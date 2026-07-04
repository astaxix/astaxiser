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

    // EMAIL API
    if (req.method === 'POST' && req.url?.includes('/api/send-email')) {
      try {
        const nodemailer = await import('nodemailer');
        
        // Setup transporter using env vars
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '465'),
          secure: process.env.SMTP_SECURE !== 'false', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const body = req.body || {};
        const { type, details, data, distance } = body;
        
        const ownerEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
        
        if (type === 'booking-owner') {
          // Send to Owner
          await transporter.sendMail({
            from: `"AS.TAXI System" <${ownerEmail}>`,
            to: ownerEmail,
            subject: `Neue Buchungsanfrage: ${details.name} - ${details.date}`,
            text: `
Neue Buchungsanfrage eingegangen:

Name: ${details.name}
Telefon: ${details.phone}
Email: ${details.email}

Abholung: ${details.pickup}
Ziel: ${details.destination}
Datum: ${details.date}
Uhrzeit: ${details.time}

Fahrzeugklasse: ${details.vehicleType}
Personenanzahl: ${details.passengers}
Zahlungsart: ${details.paymentMethod}
Anhänger: ${details.hasTrailer ? 'Ja' : 'Nein'}

Geschätzte Entfernung: ${distance ? distance + ' km' : 'Unbekannt'}

Nachricht/Notizen: ${details.notes || '-'}
            `.trim()
          });
        } else if (type === 'booking-customer') {
          // Send to Customer
          await transporter.sendMail({
            from: `"AS.TAXI Bingen" <${ownerEmail}>`,
            to: details.email,
            subject: `Ihre Buchungsanfrage bei AS.TAXI ist eingegangen`,
            text: `
Guten Tag ${details.name},

vielen Dank für Ihre Buchungsanfrage. Wir haben die folgenden Daten erhalten:

Abholung: ${details.pickup}
Ziel: ${details.destination}
Datum: ${details.date}
Uhrzeit: ${details.time}
Fahrzeugklasse: ${details.vehicleType}

Wir werden uns in Kürze mit einer Bestätigung bei Ihnen melden. Der endgültige Fahrpreis wird nach der Fahrt gemäß Taxitarif berechnet.

Mit freundlichen Grüßen,
Ihr AS.TAXI Bingen Team
            `.trim()
          });
        } else if (type === 'contact') {
          // Send to Owner
          await transporter.sendMail({
            from: `"AS.TAXI Kontakt" <${ownerEmail}>`,
            to: ownerEmail,
            subject: `Kontaktanfrage: ${data.subject}`,
            text: `
Neue Kontaktanfrage eingegangen:

Name: ${data.name}
Email: ${data.email}
Betreff: ${data.subject}

Nachricht:
${data.message}
            `.trim()
          });
        }
        
        return res.status(200).json({ success: true, message: 'Email sent successfully' });
      } catch (err: any) {
        console.error('Nodemailer error:', err);
        return res.status(500).json({ success: false, message: err.message });
      }
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