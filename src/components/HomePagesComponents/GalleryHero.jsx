import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaImages,
  FaTimes,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { getGallery } from '../../services/contentService';

// ============================================================
// CONFIG
// ============================================================

const fallbackImage =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400&h=900&fit=crop&q=85';

const HERO_LIMIT = 7; // photos shown in the hero slider
const FETCH_LIMIT = 20; // photos loaded for the lightbox
const AUTOPLAY_MS = 5500;

const HERO_STYLES = `
@keyframes gh-progress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
.gh-thumbs { scrollbar-width: none; }
.gh-thumbs::-webkit-scrollbar { display: none; }
`;

const pad = (n) => String(n).padStart(2, '0');

const handleImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackImage;
};

// ============================================================
// LIGHTBOX
// ============================================================

const lightboxVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -48 : 48 }),
};

const Lightbox = ({ images, index, onClose, onChange }) => {
  const total = images.length;
  const closeRef = useRef(null);
  const directionRef = useRef(1);
  const touchStartX = useRef(null);
  const reduceMotion = useReducedMotion();

  const go = useCallback(
    (dir) => {
      directionRef.current = dir;
      onChange((index + dir + total) % total);
    },
    [index, total, onChange]
  );

  // Keyboard, scroll lock, focus
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') go(1);
      else if (event.key === 'ArrowLeft') go(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [go, onClose]);

  // Preload neighbours for instant navigation
  useEffect(() => {
    [index + 1, index - 1].forEach((i) => {
      const src = images[(i + total) % total];
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [index, images, total]);

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const dx = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const navButton =
    'flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="text-sm font-medium tabular-nums text-white/70">
          {pad(index + 1)} <span className="text-white/30">/</span> {pad(total)}
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={navButton}
          aria-label="Close viewer"
        >
          <FaTimes />
        </button>
      </div>

      {/* Stage */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className={`${navButton} absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 sm:flex sm:left-6`}
            aria-label="Previous photo"
          >
            <FaChevronLeft />
          </button>
        )}

        <AnimatePresence mode="wait" custom={directionRef.current} initial={false}>
          <motion.img
            key={index}
            custom={directionRef.current}
            variants={lightboxVariants}
            initial={reduceMotion ? false : 'enter'}
            animate="center"
            exit={reduceMotion ? undefined : 'exit'}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            src={images[index] || fallbackImage}
            alt={`Open IT Institute gallery photo ${index + 1} of ${total}`}
            draggable={false}
            onError={handleImageError}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full select-none rounded-xl object-contain shadow-2xl"
          />
        </AnimatePresence>

        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className={`${navButton} absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 sm:flex sm:right-6`}
            aria-label="Next photo"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* Mobile controls */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-4 pb-6 sm:hidden">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className={navButton}
            aria-label="Previous photo"
          >
            <FaChevronLeft />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className={navButton}
            aria-label="Next photo"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ============================================================
// GALLERY HERO
// ============================================================

const GalleryHero = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  const thumbsRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // ============================================================
  // LOAD GALLERY
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadGallery = async () => {
      try {
        setLoading(true);

        const response = await getGallery({ limit: FETCH_LIMIT });

        const data =
          response?.data?.gallery ||
          response?.data?.images ||
          response?.data?.data ||
          response?.gallery ||
          response?.data ||
          [];

        if (mounted && Array.isArray(data)) {
          setGalleryImages(data);
        }
      } catch (error) {
        console.error('Gallery loading failed:', error);
        if (mounted) setGalleryImages([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadGallery();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // NORMALIZE IMAGE DATA
  // ============================================================

  const images = useMemo(
    () =>
      galleryImages
        .map((item) => {
          if (typeof item === 'string') return item;
          return (
            item?.image ||
            item?.imageUrl ||
            item?.url ||
            item?.photo ||
            item?.src ||
            item?.fileUrl ||
            null
          );
        })
        .filter(Boolean),
    [galleryImages]
  );

  const collection = useMemo(() => images.slice(0, HERO_LIMIT), [images]);
  const total = collection.length;
  const hasMany = total > 1;
  const lightboxOpen = lightboxIndex !== null;

  // Keep the active index valid if the list changes
  useEffect(() => {
    if (activeIndex >= total && total > 0) setActiveIndex(0);
  }, [total, activeIndex]);

  // ============================================================
  // AUTOPLAY (driven by the progress bar animation)
  // ============================================================

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const autoplay = hasMany && !reduceMotion;
  const paused = hovered || tabHidden || lightboxOpen;

  const goTo = useCallback(
    (index) => {
      if (!total) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  // Keep the active thumbnail visible inside the strip (horizontal only)
  useEffect(() => {
    const strip = thumbsRef.current;
    const el = strip?.children?.[activeIndex];
    if (!strip || !el) return;

    const target = el.offsetLeft - (strip.clientWidth - el.clientWidth) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [activeIndex]);

  // ============================================================
  // MOTION HELPERS
  // ============================================================

  const fadeUp = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: 'easeOut' },
        };

  const imageCountLabel = `${images.length}${images.length >= FETCH_LIMIT ? '+' : ''}`;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <style>{HERO_STYLES}</style>

      <section className="relative overflow-hidden bg-white">
        {/* Background: one soft brand wash + faint grid, nothing animated */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_88%_8%,rgba(15,76,129,0.09),transparent_70%),radial-gradient(45%_45%_at_0%_100%,rgba(34,211,238,0.07),transparent_70%)]" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(15,23,42,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.045) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              WebkitMaskImage:
                'radial-gradient(ellipse at 70% 30%, #000 0%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse at 70% 30%, #000 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* =================================================
                LEFT – CONTENT
            ================================================= */}
            <div className="relative z-10">
              <motion.div
                {...fadeUp(0)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"
              >
                <FaImages className="text-[#0F4C81]" />
                Open IT Institute
                <span className="h-3 w-px bg-slate-200" />
                <span className="text-slate-400">Photo gallery</span>
              </motion.div>

              <motion.h2
                {...fadeUp(0.08)}
                className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[56px]"
              >
                Learning.
                <br />
                <span className="text-[#0F4C81]">Growing.</span>
                <br />
                Creating Future.
              </motion.h2>

              <motion.p
                {...fadeUp(0.16)}
                className="mt-5 max-w-md text-[15px] leading-7 text-slate-600"
              >
                আমাদের প্রশিক্ষণ কার্যক্রম, শিক্ষার্থীদের সাফল্য এবং Open IT
                Institute-এর স্মরণীয় মুহূর্তগুলোর একটি ছোট্ট সংগ্রহ।
              </motion.p>

              <motion.div
                {...fadeUp(0.24)}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Link
                  to="/gallery"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-[#0b3b64] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
                >
                  Explore gallery
                  <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>

                {total > 0 && (
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(activeIndex)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
                  >
                    <FaExpand className="text-xs text-slate-500" />
                    View moments
                  </button>
                )}
              </motion.div>

              {images.length > 0 && (
                <motion.div
                  {...fadeUp(0.32)}
                  className="mt-10 flex items-center gap-4 border-t border-slate-200 pt-6"
                >
                  <div>
                    <div className="text-2xl font-bold tabular-nums text-slate-900">
                      {imageCountLabel}
                    </div>
                    <div className="text-xs text-slate-500">Moments captured</div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* =================================================
                RIGHT – FEATURED SLIDER
            ================================================= */}
            <div className="relative min-w-0">
              {loading && (
                <div className="animate-pulse">
                  <div className="aspect-[4/3] w-full rounded-3xl bg-slate-100" />
                  <div className="mt-3 flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-14 w-20 rounded-xl bg-slate-100" />
                    ))}
                  </div>
                </div>
              )}

              {!loading && total === 0 && (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl text-slate-400 shadow-sm ring-1 ring-slate-200">
                    <FaImages />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    No photos yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    New moments will appear here soon.
                  </p>
                </div>
              )}

              {!loading && total > 0 && (
                <motion.div
                  {...(reduceMotion
                    ? {}
                    : {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.7, delay: 0.15, ease: 'easeOut' },
                      })}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  onFocus={() => setHovered(true)}
                  onBlur={() => setHovered(false)}
                >
                  {/* Featured image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.4)] ring-1 ring-slate-900/10">
                    <AnimatePresence initial={false}>
                      <motion.img
                        key={activeIndex}
                        src={collection[activeIndex] || fallbackImage}
                        alt={`Open IT Institute gallery photo ${activeIndex + 1}`}
                        draggable={false}
                        loading={activeIndex === 0 ? 'eager' : 'lazy'}
                        fetchpriority={activeIndex === 0 ? 'high' : undefined}
                        onError={handleImageError}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="absolute inset-0 h-full w-full select-none object-cover"
                      />
                    </AnimatePresence>

                    {/* Click target for lightbox */}
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(activeIndex)}
                      className="absolute inset-0 z-10 cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#0F4C81]/60"
                      aria-label="Open photo in full screen"
                    />

                    {/* Bottom gradient + caption */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950/60 via-slate-950/15 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5">
                      <div className="flex items-end justify-between gap-3">
                        <div className="text-white">
                          <div className="text-xs font-medium text-white/70">Moment</div>
                          <div className="text-lg font-semibold tabular-nums leading-tight">
                            {pad(activeIndex + 1)}
                            <span className="text-white/50"> / {pad(total)}</span>
                          </div>
                        </div>

                        {hasMany && (
                          <div className="pointer-events-auto flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => goTo(activeIndex - 1)}
                              className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                              aria-label="Previous photo"
                            >
                              <FaChevronLeft className="text-sm" />
                            </button>
                            <button
                              type="button"
                              onClick={() => goTo(activeIndex + 1)}
                              className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                              aria-label="Next photo"
                            >
                              <FaChevronRight className="text-sm" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expand hint */}
                    <div className="pointer-events-none absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-xs text-white ring-1 ring-white/20 backdrop-blur">
                      <FaExpand />
                    </div>

                    {/* Autoplay progress */}
                    {autoplay && (
                      <span
                        key={activeIndex}
                        onAnimationEnd={() => goTo(activeIndex + 1)}
                        className="pointer-events-none absolute bottom-0 left-0 z-30 h-[3px] w-full origin-left bg-white/80"
                        style={{
                          animation: `gh-progress ${AUTOPLAY_MS}ms linear forwards`,
                          animationPlayState: paused ? 'paused' : 'running',
                        }}
                      />
                    )}
                  </div>

                  {/* Thumbnails */}
                  {hasMany && (
                    <div
                      ref={thumbsRef}
                      className="gh-thumbs mt-3 flex gap-2 overflow-x-auto pb-1"
                      role="tablist"
                      aria-label="Gallery photos"
                    >
                      {collection.map((src, index) => {
                        const active = index === activeIndex;
                        return (
                          <button
                            key={`${src}-${index}`}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            aria-label={`Show photo ${index + 1}`}
                            onClick={() => goTo(index)}
                            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2 sm:h-16 sm:w-24 ${
                              active
                                ? 'opacity-100 ring-2 ring-[#0F4C81] ring-offset-2'
                                : 'opacity-55 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={src}
                              alt=""
                              draggable={false}
                              loading="lazy"
                              onError={handleImageError}
                              className="h-full w-full select-none object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </section>

      {/* ======================================================
          LIGHTBOX
      ====================================================== */}

      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <Lightbox
            images={images}
            index={Math.min(lightboxIndex, images.length - 1)}
            onClose={() => setLightboxIndex(null)}
            onChange={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryHero;
