const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function readConnectionString() {
  const envPath = path.join(process.cwd(), ".env");
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split(/\r?\n/);

  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const firstEq = line.indexOf("=");
    if (firstEq < 0) continue;

    const key = line.slice(0, firstEq).trim();
    const rawValue = line.slice(firstEq + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (key === "DATABASE_URL" || key === "Database_url") {
      return value;
    }
  }

  return "";
}

async function main() {
  const connectionString = readConnectionString();
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL or Database_url in .env");
  }

  const migrationPath = path.join(process.cwd(), "db", "migrations", "001_init_schema.sql");
  const sql = fs.readFileSync(migrationPath, "utf8");

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query(sql);
    const check = await client.query("select to_regclass('public.staff_accounts') as staff_accounts");
    console.log("Migration applied.");
    console.log("staff_accounts table:", check.rows[0]?.staff_accounts || "not found");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
