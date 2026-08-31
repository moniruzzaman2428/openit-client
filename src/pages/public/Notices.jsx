import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBullhorn, 
  FaCalendarAlt, 
  FaSpinner, 
  FaSearch, 
  FaFilter,
  FaRegClock,
  FaTag,
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
  FaEye
} from 'react-icons/fa';
import { getNotices } from '../../services/contentService';
import SEO from '../../components/seo/SEO';

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
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedNotice(null);
    document.body.style.overflow = 'auto';
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you can implement actual bookmark saving to localStorage or API
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

  if (loading) {
    return (
      <div>
        <SEO title="Notices" description="Latest notices and announcements from OPEN IT INSTITUTE" path="/notices" />
        <section className="bg-gradient-to-r from-primary to-[#0a3a63] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-3">Notices</h1>
            <p className="text-white/80">Stay updated with latest announcements</p>
          </div>
        </section>
        <section className="py-12 bg-light min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="text-5xl text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading notices...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SEO title="Notices" description="Latest notices and announcements from OPEN IT INSTITUTE" path="/notices" />
        <section className="bg-gradient-to-r from-primary to-[#0a3a63] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-3">Notices</h1>
            <p className="text-white/80">Stay updated with latest announcements</p>
          </div>
        </section>
        <section className="py-12 bg-light min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <FaExclamationCircle className="text-5xl text-red-400 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchNotices}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <SEO title="Notices" description="Latest notices and announcements from OPEN IT INSTITUTE — exams, admissions, holidays and class updates." path="/notices" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-[#0a3a63] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Notices</h1>
            <p className="text-white/80 text-lg">Stay updated with latest announcements</p>
            <p className="text-white/60 text-sm mt-2">{notices.length} notices available</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-light">
        <div className="max-w-4xl mx-auto px-4">
          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notices by title, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FaFilter className="text-gray-400 mr-1" />
              {uniqueCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All' : categoryLabels[category] || category}
                  {category !== 'all' && (
                    <span className="ml-1 text-xs opacity-75">
                      ({notices.filter(n => n.category === category).length})
                    </span>
                  )}
                </button>
              ))}
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="text-sm text-gray-500">
              Showing {filteredNotices.length} of {notices.length} notices
            </div>
          </div>

          {/* Notices List */}
          {filteredNotices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-gray-100"
            >
              <FaBullhorn className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No notices found</h3>
              <p className="text-gray-400">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No notices published yet'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 text-primary hover:text-primary-dark font-medium"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredNotices.map((notice, i) => {
                const CategoryIcon = categoryColors[notice.category]?.icon || FaInfoCircle;
                const colors = categoryColors[notice.category] || categoryColors.general;
                
                return (
                  <motion.div
                    key={notice._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    onClick={() => handleNoticeClick(notice)}
                    className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${colors.bg} ${colors.text} border ${colors.border}`}>
                            <CategoryIcon className="text-xs" />
                            {categoryLabels[notice.category] || notice.category}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <FaCalendarAlt className="text-[10px]" />
                            {new Date(notice.publishDate || notice.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <FaRegClock className="text-[10px]" />
                            {new Date(notice.publishDate || notice.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <h3 className="font-bold text-dark text-lg mb-2 flex items-start gap-2 group-hover:text-primary transition-colors">
                          <FaBullhorn className="text-primary text-sm mt-1 flex-shrink-0" />
                          <span>{notice.title}</span>
                        </h3>

                        {notice.description && (
                          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line line-clamp-2">
                            {notice.description}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 mt-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                          <FaArrowRight className="text-primary group-hover:text-white transition-colors duration-300" />
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

      {/* Notice Detail Modal */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${categoryColors[selectedNotice.category]?.bg || 'bg-gray-100'}`}>
                    {(() => {
                      const Icon = categoryColors[selectedNotice.category]?.icon || FaInfoCircle;
                      return <Icon className={`${categoryColors[selectedNotice.category]?.text || 'text-gray-600'}`} />;
                    })()}
                  </div>
                  <div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${categoryColors[selectedNotice.category]?.bg || 'bg-gray-100'} ${categoryColors[selectedNotice.category]?.text || 'text-gray-600'}`}>
                      {categoryLabels[selectedNotice.category] || selectedNotice.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleBookmark}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Bookmark"
                  >
                    {isBookmarked ? (
                      <FaBookmark className="text-primary" />
                    ) : (
                      <FaRegBookmark className="text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Share"
                  >
                    <FaShare className="text-gray-400" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Print"
                  >
                    <FaPrint className="text-gray-400" />
                  </button>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FaTimes className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Title */}
                <h2 className="text-2xl font-bold text-dark mb-4">
                  {selectedNotice.title}
                </h2>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" />
                    {new Date(selectedNotice.publishDate || selectedNotice.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaRegClock className="text-primary" />
                    {new Date(selectedNotice.publishDate || selectedNotice.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {selectedNotice.createdBy && (
                    <span className="flex items-center gap-2">
                      <FaUser className="text-primary" />
                      Posted by: {selectedNotice.createdBy.name || 'Admin'}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <FaEye className="text-primary" />
                    142 views
                  </span>
                </div>

                {/* Description */}
                <div className="prose max-w-none">
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedNotice.description || 'No description available.'}
                    </p>
                  </div>
                </div>

                {/* Additional Info (if any) */}
                {selectedNotice.additionalInfo && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Additional Information</h4>
                    <p className="text-sm text-gray-500">{selectedNotice.additionalInfo}</p>
                  </div>
                )}

                {/* Tags */}
                {selectedNotice.tags && selectedNotice.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedNotice.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      closeModal();
                      // Here you can add logic to scroll to related notices
                    }}
                    className="px-4 py-2 text-sm text-primary hover:text-primary-dark font-medium transition"
                  >
                    View All Notices
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                  >
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