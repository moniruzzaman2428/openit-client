import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBullhorn, 
  FaCalendarAlt, 
  FaSpinner, 
  FaSearch, 
  FaFilter,
  FaRegClock,
  FaArrowRight,
  FaExclamationCircle,
  FaCheckCircle,
  FaInfoCircle,
  FaTimes,
  FaShare,
  FaPrint,
  FaBookmark,
  FaRegBookmark,
  FaUser,
  FaEye,
  FaChevronDown
} from 'react-icons/fa';
import { getNotices } from '../../services/contentService';
import SEO from '../../components/seo/SEO';

// Category Colors & Icons
const categoryColors = {
  general: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: FaInfoCircle, darkBg: 'bg-blue-600' },
  admission: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: FaCheckCircle, darkBg: 'bg-green-600' },
  exam: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: FaExclamationCircle, darkBg: 'bg-orange-600' },
  class: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: FaInfoCircle, darkBg: 'bg-purple-600' },
  result: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', icon: FaCheckCircle, darkBg: 'bg-pink-600' },
  holiday: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: FaInfoCircle, darkBg: 'bg-red-600' }
};

const categoryLabels = {
  general: 'General',
  admission: 'Admission',
  exam: 'Exam',
  class: 'Class',
  result: 'Result',
  holiday: 'Holiday'
};

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    filterNotices();
  }, [notices, searchTerm, selectedCategory]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getNotices({ limit: 50 });
      const data = res.data?.notices || res.notices || [];
      setNotices(data);
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('Failed to load notices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterNotices = () => {
    let filtered = notices;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(notice => notice.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(term) ||
        notice.description?.toLowerCase().includes(term) ||
        notice.category?.toLowerCase().includes(term)
      );
    }

    filtered = filtered.sort((a, b) => 
      new Date(b.publishDate || b.createdAt) - new Date(a.publishDate || a.createdAt)
    );

    setFilteredNotices(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setIsBookmarked(false);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedNotice(null);
    document.body.style.overflow = 'auto';
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    const shareData = {
      title: selectedNotice?.title,
      text: selectedNotice?.description,
      url: window.location.href + `?notice=${selectedNotice?._id}`
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const uniqueCategories = ['all', ...new Set(notices.map(n => n.category).filter(Boolean))];

  // ---------- LOADING SKELETON ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEO title="Notices" description="Latest notices and announcements from OPEN IT INSTITUTE" path="/notices" />
        <section className="bg-gradient-to-r from-blue-900 to-[#0a3a63] text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Notices</h1>
            <p className="text-white/80 text-lg">Stay updated with latest announcements</p>
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 w-full bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- ERROR STATE ----------
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEO title="Notices" description="Latest notices and announcements from OPEN IT INSTITUTE" path="/notices" />
        <section className="bg-gradient-to-r from-blue-900 to-[#0a3a63] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-3">Notices</h1>
            <p className="text-white/80">Stay updated with latest announcements</p>
          </div>
        </section>
        <div className="max-w-md mx-auto px-4 py-20">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <FaExclamationCircle className="text-5xl text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchNotices}
              className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
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
      <SEO title="Notices" description="Latest notices and announcements from OPEN IT INSTITUTE — exams, admissions, holidays and class updates." path="/notices" />
      
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
              <FaBullhorn className="text-cyan-300" />
              <span className="text-sm font-bold tracking-widest uppercase text-cyan-300">Announcements</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-3">Notices</h1>
            <p className="text-white/80 text-lg md:text-xl">Stay updated with all latest announcements</p>
            <p className="text-white/60 text-sm mt-3 flex items-center justify-center gap-2">
              <FaCalendarAlt className="text-cyan-300" /> {notices.length} notices available
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* ========== SEARCH & FILTER PANEL ========== */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 mb-8 border border-gray-100 shadow-lg shadow-gray-100/50">
            
            <div className="relative mb-5">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notices by title, description or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium mr-1">
                <FaFilter className="text-blue-600" /> Filter:
              </span>
              {uniqueCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All' : categoryLabels[category] || category}
                </button>
              ))}
              {(searchTerm || selectedCategory !== 'all') && (
                <button onClick={clearFilters} className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 underline ml-auto">
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100 text-sm text-gray-500">
              <span>Showing <strong className="text-gray-800">{filteredNotices.length}</strong> of <strong className="text-gray-800">{notices.length}</strong> notices</span>
              <span className="flex items-center gap-1.5"><FaRegClock className="text-blue-600" /> Latest First</span>
            </div>
          </div>

          {/* ========== NOTICES LIST ========== */}
          {filteredNotices.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                <FaBullhorn className="text-4xl text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No notices found</h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No notices published yet'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button onClick={clearFilters} className="mt-5 px-6 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition">
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-5">
              {filteredNotices.map((notice, i) => {
                const CategoryIcon = categoryColors[notice.category]?.icon || FaInfoCircle;
                const colors = categoryColors[notice.category] || categoryColors.general;
                
                return (
                  <motion.div
                    key={notice._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.3) }}
                    whileHover={{ y: -4 }}
                    onClick={() => handleNoticeClick(notice)}
                    className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    {/* Hover Accent Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-900 to-cyan-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>

                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                            <CategoryIcon className="text-xs" />
                            {categoryLabels[notice.category] || notice.category}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <FaCalendarAlt className="text-[10px]" />
                            {new Date(notice.publishDate || notice.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <FaRegClock className="text-[10px]" />
                            {new Date(notice.publishDate || notice.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-800 text-lg mb-2 flex items-start gap-2 group-hover:text-blue-900 transition-colors">
                          <FaBullhorn className="text-blue-600 text-sm mt-1 flex-shrink-0" />
                          <span className="line-clamp-1">{notice.title}</span>
                        </h3>

                        {notice.description && (
                          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line line-clamp-2">
                            {notice.description}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 mt-2">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-900 transition-colors duration-300">
                          <FaArrowRight className="text-blue-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========== NOTICE DETAIL MODAL ========== */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${categoryColors[selectedNotice.category]?.bg || 'bg-gray-100'}`}>
                    {(() => {
                      const Icon = categoryColors[selectedNotice.category]?.icon || FaInfoCircle;
                      return <Icon className={`${categoryColors[selectedNotice.category]?.text || 'text-gray-600'}`} />;
                    })()}
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${categoryColors[selectedNotice.category]?.bg || 'bg-gray-100'} ${categoryColors[selectedNotice.category]?.text || 'text-gray-600'}`}>
                    {categoryLabels[selectedNotice.category] || selectedNotice.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={toggleBookmark} className="p-2.5 hover:bg-gray-100 rounded-xl transition" title="Bookmark">
                    {isBookmarked ? <FaBookmark className="text-blue-600" /> : <FaRegBookmark className="text-gray-400" />}
                  </button>
                  <button onClick={handleShare} className="p-2.5 hover:bg-gray-100 rounded-xl transition" title="Share">
                    <FaShare className="text-gray-400" />
                  </button>
                  <button onClick={handlePrint} className="p-2.5 hover:bg-gray-100 rounded-xl transition" title="Print">
                    <FaPrint className="text-gray-400" />
                  </button>
                  <button onClick={closeModal} className="p-2.5 hover:bg-gray-100 rounded-xl transition">
                    <FaTimes className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8">
                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-5">
                  {selectedNotice.title}
                </h2>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-5 mb-7 text-sm text-gray-500 bg-gray-50 rounded-2xl p-4">
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-600" />
                    {new Date(selectedNotice.publishDate || selectedNotice.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaRegClock className="text-blue-600" />
                    {new Date(selectedNotice.publishDate || selectedNotice.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  {selectedNotice.createdBy && (
                    <span className="flex items-center gap-2">
                      <FaUser className="text-blue-600" />
                      Posted by: {selectedNotice.createdBy.name || 'Admin'}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <FaEye className="text-blue-600" />
                    142 views
                  </span>
                </div>

                {/* Description */}
                <div className="prose max-w-none">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8 mb-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedNotice.description || 'No description available.'}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                {selectedNotice.additionalInfo && (
                  <div className="border-l-4 border-blue-600 bg-blue-50/50 p-5 rounded-r-xl mb-6">
                    <h4 className="font-bold text-gray-800 mb-2">Additional Information</h4>
                    <p className="text-sm text-gray-600">{selectedNotice.additionalInfo}</p>
                  </div>
                )}

                {/* Tags */}
                {selectedNotice.tags && selectedNotice.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedNotice.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                  <button onClick={closeModal} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition">
                    Back to List
                  </button>
                  <button onClick={handleShare} className="px-5 py-2.5 text-sm bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
                    Share This Notice
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notices;