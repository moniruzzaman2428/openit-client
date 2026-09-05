import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaImages,
  FaSpinner,
  FaArrowRight,
  FaExpand,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { getGallery } from '../../services/contentService';

// ============================================================
// FALLBACK IMAGE
// ============================================================

const fallbackImage =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400&h=900&fit=crop&q=85';

// ============================================================
// GALLERY HERO
// ============================================================

const GalleryHero = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // ============================================================
  // LOAD GALLERY FROM MONGODB
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadGallery = async () => {
      try {
        setLoading(true);

        const response = await getGallery({
          limit: 20,
        });

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

        if (mounted) {
          setGalleryImages([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
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

  const images = useMemo(() => {
    return galleryImages
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

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
      .filter(Boolean);
  }, [galleryImages]);

  // ============================================================
  // HERO COLLECTION
  // 7 IMAGES MAXIMUM
  // ============================================================

  const collection = useMemo(() => {
    if (!images.length) {
      return [];
    }

    return images.slice(0, 7);
  }, [images]);

  // ============================================================
  // AUTO ACTIVE IMAGE
  // ============================================================

  useEffect(() => {
    if (collection.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % collection.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [collection.length]);

  // ============================================================
  // OPEN PREVIEW
  // ============================================================

  const openPreview = (index) => {
    setActiveIndex(index);
    setShowPreview(true);
  };

  // ============================================================
  // PREVIOUS
  // ============================================================

  const previousImage = (event) => {
    event?.stopPropagation();

    setActiveIndex(
      (prev) =>
        (prev - 1 + collection.length) % collection.length
    );
  };

  // ============================================================
  // NEXT
  // ============================================================

  const nextImage = (event) => {
    event?.stopPropagation();

    setActiveIndex(
      (prev) => (prev + 1) % collection.length
    );
  };

  return (
    <>
      {/* ======================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative min-h-[500px] overflow-hidden bg-[#f8fafc] sm:min-h-[590px] lg:min-h-[650px]">
        {/* ====================================================
            BACKGROUND
        ==================================================== */}

        <div className="pointer-events-none absolute inset-0">
          {/* Base */}

          <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f8fbff] to-[#eef7ff]" />

          {/* Blue Glow */}

          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, -25, 0],
              scale: [1, 1.08, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-300/20 blur-[110px]"
          />

          {/* Cyan Glow */}

          <motion.div
            animate={{
              x: [0, -35, 0],
              y: [0, 30, 0],
              scale: [1.05, 1, 1.05],
              opacity: [0.16, 0.25, 0.16],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -right-40 top-10 h-[430px] w-[430px] rounded-full bg-cyan-300/20 blur-[110px]"
          />

          {/* Purple Glow */}

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.08, 0.16, 0.08],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-[-180px] left-1/2 h-[400px] w-[650px] -translate-x-1/2 rounded-full bg-purple-300/10 blur-[130px]"
          />

          {/* Grid */}

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(15,23,42,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.8) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Giant Brand Text */}

          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.h1
              initial={{
                opacity: 0,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1.5,
              }}
              className="select-none whitespace-nowrap text-[70px] font-black tracking-[-0.08em] text-slate-900/[0.035] sm:text-[120px] md:text-[170px] lg:text-[220px]"
            >
              OPEN IT
            </motion.h1>
          </div>
        </div>

        {/* ====================================================
            MAIN CONTAINER
        ==================================================== */}

        <div className="relative z-10 mx-auto flex min-h-[500px] max-w-7xl items-center px-4 py-14 sm:min-h-[590px] sm:px-6 lg:min-h-[650px] lg:px-8">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
              }}
              className="relative z-20"
            >
              {/* Badge */}

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
                  delay: 0.2,
                  duration: 0.6,
                }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 shadow-sm backdrop-blur-xl sm:text-xs"
              >
                <FaImages />
                Open IT Institute
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Gallery
              </motion.div>

              {/* Heading */}

              <motion.h2
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                  duration: 0.7,
                }}
                className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-[58px]"
              >
                Learning.
                <br />

                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                  Growing.
                </span>

                <br />

                <span className="text-slate-800">
                  Creating Future.
                </span>
              </motion.h2>

              {/* Description */}

              <motion.p
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.45,
                  duration: 0.6,
                }}
                className="mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:text-[15px]"
              >
                আমাদের প্রশিক্ষণ কার্যক্রম, শিক্ষার্থীদের
                সাফল্য এবং Open IT Institute-এর স্মরণীয়
                মুহূর্তগুলোর একটি ছোট্ট সংগ্রহ।
              </motion.p>

              {/* Buttons */}

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
                  delay: 0.6,
                  duration: 0.6,
                }}
                className="mt-7 flex flex-wrap items-center gap-3"
              >
                <Link
                  to="/gallery"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#071b32] px-5 py-3 text-xs font-bold text-white shadow-xl shadow-blue-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-blue-600/20"
                >
                  Explore Gallery

                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                {collection.length > 0 && (
                  <button
                    onClick={() => openPreview(activeIndex)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:text-blue-600"
                  >
                    <FaExpand />
                    View Moments
                  </button>
                )}
              </motion.div>

              {/* Small Stats */}

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.8,
                }}
                className="mt-8 flex items-center gap-6"
              >
                <div>
                  <p className="text-xl font-black text-slate-900">
                    {images.length || 0}+
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Moments
                  </p>
                </div>

                <div className="h-8 w-px bg-slate-200" />

                <div>
                  <p className="text-xl font-black text-slate-900">
                    01
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Collection
                  </p>
                </div>

                <div className="h-8 w-px bg-slate-200" />

                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Live
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* =================================================
                RIGHT - PHOTO COLLECTION
            ================================================= */}

            <div className="relative h-[360px] w-full sm:h-[430px] lg:h-[510px]">
              {/* Collection Glow */}

              <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/20 blur-[100px] sm:h-[350px] sm:w-[350px]" />

              {/* Loading */}

              {loading && (
                <div className="relative flex h-full items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-blue-600 shadow-xl backdrop-blur-xl">
                      <FaSpinner className="animate-spin text-xl" />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-slate-400">
                      Loading gallery...
                    </p>
                  </div>
                </div>
              )}

              {/* Empty */}

              {!loading && collection.length === 0 && (
                <div className="relative flex h-full items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-xl">
                      <FaImages className="text-2xl" />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-slate-400">
                      No gallery images available
                    </p>
                  </div>
                </div>
              )}

              {/* =================================================
                  PHOTO COLLECTION
              ================================================= */}

              {!loading && collection.length > 0 && (
                <div className="absolute inset-0">
                  {/* Decorative Ring */}

                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 45,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-blue-200/60 sm:h-[390px] sm:w-[390px] lg:h-[450px] lg:w-[450px]"
                  />

                  {/* =================================================
                      IMAGE 1 - CENTER
                  ================================================= */}

                  {collection[0] && (
                    <FloatingPhoto
                      image={collection[0]}
                      index={0}
                      className="left-1/2 top-1/2 z-20 h-[230px] w-[300px] -translate-x-1/2 -translate-y-1/2 sm:h-[280px] sm:w-[370px] lg:h-[330px] lg:w-[440px]"
                      rotate={-2}
                      delay={0}
                      duration={7}
                      onClick={() => openPreview(0)}
                    />
                  )}

                  {/* =================================================
                      IMAGE 2 - TOP LEFT
                  ================================================= */}

                  {collection[1] && (
                    <FloatingPhoto
                      image={collection[1]}
                      index={1}
                      className="left-[2%] top-[4%] z-10 h-[115px] w-[145px] sm:h-[145px] sm:w-[185px] lg:left-[4%] lg:top-[5%] lg:h-[175px] lg:w-[220px]"
                      rotate={-7}
                      delay={0.8}
                      duration={8}
                      onClick={() => openPreview(1)}
                    />
                  )}

                  {/* =================================================
                      IMAGE 3 - TOP RIGHT
                  ================================================= */}

                  {collection[2] && (
                    <FloatingPhoto
                      image={collection[2]}
                      index={2}
                      className="right-[2%] top-[2%] z-10 h-[105px] w-[140px] sm:h-[140px] sm:w-[180px] lg:right-[3%] lg:top-[3%] lg:h-[165px] lg:w-[215px]"
                      rotate={7}
                      delay={1.3}
                      duration={9}
                      onClick={() => openPreview(2)}
                    />
                  )}

                  {/* =================================================
                      IMAGE 4 - BOTTOM LEFT
                  ================================================= */}

                  {collection[3] && (
                    <FloatingPhoto
                      image={collection[3]}
                      index={3}
                      className="bottom-[4%] left-[5%] z-10 h-[120px] w-[155px] sm:h-[150px] sm:w-[195px] lg:bottom-[5%] lg:left-[5%] lg:h-[180px] lg:w-[225px]"
                      rotate={5}
                      delay={1.7}
                      duration={10}
                      onClick={() => openPreview(3)}
                    />
                  )}

                  {/* =================================================
                      IMAGE 5 - BOTTOM RIGHT
                  ================================================= */}

                  {collection[4] && (
                    <FloatingPhoto
                      image={collection[4]}
                      index={4}
                      className="bottom-[2%] right-[4%] z-10 h-[125px] w-[160px] sm:h-[155px] sm:w-[200px] lg:bottom-[4%] lg:right-[4%] lg:h-[185px] lg:w-[230px]"
                      rotate={-5}
                      delay={2}
                      duration={8.5}
                      onClick={() => openPreview(4)}
                    />
                  )}

                  {/* =================================================
                      IMAGE 6 - LEFT CENTER
                  ================================================= */}

                  {collection[5] && (
                    <FloatingPhoto
                      image={collection[5]}
                      index={5}
                      className="left-[-2%] top-[43%] z-[15] h-[95px] w-[120px] sm:left-[0%] sm:h-[120px] sm:w-[150px] lg:left-[0%] lg:h-[140px] lg:w-[175px]"
                      rotate={-10}
                      delay={2.5}
                      duration={9.5}
                      onClick={() => openPreview(5)}
                    />
                  )}

                  {/* =================================================
                      IMAGE 7 - RIGHT CENTER
                  ================================================= */}

                  {collection[6] && (
                    <FloatingPhoto
                      image={collection[6]}
                      index={6}
                      className="right-[-2%] top-[44%] z-[15] h-[95px] w-[120px] sm:right-[0%] sm:h-[120px] sm:w-[150px] lg:right-[0%] lg:h-[140px] lg:w-[175px]"
                      rotate={9}
                      delay={3}
                      duration={10.5}
                      onClick={() => openPreview(6)}
                    />
                  )}

                  {/* =================================================
                      CENTER ACTIVE INDICATOR
                  ================================================= */}

                  <div className="absolute bottom-[-2px] left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/60 bg-white/75 px-3 py-2 shadow-lg backdrop-blur-xl">
                    {collection.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          activeIndex === index
                            ? 'w-6 bg-blue-600'
                            : 'w-1.5 bg-slate-300 hover:bg-blue-300'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====================================================
            BOTTOM FADE
        ==================================================== */}

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-20 bg-gradient-to-t from-white/70 to-transparent" />
      </section>

      {/* ======================================================
          LIGHTBOX
      ====================================================== */}

      <AnimatePresence>
        {showPreview && collection.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-2xl"
            onClick={() => setShowPreview(false)}
          >
            {/* Close */}

            <button
              onClick={() => setShowPreview(false)}
              className="absolute right-5 top-5 z-[110] flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/70 backdrop-blur-xl transition hover:bg-white/20 hover:text-white"
              aria-label="Close preview"
            >
              <FaTimes />
            </button>

            {/* Previous */}

            <button
              onClick={previousImage}
              className="absolute left-4 top-1/2 z-[110] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/70 backdrop-blur-xl transition hover:bg-white/20 hover:text-white sm:left-8"
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>

            {/* Next */}

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 z-[110] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/70 backdrop-blur-xl transition hover:bg-white/20 hover:text-white sm:right-8"
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>

            {/* Image */}

            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              className="relative max-h-[88vh] max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  initial={{
                    opacity: 0,
                    scale: 1.04,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                  src={
                    collection[activeIndex] ||
                    fallbackImage
                  }
                  alt="Open IT Institute Gallery"
                  className="max-h-[82vh] w-auto max-w-full object-contain"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackImage;
                  }}
                />
              </AnimatePresence>

              {/* Counter */}

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold text-white backdrop-blur-xl">
                {activeIndex + 1} / {collection.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================
// FLOATING PHOTO
// ============================================================

const FloatingPhoto = ({
  image,
  index,
  className,
  rotate = 0,
  delay = 0,
  duration = 8,
  onClick,
}) => {
  return (
    <motion.button
      type="button"
      initial={{
        opacity: 0,
        scale: 0.8,
        rotate: rotate - 4,
      }}
      animate={{
        opacity: 1,
        scale: [1, 1.025, 1],
        y: [0, -8, 0, 7, 0],
        rotate: [
          rotate,
          rotate + 1.2,
          rotate - 1,
          rotate,
        ],
      }}
      transition={{
        opacity: {
          duration: 0.8,
          delay,
        },
        scale: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
        y: {
          duration: duration + 1,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
        rotate: {
          duration: duration + 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
      }}
      whileHover={{
        scale: 1.07,
        rotate: 0,
        y: -8,
        transition: {
          duration: 0.3,
        },
      }}
      onClick={onClick}
      className={`group absolute overflow-hidden rounded-[18px] border-[6px] border-white bg-slate-100 text-left shadow-[0_25px_70px_rgba(15,23,42,0.18)] transition-shadow duration-500 hover:shadow-[0_35px_90px_rgba(15,23,42,0.28)] sm:rounded-[22px] sm:border-[7px] ${className}`}
    >
      {/* Image */}

      <img
        src={image || fallbackImage}
        alt={`Open IT Institute Gallery ${index + 1}`}
        draggable="false"
        loading={index < 3 ? 'eager' : 'lazy'}
        className="h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackImage;
        }}
      />

      {/* Image Overlay */}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-white/10 opacity-70" />

      {/* Shine */}

      <motion.div
        animate={{
          x: ['-120%', '130%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatDelay: 5,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {/* Hover Icon */}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-xl">
          <FaExpand className="text-xs" />
        </div>
      </div>
    </motion.button>
  );
};

export default GalleryHero;