import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  FaGraduationCap,
  FaLaptopCode,
  FaUsers,
  FaBriefcase,
  FaHome,
  FaGlobe,
  FaCertificate,
  FaBullseye,
  FaHandsHelping,
  FaArrowRight,
  FaRocket,
  FaStar,
  FaCheckCircle,
} from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

// ============================================================
// FEATURES DATA
// ============================================================

const features = [
  {
    id: 1,
    icon: FaGraduationCap,
    title: 'শিক্ষার্থী ও শিক্ষা',
    desc: 'একাডেমিক পড়াশোনার পাশাপাশি হাতে-কলমে প্রযুক্তি শিখে শিক্ষার্থীদের ভবিষ্যৎ প্রস্তুত করা হয়।',
    color: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59, 130, 246, 0.35)',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    id: 2,
    icon: FaLaptopCode,
    title: 'তরুণ প্রফেশনাল',
    desc: 'কর্পোরেট চাকরি বা উদ্যোক্তা হয়ে উঠতে প্রয়োজনীয় প্রফেশনাল আইটি স্কিল ডেভেলপমেন্ট।',
    color: 'from-purple-500 to-indigo-500',
    glow: 'rgba(139, 92, 246, 0.35)',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    id: 3,
    icon: FaBriefcase,
    title: 'ফ্রিল্যান্সিং ক্যারিয়ার',
    desc: 'Fiverr, Upwork সহ গ্লোবাল মার্কেটপ্লেসে কাজ করে ডলার আয়ের সুনিশ্চিত পথ দেখায়।',
    color: 'from-green-500 to-emerald-500',
    glow: 'rgba(34, 197, 94, 0.35)',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  {
    id: 4,
    icon: FaUsers,
    title: 'নারী ক্ষমতায়ন',
    desc: 'ঘরে বসে আয়ের সুযোগ সৃষ্টি করে নারীদের স্বাবলম্বী, আত্মবিশ্বাসী এবং স্বাধীন করে গড়ে তোলে।',
    color: 'from-pink-500 to-rose-500',
    glow: 'rgba(236, 72, 153, 0.35)',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
  },
  {
    id: 5,
    icon: FaHome,
    title: 'গ্রামীণ বাংলাদেশ',
    desc: 'শহরের সমান আধুনিক প্রশিক্ষণ এখন প্রান্তিক জনপদে। কেন্দুয়া থেকে শুরু হয়েছে ডিজিটাল বিপ্লব।',
    color: 'from-orange-500 to-yellow-500',
    glow: 'rgba(251, 146, 60, 0.35)',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  {
    id: 6,
    icon: FaGlobe,
    title: 'বিশ্বব্যাপী সংযোগ',
    desc: 'স্থানীয়ভাবে শিখে আন্তর্জাতিক মানের সার্টিফিকেট অর্জন করে গ্লোবাল মার্কেটের সাথে যুক্ত হওয়া।',
    color: 'from-red-500 to-orange-500',
    glow: 'rgba(239, 68, 68, 0.35)',
    bg: 'bg-red-50',
    text: 'text-red-600',
  },
];

const trustBadges = [
  { icon: FaBullseye, title: 'ডিজিটাল ট্রান্সফরমেশন', color: 'text-blue-600 bg-blue-50' },
  { icon: FaHandsHelping, title: 'নিরবচ্ছিন্ন সহায়তা', color: 'text-red-500 bg-red-50' },
  { icon: FaLaptopCode, title: '২৪/৭ সরবরাহ', color: 'text-green-600 bg-green-50' },
  { icon: FaCertificate, title: 'সরকারি সার্টিফিকেট', color: 'text-purple-600 bg-purple-50' },
  { icon: FaGlobe, title: 'গ্লোবাল কানেকশন', color: 'text-cyan-600 bg-cyan-50' },
];

// ============================================================
// COMPONENT
// ============================================================

const WhyChooseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [rotation, setRotation] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [radius, setRadius] = useState(320);

  // ==========================================================
  // RESPONSIVE RADIUS
  // ==========================================================

  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      if (w < 1024) setRadius(280);
      else if (w < 1280) setRadius(300);
      else setRadius(340);
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // ==========================================================
  // ANIMATION LOOP
  // ==========================================================

  useEffect(() => {
    if (!isInView) return;

    let animationFrame;
    let lastTime = 0;
    const speed = 0.25;

    const animate = (time) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;

      if (!isHovering) {
        setRotation((prev) => (prev + speed * (delta / 16)) % 360);
      }

      lastTime = time;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, isHovering]);

  // ==========================================================
  // POSITION HELPER
  // ==========================================================

  const getPosition = (index, total, r, centerX, centerY) => {
    const angle =
      (index / total) * 2 * Math.PI - Math.PI / 2 + (rotation * Math.PI) / 180;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y, angle };
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 py-14 sm:py-16 lg:py-20">
      {/* ======================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 h-[300px] w-[300px] rounded-full bg-blue-200/40 blur-3xl sm:h-[400px] sm:w-[400px]"
        />

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -right-20 h-[300px] w-[300px] rounded-full bg-red-200/40 blur-3xl sm:h-[400px] sm:w-[400px]"
        />

        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/30 blur-3xl sm:h-[700px] sm:w-[700px]"
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#0f4c81 1px, transparent 1px), linear-gradient(90deg, #0f4c81 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ====================================================
            SECTION HEADER
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm sm:mb-5 sm:px-5">
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-red-500"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700 sm:text-xs">
              Why Choose Us
            </span>
          </div>

          <h2 className="mb-4 text-2xl font-black leading-tight text-slate-800 sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
            "দূরত্ব শুধু মানচিত্রে,{' '}
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              স্বপ্নের পথে নয়।"
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-600 sm:text-base lg:text-lg">
            একসাথে গড়ে তুলি আগামীর ডিজিটাল বাংলাদেশ। আমাদের আধুনিক ল্যাব,
            অভিজ্ঞ মেন্টর এবং যুগোপযোগী কারিকুলাম কেন আপনার সঠিক পছন্দ?
          </p>
        </motion.div>

        {/* ====================================================
            DESKTOP: CIRCULAR ROTATING LAYOUT
        ==================================================== */}

        <div
          ref={ref}
          className="relative hidden min-h-[750px] lg:block xl:min-h-[800px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* ==================================================
              CENTER LOGO
          ================================================== */}

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.2 }}
            className="absolute left-1/2 top-1/2 z-30 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-blue-50 bg-white shadow-2xl xl:h-56 xl:w-56"
          >
            {/* Rotating rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-[-20px] rounded-full border-2 border-dashed border-blue-300"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-[-40px] rounded-full border border-red-200"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-[-60px] rounded-full border border-dashed border-cyan-300"
            />

            {/* Glow */}
            <div className="pointer-events-none absolute inset-[-70px] rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-2xl" />

            {/* Pulsing particles */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <motion.div
                key={angle}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: (angle / 360) * 3,
                }}
                className="absolute h-2 w-2 rounded-full bg-blue-400"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateX(-110px)`,
                  transformOrigin: '0 0',
                }}
              />
            ))}

            {/* Logo content */}
            <div className="relative z-10 p-6 text-center">
              <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-blue-100 bg-white shadow-lg xl:h-32 xl:w-32">
                <img
                  src={logo}
                  alt="Open IT Institute Logo"
                  className="h-full w-full object-contain p-2"
                />
              </div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-3"
              >
                <span className="text-[10px] font-bold tracking-wider text-primary xl:text-xs">
                  OPEN IT INSTITUTE
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* ==================================================
              ROTATING FEATURE CARDS
          ================================================== */}

          {features.map((feature, index) => {
            const total = features.length;
            const centerX = 384;
            const centerY = 375;

            const position = getPosition(index, total, radius, centerX, centerY);

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        scale: 1,
                        x: position.x - centerX,
                        y: position.y - centerY,
                      }
                    : {}
                }
                transition={{
                  duration: 0.8,
                  delay: 0.3 + index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.12,
                  zIndex: 50,
                  transition: { duration: 0.2 },
                }}
                className="absolute left-1/2 top-1/2 w-[260px] -translate-x-1/2 -translate-y-1/2 xl:w-[290px]"
                style={{
                  transform: `translate(${position.x - centerX}px, ${position.y - centerY}px)`,
                }}
              >
                {/* Glow behind card */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-30 blur-xl"
                  style={{ background: feature.glow }}
                />

                <div className="group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-xl transition-all duration-300 hover:border-blue-300 hover:shadow-2xl">
                  <div className="mb-2 flex items-start gap-3">
                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg xl:h-12 xl:w-12`}
                    >
                      <feature.icon className="text-lg xl:text-xl" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-800 xl:text-base">
                        {feature.title}
                      </h3>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 xl:text-sm">
                    {feature.desc}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-600 transition-colors group-hover:text-blue-700">
                      Learn More
                    </span>

                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight className="text-[10px] text-blue-600" />
                    </motion.div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${feature.color}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* ==================================================
              ORNAMENTAL DOTS
          ================================================== */}

          {[...Array(24)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute h-1.5 w-1.5 rounded-full bg-blue-300/40"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 15 + rotation}deg) translateX(-${radius}px)`,
                transformOrigin: '0 0',
              }}
            />
          ))}
        </div>

        {/* ====================================================
            MOBILE & TABLET GRID
        ==================================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:hidden">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition-all hover:shadow-xl sm:p-6"
            >
              {/* Glow */}
              <div
                className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
                style={{ background: feature.glow }}
              />

              <div className="relative">
                <div className="mb-3 flex items-start gap-3 sm:gap-4">
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-md sm:h-12 sm:w-12`}
                  >
                    <feature.icon className="text-lg sm:text-xl" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-800 sm:text-base">
                      {feature.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
                  {feature.desc}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-600 sm:text-xs">
                    Learn More
                  </span>
                  <FaArrowRight className="text-[10px] text-blue-600 sm:text-xs" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ====================================================
            TRUST BADGES
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 md:grid-cols-3 lg:grid-cols-5"
        >
          {trustBadges.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex cursor-pointer flex-col items-center rounded-xl border border-gray-100 bg-white p-4 text-center shadow-md transition-all hover:shadow-lg sm:p-5"
            >
              <motion.div
                className={`mb-3 flex h-11 w-11 items-center justify-center rounded-full ${item.color} sm:h-12 sm:w-12`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <item.icon className="text-lg sm:text-xl" />
              </motion.div>

              <p className="text-[10px] font-bold leading-tight text-slate-700 sm:text-xs">
                {item.title}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ====================================================
            BOTTOM CTA
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:mt-16 sm:flex-row sm:gap-6"
        >
          <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <FaCheckCircle className="text-green-500" />
            <span>১০০% হাতে-কলমে প্রশিক্ষণ</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <FaStar className="text-amber-400" />
            <span>৫০০+ সন্তুষ্ট শিক্ষার্থী</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <FaRocket className="text-blue-500" />
            <span>ক্যারিয়ার গাইডলাইন</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSection;