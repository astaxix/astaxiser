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
import ServiceLandingPage from '@/components/ServiceLandingPage.tsx';
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
        <Route path="/flughafentransfer" element={
          <ServiceLandingPage 
            title="Flughafentransfer"
            subtitle="Bingen ↔ Region"
            description="Buchen Sie jetzt Ihren Transfer von Bingen zum Flughafen Frankfurt, Hannover oder Berlin. Keine versteckten Kosten, maximaler Komfort."
            image="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2000&auto=format&fit=crop"
            features={["Pünktlicher Service", "Gepäckhilfe inklusive", "Moderne Fahrzeuge", "24/7 Erreichbarkeit"]}
            onOpenBooking={() => openBooking('airport')}
          />
        } />
        <Route path="/krankenfahrten" element={
          <ServiceLandingPage 
            title="Krankenfahrten"
            subtitle="Sitzend zum Arzt"
            description="Wir bringen Sie sicher und komfortabel zu Ihren medizinischen Terminen. Ob Dialyse, Bestrahlung oder Arztbesuch – wir sind Ihr zuverlässiger Partner in Bingen."
            image="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop"
            features={["Direktabrechnung mit Kassen", "Hilfsbereite Fahrer", "Sitzendtransport", "Termintreue"]}
            onOpenBooking={() => openBooking('medical')}
          />
        } />
        <Route path="/taxibingen" element={
          <ServiceLandingPage 
            title="Taxi Bingen"
            subtitle="Ihr Taxi in Bingen & Region"
            description="Schnell, zuverlässig und rund um die Uhr für Sie da. AS Taxi ist Ihr Partner für alle Fahrten in Bingen am Rhein und Umgebung. Zentrale am Stadtbahnhof."
            image="https://images.unsplash.com/photo-1556122071-e404be7457cc?q=80&w=2000&auto=format&fit=crop"
            features={["24/7 Erreichbar", "Ortskundige Fahrer", "Kurze Wartezeiten", "Zentrale am Stadtbahnhof"]}
            onOpenBooking={() => openBooking()}
          />
        } />
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
