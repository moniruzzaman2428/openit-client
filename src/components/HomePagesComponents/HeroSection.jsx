import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion';
import { useEffect, useRef } from 'react';
import {
  FaArrowRight,
  FaCheckCircle,
  FaLaptopCode,
  FaUserGraduate,
  FaClock,
  FaAward,
  FaPlayCircle,
  FaCode,
  FaReact,
  FaPython,
  FaDatabase,
  FaCloud,
  FaRocket,
  FaShieldAlt,
  FaStar,
  FaUsers,
  FaChartLine,
  FaBookOpen,
  FaCrown
} from 'react-icons/fa';
import { SiJavascript, SiTypescript, SiNextdotjs } from 'react-icons/si';
import logo from '../../assets/images/logo.png'; // আপনার লোগো পাথ দিন

const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // 3D Tilt Effect for cards
  const x = useMotionValue(0);
  const yRotation = useMotionValue(0);
  const rotateX = useSpring(yRotation, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(x, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateXValue = (e.clientY - centerY) / 20;
    const rotateYValue = (e.clientX - centerX) / 20;
    yRotation.set(-rotateXValue);
    x.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    yRotation.set(0);
    x.set(0);
  };

  const stats = [
    { number: '2500+', label: 'Students Trained', icon: FaUsers, color: 'from-blue-500 to-cyan-400' },
    { number: '95%', label: 'Success Rate', icon: FaChartLine, color: 'from-green-500 to-emerald-400' },
    { number: '30+', label: 'Expert Instructors', icon: FaCrown, color: 'from-yellow-500 to-orange-400' },
    { number: '15+', label: 'Career Courses', icon: FaBookOpen, color: 'from-purple-500 to-pink-400' }
  ];

  const floatingIcons = [
    { icon: FaReact, color: '#61DAFB', delay: 0 },
    { icon: SiJavascript, color: '#F7DF1E', delay: 0.5 },
    { icon: FaPython, color: '#3776AB', delay: 1 },
    { icon: FaDatabase, color: '#4479A1', delay: 1.5 },
    { icon: SiTypescript, color: '#3178C6', delay: 2 },
    { icon: SiNextdotjs, color: '#000000', delay: 2.5 },
    { icon: FaCloud, color: '#00B4D8', delay: 3 },
    { icon: FaCode, color: '#FF6B6B', delay: 3.5 }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-[#0a1a2f] via-[#071d34] to-[#0b253f] text-white"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, -50, 0, 50, 0],
            scale: [1, 1.2, 1, 0.8, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-secondary/30 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0, 80, 0],
            y: [0, 60, 0, -60, 0],
            scale: [1, 0.8, 1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 h-[700px] w-[700px] rounded-full bg-accent/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0, -50, 0],
            y: [0, -30, 0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/15 blur-3xl"
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating Tech Icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute hidden lg:block"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              y: [0, -30, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut"
            }}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              color: item.color,
              fontSize: `${20 + Math.random() * 20}px`
            }}
          >
            <item.icon className="opacity-20" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8 lg:py-20">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 order-2 lg:order-1"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-secondary/20 backdrop-blur-sm">
              <img src={logo} alt="Open IT Institute" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <span className="text-sm font-bold text-white/90">OPEN IT</span>
              <span className="block text-[10px] font-medium text-white/40 tracking-widest">INSTITUTE</span>
            </div>
          </motion.div>

          {/* Status Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-xl shadow-lg"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
            </span>
            ভর্তি চলছে — নতুন ব্যাচ শুরু হচ্ছে
            <span className="hidden sm:inline-block text-white/40">|</span>
            <span className="hidden sm:inline-block text-white/60">
              সীমিত আসন
            </span>
          </motion.span>

          {/* Main Heading */}
          <motion.h1 
            className="max-w-3xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            ডিজিটাল দক্ষতায়
            <motion.span 
              className="mt-2 block bg-gradient-to-r from-white via-cyan-100 to-accent bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            >
              গড়ে উঠুক আপনার ভবিষ্যৎ
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            আধুনিক প্রযুক্তি, প্র্যাকটিক্যাল ক্লাস এবং ক্যারিয়ার ফোকাসড
            প্রশিক্ষণের মাধ্যমে নিজের দক্ষতাকে পরবর্তী স্তরে নিয়ে যান{' '}
            <span className="font-semibold text-white">Open IT Institute</span>
            -এর সাথে।
          </motion.p>

          {/* Features List */}
          <motion.div 
            className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75 sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { icon: FaCheckCircle, label: 'Practical Training' },
              { icon: FaAward, label: 'Career Support' },
              { icon: FaUserGraduate, label: 'Expert Mentors' },
              { icon: FaClock, label: 'Flexible Schedule' },
            ].map(({ icon: Icon, label }) => (
              <motion.span 
                key={label} 
                className="inline-flex items-center gap-2.5"
                whileHover={{ scale: 1.05, color: '#ffffff' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Icon className="text-accent text-sm" />
                {label}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ y: -5, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link
                to="/admission"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-secondary px-8 py-4 font-extrabold text-dark shadow-[0_20px_50px_rgba(0,0,0,.25)] transition-all hover:shadow-[0_25px_60px_rgba(0,0,0,.35)] hover:brightness-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  ভর্তি হোন এখনই
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </span>
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 transition-opacity group-hover:opacity-100"
                  initial={false}
                />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link
                to="/courses"
                className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/25 shadow-lg"
              >
                <FaPlayCircle className="text-accent animate-pulse" />
                কোর্স দেখুন
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="mt-10 flex items-center gap-8 border-t border-white/5 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-[#071d34] bg-gradient-to-br from-white/20 to-white/5"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ scale: 1.1, borderColor: '#F59E0B' }}
                />
              ))}
            </div>
            <div>
              <motion.p 
                className="text-sm font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                ২৫০০+ শিক্ষার্থী
              </motion.p>
              <p className="text-xs text-white/50">আমাদের সাথে যুক্ত</p>
            </div>
            <motion.div 
              className="flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <FaStar key={i} className="text-yellow-400 text-sm" />
              ))}
              <span className="ml-2 text-sm text-white/50">4.9/5</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative order-1 hidden min-h-[600px] lg:block"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1000 }}
        >
          <motion.div
            style={{ rotateX, rotateY }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative h-full w-full"
          >
            {/* Main Image Card */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-4 top-5 w-[450px] rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-2xl backdrop-blur-2xl"
            >
              {/* Header with Logo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 p-1.5">
                    <img src={logo} alt="Open IT" className="h-6 w-6 object-contain" />
                  </div>
                  <span className="text-xs font-bold text-white/80">OPEN IT</span>
                </div>
                <span className="rounded-full bg-accent/20 px-3 py-1 text-[10px] font-bold text-accent backdrop-blur-sm">
                  Career Learning
                </span>
              </div>

              {/* Hero Image */}
              <div className="mt-6 relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800" 
                  alt="Students learning" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071d34]/80 to-transparent" />
                
                {/* Play Button Overlay */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/90 shadow-2xl cursor-pointer">
                    <FaPlayCircle className="text-3xl text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Stats Grid */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {stats.slice(0, 4).map((stat, index) => (
                  <motion.div
                    key={index}
                    className="group relative overflow-hidden rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <stat.icon className="text-accent text-lg mb-2" />
                    <p className="text-xl font-black text-white">{stat.number}</p>
                    <p className="mt-1 text-[10px] text-white/50">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Floating Badges */}
            <motion.div
              animate={{ 
                y: [0, 12, 0],
                rotate: [0, 3, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-16 -right-8 w-60 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
                  <FaLaptopCode className="text-2xl" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">প্র্যাকটিক্যাল প্রজেক্ট</p>
                  <p className="text-[10px] text-white/50">বাস্তব প্রজেক্ট তৈরি করে শিখুন</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -2, 0]
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-32 -left-6 w-52 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                  <FaCheckCircle className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">৯৫%</p>
                  <p className="text-[10px] text-white/40">সন্তুষ্টি হার</p>
                </div>
              </div>
            </motion.div>

            {/* Premium Badge */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 right-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-400 px-4 py-2 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <FaRocket className="text-white" />
                <span className="text-xs font-bold text-white">Premium Course</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#071d34] to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;