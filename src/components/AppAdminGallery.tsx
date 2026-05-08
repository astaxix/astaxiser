
import React, { useState, useEffect } from 'react';
import { db, storage, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, ref, uploadBytes, getDownloadURL, deleteObject, Timestamp } from '@/firebase';
import { Loader2, Plus, Trash2, Camera, Image as ImageIcon, Upload } from 'lucide-react';
import Button from '@/components/AppButton.tsx';

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  createdAt: any;
  storagePath: string;
}

const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setError('');

    try {
      console.log('--- Gallery Upload Started ---');
      console.log('File:', selectedFile.name, 'Size:', selectedFile.size);
      
      const timestamp = Date.now();
      const storagePath = `gallery/${timestamp}_${selectedFile.name}`;
      const storageRef = ref(storage, storagePath);
      
      console.log('Step 1: Uploading to storage path:', storagePath);
      
      // Wrap upload in a timeout to prevent infinite "loading"
      const uploadPromise = uploadBytes(storageRef, selectedFile);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT: Upload dauerte zu lange (15s). Prüfen Sie die Firebase Storage Regeln.')), 15000)
      );

      const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
      console.log('Step 2: Storage upload SUCCESS');
      
      console.log('Step 3: Getting download URL...');
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Step 4: Download URL:', downloadURL);
      
      console.log('Step 5: Writing to Firestore...');
      await addDoc(collection(db, 'gallery'), {
        url: downloadURL,
        caption: caption,
        createdAt: Timestamp.now(),
        storagePath: storagePath
      });
      console.log('Step 6: Firestore write SUCCESS');

      setSelectedFile(null);
      setCaption('');
      console.log('--- Gallery Upload Finished Successfully ---');
      
      // Reset file input
      const fileInput = document.getElementById('gallery-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err: any) {
      console.error('--- GALLERY UPLOAD FAILED ---');
      console.error('Error Code:', err.code);
      console.error('Error Message:', err.message);
      console.error('Full Error Object:', err);
      
      let friendlyMessage = 'Fehler beim Hochladen: ' + err.message;
      if (err.code === 'storage/unauthorized') {
        friendlyMessage = 'Fehler: Keine Berechtigung für den Cloud-Speicher. Bitte Admin-Rechte prüfen.';
      } else if (err.code === 'storage/retry-limit-exceeded') {
        friendlyMessage = 'Fehler: Zeitüberschreitung. Bitte Internetverbindung prüfen.';
      }
      
      setError(friendlyMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!window.confirm('Möchten Sie dieses Bild wirklich löschen?')) return;

    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, 'gallery', image.id));
      
      // 2. Delete from Storage
      if (image.storagePath) {
        const storageRef = ref(storage, image.storagePath);
        await deleteObject(storageRef).catch(err => {
            console.warn('Storage delete failed (might be expected if path is wrong):', err);
        });
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Fehler beim Löschen: ' + err.message);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-10 font-sans">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-black text-white rounded-2xl">
          <Camera size={24} />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase">Fotogalerie</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bilder hochladen und verwalten</p>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-[30px] border border-gray-100 shadow-sm">
        <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
          <Upload size={16} className="text-secondary" /> 
          Bild hochladen
        </h4>
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Bild auswählen</label>
              <input 
                id="gallery-upload"
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 font-bold text-xs focus:ring-2 ring-black transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Bildunterschrift (Optional)</label>
              <input 
                type="text" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Kurze Beschreibung..."
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 font-bold text-xs focus:ring-2 ring-black transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-red-100">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isUploading || !selectedFile}
            className="bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            {isUploading ? 'Hochladen...' : 'In Galerie speichern'}
          </Button>
        </form>
      </div>

      <div className="space-y-6">
        <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <ImageIcon size={16} className="text-secondary" /> 
          Vorhandene Bilder
        </h4>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-secondary" size={32} />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[30px] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Keine Bilder hochgeladen</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group rounded-2xl overflow-hidden aspect-square shadow-md">
                <img 
                  src={image.url} 
                  alt={image.caption} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => handleDelete(image)}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow-lg"
                >
                  <Trash2 size={14} />
                </button>
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm text-white text-[8px] font-bold uppercase truncate">
                    {image.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
