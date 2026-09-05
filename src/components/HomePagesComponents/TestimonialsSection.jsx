import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  FaQuoteLeft,
  FaStar,
  FaUserGraduate,
  FaGoogle,
  FaChevronLeft,
  FaChevronRight,
  FaGraduationCap,
} from 'react-icons/fa';

import { getTestimonials } from '../../services/contentService';

// ============================================================
// FALLBACK DATA
// ============================================================

const fallbackTestimonials = [
  {
    _id: '1',
    studentName: 'সাদিয়া আফরিন',
    course: 'গ্রাফিক ডিজাইন',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
    rating: 5,
    review: 'ওপেন আইটি ইনস্টিটিউট থেকে গ্রাফিক ডিজাইন শেখার পর আমি এখন ফ্রিল্যান্সিং করে মাসে ৩০-৪০ হাজার টাকা আয় করছি। স্যারদের পড়ানোর ধরন অসাধারণ!',
    createdAt: '2024-12-10',
  },
  {
    _id: '2',
    studentName: 'রাকিব হাসান',
    course: 'ওয়েব ডেভেলপমেন্ট',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    rating: 5,
    review: 'এখানে এসে ওয়েব ডেভেলপমেন্ট শিখে আমি এখন একটি সফটওয়্যার ফার্মে চাকরি করছি। ল্যাব এবং প্র্যাকটিক্যাল ক্লাসের সুবিধা এত ভালো যে শেখাটা খুব সহজ হয়ে যায়।',
    createdAt: '2025-01-15',
  },
  {
    _id: '3',
    studentName: 'তানিয়া আক্তার',
    course: 'ডিজিটাল মার্কেটিং',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    rating: 4,
    review: 'ডিজিটাল মার্কেটিং কোর্সটি আমার ক্যারিয়ার বদলে দিয়েছে। ফেসবুক মার্কেটিং থেকে শুরু করে SEO পর্যন্ত সবকিছু হাতে-কলমে শিখিয়েছে। খুবই উপকৃত হয়েছি।',
    createdAt: '2025-02-20',
  },
  {
    _id: '4',
    studentName: 'মেহেদী হাসান',
    course: 'হার্ডওয়্যার ও নেটওয়ার্কিং',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    rating: 5,
    review: 'হার্ডওয়্যার এবং নেটওয়ার্কিং কোর্সটি খুবই প্র্যাকটিক্যাল। কম্পিউটার অ্যাসেম্বলি থেকে নেটওয়ার্ক সেটআপ সব নিজের হাতে করতে পারি।',
    createdAt: '2024-11-05',
  },
  {
    _id: '5',
    studentName: 'নুসরাত জাহান',
    course: 'ফ্রিল্যান্সিং',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
    rating: 5,
    review: 'আগে ভাবতাম ফ্রিল্যান্সিং করা অনেক কঠিন, কিন্তু ওপেন আইটির স্যাররা এত সহজভাবে বুঝিয়েছেন যে এখন Fiverr-এ নিয়মিত অর্ডার পাচ্ছি।',
    createdAt: '2025-03-01',
  },
  {
    _id: '6',
    studentName: 'ইমরান খান',
    course: 'প্রোগ্রামিং',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    rating: 4,
    review: 'প্রোগ্রামিং কোর্সের মাধ্যমে C, C++, Python শিখেছি। ক্লাসে একদম জিরো থেকে শুরু করে অ্যাডভান্সড লেভেল পর্যন্ত যাওয়া যায়।',
    createdAt: '2024-10-12',
  },
];

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const ref = useRef(null);
  // amount: 0 মানে সেকশনটি স্ক্রিনে ঢোকামাত্রই অটো-প্লে শুরু হবে
  const isInView = useInView(ref, { once: true, amount: 0 });

  // ==========================================================
  // LOAD FROM MONGODB
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const fetchTestimonials = async () => {
      try {
        setLoading(true);

        const response = await getTestimonials({ limit: 50 });

        const data = response?.data?.testimonials || response?.data?.data || response?.testimonials || response?.data || [];

        if (mounted && Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        } else if (mounted) {
          setTestimonials(fallbackTestimonials);
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error);
        if (mounted) {
          setTestimonials(fallbackTestimonials);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTestimonials();

    return () => {
      mounted = false;
    };
  }, []);

  const visibleTestimonials = useMemo(() => {
    return testimonials.slice(0, 10);
  }, [testimonials]);

  // ==========================================================
  // AUTO SLIDER (Always ON)
  // ==========================================================

  useEffect(() => {
    // সেকশনটি স্ক্রিনে দেখা গেলেই টাইমার শুরু হবে
    if (!isInView || visibleTestimonials.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % visibleTestimonials.length);
    }, 5000); // প্রতি ৫ সেকেন্ডে স্লাইড বদলাবে

    return () => clearInterval(interval);
  }, [isInView, visibleTestimonials.length, isAutoPlaying]);

  // Reset index if needed
  useEffect(() => {
    if (currentIndex >= visibleTestimonials.length && visibleTestimonials.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, visibleTestimonials.length]);

  const currentTestimonial = visibleTestimonials[currentIndex];

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="h-[360px] animate-pulse rounded-[28px] border border-slate-100 bg-slate-50 sm:h-[430px]" />
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================
  // MAIN SECTION
  // ==========================================================

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white "
    >
      {/* ======================================================
          BACKGROUND (Animated)
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50/40" />

        {/* Blue glow */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-[110px]"
        />

        {/* Cyan glow */}
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-200/30 blur-[110px]"
        />

        {/* Giant background text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <motion.h2
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="select-none whitespace-nowrap text-[80px] font-black uppercase tracking-[-0.08em] text-slate-900/[0.035] sm:text-[130px] md:text-[180px] lg:text-[230px]"
          >
            STUDENTS
          </motion.h2>
        </div>

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: 'linear-gradient(rgba(15,23,42,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.8) 1px, transparent 1px)',
            backgroundSize: '65px 65px',
          }}
        />
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ====================================================
            HEADER (Staggered)
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700 shadow-sm"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Student Stories
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl"
          >
            শিক্ষার্থীরা
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> কী বলছেন?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base"
          >
            আমাদের শিক্ষার্থীদের অভিজ্ঞতা, শেখার গল্প এবং ক্যারিয়ারে তাদের এগিয়ে যাওয়ার কিছু কথা।
          </motion.p>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-5 flex items-center justify-center gap-3"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                >
                  <FaStar className="text-sm text-amber-400" />
                </motion.div>
              ))}
            </div>
            <span className="text-sm font-bold text-slate-700">4.9/5</span>
            <span className="text-sm text-slate-400">• Trusted by students</span>
          </motion.div>
        </motion.div>

        {/* ====================================================
            SINGLE TESTIMONIAL CARD (3D Tilt on Hover)
        ==================================================== */}

        {currentTestimonial && (
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[34px] bg-blue-500/[0.045] blur-2xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.1)]">
                <div className="pointer-events-none absolute right-6 top-5 opacity-[0.055] sm:right-10 sm:top-8">
                  <FaQuoteLeft className="text-[100px] text-blue-600 sm:text-[150px]" />
                </div>

                <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />

                {/* Slider Area */}
                <div className="relative min-h-[390px] overflow-hidden sm:min-h-[430px] lg:min-h-[400px]">
                  <AnimatePresence initial={false} mode="sync">
                    <motion.div
                      key={currentTestimonial._id || currentTestimonial.id || currentIndex}
                      initial={{ x: '100%', opacity: 0 }}
                      animate={{ x: '0%', opacity: 1 }}
                      exit={{ x: '-100%', opacity: 0 }}
                      transition={{
                        x: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.55 },
                      }}
                      className="absolute inset-0"
                    >
                      <div className="flex h-full flex-col justify-center px-6 py-10 sm:px-10 md:px-14 lg:px-20">
                        <div className="grid items-center gap-10 lg:grid-cols-[280px_1fr]">
                          {/* Student Profile */}
                          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                            <div className="relative">
                              <div className="absolute -inset-3 rounded-full bg-blue-500/10 blur-xl" />

                              <div className="relative rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-[3px] shadow-xl">
                                <div className="rounded-full bg-white p-1">
                                  <div className="h-28 w-28 overflow-hidden rounded-full bg-slate-100 sm:h-32 sm:w-32">
                                    {currentTestimonial.photo ? (
                                      <img
                                        src={currentTestimonial.photo}
                                        alt={currentTestimonial.studentName || currentTestimonial.name || 'Student'}
                                        className="h-full w-full object-cover"
                                        onError={(event) => {
                                          event.currentTarget.onerror = null;
                                          event.currentTarget.src = fallbackImage;
                                        }}
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                                        <FaUserGraduate className="text-4xl" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white shadow-lg">
                                <FaGoogle className="text-xs" />
                              </div>
                            </div>

                            <h3 className="mt-5 text-xl font-black text-slate-900">
                              {currentTestimonial.studentName || currentTestimonial.name || 'Student'}
                            </h3>

                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                              <FaGraduationCap className="text-blue-600" />
                              <span>{currentTestimonial.course || currentTestimonial.role || 'General Course'}</span>
                            </div>

                            <div className="mt-4 flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <FaStar
                                  key={index}
                                  className={
                                    index < Number(currentTestimonial.rating || 5)
                                      ? 'text-amber-400'
                                      : 'text-slate-200'
                                  }
                                />
                              ))}
                            </div>

                            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Verified Student
                            </span>
                          </div>

                          {/* Review */}
                          <div className="relative">
                            <div className="mb-5 text-blue-600">
                              <FaQuoteLeft className="text-3xl" />
                            </div>

                            <blockquote className="text-lg font-medium leading-8 text-slate-700 sm:text-xl sm:leading-9 md:text-2xl">
                              “{currentTestimonial.review || currentTestimonial.text || 'Excellent learning experience at Open IT Institute.'}”
                            </blockquote>

                            <div className="mt-7 h-px w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />

                            <div className="mt-5 flex items-center justify-between gap-4">
                              <span className="text-xs text-slate-400">
                                {formatDate(currentTestimonial.createdAt || currentTestimonial.date)}
                              </span>
                              <span className="text-xs font-semibold text-blue-600">
                                Open IT Institute
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Controls */}
                {visibleTestimonials.length > 1 && (
                  <div className="flex items-center justify-center border-t border-slate-100 bg-slate-50/60 px-5 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentIndex((previous) => (previous - 1 + visibleTestimonials.length) % visibleTestimonials.length);
                        setIsAutoPlaying(true); // ম্যানুয়াল ক্লিকের পরও অটো চালু থাকবে
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                      aria-label="Previous testimonial"
                    >
                      <FaChevronLeft className="text-xs" />
                    </button>

                    <div className="mx-5 flex items-center gap-1.5">
                      {visibleTestimonials.slice(0, 8).map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setCurrentIndex(index);
                            setIsAutoPlaying(true);
                          }}
                          aria-label={`Show testimonial ${index + 1}`}
                          className="h-1.5"
                        >
                          <motion.span
                            animate={{
                              width: currentIndex === index ? 28 : 7,
                              opacity: currentIndex === index ? 1 : 0.3,
                            }}
                            transition={{ duration: 0.3 }}
                            className="block h-1.5 rounded-full bg-blue-600"
                          />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentIndex((previous) => (previous + 1) % visibleTestimonials.length);
                        setIsAutoPlaying(true);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                      aria-label="Next testimonial"
                    >
                      <FaChevronRight className="text-xs" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Bottom Trust Line */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400"
        >
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Real Student Experiences
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
          <span>Practical Learning</span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
          <span>Career Focused Training</span>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (date) => {
  if (!date) return '';
  try {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return '';
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

// ============================================================
// FALLBACK IMAGE
// ============================================================

const fallbackImage = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face';

export default TestimonialsSection;