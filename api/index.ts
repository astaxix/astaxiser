import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method === 'POST' && req.url === '/api/admin/login') {
    const { username, password } = req.body || {};
    const adminUser = process.env.ADMIN_USERNAME || "AS.TAXI";
    const adminPass = process.env.ADMIN_PASSWORD || "##ASTAXI##";

    if (username === adminUser && password === adminPass) {
      return res.json({ success: true, token: "admin-session-token-123" });
    } else {
      return res.status(401).json({ success: false, message: "Ungültige Anmeldedaten." });
    }
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    return res.json({ status: "ok", env: process.env.NODE_ENV });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}