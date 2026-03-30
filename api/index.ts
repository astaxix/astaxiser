import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { list } from "@vercel/blob";

dotenv.config();

const app = express();
app.use(express.json());

/*
// SMTP Configuration
const transporter = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Strato specific: sometimes helpful to allow self-signed or specific ciphers
    rejectUnauthorized: false
  }
}) : null;

// Verify transporter on startup
if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP Connection Error:", error);
    } else {
      console.log("SMTP Server is ready to take our messages");
    }
  });
}
*/
const transporter = null;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

app.get("/api/blob/debug", async (req, res) => {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return res.json({ success: false, message: "Token missing" });
    }
    const { blobs } = await list({ token });
    res.json({ 
      success: true, 
      tokenPrefix: token.substring(0, 15) + "...",
      blobCount: blobs.length,
      blobs: blobs.map(b => ({ pathname: b.pathname, url: b.url }))
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/blob/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') return res.status(400).send("URL required");
  
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    // Vercel private blobs can be fetched using the token in the Authorization header
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error(`Failed to fetch blob: ${response.statusText}`);
    
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error("Blob Proxy Error:", error);
    res.status(500).send(error.message);
  }
});

app.get("/api/blob/hero-url", async (req, res) => {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: "BLOB_READ_WRITE_TOKEN is missing." 
      });
    }

    const { blobs } = await list({ token });
    
    // Try to find by name
    let heroBlob = blobs.find(b => b.pathname.toLowerCase().includes('hero-taxi'));
    
    if (!heroBlob) {
      heroBlob = blobs.find(b => b.pathname.match(/\.(png|jpg|jpeg|webp)$/i));
    }
    
    if (heroBlob) {
      // If it's a private blob, we serve it through our proxy
      const isPrivate = heroBlob.url.includes('.private.');
      const finalUrl = isPrivate 
        ? `/api/blob/proxy?url=${encodeURIComponent(heroBlob.url)}`
        : heroBlob.url;
        
      res.json({ url: finalUrl });
    } else {
      res.status(404).json({ success: false, message: "No suitable image found." });
    }
  } catch (error: any) {
    console.error("Vercel Blob Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/send-email", async (req, res) => {
  if (!transporter) {
    return res.status(500).json({ success: false, message: "Email service not configured" });
  }
  const { to, bcc, subject, html, text } = req.body;
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "Info@as-mietwagen-service.de",
      to: Array.isArray(to) ? to.join(", ") : to,
      bcc: bcc ? (Array.isArray(bcc) ? bcc.join(", ") : bcc) : undefined,
      subject,
      html,
      text
    });
    res.json({ success: true, data: info });
  } catch (err: any) {
    console.error("Email Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

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

// For local development with Vite
const startServer = async () => {
  const PORT = 3000;
  console.log(`Starting server in ${process.env.NODE_ENV} mode...`);

  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite in middleware mode...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    const path = await import("path");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  console.log(`Attempting to listen on port ${PORT}...`);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully running on http://0.0.0.0:${PORT}`);
  }).on('error', (err) => {
    console.error("Server failed to start:", err);
  });
};

startServer();

export default app;
