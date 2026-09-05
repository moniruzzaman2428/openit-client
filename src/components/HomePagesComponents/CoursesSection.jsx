import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaClock,
  FaUserTie,
  FaStar,
  FaBookOpen,
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaGraduationCap,
  FaLayerGroup,
} from 'react-icons/fa';
import { courses as fallbackCourses } from '../data/homeData';
import { getCourses } from '../../services/courseService';
import SectionTitle from './SectionTitle';
import {
  cardItem,
  sectionViewport,
  staggerContainer,
} from '../data/motionVariants';

// ============================================================
// FALLBACK IMAGES
// ============================================================

const fallbackImages = {
  'basic-computer-office-application':
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=700&fit=crop&q=85',
  'graphic-design':
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=700&fit=crop&q=85',
  'web-design':
    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=700&fit=crop&q=85',
  'web-development':
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=700&fit=crop&q=85',
  'hardware-networking':
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=700&fit=crop&q=85',
  freelancing:
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=700&fit=crop&q=85',
  'digital-marketing':
    'https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200&h=700&fit=crop&q=85',
  programming:
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=700&fit=crop&q=85',
  'ai-digital-skills':
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=700&fit=crop&q=85',
};

const genericCourseImage =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=700&fit=crop&q=85';

// ============================================================
// CATEGORY COLORS
// ============================================================

const categoryStyles = {
  'Web Development': 'bg-blue-500/90',
  'Web Design': 'bg-cyan-500/90',
  'Graphic Design': 'bg-purple-500/90',
  'Digital Marketing': 'bg-pink-500/90',
  Freelancing: 'bg-emerald-500/90',
  Programming: 'bg-indigo-500/90',
  'Hardware & Networking': 'bg-orange-500/90',
  'AI & Digital Skills': 'bg-violet-500/90',
  'Basic Computer': 'bg-sky-500/90',
};

// ============================================================
// CATEGORY FROM TITLE
// ============================================================

const getCategory = (course) => {
  if (course?.category) {
    return course.category;
  }

  const title = course?.title?.toLowerCase() || '';

  if (title.includes('web development')) return 'Web Development';
  if (title.includes('web design')) return 'Web Design';
  if (title.includes('graphic')) return 'Graphic Design';
  if (title.includes('digital marketing')) return 'Digital Marketing';
  if (title.includes('freelancing')) return 'Freelancing';
  if (title.includes('programming')) return 'Programming';
  if (title.includes('hardware')) return 'Hardware & Networking';
  if (title.includes('networking')) return 'Hardware & Networking';
  if (title.includes('ai')) return 'AI & Digital Skills';
  if (title.includes('basic computer')) return 'Basic Computer';

  return 'Career Course';
};

// ============================================================
// IMAGE FINDER
// ============================================================

const getCourseImage = (course) => {
  if (course?.image) {
    return course.image;
  }

  if (course?.slug && fallbackImages[course.slug]) {
    return fallbackImages[course.slug];
  }

  return genericCourseImage;
};

// ============================================================
// PRICE CALCULATOR
// ============================================================

const getPricing = (course) => {
  const fee = Number(course?.fee) || 0;
  const discount = Number(course?.discount) || 0;

  const discountedPrice =
    discount > 0
      ? Math.round(fee - (fee * discount) / 100)
      : fee;

  return {
    fee,
    discount,
    discountedPrice,
    saving: Math.max(fee - discountedPrice, 0),
  };
};

// ============================================================
// COURSES SECTION
// ============================================================

const CoursesSection = () => {
  const navigate = useNavigate();
  const [mongoCourses, setMongoCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // ============================================================
  // LOAD COURSES FROM MONGODB
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadCourses = async () => {
      try {
        setLoading(true);

        const response = await getCourses({
          limit: 50,
        });

        const apiCourses =
          response?.data?.courses ||
          response?.data ||
          [];

        if (
          mounted &&
          Array.isArray(apiCourses) &&
          apiCourses.length > 0
        ) {
          setMongoCourses(apiCourses);
          setUsingFallback(false);
        } else if (mounted) {
          setMongoCourses([]);
          setUsingFallback(true);
        }
      } catch (error) {
        console.error(
          'Failed to load courses from MongoDB:',
          error
        );

        if (mounted) {
          setMongoCourses([]);
          setUsingFallback(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // PRIMARY = MONGODB
  // FALLBACK = homeData.js
  // ============================================================

  const displayCourses = useMemo(() => {
    if (mongoCourses.length > 0) {
      return mongoCourses.slice(0, 6);
    }

    return Array.isArray(fallbackCourses)
      ? fallbackCourses.slice(0, 6)
      : [];
  }, [mongoCourses]);

  // ============================================================
  // HANDLE NAVIGATION
  // ============================================================

  const handleCourseClick = (slug) => {
    navigate(`/courses/${slug}`);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-12 sm:py-12 lg:py-16">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-purple-100/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.5) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />
      </div>

      {/* Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            align="left"
            badge="🎓 Popular Courses"
            title="ক্যারিয়ারের জন্য সঠিক স্কিল বেছে নিন"
            description="বর্তমান চাকরি ও ফ্রিল্যান্স মার্কেটের প্রয়োজন অনুযায়ী সাজানো আমাদের জনপ্রিয় কোর্সগুলো দেখুন।"
            light={false}
          />

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ x: 4 }}
          >
            <Link
              to="/courses"
              className="group inline-flex items-center gap-2 whitespace-nowrap text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
            >
              View All Courses
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <CourseSkeleton key={item} />
            ))}
          </div>
        )}

        {/* Courses */}
        {!loading && displayCourses.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayCourses.map((course, index) => {
              const pricing = getPricing(course);
              const category = getCategory(course);
              const imageUrl = getCourseImage(course);
              const slug =
                course?.slug ||
                course?.title
                  ?.toLowerCase()
                  .replace(/&/g, 'and')
                  .replace(/[^\w\s-]/g, '')
                  .replace(/\s+/g, '-');

              const curriculumCount = Array.isArray(
                course?.curriculum
              )
                ? course.curriculum.length
                : 0;

              const benefitsCount = Array.isArray(
                course?.benefits
              )
                ? course.benefits.length
                : 0;

              const categoryColor =
                categoryStyles[category] ||
                'bg-blue-600/90';

              return (
                <motion.article
                  key={course?._id || course?.slug || index}
                  variants={cardItem}
                  whileHover={{
                    y: -8,
                  }}
                  className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50 transition-all duration-500 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100/60"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-slate-900">
                    <img
                      src={imageUrl}
                      alt={course?.title || 'Course'}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading={index < 3 ? 'eager' : 'lazy'}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          genericCourseImage;
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/5" />
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />

                    {/* Category */}
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md ${categoryColor}`}
                    >
                      {category}
                    </span>

                    {/* Discount */}
                    {pricing.discount > 0 && (
                      <span className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-[11px] font-extrabold text-white shadow-lg">
                        {pricing.discount}% OFF
                      </span>
                    )}

                    {/* Course Icon */}
                    <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-xl backdrop-blur-md transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                      {course?.icon ? (
                        <course.icon className="text-xl" />
                      ) : (
                        <FaGraduationCap className="text-xl" />
                      )}
                    </div>

                    {/* Duration */}
                    {course?.duration && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-white backdrop-blur-md">
                        <FaClock className="text-[10px] text-white/70" />
                        <span className="text-[11px] font-semibold">
                          {course.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    {/* Title */}
                    <h3 className="line-clamp-2 min-h-[56px] text-lg font-extrabold leading-7 text-slate-800 transition-colors duration-300 group-hover:text-blue-600">
                      {course?.title}
                    </h3>

                    {/* Instructor */}
                    {course?.instructor && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                          <FaUserTie />
                        </div>
                        <span>
                          Instructor:{' '}
                          <strong className="font-semibold text-slate-700">
                            {course.instructor}
                          </strong>
                        </span>
                      </div>
                    )}

                    {/* Course Stats */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                      {course?.classHours && (
                        <span className="flex items-center gap-1.5">
                          <FaClock className="text-blue-500" />
                          {course.classHours}
                        </span>
                      )}

                      {curriculumCount > 0 && (
                        <span className="flex items-center gap-1.5">
                          <FaLayerGroup className="text-purple-500" />
                          {curriculumCount} Modules
                        </span>
                      )}

                      {benefitsCount > 0 && (
                        <span className="flex items-center gap-1.5">
                          <FaCheckCircle className="text-emerald-500" />
                          {benefitsCount} Benefits
                        </span>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="mt-5 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />

                    {/* Price + Button */}
                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Course Fee
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-blue-600">
                            ৳
                            {pricing.discountedPrice.toLocaleString()}
                          </span>
                          {pricing.discount > 0 && (
                            <span className="text-xs text-slate-400 line-through">
                              ৳{pricing.fee.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCourseClick(slug)}
                        className="group/btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40"
                      >
                        Details
                        <FaArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </button>
                    </div>

                    {/* Saving */}
                    {pricing.saving > 0 && (
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                        <FaCheckCircle />
                        Save ৳
                        {pricing.saving.toLocaleString()}
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* Fallback Notice */}
        {!loading &&
          usingFallback &&
          displayCourses.length > 0 && (
            <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400">
              <FaExclamationTriangle className="text-amber-400" />
              Showing featured courses while the course service is
              unavailable.
            </div>
          )}

        {/* Empty State */}
        {!loading && displayCourses.length === 0 && (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
              <FaBookOpen className="text-2xl" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-800">
              No Courses Available
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Courses will appear here once they are available.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-6 sm:flex-row sm:p-7"
        >
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <FaGraduationCap />
              </div>
              <h3 className="text-base font-extrabold text-slate-800 sm:text-lg">
                আপনার জন্য সঠিক কোর্সটি খুঁজে পাচ্ছেন না?
              </h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
              আমাদের সবগুলো কোর্স দেখে আপনার পছন্দের স্কিল বেছে নিন।
            </p>
          </div>

          <Link
            to="/courses"
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-600"
          >
            Explore All Courses
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================
// SKELETON
// ============================================================

const CourseSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="h-52 animate-pulse bg-slate-200" />
      <div className="space-y-4 p-6">
        <div className="h-5 w-4/5 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-7 w-24 animate-pulse rounded-lg bg-slate-100" />
        </div>
        <div className="h-px bg-slate-100" />
        <div className="flex items-center justify-between">
          <div className="h-7 w-24 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

export default CoursesSection;