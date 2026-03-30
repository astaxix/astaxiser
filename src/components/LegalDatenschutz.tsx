
import React from 'react';
import { X } from 'lucide-react';

interface LegalDatenschutzProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalDatenschutz: React.FC<LegalDatenschutzProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl p-8 md:p-12 max-h-[90vh] overflow-y-auto animate-slideUp">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-black hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-black tracking-tighter mb-8">Datenschutzerklärung</h2>
        
        <div className="space-y-8 text-sm font-medium text-gray-600 leading-relaxed">
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">1. Datenschutz auf einen Blick</h3>
            <p className="mb-4">Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
            <h4 className="font-bold text-black mb-2">Datenerfassung auf dieser Website</h4>
            <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">2. Allgemeine Hinweise und Pflichtinformationen</h3>
            <p className="mb-4">Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
            <h4 className="font-bold text-black mb-2">Hinweis zur verantwortlichen Stelle</h4>
            <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
            <p className="font-bold text-black mt-2">Ahmed Siala</p>
            <p>Schillerstraße 12, 38440 Wolfsburg</p>
            <p>E-Mail: info@as-mietwagen-service.de</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">3. Datenerfassung auf dieser Website</h3>
            <h4 className="font-bold text-black mb-2">Cookies</h4>
            <p className="mb-4">Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.</p>
            
            <h4 className="font-bold text-black mb-2">Server-Log-Dateien</h4>
            <p className="mb-4">Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.</p>
            
            <h4 className="font-bold text-black mb-2">Kontaktformular / Buchungsanfrage</h4>
            <p>Wenn Sie uns per Kontaktformular oder Buchungsanfrage Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">4. Analyse-Tools und Werbung</h3>
            <h4 className="font-bold text-black mb-2">Google Analytics / Vercel Analytics</h4>
            <p>Diese Website nutzt Funktionen von Analyse-Diensten zur Verbesserung unseres Angebots. Die Nutzung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.</p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">5. Plugins und Tools</h3>
            <h4 className="font-bold text-black mb-2">Google Maps</h4>
            <p>Diese Seite nutzt über eine API den Kartendienst Google Maps. Anbieter ist die Google Ireland Limited („Google“), Gordon House, Barrow Street, Dublin 4, Irland.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalDatenschutz;
