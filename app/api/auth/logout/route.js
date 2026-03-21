import { NextResponse } from "next/server";
import { authConstants, hashValue } from "@/lib/auth";
import { dbQuery, getDatabaseConfigError } from "@/lib/db";

export async function POST(request) {
  const token = request.cookies.get(authConstants.SESSION_COOKIE_NAME)?.value;

  if (token && !getDatabaseConfigError()) {
    await dbQuery(
      `
        update staff_accounts
        set
          session_token_hash = null,
          session_expires_at = null,
          updated_at = now()
        where session_token_hash = $1
      `,
      [hashValue(token)]
    );
  }

  const response = NextResponse.json({ message: "Logged out." });
  response.cookies.set({
    name: authConstants.SESSION_COOKIE_NAME,
    value: "",
    maxAge: 0,
    path: "/",
  });

  return response;
}
