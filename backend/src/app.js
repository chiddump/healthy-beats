import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

/* ===== SAFETY CHECK ===== */
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing");
  process.exit(1);
}

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(
  cors({
    origin: "*", // lock later to frontend domain
    credentials: true,
  })
);

/* ===== ROOT ===== */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Healthy Beats API running",
    time: new Date().toISOString(),
  });
});

/* ===== DB TEST ===== */
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

/* ===== AUTH MIDDLEWARE ===== */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains id, email, role
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

/* ===== ADMIN MIDDLEWARE ===== */
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
};

/* ===== SIGNUP ===== */
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (id, name, email, password, role) VALUES ($1,$2,$3,$4,'user')",
      [crypto.randomUUID(), name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ===== LOGIN (STEP 3 INCLUDED: ROLE IN TOKEN) ===== */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, // 👈 STEP 3
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ===== USER PROFILE ===== */
app.get("/api/user/profile", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id=$1",
      [req.user.id]
    );

    res.json({
      message: "Profile accessed successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ===== ADMIN DASHBOARD ===== */
app.get(
  "/api/admin/dashboard",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      message: "Welcome Admin 👑",
      admin: req.user.email,
    });
  }
);

/* ===== START SERVER ===== */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
/* ===== ADD PRODUCT (ADMIN ONLY) ===== */
app.post(
  "/api/admin/products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, price, image } = req.body;

      if (!name || !price) {
        return res.status(400).json({ error: "Name and price required" });
      }

      await pool.query(
        "INSERT INTO products (id, name, price, image) VALUES ($1,$2,$3,$4)",
        [crypto.randomUUID(), name, price, image]
      );

      res.status(201).json({ message: "Product added successfully" });
    } catch (err) {
      console.error("Add product error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* ===== GET PRODUCTS (PUBLIC) ===== */
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
