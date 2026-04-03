
import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageCircle, Mail, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';
import Button from '@/components/AppButton.tsx';
import Logo from '@/components/AppLogo.tsx';

interface ServiceLandingPageProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  onOpenBooking: () => void;
}

const ServiceLandingPage: React.FC<ServiceLandingPageProps> = ({
  title,
  subtitle,
  description,
  image,
  features,
  onOpenBooking
}) => {
  const phoneDigits = CONTACT_INFO.phone.replace(/\s/g, '');
  const whatsappDigits = CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/seed/${title}/1920/1080?blur=2`;
            }}
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 flex justify-center">
              <Logo className="h-16" variant="light" />
            </div>
            <h2 className="text-secondary font-black text-sm tracking-[0.3em] uppercase mb-4">
              {subtitle}
            </h2>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
              {title}
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-black uppercase tracking-tighter">
                Warum AS Taxi wählen?
              </h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 font-bold">
                    <CheckCircle2 className="text-secondary flex-shrink-0" size={24} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 shadow-xl"
            >
              <h4 className="text-xl font-black uppercase tracking-tight mb-6 text-center">
                Jetzt Kontakt aufnehmen
              </h4>
              
              <div className="space-y-4">
                {/* Online Buchen */}
                <Button 
                  onClick={onOpenBooking}
                  className="w-full bg-secondary hover:bg-[#d17a1a] text-white h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-between px-8"
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={20} />
                    <span>Online Buchen</span>
                  </div>
                  <ArrowRight size={20} />
                </Button>

                {/* Anrufen */}
                <a 
                  href={`tel:${phoneDigits}`}
                  className="w-full bg-black hover:bg-gray-900 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-between px-8 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Phone size={20} />
                    <span>Anrufen</span>
                  </div>
                  <ArrowRight size={20} />
                </a>

                {/* WhatsApp */}
                <a 
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1eb954] text-white h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-between px-8 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle size={20} />
                    <span>WhatsApp</span>
                  </div>
                  <ArrowRight size={20} />
                </a>

                {/* Email */}
                <a 
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="w-full bg-white hover:bg-gray-50 text-black border-2 border-gray-100 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm flex items-center justify-between px-8 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Mail size={20} />
                    <span>Email</span>
                  </div>
                  <ArrowRight size={20} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <div className="container mx-auto px-6">
          <Logo className="h-10 mb-6 mx-auto" variant="dark" />
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} AS Taxi & Mietwagen Service Bingen
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ServiceLandingPage;
