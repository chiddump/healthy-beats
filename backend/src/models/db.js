import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "aws-1-ap-south-1.pooler.supabase.com",
  port: 6543,
  user: "postgres.boslllzopzqdvychpmub", // ✅ IMPORTANT
  password: "1@Chidananda.",             // your real password
  database: "postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
