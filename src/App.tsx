import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '@/components/AppHeader.tsx';
import Hero from '@/components/AppHero.tsx';
import About from '@/components/AppAbout.tsx';
import Services from '@/components/AppServices.tsx';
import News from '@/components/AppNews.tsx';
import Guestbook from '@/components/AppGuestbook.tsx';
import Footer from '@/components/AppFooter.tsx';
import BookingOverlay from '@/components/AppBookingOverlay.tsx';
import AdminPanel from '@/components/AppAdminPanel.tsx';
import LeistungenPage from '@/components/AppLeistungenPage.tsx';
import LegalImpressum from '@/components/LegalImpressum.tsx';
import LegalDatenschutz from '@/components/LegalDatenschutz.tsx';
import PromoPopup from '@/components/AppPromoPopup.tsx';
import TaxiCarePopup from '@/components/AppTaxiCarePopup.tsx';
import Preloader from '@/components/AppPreloader.tsx';
import { auth, signInAnonymously } from '@/firebase';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useTracking } from '@/hooks/useTracking';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      // Kurze Verzögerung um sicherzustellen, dass die Seite gerendert ist
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname, hash]);
  return null;
}

let hasShownTaxiCare = false;

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState<'booking' | 'calculator'>('booking');
  const [isImpressumOpen, setIsImpressumOpen] = useState(false);
  const [isDatenschutzOpen, setIsDatenschutzOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isTaxiCareOpen, setIsTaxiCareOpen] = useState(false);
  const [preselectedType, setPreselectedType] = useState<string | null>(null);

  useTracking();

  useEffect(() => {
    signInAnonymously(auth).catch(err => console.error("Auth Error:", err));
  }, []);

  const openBooking = (type?: string, mode: 'booking' | 'calculator' = 'booking') => {
    setPreselectedType(type || null);
    setBookingMode(mode);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Preloader />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen">
            <Header 
              onOpenBooking={() => openBooking()} 
              onOpenCalculator={() => openBooking(null, 'calculator')}
            />
            <Hero onOpenBooking={() => openBooking()} />
            <About />
            <Services 
              onOpenTaxiCare={() => setIsTaxiCareOpen(true)} 
            />
            <News />
            <Guestbook />
            <Footer 
              onOpenImpressum={() => setIsImpressumOpen(true)} 
              onOpenDatenschutz={() => setIsDatenschutzOpen(true)} 
            />
          </div>
        } />
        <Route path="/leistungen" element={
          <LeistungenPage 
            onOpenBooking={(type) => openBooking(type)} 
            onOpenImpressum={() => setIsImpressumOpen(true)} 
            onOpenDatenschutz={() => setIsDatenschutzOpen(true)} 
            onOpenTaxiCare={() => setIsTaxiCareOpen(true)}
          />
        } />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>

      <BookingOverlay 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        preselectedType={preselectedType}
        mode={bookingMode}
      />
      
      <LegalImpressum 
        isOpen={isImpressumOpen} 
        onClose={() => setIsImpressumOpen(false)} 
      />
      
      <LegalDatenschutz 
        isOpen={isDatenschutzOpen} 
        onClose={() => setIsDatenschutzOpen(false)} 
      />
      
      <PromoPopup 
        isOpen={isPromoOpen} 
        onClose={() => setIsPromoOpen(false)} 
      />
      <TaxiCarePopup 
        isOpen={isTaxiCareOpen} 
        onClose={() => setIsTaxiCareOpen(false)} 
      />
    </>
  );
}
