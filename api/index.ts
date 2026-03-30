import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { list } from "@vercel/blob";

dotenv.config();

const app = express();
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const adminUser = process.env.ADMIN_USERNAME || "AS.TAXI";
  const adminPass = process.env.ADMIN_PASSWORD || "##ASTAXI##";

  if (username === adminUser && password === adminPass) {
    res.json({ success: true, token: "admin-session-token-123" });
  } else {
    res.status(401).json({ success: false, message: "Ungültige Anmeldedaten." });
  }
});

// Blob APIs (deine bestehenden)
app.get("/api/blob/debug", async (req, res) => {
  // ... deinen bestehenden Code
});

app.get("/api/blob/proxy", async (req, res) => {
  // ... deinen bestehenden Code
});

app.get("/api/blob/hero-url", async (req, res) => {
  // ... deinen bestehenden Code
});

app.post("/api/send-email", async (req, res) => {
  // ... deinen bestehenden Code (transporter bleibt null)
});

export default app;