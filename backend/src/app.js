
import dotenv from "dotenv";
dotenv.config({ override: true });
console.log("DATABASE_URL =", process.env.DATABASE_URL);

import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// ===== CHECK JWT =====
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing");
  process.exit(1);
}

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

// ===== IN-MEMORY STORAGE =====
// (Later we will replace with database)
const users = [];
const admins = [
  {
    id: "admin-1",
    email: "admin@healthybeats.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
];

// ===== ROOT =====
app.get("/", (req, res) => {
  res.json({ message: "Healthy Beats Backend Running ✅" });
});

// =====================================================
// =================== USER SIGNUP =====================
// =====================================================
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const emailLower = email.toLowerCase();

    const checkUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [emailLower]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, emailLower, hashedPassword, "user"]
    );

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================================================
// =================== USER LOGIN ======================
// =====================================================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailLower = email.toLowerCase();

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [emailLower]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================================================
// ================= AUTH MIDDLEWARE ===================
// =====================================================
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}

// =====================================================
// ================= ADMIN DASHBOARD ===================
// =====================================================
app.get("/api/admin/dashboard", auth, adminOnly, (req, res) => {
  res.json({
    message: "Welcome Admin 👑",
    usersCount: users.length,
  });
});

// =====================================================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
