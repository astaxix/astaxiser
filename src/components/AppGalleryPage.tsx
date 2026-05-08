
import React, { useState, useEffect } from 'react';
import Header from '@/components/AppHeader.tsx';
import Footer from '@/components/AppFooter.tsx';
import { db, collection, query, orderBy, onSnapshot } from '@/firebase';
import { motion } from 'motion/react';
import { Loader2, ImageIcon, Camera } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  createdAt: any;
}

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[];
      setImages(imageData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="bg-black py-20 mb-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-4">Einblicke</h2>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">Fotogalerie</h1>
            <div className="w-20 h-1 bg-secondary mx-auto"></div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-secondary" size={48} />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Bilder werden geladen...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">Noch keine Bilder vorhanden</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative cursor-pointer overflow-hidden rounded-sm shadow-xl aspect-square bg-gray-100"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.caption || 'Galerie Bild'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                      <ImageIcon size={24} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={selectedImage}
            alt="Vorschau"
            className="max-w-full max-h-full object-contain"
            referrerPolicy="no-referrer"
          />
          <button 
            className="absolute top-6 right-6 text-white hover:text-secondary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <Loader2 className="rotate-45" size={40} />
          </button>
        </div>
      )}

      <Footer onOpenImpressum={() => {}} onOpenDatenschutz={() => {}} />
    </div>
  );
};

export default GalleryPage;
