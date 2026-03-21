import crypto from "node:crypto";
import { cookies } from "next/headers";
import { authConstants } from "./auth-constants";
import { dbQuery, getDatabaseConfigError } from "./db";

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isAllowedStaffEmail(email) {
  return normalizeEmail(email).endsWith(authConstants.ALLOWED_DOMAIN);
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function hashValue(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function getAuthenticatedStaff() {
  if (getDatabaseConfigError()) return null;

  const cookieStore = await cookies();
  const rawToken = cookieStore.get(authConstants.SESSION_COOKIE_NAME)?.value;
  if (!rawToken) return null;

  const tokenHash = hashValue(rawToken);

  const { rows } = await dbQuery(
    `
      select id, email, role, session_expires_at
      from staff_accounts
      where session_token_hash = $1 and session_expires_at > now()
      limit 1
    `,
    [tokenHash]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

export async function getAuthenticatedStaffFromToken(rawToken) {
  if (!rawToken) return null;
  if (getDatabaseConfigError()) return null;

  const tokenHash = hashValue(rawToken);

  const { rows } = await dbQuery(
    `
      select id, email, role, session_expires_at
      from staff_accounts
      where session_token_hash = $1 and session_expires_at > now()
      limit 1
    `,
    [tokenHash]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

export { authConstants };
