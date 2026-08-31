import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSpinner, FaImage } from 'react-icons/fa';
import { getGallery } from '../../services/contentService';

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
      <div>
        <section className="bg-gradient-to-r from-primary to-[#0a3a63] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-3">Gallery</h1>
            <p className="text-white/80">Moments from our institute</p>
          </div>
        </section>
        <section className="py-12 bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-col items-center justify-center h-64">
              <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
              <span className="text-lg text-gray-600">Loading gallery...</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <section className="bg-gradient-to-r from-primary to-[#0a3a63] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-3">Gallery</h1>
            <p className="text-white/80">Moments from our institute</p>
          </div>
        </section>
        <section className="py-12 bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <FaImage className="text-4xl text-red-400 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchGalleryImages}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Retry
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-[#0a3a63] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Gallery</h1>
          <p className="text-white/80">Moments from our institute</p>
          <p className="text-white/60 text-sm mt-2">{images.length} memories captured</p>
        </div>
      </section>

      <section className="py-12 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
                  active === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat}
                {cat === 'all' 
                  ? ` (${images.length})` 
                  : ` (${images.filter(img => img.category === cat).length})`
                }
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <FaImage className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No images found in "{active}" category</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((img, i) => (
                <motion.div
                  key={img._id || img.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setLightbox(img)}
                  className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer"
                >
                  <div 
                    className={`h-52 bg-gradient-to-br ${img.color || 'from-gray-400 to-gray-600'} flex items-center justify-center relative`}
                  >
                    {/* Display image if URL exists */}
                    {img.image ? (
                      <img 
                        src={img.image} 
                        alt={img.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement?.querySelector('.fallback-text');
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                    ) : null}
                    
                    <span className={`text-white/90 font-medium text-center px-4 z-10 ${img.image ? 'absolute' : ''} fallback-text`}>
                      {img.title}
                    </span>
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                    
                    {/* Category badge */}
                    <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full capitalize z-10">
                      {img.category}
                    </span>
                  </div>
                  
                  <div className="p-3 bg-white">
                    <p className="text-sm font-medium text-gray-800 truncate">{img.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {img.createdAt && new Date(img.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition z-10" 
              onClick={() => setLightbox(null)}
            >
              <FaTimes />
            </button>
            
            <div 
              className="w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.image ? (
                <img 
                  src={lightbox.image} 
                  alt={lightbox.title} 
                  className="w-full h-full max-h-[80vh] object-contain"
                />
              ) : (
                <div className={`h-96 flex items-center justify-center bg-gradient-to-br ${lightbox.color || 'from-gray-400 to-gray-600'}`}>
                  <div className="text-center text-white">
                    <FaImage className="text-6xl mx-auto mb-4 opacity-50" />
                    <h3 className="text-2xl font-bold">{lightbox.title}</h3>
                    <p className="text-white/70 capitalize mt-2">{lightbox.category}</p>
                  </div>
                </div>
              )}
              
              {/* Image info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white text-xl font-bold">{lightbox.title}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-white/70 text-sm capitalize">{lightbox.category}</span>
                  {lightbox.createdAt && (
                    <span className="text-white/50 text-sm">
                      {new Date(lightbox.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;