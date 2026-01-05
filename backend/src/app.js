// backend/src/app.js
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// ====== BASIC CHECKS ======
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in environment variables");
  process.exit(1);
}

// ====== MIDDLEWARE ======
app.use(express.json());

app.use(
  cors({
    origin: "*", // OK for now (can restrict later)
    credentials: true,
  })
);

// ====== IN-MEMORY USER STORE (FOR NOW) ======
// ⚠️ This resets on every restart — fine for testing
const users = [];

// ====== HEALTH CHECK ======
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Healthy Beats API running",
    time: new Date().toISOString(),
  });
});

// ====== DB TEST (NO DB YET) ======
app.get("/db-test", (req, res) => {
  res.json({
    success: true,
    note: "Database not connected yet",
    time: new Date().toISOString(),
  });
});

// ====== SIGNUP ======
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
    };

    users.push(user);

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ====== LOGIN ======
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
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

// ====== AUTH MIDDLEWARE ======
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ====== PROFILE ======
app.get("/api/user/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile accessed successfully",
    user: req.user,
  });
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
