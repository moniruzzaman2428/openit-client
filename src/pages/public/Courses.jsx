import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLaptopCode, 
  FaClock, 
  FaTag, 
  FaArrowRight, 
  FaSpinner,
  FaSearch,
  FaFilter,
  FaGraduationCap,
  FaUserGraduate,
  FaStar,
  FaBookOpen,
  FaChartLine,
  FaRegCalendarAlt,
  FaLayerGroup,
  FaTimes,
  FaAward
} from 'react-icons/fa';
import { getCourses } from '../../services/courseService';
import SEO from '../../components/seo/SEO';
import StructuredData, { courseListSchema, breadcrumbSchema } from '../../components/seo/StructuredData';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCourses({ limit: 50 });
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error(err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Extract unique categories from courses
  const categories = useMemo(() => {
    const cats = new Set(courses.map(c => c.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [courses]);

  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  // Filter and sort courses
  const filtered = useMemo(() => {
    let result = courses.filter(c => 
      (c.title?.toLowerCase().includes(search.toLowerCase()) ||
       c.description?.toLowerCase().includes(search.toLowerCase()))
    );

    if (selectedCategory !== 'all') {
      result = result.filter(c => c.category === selectedCategory);
    }

    if (selectedLevel !== 'all') {
      result = result.filter(c => c.level === selectedLevel);
    }

    // Sort
    switch(sortBy) {
      case 'price-low':
        result = result.sort((a, b) => (a.fee || 0) - (b.fee || 0));
        break;
      case 'price-high':
        result = result.sort((a, b) => (b.fee || 0) - (a.fee || 0));
        break;
      case 'popular':
        result = result.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
      case 'newest':
      default:
        result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [courses, search, selectedCategory, selectedLevel, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSortBy('newest');
  };

  const hasActiveFilters = search || selectedCategory !== 'all' || selectedLevel !== 'all';

  return (
    <div className="overflow-hidden">
      <SEO 
        title="Courses | Open IT Institute" 
        description="Browse professional IT courses at Open IT Institute — Web Development, Graphic Design, Digital Marketing, Hardware & Networking, Freelancing and more." 
        path="/courses" 
      />
      <StructuredData data={[courseListSchema(courses), breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Courses", url: "/courses" }])]} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-[#0a3a63] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:60px_60px]" />
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-12 bg-accent rounded-full" />
              <span className="text-sm font-semibold text-accent tracking-widest">COURSES</span>
              <div className="h-1 w-12 bg-accent rounded-full" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Our Courses
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Choose the perfect course for your career goals
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm border border-white/10">
                🎓 {courses.length} Courses Available
              </span>
              <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm border border-white/10">
                👨‍🏫 Expert Instructors
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses by title, description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(hasActiveFilters) && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Active Filters:</span>
                {search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-lg">
                    <FaSearch className="text-xs" />
                    {search}
                    <button onClick={() => setSearch('')} className="hover:text-primary-dark">
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-lg">
                    <FaFilter className="text-xs" />
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-primary-dark">
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Showing {filtered.length} of {courses.length} courses
              </span>
              <span className="text-sm text-gray-400">
                {filtered.length > 0 && `${Math.ceil(filtered.length / 9)} pages`}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="text-4xl text-primary animate-spin mb-4" />
              <p className="text-gray-500">Loading courses...</p>
            </div>
          ) : (
            <>
              {/* Course Grid */}
              <AnimatePresence mode="wait">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((course, i) => {
                    const discounted = course.discount
                      ? Math.round(course.fee - (course.fee * course.discount) / 100)
                      : course.fee;
                    
                    const levelColors = {
                      beginner: 'bg-green-100 text-green-700',
                      intermediate: 'bg-yellow-100 text-yellow-700',
                      advanced: 'bg-red-100 text-red-700'
                    };

                    return (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -8 }}
                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
                      >
                        {/* Course Image/Banner */}
                        <div className="relative h-48 bg-gradient-to-br from-primary to-secondary overflow-hidden">
                          {course.image ? (
                            <img 
                              src={course.image} 
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <FaLaptopCode className="text-6xl text-white/30" />
                            </div>
                          )}
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {course.discount > 0 && (
                              <span className="px-3 py-1 bg-accent text-dark text-xs font-bold rounded-lg shadow-lg">
                                {course.discount}% OFF
                              </span>
                            )}
                            {course.featured && (
                              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-dark text-xs font-bold rounded-lg shadow-lg">
                                <FaStar className="inline mr-1 text-xs" />
                                Featured
                              </span>
                            )}
                          </div>
                          
                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${levelColors[course.level] || 'bg-gray-100 text-gray-700'}`}>
                              {course.level || 'All Levels'}
                            </span>
                            <span className="text-white text-sm font-semibold bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm">
                              {course.category || 'General'}
                            </span>
                          </div>
                        </div>

                        {/* Course Content */}
                        <div className="p-5">
                          <h3 className="font-bold text-dark text-lg mb-2 group-hover:text-primary transition line-clamp-1">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {course.description}
                          </p>

                          {/* Course Meta */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                            <span className="flex items-center gap-1.5">
                              <FaClock className="text-primary" />
                              {course.duration || 'Flexible'}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FaUserGraduate className="text-primary" />
                              {course.students || 0} students
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FaBookOpen className="text-primary" />
                              {course.lessons || 0} lessons
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <FaTag className="text-primary text-sm" />
                              {course.discount > 0 ? (
                                <>
                                  <span className="text-sm line-through text-gray-400">৳{course.fee}</span>
                                  <span className="text-xl font-bold text-primary">৳{discounted}</span>
                                </>
                              ) : (
                                <span className="text-xl font-bold text-primary">৳{course.fee}</span>
                              )}
                            </div>
                            {course.discount > 0 && (
                              <span className="text-xs text-green-600 font-semibold">
                                Save ৳{course.fee - discounted}
                              </span>
                            )}
                          </div>

                          {/* CTA Button */}
                          <Link
                            to={`/courses/${course.slug}`}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/5 text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all group-hover:shadow-lg"
                          >
                            View Details
                            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>

              {/* Empty State */}
              {!loading && filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white rounded-2xl border border-gray-100"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaSearch className="text-4xl text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Courses Found</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    {hasActiveFilters 
                      ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                      : 'No courses available at the moment. Please check back later.'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-6 py-2 text-primary hover:text-primary-dark font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </motion.div>
              )}
            </>
          )}

          {/* Featured Courses Banner */}
          {!loading && courses.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="hidden md:block w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <FaAward className="text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Ready to Start Learning?</h3>
                    <p className="text-white/80 text-sm">Join thousands of students and start your IT career journey today</p>
                  </div>
                </div>
                <Link
                  to="/admission"
                  className="px-8 py-3 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition-all hover:scale-105 whitespace-nowrap"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Courses;