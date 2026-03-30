
import React from 'react';
import { X } from 'lucide-react';

interface LegalImpressumProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalImpressum: React.FC<LegalImpressumProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-8 md:p-12 max-h-[90vh] overflow-y-auto animate-slideUp">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-black hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-black tracking-tighter mb-8">Impressum</h2>
        
        <div className="space-y-8 text-sm font-medium text-gray-600 leading-relaxed">
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Angaben gemäß § 5 TMG</h3>
            <p className="font-bold text-black">AS.TAXI & MIETWAGEN SERVICE</p>
            <p>Inhaber: Ahmed Siala</p>
            <p>Schillerstraße 12</p>
            <p>38440 Wolfsburg</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Kontakt</h3>
            <p>Telefon: +49 (0) 5361 2726262</p>
            <p>E-Mail: info@as-mietwagen-service.de</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Umsatzsteuer-ID</h3>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
            <p className="font-bold text-black">DE 314 556 358</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Aufsichtsbehörde</h3>
            <p>Stadt Wolfsburg - Ordnungsamt</p>
            <p>Rathaus B, Zimmer 015</p>
            <p>Porschestraße 49, 38440 Wolfsburg</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">EU-Streitschlichtung</h3>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.org/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-secondary underline">https://ec.europa.org/consumers/odr/</a>.</p>
            <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h3>
            <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalImpressum;
