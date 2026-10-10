import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaQuoteLeft,
  FaStar,
  FaUserGraduate,
  FaGoogle,
  FaGraduationCap,
  FaTimes,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
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
    photo:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&crop=face',
    rating: 5,
    review:
      'ওপেন আইটি ইনস্টিটিউট থেকে গ্রাফিক ডিজাইন শেখার পর আমি এখন ফ্রিল্যান্সিং করে মাসে ৩০-৪০ হাজার টাকা আয় করছি। স্যারদের পড়ানোর ধরন অসাধারণ!',
    createdAt: '2024-12-10',
  },
  {
    _id: '2',
    studentName: 'রাকিব হাসান',
    course: 'ওয়েব ডেভেলপমেন্ট',
    photo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face',
    rating: 5,
    review:
      'এখানে এসে ওয়েব ডেভেলপমেন্ট শিখে আমি এখন একটি সফটওয়্যার ফার্মে চাকরি করছি। ল্যাব এবং প্র্যাকটিক্যাল ক্লাসের সুবিধা এত ভালো যে শেখাটা খুব সহজ হয়ে যায়।',
    createdAt: '2025-01-15',
  },
  {
    _id: '3',
    studentName: 'তানিয়া আক্তার',
    course: 'ডিজিটাল মার্কেটিং',
    photo:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop&crop=face',
    rating: 4,
    review:
      'ডিজিটাল মার্কেটিং কোর্সটি আমার ক্যারিয়ার বদলে দিয়েছে। ফেসবুক মার্কেটিং থেকে শুরু করে SEO পর্যন্ত সবকিছু হাতে-কলমে শিখিয়েছে। খুবই উপকৃত হয়েছি।',
    createdAt: '2025-02-20',
  },
  {
    _id: '4',
    studentName: 'মেহেদী হাসান',
    course: 'হার্ডওয়্যার ও নেটওয়ার্কিং',
    photo:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop&crop=face',
    rating: 5,
    review:
      'হার্ডওয়্যার এবং নেটওয়ার্কিং কোর্সটি খুবই প্র্যাকটিক্যাল। কম্পিউটার অ্যাসেম্বলি থেকে নেটওয়ার্ক সেটআপ সব নিজের হাতে করতে পারি।',
    createdAt: '2024-11-05',
  },
  {
    _id: '5',
    studentName: 'নুসরাত জাহান',
    course: 'ফ্রিল্যান্সিং',
    photo:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop&crop=face',
    rating: 5,
    review:
      'আগে ভাবতাম ফ্রিল্যান্সিং করা অনেক কঠিন, কিন্তু ওপেন আইটির স্যাররা এত সহজভাবে বুঝিয়েছেন যে এখন Fiverr-এ নিয়মিত অর্ডার পাচ্ছি।',
    createdAt: '2025-03-01',
  },
  {
    _id: '6',
    studentName: 'ইমরান খান',
    course: 'প্রোগ্রামিং',
    photo:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&crop=face',
    rating: 4,
    review:
      'প্রোগ্রামিং কোর্সের মাধ্যমে C, C++, Python শিখেছি। ক্লাসে একদম জিরো থেকে শুরু করে অ্যাডভান্সড লেভেল পর্যন্ত যাওয়া যায়।',
    createdAt: '2024-10-12',
  },
  {
    _id: '7',
    studentName: 'মোঃ সাকিব',
    course: 'ওয়েব ডিজাইন',
    photo:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=600&fit=crop&crop=face',
    rating: 5,
    review:
      'ওপেন আইটির প্র্যাকটিক্যাল ক্লাসগুলো আমার জন্য অনেক বেশি কার্যকর হয়েছে।',
    createdAt: '2025-03-10',
  },
  {
    _id: '8',
    studentName: 'মাহমুদা আক্তার',
    course: 'বেসিক কম্পিউটার',
    photo:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=600&fit=crop&crop=face',
    rating: 5,
    review:
      'কম্পিউটার সম্পর্কে একদম শূন্য থেকে শুরু করে অনেক কিছু শিখতে পেরেছি।',
    createdAt: '2025-03-18',
  },
];

// ============================================================
// HELPERS
// ============================================================

const fallbackImage =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&crop=face';

const getStudentName = (t) => t?.studentName || t?.name || 'Student';
const getCourse = (t) => t?.course || t?.role || 'General Course';
const getRating = (t) => Number(t?.rating || 5);
const getReview = (t) =>
  t?.review || t?.text || 'Great learning experience at Open IT Institute.';
const getPhoto = (t) => t?.photo || fallbackImage;

// ---- 3D ring settings ----
const AUTO_SPEED = -12; // deg / second (negative = moves left, like the video)
const DRAG_SENSITIVITY = 0.28; // deg per px dragged
const MIN_CARDS = 8; // ring looks broken with too few cards
const CLICK_THRESHOLD = 6; // px moved before a click is treated as a drag

// Normalise any angle to the range [-180, 180]
const normalizeAngle = (deg) => {
  let a = ((deg + 180) % 360 + 360) % 360 - 180;
  if (a === -180) a = 180;
  return a;
};

// Card size + ring gap based on viewport width
const getLayout = (width) => {
  if (width < 480) return { w: 150, h: 190, gap: 14, perspective: 900 };
  if (width < 768) return { w: 180, h: 228, gap: 18, perspective: 1100 };
  if (width < 1024) return { w: 210, h: 264, gap: 22, perspective: 1300 };
  return { w: 240, h: 300, gap: 26, perspective: 1500 };
};

// ============================================================
// COMPONENT
// ============================================================

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [layout, setLayout] = useState(() =>
    getLayout(typeof window !== 'undefined' ? window.innerWidth : 1280)
  );
  const [isDragging, setIsDragging] = useState(false);

  // Refs used by the animation loop (no re-render on every frame)
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const rotationRef = useRef(0);
  const velocityRef = useRef(AUTO_SPEED);
  const snapTargetRef = useRef(null);
  const hoverRef = useRef(false);
  const draggingRef = useRef(false);
  const modalOpenRef = useRef(false);
  const dragMovedRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, t: 0 });
  const reducedMotionRef = useRef(false);

  // ==========================================================
  // LOAD TESTIMONIALS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const fetchTestimonials = async () => {
      try {
        setLoading(true);

        const response = await getTestimonials({ limit: 50 });

        const data =
          response?.data?.testimonials ||
          response?.data?.data ||
          response?.testimonials ||
          response?.data ||
          [];

        if (mounted && Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        } else if (mounted) {
          setTestimonials(fallbackTestimonials);
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error);
        if (mounted) setTestimonials(fallbackTestimonials);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTestimonials();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // RING ITEMS
  // ==========================================================

  const ringItems = useMemo(() => {
    const base = testimonials.slice(0, 12);
    if (!base.length) return [];

    // Repeat items until the ring has enough cards to look like a circle
    const items = [...base];
    while (items.length < MIN_CARDS) {
      items.push(...base);
    }
    return items.slice(0, Math.max(MIN_CARDS, base.length));
  }, [testimonials]);

  const count = ringItems.length;
  const step = count ? 360 / count : 0;

  // Radius so neighbouring cards sit side by side with a small gap
  const radius = useMemo(() => {
    if (!count) return 0;
    return (layout.w + layout.gap) / 2 / Math.tan(Math.PI / count);
  }, [count, layout]);

  // ==========================================================
  // RESPONSIVE + REDUCED MOTION
  // ==========================================================

  useEffect(() => {
    const onResize = () => setLayout(getLayout(window.innerWidth));
    window.addEventListener('resize', onResize);
    onResize();

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;
    const onMq = (e) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener?.('change', onMq);

    return () => {
      window.removeEventListener('resize', onResize);
      mq.removeEventListener?.('change', onMq);
    };
  }, []);

  // ==========================================================
  // APPLY TRANSFORMS (called every frame)
  // ==========================================================

  const applyTransforms = useCallback(() => {
    const ring = ringRef.current;
    if (!ring || !count) return;

    ring.style.transform = `translateZ(${-radius}px) rotateY(${rotationRef.current}deg)`;

    for (let i = 0; i < count; i += 1) {
      const el = cardRefs.current[i];
      if (!el) continue;

      // Angle of this card relative to the front (0 = facing the viewer)
      const a = normalizeAngle(i * step + rotationRef.current);
      const facing = Math.cos((a * Math.PI) / 180); // 1 front … -1 back
      const t = (facing + 1) / 2; // 0..1

      el.style.opacity = String(0.25 + 0.75 * t);
      el.style.filter = `brightness(${0.55 + 0.45 * t})`;
      el.style.pointerEvents = facing > 0.15 ? 'auto' : 'none';
    }
  }, [count, radius, step]);

  // ==========================================================
  // ANIMATION LOOP
  // ==========================================================

  useEffect(() => {
    if (!count) return undefined;

    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!draggingRef.current) {
        if (snapTargetRef.current !== null) {
          // Smoothly glide to the target angle (arrow buttons)
          const diff = snapTargetRef.current - rotationRef.current;
          rotationRef.current += diff * Math.min(1, dt * 8);
          velocityRef.current = 0;

          if (Math.abs(diff) < 0.05) {
            rotationRef.current = snapTargetRef.current;
            snapTargetRef.current = null;
            velocityRef.current = 0;
          }
        } else {
          // Inertia easing back to the auto speed
          const paused =
            hoverRef.current ||
            modalOpenRef.current ||
            reducedMotionRef.current;
          const target = paused ? 0 : AUTO_SPEED;

          velocityRef.current +=
            (target - velocityRef.current) * Math.min(1, dt * 2.2);
          rotationRef.current += velocityRef.current * dt;
        }
      }

      applyTransforms();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, applyTransforms]);

  // ==========================================================
  // DRAG TO ROTATE (mouse + touch + pen)
  // ==========================================================

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    draggingRef.current = true;
    snapTargetRef.current = null;
    dragMovedRef.current = 0;
    velocityRef.current = 0;
    lastPointerRef.current = { x: event.clientX, t: performance.now() };
    setIsDragging(true);

    const onMove = (e) => {
      const now = performance.now();
      const dx = e.clientX - lastPointerRef.current.x;
      const dtMs = Math.max(now - lastPointerRef.current.t, 1);

      dragMovedRef.current += Math.abs(dx);
      rotationRef.current += dx * DRAG_SENSITIVITY;

      // Track velocity (deg / sec) for the throw effect
      const instant = ((dx * DRAG_SENSITIVITY) / dtMs) * 1000;
      velocityRef.current = velocityRef.current * 0.6 + instant * 0.4;

      lastPointerRef.current = { x: e.clientX, t: now };
    };

    const onUp = () => {
      draggingRef.current = false;
      setIsDragging(false);

      // Clamp the throw so it never goes crazy
      velocityRef.current = Math.max(-400, Math.min(400, velocityRef.current));

      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // Mouse wheel / trackpad horizontal scroll rotates the ring too
  const handleWheel = (event) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      snapTargetRef.current = null;
      rotationRef.current -= event.deltaX * 0.15;
      velocityRef.current = 0;
    }
  };

  // ==========================================================
  // ARROWS / KEYBOARD
  // ==========================================================

  const rotateByStep = useCallback(
    (direction) => {
      if (!step) return;
      const base =
        snapTargetRef.current !== null
          ? snapTargetRef.current
          : Math.round(rotationRef.current / step) * step;

      snapTargetRef.current = base + direction * step;
    },
    [step]
  );

  const handleRingKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      rotateByStep(1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      rotateByStep(-1);
    }
  };

  // ==========================================================
  // MODAL
  // ==========================================================

  useEffect(() => {
    modalOpenRef.current = Boolean(selectedTestimonial);
  }, [selectedTestimonial]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') setSelectedTestimonial(null);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleCardClick = (testimonial) => {
    // Ignore the click that ends a drag
    if (dragMovedRef.current > CLICK_THRESHOLD) return;
    setSelectedTestimonial(testimonial);
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto h-[500px] max-w-7xl animate-pulse rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/30 sm:h-[600px] sm:rounded-[40px]" />
        </div>
      </section>
    );
  }

  if (!ringItems.length) {
    return null;
  }

  const stageHeight = layout.h + 140;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white  text-slate-900 sm:py-8 lg:py-12">
        {/* ======================================================
            BACKGROUND DECORATION
        ====================================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/60 blur-[130px] sm:h-[650px] sm:w-[650px]"
          />

          <motion.div
            animate={{ x: [0, 60, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-32 top-20 h-[300px] w-[300px] rounded-full bg-cyan-100/50 blur-[100px] sm:-left-64 sm:h-[450px] sm:w-[450px]"
          />

          <motion.div
            animate={{ x: [0, -60, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-32 bottom-20 h-[300px] w-[300px] rounded-full bg-blue-100/50 blur-[100px] sm:-right-64 sm:h-[450px] sm:w-[450px]"
          />

          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(#0f4c81 1px, transparent 1px), linear-gradient(90deg, #0f4c81 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="select-none whitespace-nowrap text-[80px] font-black tracking-[-0.08em] text-blue-900/[0.02] sm:text-[140px] md:text-[200px] lg:text-[260px]">
              TESTIMONIALS
            </div>
          </div>
        </div>

        {/* ======================================================
            CONTENT
        ====================================================== */}

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ====================================================
              HEADER
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700 sm:mb-5 sm:px-5 sm:text-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
              Student Stories
            </div>

            <h2 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
              শিক্ষার্থীরা{' '}
              <span className="relative bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                কী বলছেন?
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 sm:-bottom-2 sm:h-1.5"
                />
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-slate-500 sm:mt-5 sm:text-sm sm:leading-7 lg:text-base">
              আমাদের শিক্ষার্থীদের অভিজ্ঞতা, শেখার গল্প এবং ক্যারিয়ারে
              তাদের এগিয়ে যাওয়ার কিছু কথা।
            </p>

            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:mt-6 sm:flex-row sm:gap-4">
              <div className="flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50/80 px-4 py-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar
                      key={index}
                      className="text-xs text-amber-400 sm:text-sm"
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800 sm:text-sm">
                  4.9/5
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2">
                <FaUserGraduate className="text-xs text-blue-600 sm:text-sm" />
                <span className="text-xs font-bold text-slate-800 sm:text-sm">
                  500+ Students
                </span>
              </div>
            </div>
          </motion.div>

          {/* ====================================================
              3D ROTATING RING (drag to spin)
          ==================================================== */}

          <div
            className="relative mx-auto mt-10 w-full select-none overflow-hidden outline-none sm:mt-14 lg:mt-16"
            style={{
              height: stageHeight,
              perspective: `${layout.perspective}px`,
              perspectiveOrigin: '50% 50%',
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'pan-y',
            }}
            tabIndex={0}
            role="region"
            aria-label="Student testimonials. Drag or use the arrow keys to rotate."
            onPointerDown={handlePointerDown}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') hoverRef.current = true;
            }}
            onPointerLeave={() => {
              hoverRef.current = false;
            }}
            onWheel={handleWheel}
            onKeyDown={handleRingKeyDown}
            onDragStart={(e) => e.preventDefault()}
          >
            {/* Ring (rotates around the Y axis) */}
            <div
              ref={ringRef}
              className="absolute left-1/2 top-1/2"
              style={{
                width: layout.w,
                height: layout.h,
                marginLeft: -layout.w / 2,
                marginTop: -layout.h / 2,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                transform: `translateZ(${-radius}px) rotateY(0deg)`,
              }}
            >
              {ringItems.map((testimonial, index) => (
                <div
                  key={`${testimonial._id || testimonial.id || 'item'}-${index}`}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="absolute inset-0"
                  style={{
                    transform: `rotateY(${index * step}deg) translateZ(${radius}px)`,
                    backfaceVisibility: 'visible',
                    willChange: 'opacity, filter',
                  }}
                >
                  <div
                    onClick={() => handleCardClick(testimonial)}
                    className="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,76,129,0.22)] transition-shadow duration-300 hover:border-blue-300 hover:shadow-[0_24px_70px_rgba(15,76,129,0.35)] sm:rounded-[22px] lg:rounded-[26px]"
                  >
                    <img
                      src={getPhoto(testimonial)}
                      alt={getStudentName(testimonial)}
                      loading="lazy"
                      draggable={false}
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = fallbackImage;
                      }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-blue-500/0 transition-all duration-500 group-hover:bg-blue-500/15" />

                    {/* Google badge */}
                    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md sm:h-7 sm:w-7 lg:h-8 lg:w-8">
                      <FaGoogle className="text-[8px] sm:text-[10px] lg:text-xs" />
                    </div>

                    {/* View indicator */}
                    <div className="absolute bottom-[70px] right-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 sm:bottom-[80px] sm:h-8 sm:w-8 lg:bottom-[90px] lg:h-9 lg:w-9">
                      <FaEye className="text-[8px] sm:text-[10px] lg:text-xs" />
                    </div>

                    {/* Verified badge */}
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-white backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[8px]">
                      <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400 sm:h-1.5 sm:w-1.5" />
                      Verified
                    </div>

                    {/* Card info */}
                    <div className="absolute inset-x-0 bottom-0 p-3 text-left sm:p-4 lg:p-5">
                      <div className="mb-1 flex items-center gap-0.5 sm:mb-1.5">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <FaStar
                            key={starIndex}
                            className={`text-[8px] sm:text-[9px] lg:text-[10px] ${
                              starIndex < getRating(testimonial)
                                ? 'text-amber-400'
                                : 'text-white/30'
                            }`}
                          />
                        ))}
                      </div>

                      <h3 className="truncate text-sm font-black text-white sm:text-base lg:text-lg">
                        {getStudentName(testimonial)}
                      </h3>

                      <div className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-200 sm:mt-1 sm:gap-1.5 sm:text-[11px] lg:text-xs">
                        <FaGraduationCap className="shrink-0 text-cyan-300" />
                        <span className="truncate">
                          {getCourse(testimonial)}
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-2 right-3 text-[7px] font-semibold uppercase tracking-wider text-white/0 transition-all duration-300 group-hover:text-white/80 sm:text-[8px]">
                      Click to view
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Side fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-10 bg-gradient-to-r from-white to-transparent sm:w-20 lg:w-32" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-10 bg-gradient-to-l from-white to-transparent sm:w-20 lg:w-32" />
          </div>

          {/* ====================================================
              CONTROLS
          ==================================================== */}

          <div className="mt-4 flex flex-col items-center gap-3 sm:mt-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => rotateByStep(1)}
                aria-label="Rotate left"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-md shadow-blue-900/10 transition hover:-translate-y-0.5 hover:bg-blue-50 sm:h-11 sm:w-11"
              >
                <FaChevronLeft className="text-sm" />
              </button>

              <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-blue-700 sm:text-xs">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500" />
                Drag to rotate
              </div>

              <button
                type="button"
                onClick={() => rotateByStep(-1)}
                aria-label="Rotate right"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-md shadow-blue-900/10 transition hover:-translate-y-0.5 hover:bg-blue-50 sm:h-11 sm:w-11"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>

          {/* ====================================================
              BOTTOM TRUST INDICATORS
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] text-slate-400 sm:mt-8 sm:gap-x-6 sm:text-xs"
          >
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Real Student Experiences
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

            <span className="flex items-center gap-1.5">
              <FaHeart className="text-[8px] text-rose-400 sm:text-[10px]" />
              Practical Learning
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

            <span className="flex items-center gap-1.5">
              <FaGraduationCap className="text-[10px] text-blue-400 sm:text-xs" />
              Career Focused Training
            </span>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          MODAL
      ======================================================== */}

      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTestimonial(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-md sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:rounded-3xl lg:rounded-[32px]"
            >
              <button
                type="button"
                onClick={() => setSelectedTestimonial(null)}
                className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/70 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
                aria-label="Close preview"
              >
                <FaTimes className="text-sm sm:text-base" />
              </button>

              <div className="grid md:grid-cols-2">
                {/* Image section */}
                <div className="relative h-[280px] overflow-hidden sm:h-[350px] md:h-auto md:min-h-[500px]">
                  <img
                    src={getPhoto(selectedTestimonial)}
                    alt={getStudentName(selectedTestimonial)}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    <FaGoogle className="text-xs" />
                    Verified Review
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white sm:bottom-6 sm:left-6 sm:right-6">
                    <div className="mb-2 flex items-center gap-1 sm:mb-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar
                          key={index}
                          className={`text-xs sm:text-sm ${
                            index < getRating(selectedTestimonial)
                              ? 'text-amber-400'
                              : 'text-white/30'
                          }`}
                        />
                      ))}
                    </div>

                    <h3 className="text-xl font-black sm:text-2xl lg:text-3xl">
                      {getStudentName(selectedTestimonial)}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-200 sm:mt-2 sm:text-sm">
                      <FaGraduationCap className="text-cyan-300" />
                      {getCourse(selectedTestimonial)}
                    </div>
                  </div>
                </div>

                {/* Review section */}
                <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 sm:mb-6 sm:h-14 sm:w-14 sm:rounded-2xl">
                    <FaQuoteLeft className="text-lg sm:text-xl" />
                  </div>

                  <div className="mb-4 flex items-center gap-1 sm:mb-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar
                        key={index}
                        className={`text-base sm:text-lg ${
                          index < getRating(selectedTestimonial)
                            ? 'text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-500 sm:text-sm">
                      {getRating(selectedTestimonial)}/5
                    </span>
                  </div>

                  <p className="text-base font-medium leading-7 text-slate-600 sm:text-lg sm:leading-8">
                    "{getReview(selectedTestimonial)}"
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5 sm:mt-8 sm:pt-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 sm:h-11 sm:w-11">
                      <FaUserGraduate className="text-sm sm:text-base" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 sm:text-base">
                        {getStudentName(selectedTestimonial)}
                      </p>
                      <p className="text-[10px] text-slate-400 sm:text-xs">
                        Verified Student • Open IT Institute
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTestimonial(null)}
                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b3b64] hover:shadow-xl sm:mt-8 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaTimes className="text-xs sm:text-sm" />
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TestimonialsSection;

