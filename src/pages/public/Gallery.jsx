import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaImage,
  FaSearchPlus,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTh,
  FaList,
  FaArrowLeft,
  FaArrowRight,
  FaExpand,
  FaImages,
  FaLayerGroup,
} from 'react-icons/fa';
import { getGallery } from '../../services/contentService';
import SEO from '../../components/seo/SEO';
import { SiPlangrid } from 'react-icons/si';

const categories = [
  'all',
  'classroom',
  'events',
  'workshops',
  'students',
  'certificate',
];

const categoryColors = {
  classroom: 'from-blue-500 to-indigo-600',
  events: 'from-purple-500 to-pink-600',
  workshops: 'from-orange-500 to-red-600',
  students: 'from-emerald-500 to-teal-600',
  certificate: 'from-rose-500 to-pink-600',
};

const categoryIcons = {
  classroom: '🎓',
  events: '🎉',
  workshops: '🛠️',
  students: '👨‍🎓',
  certificate: '🏆',
};

const ITEMS_PER_PAGE = 12;

/* =========================================================
   HERO FLOATING IMAGE
========================================================= */

const HeroFloatingImage = ({
  image,
  index,
  className = '',
  size = 'normal',
}) => {
  if (!image?.image) return null;

  const animationSets = [
    {
      y: [0, -12, 0, 10, 0],
      rotate: [-2, 1, -1, 2, -2],
      scale: [1, 1.015, 1, 1.01, 1],
    },
    {
      y: [0, 10, 0, -12, 0],
      rotate: [2, -1, 1, -2, 2],
      scale: [1, 1.02, 1, 1.015, 1],
    },
    {
      y: [0, -8, 0, 8, 0],
      rotate: [-1, 2, -2, 1, -1],
      scale: [1, 1.015, 1.005, 1.015, 1],
    },
    {
      y: [0, 8, 0, -10, 0],
      rotate: [1, -2, 1, -1, 1],
      scale: [1, 1.02, 1, 1.01, 1],
    },
  ];

  const animation = animationSets[index % animationSets.length];

  const sizeClasses =
    size === 'main'
      ? 'w-[270px] h-[340px] sm:w-[300px] sm:h-[370px] lg:w-[340px] lg:h-[420px]'
      : 'w-[125px] h-[155px] sm:w-[145px] sm:h-[180px] lg:w-[165px] lg:h-[205px]';

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.92,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: animation.y,
        rotate: animation.rotate,
      }}
      transition={{
        opacity: {
          duration: 0.8,
          delay: index * 0.08,
        },
        scale: {
          duration: 0.8,
          delay: index * 0.08,
        },
        y: {
          duration: 6 + (index % 3),
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.25,
        },
        rotate: {
          duration: 7 + (index % 4),
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.2,
        },
      }}
      className={`absolute ${sizeClasses} ${className}`}
      style={{ zIndex: size === 'main' ? 20 : 10 + index }}
    >
      <div className="relative w-full h-full rounded-[28px] overflow-hidden border border-white/20 bg-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
        {/* Image */}
        <img
          src={image.image}
          alt={image.title || 'Open IT Institute memory'}
          className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
          loading="eager"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/80 via-transparent to-white/10 pointer-events-none" />

        {/* Shine */}
        <motion.div
          animate={{
            x: ['-120%', '120%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatDelay: 4 + index,
            ease: 'easeInOut',
          }}
          className="absolute inset-y-0 -skew-x-12 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
        />

        {/* Main image information */}
        {size === 'main' && (
          <div className="absolute left-0 right-0 bottom-0 p-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/10 text-[11px] font-bold uppercase tracking-wider text-cyan-200 mb-2">
              <FaImage />
              Featured Memory
            </div>

            <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
              {image.title || 'Open IT Institute'}
            </h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* =========================================================
   HERO SECTION
========================================================= */

const GalleryHero = ({ images }) => {
  const heroImages = useMemo(() => {
    return images
      .filter((item) => item?.image)
      .slice(0, 8);
  }, [images]);

  const [activeHero, setActiveHero] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const timer = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  const featuredImage =
    heroImages[activeHero] || heroImages[0];

  const secondaryImages = heroImages
    .filter((_, index) => index !== activeHero)
    .slice(0, 7);

  return (
    <section className="relative overflow-hidden bg-[#030b18] text-white min-h-[680px] lg:min-h-[650px] flex items-center">
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[130px]" />

        <div className="absolute -bottom-40 right-0 w-[550px] h-[550px] rounded-full bg-blue-600/15 blur-[140px]" />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '55px 55px',
        }}
      />

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-20 lg:py-16">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-4 items-center">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-30 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/10 shadow-xl"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>

              <FaImages className="text-cyan-300" />

              <span className="text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-cyan-200">
                Our Memories
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="mt-7 text-5xl sm:text-6xl lg:text-[76px] xl:text-[84px] leading-[0.95] font-black tracking-tight"
            >
              Moments
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent">
                That Matter.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 max-w-xl mx-auto lg:mx-0 text-white/60 text-base sm:text-lg leading-8"
            >
              Explore the moments of learning, creativity, friendship
              and achievement from the Open IT Institute community.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3"
            >
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-xl">
                <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                  <FaImages className="text-cyan-300" />
                </div>

                <div className="text-left">
                  <div className="text-white font-bold text-lg leading-none">
                    {images.length}
                  </div>
                  <div className="text-white/40 text-xs mt-1">
                    Memories
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-xl">
                <div className="w-9 h-9 rounded-xl bg-blue-400/10 flex items-center justify-center">
                  <FaLayerGroup className="text-blue-300" />
                </div>

                <div className="text-left">
                  <div className="text-white font-bold text-lg leading-none">
                    {categories.length - 1}
                  </div>
                  <div className="text-white/40 text-xs mt-1">
                    Categories
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom decorative line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="hidden lg:block mt-9 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
            />
          </motion.div>

          {/* =================================================
              RIGHT PHOTO COLLECTION
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative h-[430px] sm:h-[500px] lg:h-[560px] w-full"
          >
            {/* Rotating dashed ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[390px] h-[390px] sm:w-[470px] sm:h-[470px] lg:w-[530px] lg:h-[530px] rounded-full border border-dashed border-cyan-400/10"
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 50,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[430px] lg:h-[430px] rounded-full border border-dashed border-blue-400/10"
            />

            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-cyan-400/10 blur-[100px]" />

            {/* Main image */}
            {featuredImage && (
              <HeroFloatingImage
                image={featuredImage}
                index={0}
                size="main"
                className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            )}

            {/* Secondary images */}

            {secondaryImages[0] && (
              <HeroFloatingImage
                image={secondaryImages[0]}
                index={1}
                className="top-[4%] left-[5%] sm:left-[8%] lg:left-[5%]"
              />
            )}

            {secondaryImages[1] && (
              <HeroFloatingImage
                image={secondaryImages[1]}
                index={2}
                className="top-[2%] right-[5%] sm:right-[8%] lg:right-[4%]"
              />
            )}

            {secondaryImages[2] && (
              <HeroFloatingImage
                image={secondaryImages[2]}
                index={3}
                className="bottom-[4%] left-[4%] sm:left-[8%] lg:left-[3%]"
              />
            )}

            {secondaryImages[3] && (
              <HeroFloatingImage
                image={secondaryImages[3]}
                index={4}
                className="bottom-[3%] right-[4%] sm:right-[8%] lg:right-[3%]"
              />
            )}

            {secondaryImages[4] && (
              <HeroFloatingImage
                image={secondaryImages[4]}
                index={5}
                className="top-[35%] left-0 lg:left-[-2%]"
              />
            )}

            {secondaryImages[5] && (
              <HeroFloatingImage
                image={secondaryImages[5]}
                index={6}
                className="top-[35%] right-0 lg:right-[-2%]"
              />
            )}

            {/* Small top floating image */}
            {secondaryImages[6] && (
              <HeroFloatingImage
                image={secondaryImages[6]}
                index={7}
                className="top-0 left-1/2 -translate-x-1/2 hidden sm:block"
              />
            )}

            {/* Image counter */}
            {heroImages.length > 0 && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-black/45 backdrop-blur-xl border border-white/10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveHero(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === activeHero
                        ? 'w-7 h-2 bg-cyan-400'
                        : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                    }`}
                    aria-label={`Show memory ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Floating decorative dots */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                opacity: [0.35, 0.8, 0.35],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="absolute top-[15%] right-[20%] w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
            />

            <motion.div
              animate={{
                y: [0, 10, 0],
                opacity: [0.2, 0.7, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="absolute bottom-[20%] left-[22%] w-2.5 h-2.5 rounded-full bg-blue-300 shadow-[0_0_20px_rgba(96,165,250,0.8)]"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030b18] to-transparent pointer-events-none" />
    </section>
  );
};

/* =========================================================
   MAIN GALLERY
========================================================= */

const Gallery = () => {
  const [active, setActive] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getGallery();

      let galleryData = [];

      if (
        response?.data?.gallery &&
        Array.isArray(response.data.gallery)
      ) {
        galleryData = response.data.gallery;
      } else if (
        response?.data &&
        Array.isArray(response.data)
      ) {
        galleryData = response.data;
      } else if (Array.isArray(response)) {
        galleryData = response;
      } else if (
        response?.gallery &&
        Array.isArray(response.gallery)
      ) {
        galleryData = response.gallery;
      } else if (
        response?.data?.data &&
        Array.isArray(response.data.data)
      ) {
        galleryData = response.data.data;
      } else if (response && typeof response === 'object') {
        for (const key in response) {
          if (
            Array.isArray(response[key]) &&
            response[key].length > 0
          ) {
            galleryData = response[key];
            break;
          }
        }
      }

      if (!Array.isArray(galleryData)) {
        galleryData = [];
      }

      const formattedData = galleryData.map((item, index) => ({
        ...item,
        id:
          item._id ||
          item.id ||
          `gallery-${Date.now()}-${index}`,

        image:
          item.image ||
          item.imageUrl ||
          item.url ||
          item.photo ||
          item.src ||
          item.fileUrl ||
          '',

        color:
          categoryColors[item.category] ||
          'from-gray-400 to-gray-600',

        icon:
          categoryIcons[item.category] ||
          '📸',
      }));

      setImages(formattedData);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching gallery:', err);

      setError(
        err.response?.data?.message ||
          'Failed to load gallery images. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FILTER
  ========================================================= */

  const filtered = useMemo(() => {
    return active === 'all'
      ? images
      : images.filter(
          (img) => img.category === active
        );
  }, [images, active]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.ceil(
    filtered.length / ITEMS_PER_PAGE
  );

  const paginatedImages = useMemo(() => {
    const start =
      (currentPage - 1) * ITEMS_PER_PAGE;

    return filtered.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [active]);

  const goToPage = (page) => {
    setCurrentPage(
      Math.max(
        1,
        Math.min(page, totalPages || 1)
      )
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <SEO
          title="Gallery"
          description="Moments from OPEN IT INSTITUTE"
          path="/gallery"
        />

        <section className="relative min-h-[620px] overflow-hidden bg-[#030b18]">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-[#07152b] to-[#030b18]" />

          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />

          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />

          <div className="relative z-10 min-h-[620px] flex items-center justify-center text-center px-4">
            <div>
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl mb-6">
                <FaImage className="text-cyan-300 animate-pulse" />
                <span className="text-cyan-200 text-sm font-bold uppercase tracking-widest">
                  Loading Gallery
                </span>
              </div>

              <div className="h-16 w-72 sm:w-96 bg-white/10 rounded-2xl animate-pulse mx-auto" />

              <div className="h-5 w-80 bg-white/10 rounded-full animate-pulse mx-auto mt-6" />

              <div className="flex justify-center gap-3 mt-8">
                <div className="h-12 w-28 rounded-2xl bg-white/10 animate-pulse" />
                <div className="h-12 w-28 rounded-2xl bg-white/10 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-5 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm animate-pulse"
              >
                <div className="h-64 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SEO
          title="Gallery"
          description="Moments from OPEN IT INSTITUTE"
          path="/gallery"
        />

        <section className="min-h-[500px] bg-[#030b18] flex items-center justify-center text-center px-5">
          <div>
            <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <FaImage className="text-4xl text-red-400" />
            </div>

            <h1 className="text-4xl font-black text-white mb-3">
              Gallery Unavailable
            </h1>

            <p className="text-white/50 max-w-md mx-auto mb-7">
              {error}
            </p>

            <button
              onClick={fetchGalleryImages}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
            >
              Try Again
            </button>
          </div>
        </section>
      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <SEO
        title="Gallery"
        description="Moments from OPEN IT INSTITUTE — classroom, events, workshops, students and certificate ceremony."
        path="/gallery"
      />

      {/* =====================================================
          HERO
      ===================================================== */}

      <GalleryHero images={images} />

      {/* =====================================================
          GALLERY CONTENT
      ===================================================== */}

      <section className="relative py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-cyan-600 text-sm font-bold uppercase tracking-widest mb-3">
                  <span className="w-8 h-px bg-cyan-500" />
                  Explore Memories
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                  Our Gallery
                </h2>

                <p className="text-slate-500 mt-2">
                  Discover the moments behind our journey.
                </p>
              </div>

              <div className="text-sm text-slate-400">
                Showing{' '}
                <span className="font-bold text-slate-700">
                  {filtered.length}
                </span>{' '}
                memories
              </div>
            </div>
          </motion.div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10"
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const count =
                  cat === 'all'
                    ? images.length
                    : images.filter(
                        (img) =>
                          img.category === cat
                      ).length;

                return (
                  <motion.button
                    key={cat}
                    onClick={() => setActive(cat)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className={`px-5 py-3 rounded-full text-sm font-bold capitalize flex items-center gap-2 transition-all duration-300 ${
                      active === cat
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/20'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                    }`}
                  >
                    {cat !== 'all' && (
                      <span>
                        {categoryIcons[cat]}
                      </span>
                    )}

                    {cat}

                    <span
                      className={`text-xs ${
                        active === cat
                          ? 'text-white/70'
                          : 'text-slate-400'
                      }`}
                    >
                      ({count})
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* View controls */}
            <div className="self-start lg:self-auto flex items-center gap-1 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <SiPlangrid />
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <FaList />
              </button>
            </div>
          </motion.div>

          {/* =================================================
              EMPTY
          ================================================= */}

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-[32px] bg-white border border-slate-100 shadow-xl p-16 text-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <FaImage className="text-4xl text-slate-300" />
              </div>

              <h3 className="text-2xl font-bold text-slate-800">
                No memories found
              </h3>

              <p className="text-slate-400 mt-2">
                No images are available in the "{active}"
                category.
              </p>
            </motion.div>
          ) : (
            <>
              {/* =================================================
                  GRID / LIST
              ================================================= */}

              <motion.div
                layout
                className={
                  viewMode === 'grid'
                    ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-5'
                }
              >
                <AnimatePresence mode="popLayout">
                  {paginatedImages.map((img, index) => (
                    <motion.article
                      key={img.id}
                      layout
                      initial={{
                        opacity: 0,
                        y: 25,
                        scale: 0.97,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(
                          index * 0.04,
                          0.3
                        ),
                      }}
                      onClick={() => setLightbox(img)}
                      className={`group cursor-pointer bg-white overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 ${
                        viewMode === 'grid'
                          ? 'rounded-[24px]'
                          : 'rounded-[24px] flex p-3 gap-5'
                      }`}
                    >
                      {/* Image */}
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === 'grid'
                            ? 'h-64'
                            : 'w-52 h-40 flex-shrink-0 rounded-2xl'
                        } bg-gradient-to-br ${
                          img.color
                        }`}
                      >
                        {img.image ? (
                          <img
                            src={img.image}
                            alt={
                              img.title ||
                              'Gallery Image'
                            }
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">
                              {img.icon}
                            </span>
                          </div>
                        )}

                        {/* Dark gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                        {/* Zoom */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.6,
                            }}
                            whileHover={{
                              opacity: 1,
                              scale: 1,
                            }}
                            className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center"
                          >
                            <FaSearchPlus className="text-white text-xl" />
                          </motion.div>
                        </div>

                        {/* Category */}
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-white text-xs font-bold capitalize">
                            <span>{img.icon}</span>
                            {img.category ||
                              'General'}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div
                        className={
                          viewMode === 'grid'
                            ? 'p-5'
                            : 'flex-1 flex flex-col justify-center py-2 pr-4'
                        }
                      >
                        <h3 className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {img.title ||
                            'Untitled Memory'}
                        </h3>

                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                          <FaCalendarAlt className="text-blue-400" />

                          {img.createdAt
                            ? new Date(
                                img.createdAt
                              ).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )
                            : 'Recent'}
                        </div>

                        {viewMode === 'list' &&
                          img.description && (
                            <p className="text-sm text-slate-500 mt-3 line-clamp-2">
                              {img.description}
                            </p>
                          )}

                        {viewMode === 'grid' && (
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                            <span className="text-xs text-slate-400">
                              View memory
                            </span>

                            <span className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition">
                              <FaArrowRight className="text-xs" />
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 mt-14"
                >
                  <button
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <FaChevronLeft />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {[...Array(totalPages)].map(
                      (_, i) => {
                        const page = i + 1;

                        if (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(
                            page - currentPage
                          ) <= 1
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() =>
                                goToPage(page)
                              }
                              className={`w-12 h-12 rounded-xl font-bold transition ${
                                currentPage ===
                                page
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                  : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }

                        if (
                          page === 2 &&
                          currentPage > 3
                        ) {
                          return (
                            <span
                              key={page}
                              className="px-1 text-slate-400"
                            >
                              …
                            </span>
                          );
                        }

                        if (
                          page ===
                            totalPages - 1 &&
                          currentPage <
                            totalPages - 2
                        ) {
                          return (
                            <span
                              key={page}
                              className="px-1 text-slate-400"
                            >
                              …
                            </span>
                          );
                        }

                        return null;
                      }
                    )}
                  </div>

                  <button
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <FaChevronRight />
                  </button>
                </motion.div>
              )}

              {/* Results */}
              <div className="text-center mt-6 text-sm text-slate-400">
                Showing{' '}
                <span className="font-semibold text-slate-600">
                  {filtered.length
                    ? (currentPage - 1) *
                        ITEMS_PER_PAGE +
                      1
                    : 0}
                </span>{' '}
                –{' '}
                <span className="font-semibold text-slate-600">
                  {Math.min(
                    currentPage *
                      ITEMS_PER_PAGE,
                    filtered.length
                  )}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-600">
                  {filtered.length}
                </span>{' '}
                memories
              </div>
            </>
          )}
        </div>
      </section>

      {/* =====================================================
          LIGHTBOX
      ===================================================== */}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <motion.button
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="absolute top-4 right-4 sm:top-7 sm:right-7 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition"
              onClick={() => setLightbox(null)}
            >
              <FaTimes />
            </motion.button>

            {/* Counter */}
            <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-30 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl text-white/70 text-sm">
              {filtered.findIndex(
                (item) =>
                  item.id === lightbox.id
              ) + 1}{' '}
              / {filtered.length}
            </div>

            {/* Main */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
              }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 260,
              }}
              className="relative w-full max-w-6xl max-h-[92vh] rounded-[28px] overflow-hidden bg-black/50 border border-white/10 shadow-2xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              {/* Image */}
              <div className="h-[70vh] sm:h-[78vh] flex items-center justify-center">
                {lightbox.image ? (
                  <img
                    src={lightbox.image}
                    alt={
                      lightbox.title ||
                      'Gallery Image'
                    }
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${
                      lightbox.color ||
                      'from-gray-500 to-gray-700'
                    } flex items-center justify-center`}
                  >
                    <span className="text-8xl">
                      {lightbox.icon}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 sm:p-8 pt-20">
                <h3 className="text-white text-xl sm:text-3xl font-black">
                  {lightbox.title ||
                    'Open IT Institute'}
                </h3>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/80 text-xs capitalize">
                    {lightbox.icon}
                    {lightbox.category ||
                      'General'}
                  </span>

                  {lightbox.createdAt && (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/60 text-xs">
                      <FaCalendarAlt className="text-cyan-300" />
                      {new Date(
                        lightbox.createdAt
                      ).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </span>
                  )}
                </div>

                {lightbox.description && (
                  <p className="mt-3 text-white/50 text-sm max-w-2xl">
                    {lightbox.description}
                  </p>
                )}
              </div>

              {/* Previous */}
              <button
                onClick={() => {
                  const index =
                    filtered.findIndex(
                      (item) =>
                        item.id ===
                        lightbox.id
                    );

                  if (index > 0) {
                    setLightbox(
                      filtered[index - 1]
                    );
                  }
                }}
                disabled={
                  filtered.findIndex(
                    (item) =>
                      item.id ===
                      lightbox.id
                  ) === 0
                }
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-black/50 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center disabled:opacity-20 transition"
              >
                <FaArrowLeft />
              </button>

              {/* Next */}
              <button
                onClick={() => {
                  const index =
                    filtered.findIndex(
                      (item) =>
                        item.id ===
                        lightbox.id
                    );

                  if (
                    index <
                    filtered.length - 1
                  ) {
                    setLightbox(
                      filtered[index + 1]
                    );
                  }
                }}
                disabled={
                  filtered.findIndex(
                    (item) =>
                      item.id ===
                      lightbox.id
                  ) ===
                  filtered.length - 1
                }
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-black/50 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center disabled:opacity-20 transition"
              >
                <FaArrowRight />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;