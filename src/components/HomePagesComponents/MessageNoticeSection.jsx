import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaBullhorn,
  FaCalendarAlt,
  FaChevronRight,
  FaGraduationCap,
  FaQuoteLeft,
  FaUserTie,
  FaSpinner,
  FaCheckCircle,
} from 'react-icons/fa';

import { getNotices } from '../../services/contentService';

import nuruzzamanImage from '../../assets/images/nur.JPG';
import tonoyImage from '../../assets/images/DSC03830.JPG';

// ============================================================
// SLUG GENERATOR
// ============================================================

const createSlug = (text = '') => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (date) => {
  if (!date) {
    return 'Date unavailable';
  }

  try {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return date;
  }
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const MessageNoticeSection = () => {
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [noticeError, setNoticeError] = useState(false);

  // ============================================================
  // LOAD NOTICES FROM MONGODB
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadNotices = async () => {
      try {
        setLoadingNotices(true);
        setNoticeError(false);

        const response = await getNotices({
          limit: 5,
        });

        const noticeData =
          response?.data?.notices ||
          response?.data?.data ||
          response?.notices ||
          response?.data ||
          [];

        if (mounted) {
          if (Array.isArray(noticeData)) {
            setNotices(noticeData.slice(0, 5));
          } else {
            setNotices([]);
          }
        }
      } catch (error) {
        console.error('Failed to load notices:', error);

        if (mounted) {
          setNoticeError(true);
          setNotices([]);
        }
      } finally {
        if (mounted) {
          setLoadingNotices(false);
        }
      }
    };

    loadNotices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Left Glow */}
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />

        {/* Right Glow */}
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-100/30 blur-3xl" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.7) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />
      </div>

      {/* ======================================================
          CONTAINER
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-10">
          {/* ==================================================
              LEFT - MESSAGE FROM HEAD
          ================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50/50 p-6 shadow-xl shadow-slate-200/40 sm:p-8 lg:p-10"
          >
            {/* Decorative Quote */}

            <div className="absolute right-8 top-8 opacity-[0.045]">
              <FaQuoteLeft className="text-[120px] text-blue-600" />
            </div>

            {/* Top Badge */}

            <div className="relative z-10 mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600">
              <FaGraduationCap />
              MESSAGE FROM OUR LEADERSHIP
            </div>

            {/* Heading */}

            <h2 className="relative z-10 max-w-2xl text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl lg:text-[34px]">
              Message from the head of the institution
            </h2>

            {/* Accent */}

            <div className="mt-4 flex items-center gap-2">
              <span className="h-1 w-12 rounded-full bg-blue-600" />
              <span className="h-1 w-5 rounded-full bg-cyan-400" />
              <span className="h-1 w-2 rounded-full bg-purple-400" />
            </div>

            {/* Message */}

            <div className="relative z-10 mt-6 space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
              <p>
                পৃথিবীর প্রতি ব্যক্তি নিজেকে বেঁচে থাকে, আমি ও তাই।
                কেবল নিজের জন্য জীবন যাপন করতে মানুষ নয়, মানুষ হওয়ার
                সার্থকতা হলো অন্যদের উপকার করা।
              </p>

              <p>
                আমি তৈরি আছি হাতে আধুনিক দক্ষতা ও জ্ঞান নিয়ে। সেই
                লক্ষ্যেই প্রতিষ্ঠিত হয়েছে{' '}
                <strong>OPEN IT INSTITUTE</strong>। এটি একটি আধুনিক
                কম্পিউটার প্রশিক্ষণ কেন্দ্র।
              </p>

              <p>
                আমাদের লক্ষ্য হলো বর্তমান সময়ের চাহিদা অনুযায়ী
                শিক্ষার্থীদের হাতে-কলমে প্রশিক্ষণের মাধ্যমে দক্ষ করে
                তোলা এবং তাদের ক্যারিয়ার গঠনে সহযোগিতা করা।
              </p>

              <p>
                আমাদের প্রশিক্ষণ কার্যক্রমে রয়েছে Basic Computer,
                Digital Skills, Graphic Design, Web Design, Web
                Development, Digital Marketing, Freelancing সহ
                বিভিন্ন আধুনিক কোর্স।
              </p>
            </div>

            {/* ==================================================
                LEADERS
            ================================================== */}

            <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-2">
              {/* Nuruzzaman */}

              <LeaderCard
                image={nuruzzamanImage}
                name="Md. Nuruzzaman"
                role="Founder & CEO"
                description="Founder & CEO of Open IT Institute"
                primary
              />

              {/* Moniruzzaman */}

              <LeaderCard
                image={tonoyImage}
                name="Md. Moniruzzaman Tonoy"
                role="Full Stack Web Developer"
                description="Trainer & IT Specialist"
              />
            </div>

            {/* Bottom Line */}

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FaUserTie className="text-blue-500" />

                <span>Open IT Institute Leadership Team</span>
              </div>

              <Link
                to="/about"
                className="group inline-flex items-center gap-2 text-xs font-bold text-blue-600 transition-colors hover:text-blue-700"
              >
                About Our Institute

                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* ==================================================
              RIGHT - NOTICE BOARD
          ================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
          >
            {/* Notice Header */}

            <div className="relative overflow-hidden bg-gradient-to-br from-[#071b32] to-[#0f4c81] px-6 py-6 text-white">
              {/* Decorative Circle */}

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-white/10" />

              {/* Glow */}

              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Icon */}

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md">
                    <FaBullhorn className="text-xl text-cyan-300" />
                  </div>

                  {/* Heading */}

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                      Latest Updates
                    </p>

                    <h3 className="mt-1 text-xl font-extrabold">
                      Notice Board
                    </h3>
                  </div>
                </div>

                {/* Count */}

                <div className="flex h-8 min-w-8 items-center justify-center rounded-full bg-white/10 px-2 text-xs font-bold text-white/80">
                  {notices.length}
                </div>
              </div>
            </div>

            {/* ==================================================
                NOTICE CONTENT
            ================================================== */}

            <div className="min-h-[430px]">
              {/* ==================================================
                  LOADING
              ================================================== */}

              {loadingNotices && (
                <div className="flex min-h-[430px] flex-col items-center justify-center px-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <FaSpinner className="animate-spin text-xl" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-600">
                    Loading notices...
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Fetching latest updates
                  </p>
                </div>
              )}

              {/* ==================================================
                  ERROR
              ================================================== */}

              {!loadingNotices && noticeError && (
                <div className="flex min-h-[430px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                    <FaBullhorn className="text-xl" />
                  </div>

                  <h4 className="mt-4 text-sm font-bold text-slate-700">
                    Notice temporarily unavailable
                  </h4>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
                    নতুন নোটিশ দেখতে কিছুক্ষণ পর আবার চেষ্টা করুন।
                  </p>
                </div>
              )}

              {/* ==================================================
                  EMPTY
              ================================================== */}

              {!loadingNotices &&
                !noticeError &&
                notices.length === 0 && (
                  <div className="flex min-h-[430px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                      <FaBullhorn className="text-xl" />
                    </div>

                    <h4 className="mt-4 text-sm font-bold text-slate-700">
                      No notices available
                    </h4>

                    <p className="mt-2 text-xs text-slate-400">
                      নতুন নোটিশ প্রকাশ হলে এখানে দেখা যাবে।
                    </p>
                  </div>
                )}

              {/* ==================================================
                  NOTICE LIST
              ================================================== */}

              {!loadingNotices &&
                !noticeError &&
                notices.length > 0 && (
                  <div className="divide-y divide-slate-100">
                    {notices.map((notice, index) => (
                      <NoticeItem
                        key={
                          notice?._id ||
                          notice?.id ||
                          notice?.slug ||
                          index
                        }
                        notice={notice}
                        index={index}
                      />
                    ))}
                  </div>
                )}
            </div>

            {/* ==================================================
                NOTICE FOOTER
            ================================================== */}

            <div className="border-t border-slate-100 bg-slate-50/70 p-4">
              <Link
                to="/notices"
                className="group flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-blue-600 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:shadow-lg"
              >
                View All Notices

                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// LEADER CARD
// ============================================================

const LeaderCard = ({
  image,
  name,
  role,
  description,
  primary = false,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${
        primary
          ? 'border-blue-100 bg-gradient-to-r from-blue-50/80 to-white'
          : 'border-slate-100 bg-slate-50/60 hover:border-blue-100 hover:bg-blue-50/30'
      }`}
    >
      {/* Image */}

      <div className="relative shrink-0">
        <div
          className={`h-[72px] w-[72px] overflow-hidden rounded-full border-2 p-1 ${
            primary ? 'border-blue-600' : 'border-cyan-400'
          }`}
        >
          <img
            src={image}
            alt={name}
            className="h-full w-full rounded-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Verified */}

        <div className="absolute bottom-1 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
          <FaCheckCircle className="text-[9px] text-white" />
        </div>
      </div>

      {/* Info */}

      <div className="min-w-0">
        <h4 className="truncate text-sm font-extrabold text-slate-900">
          {name}
        </h4>

        <p
          className={`mt-1 text-[11px] font-bold ${
            primary ? 'text-blue-600' : 'text-cyan-600'
          }`}
        >
          {role}
        </p>

        <p className="mt-1 text-[10px] leading-4 text-slate-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// ============================================================
// NOTICE ITEM
// ============================================================

const NoticeItem = ({ notice, index }) => {
  // ============================================================
  // NOTICE TITLE
  // ============================================================

  const title =
    notice?.title ||
    notice?.noticeTitle ||
    notice?.name ||
    'Untitled Notice';

  // ============================================================
  // NOTICE DATE
  // ============================================================

  const noticeDate =
    notice?.date ||
    notice?.publishDate ||
    notice?.createdAt;

  const formattedDate = formatDate(noticeDate);

  // ============================================================
  // IMPORTANT:
  // Use MongoDB slug instead of MongoDB _id
  // ============================================================

  const noticeSlug =
    notice?.slug ||
    createSlug(title);

  // ============================================================
  // NOTICE URL
  // ============================================================

  const noticePath = `/notices/${noticeSlug}`;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 15,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
      }}
    >
      <Link
        to={noticePath}
        className="group block px-5 py-4 transition-colors hover:bg-blue-50/50 sm:px-6"
      >
        <div className="flex items-center gap-3">
          {/* Number */}

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xs font-extrabold text-slate-400 transition-all group-hover:bg-blue-600 group-hover:text-white">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Title */}

          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-2 text-xs font-semibold leading-5 text-slate-700 transition-colors group-hover:text-blue-600 sm:text-sm">
              {title}
            </h4>

            {/* Date */}

            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
              <FaCalendarAlt className="text-blue-400" />

              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Arrow */}

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 transition-all group-hover:bg-blue-100 group-hover:text-blue-600">
            <FaChevronRight className="text-[10px]" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MessageNoticeSection;