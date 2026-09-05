import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaArrowRight,
  FaBullhorn,
  FaCalendarAlt,
  FaClock,
  FaExclamationCircle,
  FaFacebookF,
  FaHome,
  FaInfoCircle,
  FaLink,
  FaPrint,
  FaShareAlt,
  FaTag,
  FaUser,
  FaWhatsapp,
} from 'react-icons/fa';

import { getNotices } from '../../services/contentService';
import SEO from '../../components/seo/SEO';
import StructuredData, {
  breadcrumbSchema,
  organizationSchema,
} from '../../components/seo/StructuredData';

// ============================================================
// CATEGORY CONFIG
// ============================================================

const categoryConfig = {
  general: {
    label: 'General',
    icon: FaInfoCircle,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dark: 'bg-blue-600',
    gradient: 'from-blue-600 to-cyan-500',
  },

  admission: {
    label: 'Admission',
    icon: FaBullhorn,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dark: 'bg-emerald-600',
    gradient: 'from-emerald-600 to-teal-500',
  },

  exam: {
    label: 'Exam',
    icon: FaExclamationCircle,
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dark: 'bg-orange-600',
    gradient: 'from-orange-500 to-amber-500',
  },

  class: {
    label: 'Class',
    icon: FaInfoCircle,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dark: 'bg-purple-600',
    gradient: 'from-purple-600 to-fuchsia-500',
  },

  result: {
    label: 'Result',
    icon: FaBullhorn,
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    dark: 'bg-pink-600',
    gradient: 'from-pink-600 to-rose-500',
  },

  holiday: {
    label: 'Holiday',
    icon: FaCalendarAlt,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dark: 'bg-red-600',
    gradient: 'from-red-600 to-orange-500',
  },
};

// ============================================================
// SLUG GENERATOR
// ============================================================

const createSlug = (text = '') => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(
      /[\u0980-\u09FF]+/g,
      (match) => match
    )
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (date) => {
  if (!date) {
    return 'Date unavailable';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable';
  }

  return parsedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ============================================================
// TIME FORMATTER
// ============================================================

const formatTime = (date) => {
  if (!date) {
    return '';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ============================================================
// NOTICES DETAILS
// ============================================================

const NoticesDetails = () => {
  const { slug } = useParams();

  const [notice, setNotice] = useState(null);
  const [relatedNotices, setRelatedNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==========================================================
  // LOAD NOTICE
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadNotice = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getNotices({
          limit: 50,
        });

        const notices =
          response?.data?.notices ||
          response?.notices ||
          response?.data?.data ||
          response?.data ||
          [];

        if (!mounted) {
          return;
        }

        if (!Array.isArray(notices)) {
          throw new Error(
            'Invalid notices response'
          );
        }

        // ------------------------------------------------------
        // FIND NOTICE BY SLUG
        // ------------------------------------------------------

        const foundNotice = notices.find((item) => {
          const itemSlug =
            item?.slug ||
            createSlug(item?.title);

          return itemSlug === slug;
        });

        if (!foundNotice) {
          setError(
            'The notice you are looking for could not be found.'
          );
          setNotice(null);
          return;
        }

        setNotice(foundNotice);

        // ------------------------------------------------------
        // RELATED NOTICES
        // ------------------------------------------------------

        const related = notices
          .filter(
            (item) =>
              item?._id !== foundNotice?._id
          )
          .filter((item) => {
            if (!foundNotice.category) {
              return true;
            }

            return (
              item.category ===
              foundNotice.category
            );
          })
          .sort(
            (a, b) =>
              new Date(
                b.publishDate ||
                  b.createdAt
              ) -
              new Date(
                a.publishDate ||
                  a.createdAt
              )
          )
          .slice(0, 3);

        setRelatedNotices(related);
      } catch (err) {
        console.error(
          'Failed to load notice:',
          err
        );

        if (mounted) {
          setError(
            'Failed to load notice. Please try again later.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNotice();

    return () => {
      mounted = false;
    };
  }, [slug]);

  // ==========================================================
  // NOTICE CONFIG
  // ==========================================================

  const config = useMemo(() => {
    return (
      categoryConfig[
        notice?.category
      ] || categoryConfig.general
    );
  }, [notice?.category]);

  const CategoryIcon = config.icon;

  // ==========================================================
  // SHARE
  // ==========================================================

  const handleShare = async () => {
    if (!notice) {
      return;
    }

    const shareUrl =
      window.location.href;

    const shareData = {
      title: notice.title,
      text:
        notice.description ||
        'OPEN IT INSTITUTE Notice',
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(
          shareData
        );
        return;
      }

      await navigator.clipboard.writeText(
        shareUrl
      );

      alert(
        'Notice link copied to clipboard!'
      );
    } catch (err) {
      console.error(
        'Share failed:',
        err
      );
    }
  };

  // ==========================================================
  // COPY LINK
  // ==========================================================

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      alert(
        'Notice link copied successfully!'
      );
    } catch (error) {
      console.error(
        'Copy link failed:',
        error
      );
    }
  };

  // ==========================================================
  // WHATSAPP SHARE
  // ==========================================================

  const shareWhatsApp = () => {
    if (!notice) {
      return;
    }

    const text = encodeURIComponent(
      `${notice.title}\n\n${window.location.href}`
    );

    window.open(
      `https://wa.me/?text=${text}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // ==========================================================
  // FACEBOOK SHARE
  // ==========================================================

  const shareFacebook = () => {
    const url = encodeURIComponent(
      window.location.href
    );

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // ==========================================================
  // PRINT
  // ==========================================================

  const handlePrint = () => {
    window.print();
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SEO
          title="Notice"
          description="OPEN IT INSTITUTE notice and announcement"
          path={`/notices/${slug}`}
        />

        {/* Loading Hero */}

        <section className="relative overflow-hidden bg-[#061426] py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#061426] via-[#0b2440] to-[#07111d]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl animate-pulse">
              <div className="mb-6 h-8 w-32 rounded-full bg-white/10" />

              <div className="h-12 w-3/4 rounded-xl bg-white/10" />

              <div className="mt-5 h-5 w-1/2 rounded-lg bg-white/10" />
            </div>
          </div>
        </section>

        {/* Loading Content */}

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
              <div className="animate-pulse rounded-[28px] bg-white p-7 shadow-sm">
                <div className="h-5 w-40 rounded bg-slate-200" />

                <div className="mt-7 space-y-4">
                  <div className="h-5 w-full rounded bg-slate-200" />
                  <div className="h-5 w-full rounded bg-slate-200" />
                  <div className="h-5 w-5/6 rounded bg-slate-200" />
                  <div className="h-5 w-4/6 rounded bg-slate-200" />
                </div>

                <div className="mt-10 space-y-4">
                  <div className="h-5 w-full rounded bg-slate-200" />
                  <div className="h-5 w-full rounded bg-slate-200" />
                  <div className="h-5 w-3/4 rounded bg-slate-200" />
                </div>
              </div>

              <div className="hidden h-72 animate-pulse rounded-[28px] bg-white lg:block" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================================
  // ERROR / NOT FOUND
  // ==========================================================

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SEO
          title="Notice Not Found"
          description="The requested notice could not be found."
          path={`/notices/${slug}`}
        />

        <section className="relative overflow-hidden bg-[#061426] py-24 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#061426] via-[#0b2440] to-[#07111d]" />

          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <FaBullhorn className="mx-auto mb-5 text-5xl text-cyan-400" />

            <h1 className="text-4xl font-black sm:text-5xl">
              Notice Not Found
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-white/60">
              {error ||
                'The requested notice does not exist or may have been removed.'}
            </p>

            <Link
              to="/notices"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <FaArrowLeft />
              Back to Notices
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================================
  // DATE
  // ==========================================================

  const publishDate =
    notice.publishDate ||
    notice.createdAt;

  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ======================================================
          SEO
      ====================================================== */}

      <SEO
        title={`${notice.title} | Notice`}
        description={
          notice.description ||
          `Latest notice from OPEN IT INSTITUTE — ${notice.title}`
        }
        path={`/notices/${slug}`}
      />

      <StructuredData
        data={[
          organizationSchema(),
          breadcrumbSchema([
            {
              name: 'Home',
              url: '/',
            },
            {
              name: 'Notices',
              url: '/notices',
            },
            {
              name: notice.title,
              url: `/notices/${slug}`,
            },
          ]),
        ]}
      />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#061426] text-white">
        {/* Background */}

        <div className="absolute inset-0 bg-gradient-to-br from-[#061426] via-[#0a2340] to-[#050d18]" />

        {/* Glow */}

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-[100px]"
        />

        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.08, 0.14, 0.08],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[110px]"
        />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />

        {/* Huge Background Text */}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="select-none whitespace-nowrap text-[100px] font-black uppercase tracking-[-0.08em] text-white/[0.025] sm:text-[160px] lg:text-[230px]">
            NOTICE
          </span>
        </div>

        {/* Hero Content */}

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-5xl">
            {/* Breadcrumb */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="mb-7 flex flex-wrap items-center gap-2 text-xs text-white/50"
            >
              <Link
                to="/"
                className="flex items-center gap-1.5 transition hover:text-white"
              >
                <FaHome />
                Home
              </Link>

              <span>/</span>

              <Link
                to="/notices"
                className="transition hover:text-white"
              >
                Notices
              </Link>

              <span>/</span>

              <span className="max-w-[180px] truncate text-white/70 sm:max-w-xs">
                {notice.title}
              </span>
            </motion.div>

            {/* Category */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="mb-6"
            >
              <span
                className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md`}
              >
                <CategoryIcon className="text-cyan-300" />
                {config.label}
              </span>
            </motion.div>

            {/* Title */}

            <motion.h1
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.05,
              }}
              className="max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {notice.title}
            </motion.h1>

            {/* Meta */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.12,
              }}
              className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60"
            >
              <span className="flex items-center gap-2">
                <FaCalendarAlt className="text-cyan-300" />
                {formatDate(publishDate)}
              </span>

              {formatTime(publishDate) && (
                <span className="flex items-center gap-2">
                  <FaClock className="text-cyan-300" />
                  {formatTime(publishDate)}
                </span>
              )}

              {notice.createdBy && (
                <span className="flex items-center gap-2">
                  <FaUser className="text-cyan-300" />
                  {notice.createdBy?.name ||
                    'Open IT Institute'}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          {/* ==================================================
              ARTICLE
          ================================================== */}

          <motion.article
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.07)]"
          >
            {/* Article top */}

            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />

            <div className="p-6 sm:p-8 md:p-10 lg:p-12">
              {/* Notice label */}

              <div className="mb-7 flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${config.bg} ${config.text}`}
                >
                  <CategoryIcon />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Official Announcement
                  </p>

                  <p
                    className={`mt-0.5 text-sm font-bold ${config.text}`}
                  >
                    {config.label} Notice
                  </p>
                </div>
              </div>

              {/* Description */}

              <div className="relative">
                <FaBullhorn className="pointer-events-none absolute -right-2 -top-5 text-7xl text-blue-600/[0.035] sm:text-8xl" />

                <div className="prose prose-slate max-w-none">
                  <p className="whitespace-pre-line text-[16px] leading-8 text-slate-600 sm:text-[17px] sm:leading-9">
                    {notice.description ||
                      'No detailed description is available for this notice.'}
                  </p>
                </div>
              </div>

              {/* Additional Info */}

              {notice.additionalInfo && (
                <div className="mt-9 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50/40">
                  <div className="flex items-start gap-4 p-5 sm:p-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                      <FaInfoCircle />
                    </div>

                    <div>
                      <h3 className="font-black text-slate-800">
                        Additional Information
                      </h3>

                      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                        {notice.additionalInfo}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}

              {Array.isArray(notice.tags) &&
                notice.tags.length > 0 && (
                  <div className="mt-9 border-t border-slate-100 pt-7">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                      <FaTag className="text-blue-600" />
                      Tags
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {notice.tags.map(
                        (tag, index) => (
                          <span
                            key={`${tag}-${index}`}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            #{tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Share */}

              <div className="mt-10 border-t border-slate-100 pt-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-black text-slate-800">
                      Share this notice
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Help others stay informed.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={shareWhatsApp}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition hover:-translate-y-0.5 hover:bg-emerald-500 hover:text-white"
                      title="Share on WhatsApp"
                    >
                      <FaWhatsapp />
                    </button>

                    <button
                      type="button"
                      onClick={shareFacebook}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white"
                      title="Share on Facebook"
                    >
                      <FaFacebookF />
                    </button>

                    <button
                      type="button"
                      onClick={copyLink}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:text-white"
                      title="Copy Link"
                    >
                      <FaLink />
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition hover:-translate-y-0.5 hover:bg-cyan-600 hover:text-white"
                      title="More Share Options"
                    >
                      <FaShareAlt />
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:text-white"
                      title="Print"
                    >
                      <FaPrint />
                    </button>
                  </div>
                </div>
              </div>

              {/* Back */}

              <div className="mt-8">
                <Link
                  to="/notices"
                  className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
                >
                  <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
                  Back to all notices
                </Link>
              </div>
            </div>
          </motion.article>

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="space-y-5 lg:sticky lg:top-24">
            {/* Notice Info */}

            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
              className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.06)]"
            >
              <div
                className={`bg-gradient-to-br ${config.gradient} p-6 text-white`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                  <CategoryIcon className="text-xl" />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-white/60">
                  Notice Information
                </p>

                <h3 className="mt-1 text-xl font-black">
                  {config.label}
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Date */}

                <div className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Published
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {formatDate(
                        publishDate
                      )}
                    </p>
                  </div>
                </div>

                {/* Time */}

                {formatTime(
                  publishDate
                ) && (
                  <div className="flex items-center gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                      <FaClock />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Time
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {formatTime(
                          publishDate
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Posted By */}

                <div className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <FaUser />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Posted By
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {notice.createdBy?.name ||
                        'Open IT Institute'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Quick Actions
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  <span className="flex items-center gap-3">
                    <FaShareAlt />
                    Share Notice
                  </span>

                  <FaArrowRight className="text-xs" />
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-800 hover:text-white"
                >
                  <span className="flex items-center gap-3">
                    <FaPrint />
                    Print Notice
                  </span>

                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>

            {/* Back To Notices */}

            <Link
              to="/notices"
              className="group flex items-center justify-between rounded-[20px] bg-[#061426] px-5 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-3">
                <FaBullhorn className="text-cyan-400" />
                All Notices
              </span>

              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </aside>
        </div>

        {/* ====================================================
            RELATED NOTICES
        ==================================================== */}

        {relatedNotices.length > 0 && (
          <section className="mt-14 border-t border-slate-200 pt-12">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">
                  More Updates
                </span>

                <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                  Related Notices
                </h2>
              </div>

              <Link
                to="/notices"
                className="group inline-flex items-center gap-2 text-sm font-bold text-blue-600"
              >
                View All
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {relatedNotices.map(
                (item, index) => {
                  const itemConfig =
                    categoryConfig[
                      item.category
                    ] ||
                    categoryConfig.general;

                  const ItemIcon =
                    itemConfig.icon;

                  const itemSlug =
                    item.slug ||
                    createSlug(
                      item.title
                    );

                  return (
                    <motion.div
                      key={
                        item._id ||
                        itemSlug ||
                        index
                      }
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
                      }}
                      transition={{
                        delay:
                          index * 0.08,
                      }}
                    >
                      <Link
                        to={`/notices/${itemSlug}`}
                        className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${itemConfig.bg} ${itemConfig.text}`}
                          >
                            <ItemIcon />
                          </div>

                          <FaArrowRight className="mt-2 text-xs text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                        </div>

                        <span
                          className={`mt-4 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${itemConfig.bg} ${itemConfig.text}`}
                        >
                          {itemConfig.label}
                        </span>

                        <h3 className="mt-3 line-clamp-2 font-black leading-6 text-slate-800 transition-colors group-hover:text-blue-600">
                          {item.title}
                        </h3>

                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                          <FaCalendarAlt />

                          {formatDate(
                            item.publishDate ||
                              item.createdAt
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                }
              )}
            </div>
          </section>
        )}
      </main>

      {/* ======================================================
          PRINT STYLES
      ====================================================== */}

      <style>
        {`
          @media print {
            header,
            nav,
            footer,
            aside,
            button,
            .no-print {
              display: none !important;
            }

            body {
              background: white !important;
            }

            main {
              max-width: 100% !important;
              padding: 0 !important;
            }

            article {
              border: none !important;
              box-shadow: none !important;
            }

            article > div:first-child {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default NoticesDetails;