
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db, doc, setDoc, increment } from '@/firebase';

export function useTracking() {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      let field = '';
      const path = location.pathname;

      if (path === '/') field = 'homepage';
      else if (path === '/leistungen') field = 'leistungen_page';
      else if (path === '/taxibingen') field = 'landing_taxibingen';
      else if (path === '/krankenfahrten') field = 'landing_krankenfahrten';
      else if (path === '/flughafentransfer') field = 'landing_flughafentransfer';

      if (field) {
        try {
          await setDoc(doc(db, 'settings', 'website_stats'), {
            [field]: increment(1)
          }, { merge: true });
        } catch (err) {
          // Silently fail to not disturb user experience
          console.debug('Tracking error:', err);
        }
      }
    };

    trackPageView();
  }, [location]);
}

export const trackEvent = async (event: 'buchen_tab' | 'preisrechner_tab' | 'leistungen_tab') => {
  try {
    await setDoc(doc(db, 'settings', 'website_stats'), {
      [event]: increment(1)
    }, { merge: true });
  } catch (err) {
    console.debug('Event tracking error:', err);
  }
};
