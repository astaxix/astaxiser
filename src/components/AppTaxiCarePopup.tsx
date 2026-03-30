
import React from 'react';
import { X, ShieldCheck, Zap, Heart, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaxiCarePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaxiCarePopup: React.FC<TaxiCarePopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={onClose}
          ></motion.div>
          
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            {/* Header Image/Gradient */}
            <div className="h-48 bg-gradient-to-br from-green-600 via-green-700 to-green-900 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
              </div>
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-4">
                  <ShieldCheck className="text-white" size={16} />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Sicherheit & Service</span>
                </div>
                <h3 className="text-4xl font-black text-white tracking-tighter">AS.TAXI CARE</h3>
              </div>
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors border border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest mb-1">Echtzeit-Tracking</h4>
                      <p className="text-gray-500 text-xs font-bold leading-relaxed">
                        Verfolgen Sie Ihr Taxi live auf der Karte und teilen Sie Ihren Standort mit Freunden oder Familie.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest mb-1">Geprüfte Fahrer</h4>
                      <p className="text-gray-500 text-xs font-bold leading-relaxed">
                        Alle unsere Fahrer sind staatlich geprüft, ortskundig und regelmäßig geschult.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest mb-1">24/7 Erreichbarkeit</h4>
                      <p className="text-gray-500 text-xs font-bold leading-relaxed">
                        Unser Service steht Ihnen rund um die Uhr zur Verfügung – Tag und Nacht, 365 Tage im Jahr.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest mb-1">Hygiene-Standard</h4>
                      <p className="text-gray-500 text-xs font-bold leading-relaxed">
                        Regelmäßige Desinfektion und Reinigung aller Fahrzeuge für Ihre Gesundheit und Sicherheit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8">
                <p className="text-gray-600 text-sm font-bold leading-relaxed text-center italic">
                  "Ihre Sicherheit ist unser höchstes Gut. Mit AS.TAXI CARE setzen wir neue Maßstäbe im Wolfsburger Personenverkehr."
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-green-600 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-green-700 transition-all flex items-center justify-center gap-3"
              >
                Verstanden <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaxiCarePopup;
