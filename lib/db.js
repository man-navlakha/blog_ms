import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.Database_url ||
  process.env.POSTGRES_URL ||
  "";

let pool;

export function getDatabaseConfigError() {
  if (!connectionString) {
    return "Database is not configured. Missing: DATABASE_URL (or Database_url).";
  }

  return null;
}

export function getDbPool() {
  if (getDatabaseConfigError()) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }

  return pool;
}

export async function dbQuery(text, params = []) {
  const dbPool = getDbPool();
  if (!dbPool) {
    throw new Error(getDatabaseConfigError());
  }

  return dbPool.query(text, params);
}
