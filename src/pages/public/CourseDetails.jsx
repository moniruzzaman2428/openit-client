import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaClock,
  FaUser,
  FaCheckCircle,
  FaArrowLeft,
  FaSpinner,
  FaGraduationCap,
  FaBookOpen,
  FaAward,
  FaRocket,
  FaLayerGroup,
  FaStar,
  FaShareAlt,
  FaBookmark,
  FaRegBookmark,
  FaWhatsapp,
  FaFacebookF,
  FaCalendarAlt,
  FaCertificate,
  FaArrowRight,
  FaLaptopCode,
  FaTag,
} from 'react-icons/fa';

import { getCourse } from '../../services/courseService';
import SEO from '../../components/seo/SEO';
import StructuredData, {
  courseSchema,
  breadcrumbSchema,
} from '../../components/seo/StructuredData';

const CourseDetails = () => {
  const { slug } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // ==================================================
  // FETCH COURSE
  // ==================================================

  useEffect(() => {
    let mounted = true;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await getCourse(slug);

        if (mounted) {
          setCourse(res?.data?.course || res?.data || null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.message ||
              'The course you are looking for could not be found.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchCourse();
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  // ==================================================
  // COURSE CALCULATIONS
  // ==================================================

  const pricing = useMemo(() => {
    const fee = Number(course?.fee) || 0;
    const discount = Number(course?.discount) || 0;

    const discounted =
      discount > 0
        ? Math.round(fee - (fee * discount) / 100)
        : fee;

    return {
      fee,
      discount,
      discounted,
      saving: Math.max(fee - discounted, 0),
    };
  }, [course]);

  const curriculumCount = Array.isArray(course?.curriculum)
    ? course.curriculum.length
    : 0;

  const requirementsCount = Array.isArray(course?.requirements)
    ? course.requirements.length
    : 0;

  const benefitsCount = Array.isArray(course?.benefits)
    ? course.benefits.length
    : 0;

  // ==================================================
  // SHARE
  // ==================================================

  const handleShare = async () => {
    if (!course) return;

    const shareData = {
      title: course.title,
      text: `Learn ${course.title} at Open IT Institute`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  // ==================================================
  // WHATSAPP SHARE
  // ==================================================

  const shareWhatsApp = () => {
    if (!course) return;

    const message = `আমি ${course.title} কোর্সটি সম্পর্কে জানতে চাই।\n\n${window.location.href}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // ==================================================
  // FACEBOOK SHARE
  // ==================================================

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="relative mx-auto mb-5 h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary/10" />

            <FaSpinner className="absolute inset-0 m-auto animate-spin text-3xl text-primary" />
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            Loading Course
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while we load the course details...
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error || !course) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16"
      >
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-100 bg-red-50">
            <FaBookOpen className="text-3xl text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Course Not Found
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error ||
              "The course you're looking for doesn't exist or may have been removed."}
          </p>

          <Link
            to="/courses"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <FaArrowLeft />
            Browse All Courses
          </Link>
        </div>
      </motion.div>
    );
  }

  // ==================================================
  // DATA
  // ==================================================

  const shortDescription =
    course.shortDescription ||
    course.description?.slice(0, 180) ||
    'Build practical IT skills with professional training at Open IT Institute.';

  const updatedDate = course.updatedAt
    ? new Date(course.updatedAt).toLocaleDateString('en-BD', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="overflow-hidden bg-slate-50">
      {/* ==================================================
          SEO
      ================================================== */}

      <SEO
        title={course.title}
        description={shortDescription.slice(0, 160)}
        path={`/courses/${course.slug}`}
      />

      <StructuredData
        data={[
          courseSchema(course),
          breadcrumbSchema([
            {
              name: 'Home',
              url: '/',
            },
            {
              name: 'Courses',
              url: '/courses',
            },
            {
              name: course.title,
              url: `/courses/${course.slug}`,
            },
          ]),
        ]}
      />

      {/* ==================================================
          HERO SECTION
      ================================================== */}

      <section className="relative isolate min-h-[620px] overflow-hidden bg-[#071426] text-white sm:min-h-[600px]">
        {/* ==================================================
            COURSE IMAGE
        ================================================== */}

        {course.image ? (
          <motion.img
            src={course.image}
            alt={course.title}
            loading="eager"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#071426] via-[#0c2340] to-[#102f52]" />
        )}

        {/* ==================================================
            IMAGE OVERLAY
            Much lighter than previous version
        ================================================== */}

        <div className="absolute inset-0 bg-black/25" />

        {/* Left dark gradient for text readability */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#03101f]/90 via-[#061426]/55 to-transparent" />

        {/* Bottom dark gradient */}

        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#061426] via-[#061426]/55 to-transparent" />

        {/* Subtle top gradient */}

        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />

        {/* ==================================================
            DECORATIVE GLOW
        ================================================== */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-3xl" />

        {/* ==================================================
            GRID
        ================================================== */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* ==================================================
            HERO CONTENT
        ================================================== */}

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {/* Back */}

          <Link
            to="/courses"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"
          >
            <FaArrowLeft className="transition group-hover:-translate-x-1" />
            Back to Courses
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* ==================================================
                HERO CONTENT
            ================================================== */}

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              {/* Badge */}

              <div className="mb-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
                  <FaGraduationCap className="text-primary" />
                  Professional Course
                </span>

                {pricing.discount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-lg">
                    <FaTag />
                    {pricing.discount}% OFF
                  </span>
                )}
              </div>

              {/* Course Title */}

              <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight drop-shadow-lg sm:text-4xl lg:text-5xl xl:text-6xl">
                {course.title}
              </h1>

              {/* Description */}

              <p className="mt-5 max-w-3xl text-base leading-7 text-white/90 drop-shadow-md sm:text-lg">
                {shortDescription}
              </p>

              {/* Course Meta */}

              <div className="mt-7 flex flex-wrap gap-3">
                {course.duration && (
                  <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/25 px-4 py-2.5 text-sm text-white shadow-lg backdrop-blur-md">
                    <FaClock className="text-primary" />
                    {course.duration}
                  </div>
                )}

                {course.classHours && (
                  <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/25 px-4 py-2.5 text-sm text-white shadow-lg backdrop-blur-md">
                    <FaLaptopCode className="text-secondary" />
                    {course.classHours}
                  </div>
                )}

                {course.instructor && (
                  <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/25 px-4 py-2.5 text-sm text-white shadow-lg backdrop-blur-md">
                    <FaUser className="text-emerald-400" />
                    {course.instructor}
                  </div>
                )}
              </div>
            </motion.div>

            {/* ==================================================
                PRICE CARD
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: 25,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
              className="relative"
            >
              <div className="rounded-3xl border border-white/20 bg-black/35 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-medium text-white/70">
                    Course Fee
                  </span>

                  <div className="flex items-center gap-1 text-sm text-amber-300">
                    <FaStar />
                    <span>4.8</span>
                  </div>
                </div>

                {/* Price */}

                <div className="flex items-end gap-3">
                  <span className="text-4xl font-extrabold">
                    ৳{pricing.discounted.toLocaleString()}
                  </span>

                  {pricing.discount > 0 && (
                    <span className="mb-1 text-sm text-white/50 line-through">
                      ৳{pricing.fee.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Saving */}

                {pricing.saving > 0 && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                    <FaCheckCircle />
                    Save ৳{pricing.saving.toLocaleString()}
                  </div>
                )}

                {/* Admission */}

                <Link
                  to="/admission"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  ভর্তি হোন এখনই
                  <FaArrowRight className="text-xs" />
                </Link>

                <p className="mt-3 text-center text-xs text-white/50">
                  Limited seats available
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================
          QUICK STATS
      ================================================== */}

      <section className="relative z-20 -mt-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:grid-cols-4">
          <div className="flex items-center gap-3 border-b border-r border-slate-100 p-4 sm:border-b-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FaClock />
            </div>

            <div>
              <p className="text-xs text-slate-400">Duration</p>

              <p className="text-sm font-bold text-slate-800">
                {course.duration || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-slate-100 p-4 sm:border-b-0 sm:border-r">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <FaLayerGroup />
            </div>

            <div>
              <p className="text-xs text-slate-400">Modules</p>

              <p className="text-sm font-bold text-slate-800">
                {curriculumCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-r border-slate-100 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <FaAward />
            </div>

            <div>
              <p className="text-xs text-slate-400">Benefits</p>

              <p className="text-sm font-bold text-slate-800">
                {benefitsCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <FaCertificate />
            </div>

            <div>
              <p className="text-xs text-slate-400">Requirements</p>

              <p className="text-sm font-bold text-slate-800">
                {requirementsCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="space-y-7">
              {/* Description */}

              {course.description && (
                <motion.section
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                  <SectionTitle
                    icon={<FaBookOpen />}
                    title="Course Description"
                  />

                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                    {course.description}
                  </p>
                </motion.section>
              )}

              {/* Curriculum */}

              {curriculumCount > 0 && (
                <motion.section
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                  <SectionTitle
                    icon={<FaLayerGroup />}
                    title="Course Curriculum"
                    badge={`${curriculumCount} Modules`}
                  />

                  <div className="mt-6 space-y-2">
                    {course.curriculum.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition hover:border-primary/10 hover:bg-primary/[0.03]"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <div className="pt-1">
                          <p className="text-sm font-medium leading-6 text-slate-700">
                            {item}
                          </p>
                        </div>

                        <FaCheckCircle className="ml-auto mt-1 hidden text-sm text-emerald-400 group-hover:block" />
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Requirements + Benefits */}

              <div className="grid gap-7 md:grid-cols-2">
                {requirementsCount > 0 && (
                  <motion.section
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <SectionTitle
                      icon={<FaCheckCircle />}
                      title="Requirements"
                    />

                    <ul className="mt-5 space-y-3">
                      {course.requirements.map((item, index) => (
                        <li
                          key={`${item}-${index}`}
                          className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                        >
                          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs text-emerald-500">
                            ✓
                          </span>

                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.section>
                )}

                {benefitsCount > 0 && (
                  <motion.section
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <SectionTitle
                      icon={<FaAward />}
                      title="Course Benefits"
                    />

                    <ul className="mt-5 space-y-3">
                      {course.benefits.map((item, index) => (
                        <li
                          key={`${item}-${index}`}
                          className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                        >
                          <FaRocket className="mt-1 shrink-0 text-secondary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.section>
                )}
              </div>
            </main>

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside className="lg:sticky lg:top-24">
              <div className="space-y-6">
                {/* Admission Card */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                >
                  <div className="bg-gradient-to-r from-primary to-secondary p-5 text-white">
                    <p className="text-xs font-medium text-white/70">
                      ENROLLMENT FEE
                    </p>

                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-3xl font-extrabold">
                        ৳{pricing.discounted.toLocaleString()}
                      </span>

                      {pricing.discount > 0 && (
                        <span className="mb-1 text-xs text-white/50 line-through">
                          ৳{pricing.fee.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="space-y-3">
                      <InfoRow
                        icon={<FaClock />}
                        label="Duration"
                        value={course.duration || 'N/A'}
                      />

                      {course.classHours && (
                        <InfoRow
                          icon={<FaLaptopCode />}
                          label="Class Hours"
                          value={course.classHours}
                        />
                      )}

                      {course.instructor && (
                        <InfoRow
                          icon={<FaUser />}
                          label="Instructor"
                          value={course.instructor}
                        />
                      )}

                      <InfoRow
                        icon={<FaLayerGroup />}
                        label="Modules"
                        value={curriculumCount}
                      />
                    </div>

                    <Link
                      to="/admission"
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark hover:shadow-lg"
                    >
                      ভর্তি হোন এখনই
                      <FaArrowRight />
                    </Link>
                  </div>
                </motion.div>

                {/* Share Card */}

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Save & Share
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Share this course with others
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setIsBookmarked((prev) => !prev)
                      }
                      aria-label="Bookmark course"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 transition hover:bg-primary/10"
                    >
                      {isBookmarked ? (
                        <FaBookmark className="text-primary" />
                      ) : (
                        <FaRegBookmark className="text-slate-400" />
                      )}
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-primary/10 hover:text-primary"
                    >
                      <FaShareAlt />
                      {copied ? 'Copied!' : 'Share'}
                    </button>

                    <button
                      type="button"
                      onClick={shareWhatsApp}
                      aria-label="Share on WhatsApp"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500 transition hover:bg-green-100"
                    >
                      <FaWhatsapp />
                    </button>

                    <button
                      type="button"
                      onClick={shareFacebook}
                      aria-label="Share on Facebook"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                    >
                      <FaFacebookF />
                    </button>
                  </div>
                </div>

                {/* Updated */}

                {updatedDate && (
                  <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/[0.04] p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FaCalendarAlt />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Last Updated
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-slate-700">
                        {updatedDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ==================================================
          FINAL CTA
      ================================================== */}

      <section className="relative overflow-hidden bg-[#061426] py-14 text-white sm:py-16">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70">
                <FaGraduationCap />
                Start Your Career
              </div>

              <h2 className="text-2xl font-extrabold sm:text-3xl">
                Ready to Start Learning?
              </h2>

              <p className="mt-2 max-w-xl text-sm text-white/60 sm:text-base">
                Join Open IT Institute and build practical skills for your
                future career.
              </p>
            </div>

            <Link
              to="/admission"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Apply Now
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// ======================================================
// REUSABLE COMPONENTS
// ======================================================

const SectionTitle = ({ icon, title, badge }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
        {title}
      </h2>
    </div>

    {badge && (
      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
        {badge}
      </span>
    )}
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
    <div className="flex items-center gap-2.5 text-sm text-slate-500">
      <span className="text-primary">{icon}</span>
      {label}
    </div>

    <span className="max-w-[55%] text-right text-sm font-semibold text-slate-800">
      {value}
    </span>
  </div>
);

export default CourseDetails;