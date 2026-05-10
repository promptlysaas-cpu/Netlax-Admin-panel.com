import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Megaphone, Plus, Trash2, Edit2, PlayCircle, Eye, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdsManager() {
  const [ads, setAds] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'ads'), (snapshot) => {
      setAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (ad = null) => {
    setCurrentAd(ad || { 
      title: '', 
      code: '', 
      type: 'preroll', 
      enabled: true, 
      midrollMinute: 10,
      skipTimer: 5,
      movieId: '' 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const adData = {
        title: currentAd.title,
        code: currentAd.code,
        type: currentAd.type,
        enabled: currentAd.enabled,
        midrollMinute: Number(currentAd.midrollMinute),
        skipTimer: Number(currentAd.skipTimer),
        movieId: currentAd.movieId || null,
        updatedAt: serverTimestamp()
      };

      if (currentAd.id) {
        await updateDoc(doc(db, 'ads', currentAd.id), adData);
      } else {
        await addDoc(collection(db, 'ads'), {
          ...adData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving ad", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnable = async (id: string, currentEnabled: boolean) => {
    await updateDoc(doc(db, 'ads', id), { enabled: !currentEnabled });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this ad configuration?")) {
      await deleteDoc(doc(db, 'ads', id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Ads Manager</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#e50914] hover:bg-[#f40612] text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Create Ad
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {ads.map(ad => (
          <motion.div
            layout
            key={ad.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white dark:bg-[#1f1f1f] rounded-xl shadow-sm border ${ad.enabled ? 'border-green-500/20 dark:border-green-500/20' : 'border-gray-200 dark:border-gray-800'} overflow-hidden relative`}
          >
            <div className={`h-2 ${ad.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{ad.title}</h3>
                  <span className="inline-block mt-1 uppercase text-[10px] font-bold tracking-wider text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {ad.type} AD
                  </span>
                </div>
                <button 
                  onClick={() => handleToggleEnable(ad.id, ad.enabled)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${ad.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${ad.enabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center text-sm mb-1">
                    <Eye className="w-4 h-4 mr-1" /> Views
                  </div>
                  <div className="text-xl font-semibold dark:text-white">12.4k</div> {/* Mock Analytics */}
                </div>
                <div className="text-center border-l border-gray-100 dark:border-gray-800">
                  <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center text-sm mb-1">
                    <MousePointerClick className="w-4 h-4 mr-1" /> Clicks
                  </div>
                  <div className="text-xl font-semibold dark:text-white">842</div> {/* Mock Analytics */}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                 <button onClick={() => handleOpenModal(ad)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                   <Edit2 className="w-5 h-5" />
                 </button>
                 <button onClick={() => handleDelete(ad.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                   <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {ads.length === 0 && (
         <div className="h-64 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-gray-800">
           <Megaphone className="w-12 h-12 mb-4 opacity-50" />
           <p>No ads configured yet.</p>
         </div>
      )}

      {/* Ad Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white dark:bg-[#1f1f1f] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border border-gray-200 dark:border-gray-800"
            >
              <div className="sticky top-0 bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-bold dark:text-white">{currentAd.id ? 'Edit Ad' : 'Create Ad'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ad Campaign Title</label>
                    <input required type="text" value={currentAd.title} onChange={e => setCurrentAd({...currentAd, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-[#e50914] outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ad Type</label>
                    <select value={currentAd.type} onChange={e => setCurrentAd({...currentAd, type: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] dark:text-white focus:ring-2 focus:ring-[#e50914] outline-none">
                      <option value="preroll">Pre-Roll (Before Movie)</option>
                      <option value="midroll">Mid-Roll (During Movie)</option>
                      <option value="popup">Popup / Overlay</option>
                      <option value="banner">Banner Ad</option>
                    </select>
                  </div>

                  {currentAd.type === 'midroll' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trigger Time (Minutes)</label>
                      <input type="number" min="1" value={currentAd.midrollMinute} onChange={e => setCurrentAd({...currentAd, midrollMinute: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-[#e50914] outline-none" placeholder="e.g. 10" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Skip Timer (Seconds)</label>
                    <input type="number" min="0" value={currentAd.skipTimer} onChange={e => setCurrentAd({...currentAd, skipTimer: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-[#e50914] outline-none" placeholder="0 = Unskippable" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between">
                      <span>Ad Code (HTML / Script / VAST / Iframe)</span>
                      <a href="#" className="text-[#e50914] hover:underline text-xs">Preview Code</a>
                    </label>
                    <textarea required rows={8} value={currentAd.code} onChange={e => setCurrentAd({...currentAd, code: e.target.value})} className="font-mono text-sm w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black text-gray-900 dark:text-green-400 focus:ring-2 focus:ring-[#e50914] outline-none resize-none" placeholder="<!-- Paste your ad network code here -->"></textarea>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800 space-x-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg font-medium bg-[#e50914] text-white hover:bg-[#f40612] disabled:opacity-50 shadow-lg transition-colors">
                    {loading ? 'Saving...' : 'Save Ad Configuration'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
