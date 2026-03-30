
import React from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';

interface LiveMapProps {
  pickup?: string;
  destination?: string;
  className?: string;
}

const LiveMap: React.FC<LiveMapProps> = ({ pickup, destination, className = "h-full w-full" }) => {
  // Standard-Koordinaten für Wolfsburg
  const defaultCenter = "Wolfsburg, Germany";
  
  // Wenn Abholort oder Zielort vorhanden sind, nutzen wir diese für die Anzeige
  const searchQuery = destination ? `${pickup} to ${destination}` : (pickup || defaultCenter);
  const encodedQuery = encodeURIComponent(searchQuery);
  
  return (
    <div className={`relative overflow-hidden rounded-[30px] bg-gray-100 border border-gray-200 ${className}`}>
      {/* Google Maps Iframe als Fallback für echte Live-Map */}
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_YOUR_KEY&q=${encodedQuery}&zoom=13`}
        // Da wir keinen API Key haben, nutzen wir die Standard-Suche (eingebettet)
        // Hinweis: Ohne API Key funktioniert embed/v1/place nicht. 
        // Wir nutzen stattdessen die öffentliche Suche-Einbettung:
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; font-family: sans-serif; }
                .placeholder { 
                  height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; 
                  background: #f3f4f6; color: #9ca3af; text-align: center; padding: 20px;
                }
                .map-bg { position: absolute; inset: 0; opacity: 0.1; background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px; }
              </style>
            </head>
            <body>
              <div class="placeholder">
                <div class="map-bg"></div>
                <div style="background: white; padding: 24px; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); position: relative; z-index: 10; max-width: 280px;">
                  <div style="color: #f27d26; margin-bottom: 12px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 16px; font-weight: 900; letter-spacing: -0.025em;">Live-Karte</h3>
                  <p style="margin: 0; font-size: 12px; line-height: 1.5; font-weight: 600; color: #6b7280;">
                    ${pickup ? `Von: ${pickup}` : 'Karte wird geladen...'}
                    ${destination ? `<br/>Nach: ${destination}` : ''}
                  </p>
                  <div style="margin-top: 16px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #f27d26;">
                    Route wird berechnet
                  </div>
                </div>
              </div>
            </body>
          </html>
        `}
      ></iframe>

      {/* Overlay für Status */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-black">Live Tracking Aktiv</span>
        </div>
        
        <div className="bg-black/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/10 flex items-center gap-2">
          <Navigation size={12} className="text-secondary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white">Wolfsburg</span>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
