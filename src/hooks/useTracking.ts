
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useTracking() {
  const location = useLocation();

  useEffect(() => {
    // Hier könnten Analytics-Events geloggt werden
    // console.log('Tracking page view:', location.pathname);
    
    // Vercel Analytics trackt automatisch, wenn das Paket installiert und die Komponente gerendert ist
  }, [location]);
}
