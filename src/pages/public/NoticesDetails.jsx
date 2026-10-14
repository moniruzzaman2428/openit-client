// ============================================================
// FILE: NoticesDetails.jsx
// Requires: src/components/notices/NoticeLetter.jsx
//           src/components/notices/noticeExport.js
// ============================================================
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaArrowRight,
  FaBullhorn,
  FaCalendarAlt,
  FaClock,
  FaDownload,
  FaExclamationCircle,
  FaEye,
  FaFacebookF,
  FaHashtag,
  FaHome,
  FaInfoCircle,
  FaLink,
  FaPrint,
  FaRedo,
  FaShareAlt,
  FaSpinner,
  FaUser,
  FaWhatsapp,
} from 'react-icons/fa';

import { getNotices } from '../../services/contentService';
import SEO from '../../components/seo/SEO';
import StructuredData, {
  breadcrumbSchema,
  organizationSchema,
} from '../../components/seo/StructuredData';
import NoticeLetter, {
  NoticeLetterModal,
  RichText,
} from '../../components/notices/NoticeLetter';
import {
  buildFileName,
  downloadNoticePDF,
  ensureBengaliFonts,
  formatLetterDate,
  printNoticeNode,
} from '../../components/notices/noticeExport';

// ============================================================
// CATEGORY CONFIG
// ============================================================

const categoryConfig = {
  general: { label: 'General', icon: FaInfoCircle, chip: 'bg-blue-50 text-blue-700 ring-blue-200' },
  admission: { label: 'Admission', icon: FaBullhorn, chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  exam: { label: 'Exam', icon: FaExclamationCircle, chip: 'bg-orange-50 text-orange-700 ring-orange-200' },
  class: { label: 'Class', icon: FaInfoCircle, chip: 'bg-violet-50 text-violet-700 ring-violet-200' },
  result: { label: 'Result', icon: FaBullhorn, chip: 'bg-pink-50 text-pink-700 ring-pink-200' },
  holiday: { label: 'Holiday', icon: FaCalendarAlt, chip: 'bg-red-50 text-red-700 ring-red-200' },
};

// ============================================================
// HELPERS
// ============================================================

const createSlug = (text = '') =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatDate = (date) => {
  if (!date) return 'Date unavailable';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable';
  return parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatShortDate = (date) => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (date) => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const dateValue = (item) => new Date(item?.publishDate || item?.createdAt || 0).getTime() || 0;

// ============================================================
// PAGE
// ============================================================

const NoticesDetails = () => {
  const { slug } = useParams();

  const [notice, setNotice] = useState(null);
  const [relatedNotices, setRelatedNotices] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | notfound | error
  const [reloadKey, setReloadKey] = useState(0);

  const [showLetter, setShowLetter] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [toast, setToast] = useState('');

  const exportRef = useRef(null); // hidden A4 letter used for PDF + print
  const toastTimer = useRef(null);

  // Load Bengali fonts once (needed for a correct PDF)
  useEffect(() => {
    ensureBengaliFonts();
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  }, []);

  // ==========================================================
  // LOAD NOTICE
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadNotice = async () => {
      try {
        setStatus('loading');

        const response = await getNotices({ limit: 50 });

        const notices =
          response?.data?.notices ||
          response?.notices ||
          response?.data?.data ||
          response?.data ||
          [];

        if (!mounted) return;
        if (!Array.isArray(notices)) throw new Error('Invalid notices response');

        const found = notices.find((item) => (item?.slug || createSlug(item?.title)) === slug);

        if (!found) {
          setNotice(null);
          setStatus('notfound');
          return;
        }

        const related = notices
          .filter((item) => item?._id !== found._id)
          .filter((item) => !found.category || item.category === found.category)
          .sort((a, b) => dateValue(b) - dateValue(a))
          .slice(0, 3);

        setNotice(found);
        setRelatedNotices(related);
        setStatus('ready');
      } catch (err) {
        console.error('Failed to load notice:', err);
        if (mounted) setStatus('error');
      }
    };

    loadNotice();
    window.scrollTo({ top: 0 });

    return () => {
      mounted = false;
    };
  }, [slug, reloadKey]);

  // ==========================================================
  // DERIVED
  // ==========================================================

  const config = categoryConfig[notice?.category] || categoryConfig.general;
  const CategoryIcon = config.icon;
  const publishDate = notice?.publishDate || notice?.createdAt;
  const memoNo =
    notice?.memoNo || notice?.memoNumber || notice?.referenceNumber || notice?.refNo || '';

  const letter = useMemo(
    () =>
      notice
        ? {
            title: notice.title,
            description: notice.description,
            additionalInfo: notice.additionalInfo,
            memoNo,
            dateText: formatLetterDate(publishDate),
          }
        : null,
    [notice, memoNo, publishDate]
  );

  const fileName = buildFileName(slug, publishDate);
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  // ==========================================================
  // ACTIONS
  // ==========================================================

  const handleDownload = async () => {
    if (!exportRef.current || downloading) return;
    try {
      setDownloading(true);
      await downloadNoticePDF(exportRef.current, fileName);
      showToast('PDF downloaded');
    } catch (err) {
      console.error('PDF error:', err);
      showToast('Could not create the PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    if (!exportRef.current || printing) return;
    try {
      setPrinting(true);
      await printNoticeNode(exportRef.current, fileName);
    } catch (err) {
      console.error('Print error:', err);
      showToast('Could not open the print dialog.');
    } finally {
      setPrinting(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied');
    } catch {
      showToast('Could not copy the link');
    }
  };

  const nativeShare = async () => {
    if (!notice) return;
    try {
      await navigator.share({
        title: notice.title,
        text: notice.description?.slice(0, 120) || 'Open IT Institute notice',
        url: window.location.href,
      });
    } catch {
      /* user cancelled */
    }
  };

  const shareWhatsApp = () => {
    if (!notice) return;
    const text = encodeURIComponent(`${notice.title}\n\n${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50" aria-busy="true">
        <SEO title="Notice" description="Open IT Institute notice and announcement" path={`/notices/${slug}`} />

        <section className="bg-[#071b32] py-20">
          <div className="mx-auto max-w-6xl animate-pulse px-4 sm:px-6 lg:px-8">
            <div className="h-4 w-48 rounded bg-white/10" />
            <div className="mt-6 h-6 w-28 rounded-full bg-white/10" />
            <div className="mt-5 h-10 w-3/4 rounded-xl bg-white/10" />
            <div className="mt-5 h-4 w-1/2 rounded bg-white/10" />
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="animate-pulse space-y-4 rounded-2xl border border-slate-200 bg-white p-8">
              {[100, 100, 90, 75, 100, 60].map((w, i) => (
                <div key={i} className="h-4 rounded bg-slate-100" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="hidden h-64 animate-pulse rounded-2xl bg-white lg:block" />
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // NOT FOUND / ERROR
  // ==========================================================

  if (status !== 'ready' || !notice) {
    const isError = status === 'error';

    return (
      <div className="min-h-screen bg-slate-50">
        <SEO
          title={isError ? 'Notice' : 'Notice Not Found'}
          description="The requested notice could not be loaded."
          path={`/notices/${slug}`}
        />

        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
              <FaBullhorn />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              {isError ? 'Could not load notice' : 'Notice not found'}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {isError
                ? 'Something went wrong while loading this notice. Please check your connection and try again.'
                : 'The notice you are looking for does not exist or may have been removed.'}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {isError && (
                <button
                  type="button"
                  onClick={() => setReloadKey((k) => k + 1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3b64]"
                >
                  <FaRedo className="text-xs" /> Try again
                </button>
              )}
              <Link
                to="/notices"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <FaArrowLeft className="text-xs" /> Back to notices
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN
  // ==========================================================

  const time = formatTime(publishDate);
  const postedBy = notice.createdBy?.name || 'Open IT Institute';

  const heroBtn =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#071b32] disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title={`${notice.title} | Notice`}
        description={
          notice.description?.slice(0, 160) ||
          `Latest notice from Open IT Institute - ${notice.title}`
        }
        path={`/notices/${slug}`}
      />

      <StructuredData
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Notices', url: '/notices' },
            { name: notice.title, url: `/notices/${slug}` },
          ]),
        ]}
      />

      {/* Hidden A4 letter: the source for PDF and print */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', left: '-10000px', top: 0, pointerEvents: 'none' }}
      >
        <NoticeLetter ref={exportRef} {...letter} />
      </div>

      {/* ======================================================
          HEADER
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#071b32] text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(60%_90%_at_90%_0%,rgba(34,211,238,0.13),transparent_65%),radial-gradient(50%_80%_at_0%_100%,rgba(15,76,129,0.55),transparent_70%)]" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, #000 0%, transparent 75%)',
              maskImage: 'radial-gradient(ellipse at 50% 0%, #000 0%, transparent 75%)',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/60">
            <Link to="/" className="inline-flex items-center gap-1.5 transition hover:text-white">
              <FaHome className="text-xs" /> Home
            </Link>
            <span className="text-white/30">/</span>
            <Link to="/notices" className="transition hover:text-white">
              Notices
            </Link>
            <span className="text-white/30">/</span>
            <span className="max-w-[200px] truncate text-white/90 sm:max-w-sm" aria-current="page">
              {notice.title}
            </span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white ring-1 ring-white/15">
            <CategoryIcon className="text-xs text-cyan-300" />
            {config.label}
          </span>

          <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {notice.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/65">
            <span className="inline-flex items-center gap-2">
              <FaCalendarAlt className="text-cyan-300" />
              {formatDate(publishDate)}
            </span>
            {time && (
              <span className="inline-flex items-center gap-2">
                <FaClock className="text-cyan-300" />
                {time}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <FaUser className="text-cyan-300" />
              {postedBy}
            </span>
          </div>

          {/* Official copy actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className={`${heroBtn} bg-white text-[#071b32] shadow-lg shadow-black/10 hover:bg-cyan-50`}
            >
              {downloading ? <FaSpinner className="animate-spin" /> : <FaDownload className="text-xs" />}
              {downloading ? 'Generating PDF…' : 'Download PDF'}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={printing}
              className={`${heroBtn} bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15`}
            >
              {printing ? <FaSpinner className="animate-spin" /> : <FaPrint className="text-xs" />}
              Print
            </button>

            <button
              type="button"
              onClick={() => setShowLetter(true)}
              className={`${heroBtn} text-white/85 hover:bg-white/10 hover:text-white`}
            >
              <FaEye className="text-xs" />
              View official copy
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
          {/* ---------------- ARTICLE ---------------- */}
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#0F4C81] to-cyan-400" />

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${config.chip}`}
                >
                  <CategoryIcon className="text-[11px]" />
                  {config.label}
                </span>
                <span className="text-sm text-slate-500">Official announcement</span>
              </div>

              <div className="whitespace-pre-line text-[17px] leading-8 text-slate-700">
                <RichText text={notice.description || 'No detailed description is available for this notice.'} />
              </div>

              {notice.additionalInfo && (
                <div className="mt-8 flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50/60 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81] text-white">
                    <FaInfoCircle />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900">Additional information</h2>
                    <p className="mt-1.5 whitespace-pre-line text-[15px] leading-7 text-slate-600">
                      <RichText text={notice.additionalInfo} />
                    </p>
                  </div>
                </div>
              )}

              {Array.isArray(notice.tags) && notice.tags.length > 0 && (
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FaHashtag className="text-[#0F4C81]" />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {notice.tags.map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 border-t border-slate-100 pt-6">
                <Link
                  to="/notices"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0F4C81]"
                >
                  <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-0.5" />
                  Back to all notices
                </Link>
              </div>
            </div>
          </article>

          {/* ---------------- SIDEBAR ---------------- */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Notice details</h2>

              <dl className="mt-3 divide-y divide-slate-100 text-sm">
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-slate-500">Category</dt>
                  <dd>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${config.chip}`}>
                      {config.label}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-slate-500">Published</dt>
                  <dd className="text-right font-medium text-slate-800">{formatShortDate(publishDate) || '—'}</dd>
                </div>
                {time && (
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-slate-500">Time</dt>
                    <dd className="font-medium text-slate-800">{time}</dd>
                  </div>
                )}
                {memoNo && (
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-slate-500">Memo no.</dt>
                    <dd className="truncate font-mono text-[13px] font-medium text-slate-800">{memoNo}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-slate-500">Posted by</dt>
                  <dd className="truncate text-right font-medium text-slate-800">{postedBy}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Share this notice</h2>
              <p className="mt-1 text-xs text-slate-500">Help others stay informed.</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500 hover:text-white"
                >
                  <FaWhatsapp /> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={shareFacebook}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                >
                  <FaFacebookF /> Facebook
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-800 hover:text-white"
                >
                  <FaLink /> Copy link
                </button>
                {canNativeShare && (
                  <button
                    type="button"
                    onClick={nativeShare}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-50 px-3 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-600 hover:text-white"
                  >
                    <FaShareAlt /> More
                  </button>
                )}
              </div>
            </div>

            <Link
              to="/notices"
              className="group flex items-center justify-between rounded-2xl bg-[#071b32] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-[#0b2a4a]"
            >
              <span className="flex items-center gap-3">
                <FaBullhorn className="text-cyan-300" />
                All notices
              </span>
              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
            </Link>
          </aside>
        </div>

        {/* ====================================================
            RELATED
        ==================================================== */}
        {relatedNotices.length > 0 && (
          <section className="mt-14 border-t border-slate-200 pt-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#0F4C81]">More updates</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Related notices</h2>
              </div>
              <Link
                to="/notices"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0F4C81]"
              >
                View all
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {relatedNotices.map((item, index) => {
                const itemConfig = categoryConfig[item.category] || categoryConfig.general;
                const ItemIcon = itemConfig.icon;
                const itemSlug = item.slug || createSlug(item.title);

                return (
                  <Link
                    key={item._id || itemSlug || index}
                    to={`/notices/${itemSlug}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                  >
                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${itemConfig.chip}`}
                    >
                      <ItemIcon className="text-[10px]" />
                      {itemConfig.label}
                    </span>

                    <h3 className="mt-3 line-clamp-2 font-semibold leading-6 text-slate-900 transition-colors group-hover:text-[#0F4C81]">
                      {item.title}
                    </h3>

                    <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <FaCalendarAlt />
                        {formatShortDate(item.publishDate || item.createdAt)}
                      </span>
                      <FaArrowRight className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0F4C81]" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Official copy preview */}
      {showLetter && (
        <NoticeLetterModal
          letter={letter}
          onClose={() => setShowLetter(false)}
          onDownload={handleDownload}
          onPrint={handlePrint}
          downloading={downloading}
          printing={printing}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-[10000] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl"
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default NoticesDetails;
