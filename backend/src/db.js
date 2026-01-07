import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST be first

import pkg from "pg";
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL missing in db.js");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
