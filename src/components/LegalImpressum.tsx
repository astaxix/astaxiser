
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
            <p className="font-bold text-black">AS Mietwagen Service</p>
            <p>Inhaber: Semiya Atalay</p>
            <p>Espenschiedstr 1</p>
            <p>55411 Bingen am Rhein</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Kontakt</h3>
            <p>Telefon: 06721-681 08 08</p>
            <p>Telefax: 06721-201 6381</p>
            <p>E-Mail: info@as-mietwagen-service.de</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Umsatzsteuer-ID</h3>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
            <p className="font-bold text-black">DE 84 690 719 236</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Aufsichtsbehörde</h3>
            <p>Bingen am Rhein</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Haftungsausschluss (Disclaimer)</h3>
            <p>Haftung für Inhalte
Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.

Haftung für Links
Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.

Urheberrecht
Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Datenschutzerklärung</h3>
            <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.

Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.

Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.

(Hinweis: Weitere Details zu Facebook, Google Analytics und Twitter finden Sie in der vollständigen Datenschutzerklärung in unserem Impressum-Bereich.)</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalImpressum;
