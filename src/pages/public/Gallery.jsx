import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSpinner, FaImage, FaSearchPlus, FaCalendarAlt } from 'react-icons/fa';
import { getGallery } from '../../services/contentService';
import SEO from '../../components/seo/SEO';

const categories = ['all', 'classroom', 'events', 'workshops', 'students', 'certificate'];

// Default colors for categories
const categoryColors = {
  classroom: 'from-blue-400 to-blue-600',
  events: 'from-purple-400 to-purple-600',
  workshops: 'from-orange-400 to-orange-600',
  students: 'from-green-400 to-green-600',
  certificate: 'from-pink-400 to-pink-600'
};

const Gallery = () => {
  const [active, setActive] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gallery images on component mount
  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API returns: { success: true, results: 8, data: { gallery: [...] } }
      const response = await getGallery();
      
      // Extract gallery array from response
      let galleryData = [];
      
      // Check if response has data.gallery structure
      if (response?.data?.gallery && Array.isArray(response.data.gallery)) {
        galleryData = response.data.gallery;
      } 
      // Check if response has data directly as array
      else if (response?.data && Array.isArray(response.data)) {
        galleryData = response.data;
      }
      // Check if response itself is an array
      else if (Array.isArray(response)) {
        galleryData = response;
      }
      // Check if response has gallery property directly
      else if (response?.gallery && Array.isArray(response.gallery)) {
        galleryData = response.gallery;
      }
      // Fallback: try to find any array in the response
      else if (response && typeof response === 'object') {
        for (const key in response) {
          if (Array.isArray(response[key]) && response[key].length > 0) {
            galleryData = response[key];
            break;
          }
        }
      }
      
      // Ensure we have an array
      if (!Array.isArray(galleryData)) {
        console.error('Gallery data is not an array:', galleryData);
        galleryData = [];
      }
      
      // Format data and add color based on category
      const formattedData = galleryData.map(item => ({
        ...item,
        id: item._id || item.id || `temp-${Date.now()}-${Math.random()}`,
        color: categoryColors[item.category] || 'from-gray-400 to-gray-600'
      }));
      
      setImages(formattedData);
      
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError(err.response?.data?.message || 'Failed to load gallery images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter images based on active category
  const filtered = active === 'all' 
    ? images 
    : images.filter((img) => img.category === active);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEO title="Gallery" description="Moments from OPEN IT INSTITUTE" path="/gallery" />
        <section className="bg-gradient-to-r from-blue-900 to-[#0a3a63] text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Gallery</h1>
            <p className="text-white/80 text-lg">Moments from our institute</p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-52 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEO title="Gallery" description="Moments from OPEN IT INSTITUTE" path="/gallery" />
        <section className="bg-gradient-to-r from-blue-900 to-[#0a3a63] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-3">Gallery</h1>
            <p className="text-white/80">Moments from our institute</p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
            <FaImage className="text-5xl text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchGalleryImages}
              className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Gallery" description="Moments from OPEN IT INSTITUTE — classroom, events, workshops, students and certificate ceremony." path="/gallery" />
      
      {/* ========== HERO SECTION ========== */}
      <section className="bg-gradient-to-br from-[#06111f] via-[#0b2440] to-[#07111d] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '55px 55px' }}></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10 mb-6">
              <FaImage className="text-cyan-300" />
              <span className="text-sm font-bold tracking-widest uppercase text-cyan-300">Our Memories</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-3">Gallery</h1>
            <p className="text-white/80 text-lg md:text-xl">Moments from our institute</p>
            <p className="text-white/60 text-sm mt-3 flex items-center justify-center gap-2">
              <FaCalendarAlt className="text-cyan-300" /> {images.length} memories captured
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ========== FILTERS ========== */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold capitalize transition-all duration-300 ${
                  active === cat
                    ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/25 scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-xs ${active === cat ? 'text-cyan-300' : 'text-gray-400'}`}>
                  ({cat === 'all' ? images.length : images.filter(img => img.category === cat).length})
                </span>
              </button>
            ))}
          </motion.div>

          {/* ========== GRID ========== */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                <FaImage className="text-4xl text-gray-300" />
              </div>
              <p className="text-gray-500">No images found in "{active}" category</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id || img._id || i}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
                  onClick={() => setLightbox(img)}
                  className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 cursor-pointer"
                >
                  {/* Image Area */}
                  <div className={`relative h-56 bg-gradient-to-br ${img.color || 'from-gray-400 to-gray-600'} overflow-hidden`}>
                    {img.image ? (
                      <img 
                        src={img.image} 
                        alt={img.title || 'Gallery Image'} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement?.querySelector('.fallback-content');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback Content */}
                    <div className={`fallback-content ${img.image ? 'hidden' : 'flex'} absolute inset-0 flex-col items-center justify-center text-white/90 z-10`}>
                      <FaImage className="text-5xl mb-3 opacity-50" />
                      <span className="font-medium text-center px-4">{img.title || 'Open IT Institute'}</span>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Zoom Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <FaSearchPlus className="text-white text-xl" />
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full capitalize z-10 border border-white/10">
                      {img.category || 'General'}
                    </span>
                  </div>
                  
                  {/* Info Area */}
                  <div className="p-4 bg-white">
                    <p className="text-sm font-bold text-gray-800 truncate">{img.title || 'Untitled'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {img.createdAt ? new Date(img.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ========== LIGHTBOX MODAL ========== */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition z-20 bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10" 
              onClick={() => setLightbox(null)}
            >
              <FaTimes />
            </motion.button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.image ? (
                <img 
                  src={lightbox.image} 
                  alt={lightbox.title} 
                  className="w-full h-full max-h-[80vh] object-contain"
                />
              ) : (
                <div className={`h-[80vh] flex items-center justify-center bg-gradient-to-br ${lightbox.color || 'from-gray-400 to-gray-600'}`}>
                  <div className="text-center text-white">
                    <FaImage className="text-8xl mx-auto mb-6 opacity-30" />
                    <h3 className="text-3xl font-bold">{lightbox.title || 'Open IT Institute'}</h3>
                    <p className="text-white/70 capitalize mt-3">{lightbox.category || 'General'}</p>
                  </div>
                </div>
              )}
              
              {/* Image info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
                <h3 className="text-white text-2xl font-bold">{lightbox.title || 'Open IT Institute'}</h3>
                <div className="flex items-center gap-5 mt-2">
                  <span className="text-white/80 text-sm capitalize flex items-center gap-2">
                    <FaImage className="text-cyan-300" /> {lightbox.category || 'General'}
                  </span>
                  {lightbox.createdAt && (
                    <span className="text-white/60 text-sm flex items-center gap-2">
                      <FaCalendarAlt className="text-cyan-300" />
                      {new Date(lightbox.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;