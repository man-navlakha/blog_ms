import { NextResponse } from "next/server";
import {
  authConstants,
  generateOtp,
  hashValue,
  isAllowedStaffEmail,
  normalizeEmail,
} from "@/lib/auth";
import { dbQuery, getDatabaseConfigError } from "@/lib/db";
import { sendOtpEmail } from "@/lib/brevo";

export async function POST(request) {
  try {
    const body = await request.json();
    const normalizedEmail = normalizeEmail(body?.email);

    if (!normalizedEmail || !isAllowedStaffEmail(normalizedEmail)) {
      return NextResponse.json(
        { message: "Only @mechanicsetu.tech staff emails are allowed." },
        { status: 400 }
      );
    }

    const dbError = getDatabaseConfigError();
    if (dbError) {
      return NextResponse.json(
        { message: dbError },
        { status: 500 }
      );
    }

    const otp = generateOtp();
    const otpHash = hashValue(otp);
    const otpExpiresAt = new Date(
      Date.now() + authConstants.OTP_TTL_MINUTES * 60 * 1000
    ).toISOString();

    await dbQuery(
      `
        insert into staff_accounts (email, otp_hash, otp_expires_at, updated_at)
        values ($1, $2, $3, now())
        on conflict (email)
        do update set
          otp_hash = excluded.otp_hash,
          otp_expires_at = excluded.otp_expires_at,
          updated_at = now()
      `,
      [normalizedEmail, otpHash, otpExpiresAt]
    );

    await sendOtpEmail({ toEmail: normalizedEmail, otp });

    return NextResponse.json({
      message: "OTP sent to your staff email.",
      ...(process.env.NODE_ENV !== "production" ? { debugOtp: otp } : {}),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Could not generate OTP." },
      { status: 400 }
    );
  }
}
