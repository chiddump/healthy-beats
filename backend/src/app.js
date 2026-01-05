import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// DB
import pool from "./models/db.js";

const app = express(); // 👈 app MUST be created first

// MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://healthybeats.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// TEST ROUTES
app.get("/", (req, res) => {
  res.send("Healthy Beats API running");
});

app.get("/db-test", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({ success: true, time: result.rows[0] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
