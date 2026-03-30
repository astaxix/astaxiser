import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // ADMIN LOGIN - Hauptfix für dein Problem
    if (req.method === 'POST' && req.url?.includes('/api/admin/login')) {
      const { username, password } = req.body || {} as { username?: string; password?: string };
      
      const adminUser = process.env.ADMIN_USERNAME || 'AS.TAXI';
      const adminPass = process.env.ADMIN_PASSWORD || '##ASTAXI##';

      console.log('Admin login attempt:', { username: username ? '***' : undefined });

      if (username === adminUser && password === adminPass) {
        console.log('Admin login SUCCESS');
        return res.status(200).json({ 
          success: true, 
          token: 'admin-session-token-123',
          message: 'Login erfolgreich'
        });
      } else {
        console.log('Admin login FAILED');
        return res.status(401).json({ 
          success: false, 
          message: 'Ungültige Anmeldedaten.' 
        });
      }
    }

    // Health Check
    if (req.method === 'GET' && req.url?.includes('/api/health')) {
      return res.status(200).json({ 
        status: 'ok', 
        env: process.env.NODE_ENV || 'production',
        timestamp: new Date().toISOString()
      });
    }

    // BLOB Endpoints (deine bestehenden)
    if (req.method === 'GET' && req.url?.includes('/api/blob/hero-url')) {
      // Dein Blob-Code hier...
      return res.status(200).json({ url: '/hero-taxi.png' });
    }

    // EMAIL (deaktiviert)
    if (req.method === 'POST' && req.url?.includes('/api/send-email')) {
      return res.status(501).json({ 
        success: false, 
        message: 'Email service not configured' 
      });
    }

    console.log(`Unhandled request: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Endpoint not found' });

  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
}