import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Admin Login
  if (req.method === 'POST' && req.url?.startsWith('/api/admin/login')) {
    const { username, password } = req.body || {};
    const adminUser = process.env.ADMIN_USERNAME || "AS.TAXI";
    const adminPass = process.env.ADMIN_PASSWORD || "##ASTAXI##";

    if (username === adminUser && password === adminPass) {
      return res.status(200).json({ success: true, token: "admin-session-token-123" });
    } else {
      return res.status(401).json({ success: false, message: "Ungültige Anmeldedaten." });
    }
  }

  // Health Check
  if (req.method === 'GET' && req.url?.startsWith('/api/health')) {
    return res.status(200).json({ status: "ok", env: process.env.NODE_ENV });
  }

  // 405 for everything else
  return res.status(405).json({ error: 'Method Not Allowed' });
}