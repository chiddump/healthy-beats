import dotenv from "dotenv";
dotenv.config();

import pool from "./db.js";

async function test() {
  console.log("DATABASE_URL =", process.env.DATABASE_URL);

  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ DB Connected:", res.rows);
    process.exit(0);
  } catch (err) {
    console.error("❌ DB Error:", err);
    process.exit(1);
  }
}

test();
