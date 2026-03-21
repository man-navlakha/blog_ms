import { NextResponse } from "next/server";
import {
  authConstants,
  generateSessionToken,
  hashValue,
  isAllowedStaffEmail,
  normalizeEmail,
} from "@/lib/auth";
import { dbQuery, getDatabaseConfigError } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const normalizedEmail = normalizeEmail(body?.email);
    const otp = String(body?.otp || "").trim();

    if (!normalizedEmail || !isAllowedStaffEmail(normalizedEmail)) {
      return NextResponse.json(
        { message: "Only @mechanicsetu.tech staff emails are allowed." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "OTP must be a 6-digit code." },
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

    const { rows } = await dbQuery(
      `
        select id, email, role, otp_hash, otp_expires_at
        from staff_accounts
        where email = $1
        limit 1
      `,
      [normalizedEmail]
    );

    const staff = rows[0];
    if (!staff) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
    }

    if (!staff.otp_hash || !staff.otp_expires_at) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
    }

    const expired = new Date(staff.otp_expires_at).getTime() < Date.now();
    const validOtp = hashValue(otp) === staff.otp_hash;
    if (expired || !validOtp) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
    }

    const rawSessionToken = generateSessionToken();
    const sessionTokenHash = hashValue(rawSessionToken);
    const sessionExpiresAt = new Date(
      Date.now() + authConstants.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    await dbQuery(
      `
        update staff_accounts
        set
          otp_hash = null,
          otp_expires_at = null,
          session_token_hash = $1,
          session_expires_at = $2,
          last_login = now(),
          updated_at = now()
        where id = $3
      `,
      [sessionTokenHash, sessionExpiresAt, staff.id]
    );

    const response = NextResponse.json({
      message: "Login successful.",
      user: { id: staff.id, email: staff.email, role: staff.role },
    });

    response.cookies.set({
      name: authConstants.SESSION_COOKIE_NAME,
      value: rawSessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: authConstants.SESSION_TTL_DAYS * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Invalid request." },
      { status: 400 }
    );
  }
}
