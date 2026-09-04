import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  FaLaptopCode,
  FaClock,
  FaArrowRight,
  FaSearch,
  FaFilter,
  FaGraduationCap,
  FaBookOpen,
  FaLayerGroup,
  FaTimes,
  FaAward,
  FaCheckCircle,
  FaRocket,
  FaPlayCircle,
  FaChevronDown,
  FaCode,
  FaPalette,
  FaBullhorn,
  FaBriefcase,
  FaNetworkWired,
  FaRobot,
  FaUserTie,
  FaListUl,
  FaCertificate,
  FaLaptop,
} from 'react-icons/fa';

import { getCourses } from '../../services/courseService';

import SEO from '../../components/seo/SEO';

import StructuredData, {
  courseListSchema,
  breadcrumbSchema,
} from '../../components/seo/StructuredData';


/* =========================================================
   ANIMATION
========================================================= */

const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const heroItem = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};


/* =========================================================
   CATEGORY
========================================================= */

const getCourseCategory = (title = '') => {
  const value = title.toLowerCase();

  if (value.includes('basic') || value.includes('office')) {
    return 'Basic Computer';
  }

  if (value.includes('graphic')) {
    return 'Graphic Design';
  }

  if (value.includes('web design')) {
    return 'Web Design';
  }

  if (value.includes('web development')) {
    return 'Web Development';
  }

  if (value.includes('hardware') || value.includes('network')) {
    return 'Hardware & Networking';
  }

  if (value.includes('freelanc')) {
    return 'Freelancing';
  }

  if (value.includes('digital marketing') || value.includes('marketing')) {
    return 'Digital Marketing';
  }

  if (value.includes('programming')) {
    return 'Programming';
  }

  if (value.includes('ai') || value.includes('digital skills')) {
    return 'AI & Digital Skills';
  }

  return 'Computer Training';
};


/* =========================================================
   CATEGORY ICON
========================================================= */

const getCategoryIcon = (category = '') => {
  const value = category.toLowerCase();

  if (value.includes('web')) {
    return FaCode;
  }

  if (value.includes('graphic') || value.includes('design')) {
    return FaPalette;
  }

  if (value.includes('marketing')) {
    return FaBullhorn;
  }

  if (value.includes('freelanc')) {
    return FaBriefcase;
  }

  if (value.includes('hardware') || value.includes('network')) {
    return FaNetworkWired;
  }

  if (value.includes('program')) {
    return FaLaptopCode;
  }

  if (value.includes('ai')) {
    return FaRobot;
  }

  if (value.includes('basic')) {
    return FaLaptop;
  }

  return FaLaptopCode;
};


/* =========================================================
   CATEGORY STYLE
========================================================= */

const getCategoryStyle = (category = '') => {
  const value = category.toLowerCase();

  if (value.includes('web development')) {
    return 'bg-blue-50 text-blue-700 border-blue-100';
  }

  if (value.includes('web design')) {
    return 'bg-indigo-50 text-indigo-700 border-indigo-100';
  }

  if (value.includes('graphic')) {
    return 'bg-pink-50 text-pink-700 border-pink-100';
  }

  if (value.includes('marketing')) {
    return 'bg-orange-50 text-orange-700 border-orange-100';
  }

  if (value.includes('freelanc')) {
    return 'bg-violet-50 text-violet-700 border-violet-100';
  }

  if (value.includes('hardware') || value.includes('network')) {
    return 'bg-cyan-50 text-cyan-700 border-cyan-100';
  }

  if (value.includes('program')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  }

  if (value.includes('ai')) {
    return 'bg-purple-50 text-purple-700 border-purple-100';
  }

  return 'bg-slate-50 text-slate-600 border-slate-100';
};


/* =========================================================
   SKELETON
========================================================= */

const CourseSkeleton = () => (
  <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm animate-pulse">
    <div className="h-[225px] bg-slate-200" />
    <div className="p-5">
      <div className="h-5 w-4/5 bg-slate-200 rounded mb-3" />
      <div className="h-3 w-full bg-slate-100 rounded mb-2" />
      <div className="h-3 w-3/4 bg-slate-100 rounded mb-5" />
      <div className="h-px bg-slate-100 mb-5" />
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-12 bg-slate-100 rounded-xl" />
      </div>
      <div className="h-10 bg-slate-200 rounded-xl" />
    </div>
  </div>
);


/* =========================================================
   MAIN COMPONENT
========================================================= */

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');


  /* =======================================================
     FETCH
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchCourses = async () => {
      try {
        const res = await getCourses({ limit: 50 });

        const data = Array.isArray(res?.data?.courses)
          ? res.data.courses
          : Array.isArray(res?.data)
            ? res.data
            : [];

        if (mounted) {
          setCourses(data);
        }
      } catch (error) {
        console.error('Failed to load courses:', error);

        if (mounted) {
          setCourses([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      mounted = false;
    };
  }, []);


  /* =======================================================
     CATEGORY LIST
  ======================================================= */

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        courses
          .map((course) => getCourseCategory(course?.title))
          .filter(Boolean)
      ),
    ];

    return ['all', ...unique];
  }, [courses]);


  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let result = courses.filter((course) => {
      const title = String(course?.title || '').toLowerCase();
      const description = String(course?.description || '').toLowerCase();
      const instructor = String(course?.instructor || '').toLowerCase();
      const category = getCourseCategory(course?.title).toLowerCase();

      return (
        title.includes(keyword) ||
        description.includes(keyword) ||
        instructor.includes(keyword) ||
        category.includes(keyword)
      );
    });

    if (selectedCategory !== 'all') {
      result = result.filter(
        (course) =>
          getCourseCategory(course?.title) === selectedCategory
      );
    }

    result = [...result];

    switch (sortBy) {
      case 'price-low':
        result.sort(
          (a, b) =>
            Number(a?.fee || 0) - Number(b?.fee || 0)
        );
        break;

      case 'price-high':
        result.sort(
          (a, b) =>
            Number(b?.fee || 0) - Number(a?.fee || 0)
        );
        break;

      case 'duration-short':
        result.sort(
          (a, b) =>
            parseInt(a?.duration || 0) -
            parseInt(b?.duration || 0)
        );
        break;

      case 'newest':
      default:
        result.sort(
          (a, b) =>
            new Date(b?.createdAt || 0) -
            new Date(a?.createdAt || 0)
        );
        break;
    }

    return result;
  }, [courses, search, selectedCategory, sortBy]);


  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    Boolean(search) ||
    selectedCategory !== 'all';


  /* =======================================================
     STATS
  ======================================================= */

  const totalModules = useMemo(() => {
    return courses.reduce(
      (total, course) =>
        total + (Array.isArray(course?.curriculum)
          ? course.curriculum.length
          : 0),
      0
    );
  }, [courses]);


  /* =======================================================
     COURSE CARD
  ======================================================= */

  const renderCourseCard = (course, index) => {
    const fee = Number(course?.fee || 0);
    const discount = Number(course?.discount || 0);

    const discountedPrice =
      discount > 0
        ? Math.round(fee - (fee * discount) / 100)
        : fee;

    const saving = fee - discountedPrice;

    const category = getCourseCategory(course?.title);
    const CategoryIcon = getCategoryIcon(category);
    const categoryStyle = getCategoryStyle(category);

    const curriculumCount = Array.isArray(course?.curriculum)
      ? course.curriculum.length
      : 0;

    const requirementsCount = Array.isArray(course?.requirements)
      ? course.requirements.length
      : 0;

    const benefitsCount = Array.isArray(course?.benefits)
      ? course.benefits.length
      : 0;

    return (
      <motion.article
        key={course?._id || course?.slug || index}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
        whileHover={{ y: -7 }}
        className="group relative bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_25px_65px_rgba(15,23,42,0.13)] transition-shadow duration-500"
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

        {/* IMAGE */}

        <div className="relative h-[225px] overflow-hidden bg-[#071a35]">
          {course?.image ? (
            <img
              src={course.image}
              alt={course?.title || 'Course'}
              loading={index < 3 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#071a35] via-[#0d3763] to-[#164e78]">
              <CategoryIcon className="text-7xl text-white/15" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#06152d]/95 via-[#06152d]/20 to-transparent" />

          {/* BADGES */}

          <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {discount > 0 && (
                <span className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-[10px] font-extrabold tracking-wide shadow-lg">
                  {discount}% OFF
                </span>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/35 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold whitespace-nowrap">
              <CategoryIcon />
              {category}
            </span>
          </div>

          {/* IMAGE BOTTOM */}

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
            <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${categoryStyle}`}>
              {category}
            </span>

            <span className="flex items-center gap-1.5 text-white text-xs font-semibold">
              <FaClock className="text-cyan-300" />
              {course?.duration || 'Flexible'}
            </span>
          </div>
        </div>

        {/* CONTENT */}

        <div className="p-5">
          <Link to={`/courses/${course?.slug}`}>
            <h3 className="text-[18px] font-extrabold text-[#091a33] leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 min-h-[50px]">
              {course?.title || 'Untitled Course'}
            </h3>
          </Link>

          <p className="mt-2.5 text-[13px] text-slate-500 leading-6 line-clamp-2 min-h-[48px]">
            {course?.description || 'Build practical IT skills and prepare yourself for a successful digital career.'}
          </p>

          {/* INSTRUCTOR */}

          <div className="flex items-center gap-2.5 mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <FaUserTie className="text-blue-600 text-xs" />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                Instructor
              </p>

              <p className="text-xs font-bold text-slate-700 truncate">
                {course?.instructor || 'Expert Instructor'}
              </p>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-5" />

          {/* META */}

          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto rounded-lg bg-blue-50 flex items-center justify-center mb-1.5">
                <FaClock className="text-blue-500 text-xs" />
              </div>

              <p className="text-[9px] text-slate-400">Duration</p>

              <p className="text-[11px] font-bold text-slate-700 mt-0.5 truncate">
                {course?.duration || 'Flexible'}
              </p>
            </div>

            <div className="text-center border-x border-slate-100">
              <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-50 flex items-center justify-center mb-1.5">
                <FaBookOpen className="text-indigo-500 text-xs" />
              </div>

              <p className="text-[9px] text-slate-400">Modules</p>

              <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                {curriculumCount}
              </p>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-50 flex items-center justify-center mb-1.5">
                <FaCertificate className="text-emerald-500 text-xs" />
              </div>

              <p className="text-[9px] text-slate-400">Benefits</p>

              <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                {benefitsCount}
              </p>
            </div>
          </div>

          {/* CLASS HOURS */}

          {course?.classHours && (
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
              <FaClock className="text-cyan-500" />
              <span>Class:</span>
              <span className="font-bold text-slate-700">
                {course.classHours}
              </span>
            </div>
          )}

          {/* PRICE */}

          <div className="flex items-end justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
                Course Fee
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {discount > 0 && (
                  <span className="text-xs text-slate-400 line-through">
                    ৳{fee.toLocaleString()}
                  </span>
                )}

                <span className="text-2xl font-black text-[#081a35]">
                  ৳{discountedPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {discount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                Save ৳{saving.toLocaleString()}
              </span>
            )}
          </div>

          {/* CTA */}

          <Link
            to={`/courses/${course?.slug}`}
            className="group/btn flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#081a35] text-white text-sm font-bold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/20 transition-all duration-300"
          >
            <FaPlayCircle className="text-cyan-300 group-hover/btn:text-white transition-colors" />

            View Course Details

            <FaArrowRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.article>
    );
  };


  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7faff] text-slate-800">

      {/* SEO */}

      <SEO
        title="কম্পিউটার কোর্স"
        description="ওপেন আইটি ইনস্টিটিউটে Web Development, Graphic Design, Digital Marketing, Freelancing এবং বিভিন্ন কম্পিউটার কোর্সে ভর্তি চলছে।"
        path="/courses"
      />

      <StructuredData
        data={[
          courseListSchema(courses),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Courses', url: '/courses' },
          ]),
        ]}
      />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#06152d] text-white">

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-400/10 blur-[130px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[130px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)
              `,
              backgroundSize: '55px 55px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-12 gap-10 items-center min-h-[440px] py-14 lg:py-16">

            {/* LEFT */}

            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="show"
              className="lg:col-span-7"
            >

              <motion.div
                variants={heroItem}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-xl mb-5"
              >
                <span className="w-7 h-7 rounded-full bg-cyan-400/10 flex items-center justify-center">
                  <FaGraduationCap className="text-cyan-300 text-xs" />
                </span>

                <span className="text-xs sm:text-sm font-bold tracking-wide text-cyan-200">
                  PROFESSIONAL IT EDUCATION
                </span>

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </motion.div>

              <motion.h1
                variants={heroItem}
                className="text-4xl sm:text-5xl lg:text-[58px] font-black leading-[1.05] tracking-tight"
              >
                Learn Skills.

                <br />

                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Build Your Career.
                </span>
              </motion.h1>

              <motion.p
                variants={heroItem}
                className="mt-5 max-w-2xl text-base sm:text-lg text-slate-300 leading-8"
              >
                Learn practical IT skills with expert instructors,
                project-based training and career-focused courses
                designed for today's digital world.
              </motion.p>

              <motion.div
                variants={heroItem}
                className="flex flex-wrap gap-3 mt-7"
              >
                <a
                  href="#course-list"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#06152d] text-sm font-extrabold shadow-xl shadow-cyan-500/20 hover:-translate-y-1 transition-all"
                >
                  Explore Courses

                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </a>

                <Link
                  to="/admission"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm font-bold backdrop-blur-xl hover:bg-white/10 hover:-translate-y-1 transition-all"
                >
                  <FaRocket className="text-cyan-300" />
                  Start Learning
                </Link>
              </motion.div>

              <motion.div
                variants={heroItem}
                className="flex flex-wrap gap-x-6 gap-y-3 mt-7 text-xs text-slate-400"
              >
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-400" />
                  Practical Learning
                </span>

                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-400" />
                  Expert Instructors
                </span>

                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-400" />
                  Career Focused
                </span>
              </motion.div>

            </motion.div>


            {/* RIGHT VISUAL */}

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block lg:col-span-5"
            >

              <div className="relative h-[350px]">

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-8 left-8 right-2 rounded-[28px] bg-white/[0.07] border border-white/10 backdrop-blur-2xl shadow-2xl p-6"
                >

                  <div className="flex items-center justify-between mb-6">

                    <div>
                      <p className="text-[10px] text-cyan-300 font-bold tracking-[0.18em]">
                        OPEN IT INSTITUTE
                      </p>

                      <h3 className="text-xl font-extrabold mt-1">
                        Career Learning Hub
                      </h3>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-300/10 flex items-center justify-center">
                      <FaLaptopCode className="text-cyan-300 text-xl" />
                    </div>

                  </div>

                  <div className="space-y-3">

                    {[
                      {
                        name: 'Web Development',
                        icon: FaCode,
                        progress: '92%',
                      },
                      {
                        name: 'Graphic Design',
                        icon: FaPalette,
                        progress: '84%',
                      },
                      {
                        name: 'Digital Marketing',
                        icon: FaBullhorn,
                        progress: '88%',
                      },
                    ].map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/5"
                        >
                          <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center">
                            <Icon className="text-cyan-300 text-sm" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="text-slate-300">
                                {item.name}
                              </span>

                              <span className="text-cyan-300 font-bold">
                                {item.progress}
                              </span>
                            </div>

                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: item.progress }}
                                transition={{
                                  duration: 1.2,
                                  delay: 0.7 + index * 0.2,
                                }}
                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  </div>

                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
                        <FaBookOpen className="text-cyan-300 text-xs" />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-white">
                          {courses.length}+
                        </p>

                        <p className="text-[9px] text-slate-500">
                          Courses
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-300">
                        {totalModules}+
                      </p>

                      <p className="text-[9px] text-slate-500">
                        Learning Modules
                      </p>
                    </div>

                  </div>

                </motion.div>


                {/* FLOATING CARD */}

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute left-0 bottom-5 px-4 py-3 rounded-2xl bg-white text-[#06152d] shadow-2xl"
                >
                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                      <FaAward className="text-blue-600" />
                    </div>

                    <div>
                      <p className="text-sm font-black">
                        Career Ready
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Learn • Practice • Grow
                      </p>
                    </div>

                  </div>
                </motion.div>

              </div>

            </motion.div>

          </div>


          {/* HERO SEARCH */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pb-8"
          >
            <div className="max-w-5xl mx-auto p-2 rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-xl">

              <div className="relative">

                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-300" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Web Development, Graphic Design, Digital Marketing..."
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-white text-slate-800 placeholder:text-slate-400 outline-none text-sm shadow-lg"
                />

                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
                    aria-label="Clear search"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}

              </div>

            </div>
          </motion.div>

        </div>
      </section>


      {/* =====================================================
          COURSE SECTION
      ===================================================== */}

      <section id="course-list" className="py-14 lg:py-18">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-7">

            <div>

              <div className="flex items-center gap-2 mb-3">

                <span className="w-9 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />

                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-[0.2em]">
                  Explore Learning
                </span>

              </div>

              <h2 className="text-3xl md:text-4xl font-black text-[#091a33]">
                Choose Your Course
              </h2>

              <p className="mt-2 text-sm md:text-base text-slate-500 max-w-xl">
                Learn practical skills from experienced instructors
                and prepare yourself for the digital career market.
              </p>

            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm text-sm text-slate-500">
              <FaLayerGroup className="text-blue-500" />

              <span>
                {filteredCourses.length} course
                {filteredCourses.length !== 1 ? 's' : ''} found
              </span>
            </div>

          </div>


          {/* FILTER */}

          <div className="bg-white rounded-[22px] border border-slate-100 shadow-[0_10px_40px_rgba(15,23,42,0.05)] p-4 md:p-5 mb-8">

            <div className="grid md:grid-cols-4 gap-3">

              {/* SEARCH */}

              <div className="md:col-span-2 relative">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                <input
                  type="text"
                  placeholder="Search courses or instructor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition"
                />

              </div>


              {/* CATEGORY */}

              <div className="relative">

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all'
                        ? 'All Categories'
                        : category}
                    </option>
                  ))}
                </select>

                <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />

              </div>


              {/* SORT */}

              <div className="relative">

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="newest">
                    Newest First
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="duration-short">
                    Shortest Duration
                  </option>
                </select>

                <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />

              </div>

            </div>


            {/* ACTIVE FILTER */}

            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100"
              >

                <span className="text-xs font-semibold text-slate-400">
                  Active:
                </span>

                {search && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold">

                    <FaSearch />

                    <span className="max-w-[180px] truncate">
                      {search}
                    </span>

                    <button onClick={() => setSearch('')}>
                      <FaTimes />
                    </button>

                  </span>
                )}

                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold">

                    <FaFilter />

                    {selectedCategory}

                    <button onClick={() => setSelectedCategory('all')}>
                      <FaTimes />
                    </button>

                  </span>
                )}

                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-slate-500 hover:text-blue-600 ml-1 transition"
                >
                  Clear all
                </button>

              </motion.div>
            )}

          </div>


          {/* COURSES */}

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {Array.from({ length: 6 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))}

            </div>
          ) : (
            <AnimatePresence mode="wait">

              {filteredCourses.length > 0 ? (
                <motion.div
                  key="courses"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredCourses.map(renderCourseCard)}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20 px-5 bg-white rounded-[28px] border border-slate-100 shadow-sm"
                >

                  <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
                    <FaSearch className="text-3xl text-blue-400" />
                  </div>

                  <h3 className="text-xl font-black text-[#081a35]">
                    No Courses Found
                  </h3>

                  <p className="text-sm text-slate-400 max-w-md mx-auto mt-2 leading-6">
                    Try adjusting your search or filter criteria
                    to find a suitable course.
                  </p>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-5 px-5 py-2.5 rounded-xl bg-[#081a35] text-white text-sm font-bold hover:bg-blue-600 transition"
                    >
                      Clear All Filters
                    </button>
                  )}

                </motion.div>
              )}

            </AnimatePresence>
          )}


          {/* BOTTOM CTA */}

          {!loading && courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative overflow-hidden mt-16 rounded-[28px] bg-[#06152d] p-7 md:p-10"
            >

              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-cyan-400/10 blur-[80px]" />

              <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-blue-600/20 blur-[80px]" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-7">

                <div className="flex items-center gap-5">

                  <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-300/10 items-center justify-center">
                    <FaAward className="text-2xl text-cyan-300" />
                  </div>

                  <div>

                    <p className="text-cyan-300 text-xs font-bold uppercase tracking-[0.18em] mb-1">
                      Ready to Grow?
                    </p>

                    <h3 className="text-xl md:text-2xl font-black text-white">
                      Start Your IT Career Today
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      Choose a course and take the first step
                      toward your future.
                    </p>

                  </div>

                </div>

                <Link
                  to="/admission"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#06152d] text-sm font-extrabold hover:bg-cyan-300 hover:scale-[1.02] transition-all whitespace-nowrap"
                >
                  Apply for Admission

                  <FaArrowRight className="text-xs" />
                </Link>

              </div>

            </motion.div>
          )}

        </div>
      </section>

    </div>
  );
};


export default Courses;