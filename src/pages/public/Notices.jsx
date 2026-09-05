import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowRight,
  FaBullhorn,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaExclamationCircle,
  FaInfoCircle,
  FaSearch,
  FaSpinner,
  FaTag,
  FaUser,
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
    gradient: 'from-blue-600 to-cyan-500',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
  },

  admission: {
    label: 'Admission',
    icon: FaBullhorn,
    gradient: 'from-emerald-600 to-teal-500',
    light: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
  },

  exam: {
    label: 'Exam',
    icon: FaExclamationCircle,
    gradient: 'from-orange-500 to-amber-500',
    light: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-100',
  },

  class: {
    label: 'Class',
    icon: FaInfoCircle,
    gradient: 'from-purple-600 to-fuchsia-500',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
  },

  result: {
    label: 'Result',
    icon: FaBullhorn,
    gradient: 'from-pink-600 to-rose-500',
    light: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-100',
  },

  holiday: {
    label: 'Holiday',
    icon: FaCalendarAlt,
    gradient: 'from-red-600 to-orange-500',
    light: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-100',
  },
};

// ============================================================
// FALLBACK CATEGORY
// ============================================================

const defaultCategory = categoryConfig.general;

// ============================================================
// SLUG GENERATOR
// ============================================================

const createSlug = (text = '') => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0980-\u09FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ============================================================
// DATE FORMAT
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
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ============================================================
// TIME FORMAT
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
// DATE VALUE
// ============================================================

const getNoticeDate = (notice) => {
  return notice?.publishDate || notice?.createdAt || null;
};

// ============================================================
// SKELETON CARD
// ============================================================

const NoticeSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="h-1.5 animate-pulse bg-slate-200" />

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="h-9 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
        </div>

        <div className="mt-6 h-6 w-11/12 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />

        <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-slate-100" />

        <div className="mt-7 h-px bg-slate-100" />

        <div className="mt-5 flex justify-between">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
};

// ============================================================
// NOTICE CARD
// ============================================================

const NoticeCard = ({ notice, index }) => {
  const category =
    categoryConfig[notice?.category] ||
    defaultCategory;

  const CategoryIcon = category.icon;

  const noticeSlug =
    notice?.slug ||
    createSlug(notice?.title);

  const publishDate =
    getNoticeDate(notice);

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.55,
        delay: index * 0.06,
      }}
      whileHover={{
        y: -7,
      }}
      className="group h-full"
    >
      <Link
        to={`/notices/${noticeSlug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_12px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_20px_55px_rgba(15,23,42,0.12)]"
      >
        {/* Top Gradient */}

        <div
          className={`h-1.5 bg-gradient-to-r ${category.gradient}`}
        />

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* Header */}

          <div className="flex items-start justify-between gap-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full border ${category.border} ${category.light} px-3 py-1.5 text-[11px] font-black uppercase tracking-wider ${category.text}`}
            >
              <CategoryIcon className="text-xs" />
              {category.label}
            </span>

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${category.light} ${category.text} transition-all duration-300 group-hover:scale-110`}
            >
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Title */}

          <h2 className="mt-5 line-clamp-2 text-[19px] font-black leading-7 text-slate-800 transition-colors duration-300 group-hover:text-blue-600 sm:text-xl">
            {notice?.title ||
              'Untitled Notice'}
          </h2>

          {/* Description */}

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
            {notice?.description ||
              'No description is available for this notice.'}
          </p>

          {/* Additional Info */}

          {notice?.additionalInfo && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
              <FaInfoCircle className="mt-0.5 shrink-0 text-xs text-blue-500" />

              <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                {notice.additionalInfo}
              </p>
            </div>
          )}

          {/* Spacer */}

          <div className="flex-1" />

          {/* Divider */}

          <div className="my-5 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />

          {/* Meta */}

          <div className="flex flex-col gap-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-blue-500">
                <FaCalendarAlt />
              </span>

              {formatDate(publishDate)}
            </span>

            {formatTime(publishDate) && (
              <span className="flex items-center gap-2">
                <FaClock />

                {formatTime(publishDate)}
              </span>
            )}
          </div>

          {/* Posted By */}

          <div className="mt-4 flex items-center justify-between">
            <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                <FaUser className="text-[10px]" />
              </span>

              <span className="truncate">
                {notice?.createdBy?.name ||
                  'Open IT Institute'}
              </span>
            </span>

            <span className="flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              Read More
              <FaArrowRight className="text-[10px]" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

// ============================================================
// NOTICES PAGE
// ============================================================

const Notices = () => {
  const [notices, setNotices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [searchTerm, setSearchTerm] =
    useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('all');

  const [sortBy, setSortBy] =
    useState('latest');

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 9;

  // ==========================================================
  // LOAD NOTICES
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadNotices = async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          await getNotices({
            limit: 100,
          });

        const data =
          response?.data?.notices ||
          response?.data?.data ||
          response?.notices ||
          response?.data ||
          [];

        if (!mounted) {
          return;
        }

        if (!Array.isArray(data)) {
          throw new Error(
            'Invalid notices response'
          );
        }

        setNotices(data);
      } catch (err) {
        console.error(
          'Failed to load notices:',
          err
        );

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              'Failed to load notices. Please try again later.'
          );

          setNotices([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNotices();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // CATEGORIES
  // ==========================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        notices
          .map(
            (notice) =>
              notice?.category
          )
          .filter(Boolean)
      ),
    ];

    return uniqueCategories;
  }, [notices]);

  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  const filteredNotices = useMemo(() => {
    let result = [...notices];

    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    const query =
      searchTerm
        .trim()
        .toLowerCase();

    if (query) {
      result = result.filter(
        (notice) => {
          const title =
            notice?.title
              ?.toString()
              .toLowerCase() || '';

          const description =
            notice?.description
              ?.toString()
              .toLowerCase() || '';

          const category =
            notice?.category
              ?.toString()
              .toLowerCase() || '';

          const tags =
            Array.isArray(
              notice?.tags
            )
              ? notice.tags
                  .join(' ')
                  .toLowerCase()
              : '';

          return (
            title.includes(query) ||
            description.includes(
              query
            ) ||
            category.includes(query) ||
            tags.includes(query)
          );
        }
      );
    }

    // --------------------------------------------------------
    // CATEGORY
    // --------------------------------------------------------

    if (
      selectedCategory !==
      'all'
    ) {
      result = result.filter(
        (notice) =>
          notice?.category ===
          selectedCategory
      );
    }

    // --------------------------------------------------------
    // SORT
    // --------------------------------------------------------

    result.sort((a, b) => {
      const dateA =
        new Date(
          getNoticeDate(a) || 0
        ).getTime();

      const dateB =
        new Date(
          getNoticeDate(b) || 0
        ).getTime();

      if (sortBy === 'oldest') {
        return dateA - dateB;
      }

      if (sortBy === 'title') {
        return (
          (a?.title || '')
            .toLowerCase()
            .localeCompare(
              (b?.title || '')
                .toLowerCase()
            )
        );
      }

      return dateB - dateA;
    });

    return result;
  }, [
    notices,
    searchTerm,
    selectedCategory,
    sortBy,
  ]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.ceil(
    filteredNotices.length /
      itemsPerPage
  );

  const paginatedNotices =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        itemsPerPage;

      return filteredNotices.slice(
        start,
        start + itemsPerPage
      );
    }, [
      filteredNotices,
      currentPage,
    ]);

  // ==========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategory,
    sortBy,
  ]);

  // ==========================================================
  // PAGE NUMBERS
  // ==========================================================

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) =>
          index + 1
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (
      currentPage >=
      totalPages - 2
    ) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }, [
    currentPage,
    totalPages,
  ]);

  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('latest');
    setCurrentPage(1);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ======================================================
          SEO
      ====================================================== */}

      <SEO
        title="Notices & Announcements"
        description="View the latest notices, announcements, class updates, examination schedules and important information from OPEN IT INSTITUTE."
        path="/notices"
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
            opacity: [
              0.08,
              0.16,
              0.08,
            ],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-[100px]"
        />

        <motion.div
          animate={{
            scale: [
              1.1,
              1,
              1.1,
            ],
            opacity: [
              0.08,
              0.14,
              0.08,
            ],
          }}
          transition={{
            duration: 11,
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
            backgroundSize:
              '55px 55px',
          }}
        />

        {/* Background Text */}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="select-none whitespace-nowrap text-[90px] font-black uppercase tracking-[-0.08em] text-white/[0.025] sm:text-[150px] lg:text-[230px]">
            NOTICES
          </span>
        </div>

        {/* Hero Content */}

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <motion.div
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
            className="mx-auto max-w-4xl text-center"
          >
            {/* Badge */}

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
              <FaBullhorn className="text-cyan-300" />
              OPEN IT INSTITUTE
            </span>

            {/* Title */}

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Notices &{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Announcements
              </span>
            </h1>

            {/* Description */}

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              প্রতিষ্ঠানের সর্বশেষ নোটিশ,
              ঘোষণা, ক্লাস আপডেট,
              পরীক্ষার তথ্য এবং
              গুরুত্বপূর্ণ সকল তথ্য
              এখানে দেখুন।
            </p>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <main className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* ====================================================
            FILTER BAR
        ==================================================== */}

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
            duration: 0.6,
            delay: 0.1,
          }}
          className="mb-10 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_15px_50px_rgba(15,23,42,0.06)] sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}

            <div className="relative flex-1">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search notices..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Category */}

            <div className="lg:w-48">
              <select
                value={
                  selectedCategory
                }
                onChange={(event) =>
                  setSelectedCategory(
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-600 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {categoryConfig[
                        category
                      ]?.label ||
                        category}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Sort */}

            <div className="lg:w-44">
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-600 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="latest">
                  Latest First
                </option>

                <option value="oldest">
                  Oldest First
                </option>

                <option value="title">
                  Title A-Z
                </option>
              </select>
            </div>
          </div>

          {/* Result Count */}

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <FaBullhorn className="text-blue-500" />

              {loading
                ? 'Loading notices...'
                : `${filteredNotices.length} notice${
                    filteredNotices.length !==
                    1
                      ? 's'
                      : ''
                  } found`}
            </div>

            {(searchTerm ||
              selectedCategory !==
                'all' ||
              sortBy !==
                'latest') && (
              <button
                type="button"
                onClick={
                  resetFilters
                }
                className="text-xs font-bold text-blue-600 transition hover:text-blue-700"
              >
                Reset Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <NoticeSkeleton
                key={index}
              />
            ))}
          </div>
        )}

        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading && error && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="rounded-[28px] border border-red-100 bg-white p-10 text-center shadow-sm"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FaExclamationCircle className="text-2xl" />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-800">
              Unable to Load Notices
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#061426] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Try Again
              <FaArrowRight />
            </button>
          </motion.div>
        )}

        {/* ====================================================
            EMPTY
        ==================================================== */}

        {!loading &&
          !error &&
          filteredNotices.length ===
            0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-[28px] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-500">
                <FaBullhorn className="text-3xl" />
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-800">
                No Notices Found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                আপনার সার্চ বা ফিল্টারের
                সাথে মিলছে এমন কোনো
                নোটিশ পাওয়া যায়নি।
              </p>

              <button
                type="button"
                onClick={
                  resetFilters
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Clear Filters
                <FaArrowRight />
              </button>
            </motion.div>
          )}

        {/* ====================================================
            NOTICE GRID
        ==================================================== */}

        {!loading &&
          !error &&
          paginatedNotices.length >
            0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPage}-${searchTerm}-${selectedCategory}-${sortBy}`}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {paginatedNotices.map(
                  (notice, index) => (
                    <NoticeCard
                      key={
                        notice?._id ||
                        notice?.id ||
                        notice?.slug ||
                        index
                      }
                      notice={notice}
                      index={index}
                    />
                  )
                )}
              </motion.div>
            </AnimatePresence>
          )}

        {/* ====================================================
            PAGINATION
        ==================================================== */}

        {!loading &&
          !error &&
          totalPages > 1 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
            >
              {/* Previous */}

              <button
                type="button"
                disabled={
                  currentPage ===
                  1
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(
                        1,
                        page - 1
                      )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              {/* Page Numbers */}

              {pageNumbers.map(
                (page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                    className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-bold transition ${
                      currentPage ===
                      page
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'border border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}

              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        totalPages,
                        page + 1
                      )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </motion.div>
          )}

        {/* ====================================================
            BOTTOM CTA
        ==================================================== */}

        {!loading &&
          !error &&
          notices.length > 0 && (
            <motion.section
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              className="relative mt-16 overflow-hidden rounded-[28px] bg-[#061426] px-6 py-10 text-center text-white sm:px-10"
            >
              {/* Glow */}

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

              {/* Grid */}

              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)',
                  backgroundSize:
                    '45px 45px',
                }}
              />

              <div className="relative z-10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 backdrop-blur-md">
                  <FaBullhorn />
                </div>

                <h2 className="mt-5 text-2xl font-black sm:text-3xl">
                  Stay Updated With Us
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/55">
                  OPEN IT INSTITUTE-এর
                  গুরুত্বপূর্ণ নোটিশ ও
                  আপডেটগুলো নিয়মিত
                  অনুসরণ করুন।
                </p>

                <Link
                  to="/"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-slate-900 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  Back to Home
                  <FaArrowRight />
                </Link>
              </div>
            </motion.section>
          )}
      </main>
    </div>
  );
};

export default Notices;