import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'movies'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMovies(data);
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (movie = null) => {
    setCurrentMovie(movie || { title: '', genre: 'Action', description: '', thumbnailUrl: '', videoUrl: '', rating: 0, releaseYear: new Date().getFullYear() });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMovie(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const movieData = {
        title: currentMovie.title,
        genre: currentMovie.genre,
        description: currentMovie.description,
        thumbnailUrl: currentMovie.thumbnailUrl,
        videoUrl: currentMovie.videoUrl,
        rating: Number(currentMovie.rating),
        releaseYear: Number(currentMovie.releaseYear),
        updatedAt: serverTimestamp()
      };

      if (currentMovie.id) {
        await updateDoc(doc(db, 'movies', currentMovie.id), movieData);
      } else {
        await addDoc(collection(db, 'movies'), {
          ...movieData,
          createdAt: serverTimestamp()
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving movie: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteDoc(doc(db, 'movies', id));
      } catch (error) {
        console.error("Error deleting movie: ", error);
      }
    }
  };

  const filteredMovies = movies.filter(m => 
    m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold dark:text-white">Movies Management</h1>
        <div className="flex space-x-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 sm:w-64 px-4 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#e50914] focus:outline-none"
          />
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#e50914] hover:bg-[#f40612] text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Movie
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredMovies.map(movie => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={movie.id}
            className="bg-white dark:bg-[#2a2a2a] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group"
          >
            <div className="aspect-[2/3] relative bg-gray-200 dark:bg-gray-800">
              {movie.thumbnailUrl ? (
                <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span className="text-sm">No Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                <button onClick={() => handleOpenModal(movie)} className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(movie.id)} className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-yellow-400">
                ★ {movie.rating || 'N/A'}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{movie.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{movie.releaseYear} • {movie.genre}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredMovies.length === 0 && (
         <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#2a2a2a] rounded-xl border border-gray-200 dark:border-gray-800">
           No movies found. Add one to get started!
         </div>
      )}

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white dark:bg-[#1f1f1f] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border border-gray-200 dark:border-gray-800"
            >
              <div className="sticky top-0 bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-bold dark:text-white">{currentMovie.id ? 'Edit Movie' : 'Add New Movie'}</h2>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input required type="text" value={currentMovie.title} onChange={e => setCurrentMovie({...currentMovie, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-[#e50914] outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Genre</label>
                    <select value={currentMovie.genre} onChange={e => setCurrentMovie({...currentMovie, genre: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] dark:text-white focus:ring-2 focus:ring-[#e50914] outline-none">
                      <option>Action</option>
                      <option>Comedy</option>
                      <option>Drama</option>
                      <option>Horror</option>
                      <option>Sci-Fi</option>
                      <option>Romance</option>
                      <option>Thriller</option>
                      <option>Animation</option>
                      <option>Adventure</option>
                      <option>Fantasy</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail URL</label>
                    <input required type="url" value={currentMovie.thumbnailUrl} onChange={e => setCurrentMovie({...currentMovie, thumbnailUrl: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-[#e50914] outline-none" placeholder="https://" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Video Streaming URL (YouTube/Vimeo/Direct)</label>
                    <input required type="url" value={currentMovie.videoUrl} onChange={e => setCurrentMovie({...currentMovie, videoUrl: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-[#e50914] outline-none" placeholder="https://" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating (0-10)</label>
                    <input type="number" step="0.1" min="0" max="10" value={currentMovie.rating} onChange={e => setCurrentMovie({...currentMovie, rating: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-[#e50914] outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Release Year</label>
                    <input type="number" min="1900" max="2100" value={currentMovie.releaseYear} onChange={e => setCurrentMovie({...currentMovie, releaseYear: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-[#e50914] outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea rows={4} value={currentMovie.description} onChange={e => setCurrentMovie({...currentMovie, description: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-[#e50914] outline-none resize-none"></textarea>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800 space-x-4">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg font-medium bg-[#e50914] text-white hover:bg-[#f40612] disabled:opacity-50 shadow-lg transition-colors">
                    {loading ? 'Saving...' : 'Save Movie'}
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
