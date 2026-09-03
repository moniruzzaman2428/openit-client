import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

import {
  FaArrowRight,
  FaCheckCircle,
  FaLaptopCode,
  FaUserGraduate,
  FaAward,
  FaPlayCircle,
  FaRocket,
  FaStar,
  FaUsers,
  FaChartLine,
  FaBookOpen,
  FaCrown,
  FaShieldAlt,
  FaCertificate,
} from "react-icons/fa";

import {
  SiReact,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiMongodb,
  SiNodedotjs,
} from "react-icons/si";

import logo from "../../assets/images/logo.png";

const HeroSection = () => {
  /* =====================================================
     MOUSE 3D EFFECT
  ====================================================== */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [6, -6]),
    {
      stiffness: 180,
      damping: 22,
    }
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-6, 6]),
    {
      stiffness: 180,
      damping: 22,
    }
  );

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  /* =====================================================
     TYPING ANIMATION
  ====================================================== */

  const typingTexts = [
    "Open IT Institute",
    "ডিজিটাল দক্ষতার নতুন দিগন্ত",
    "ক্যারিয়ার গড়ার স্মার্ট প্ল্যাটফর্ম",
  ];

  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = typingTexts[textIndex];

    const speed = isDeleting ? 45 : 85;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(
          currentText.substring(0, displayText.length + 1)
        );

        if (displayText.length + 1 === currentText.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setDisplayText(
          currentText.substring(0, displayText.length - 1)
        );

        if (displayText.length === 0) {
          setIsDeleting(false);
          setTextIndex(
            (prev) => (prev + 1) % typingTexts.length
          );
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex]);

  /* =====================================================
     STATS
  ====================================================== */

  const stats = [
    {
      number: "২৫০০+",
      label: "শিক্ষার্থী",
      icon: FaUsers,
    },
    {
      number: "৯৫%",
      label: "সাফল্যের হার",
      icon: FaChartLine,
    },
    {
      number: "৩০+",
      label: "ইনস্ট্রাক্টর",
      icon: FaCrown,
    },
    {
      number: "১৫+",
      label: "কোর্স",
      icon: FaBookOpen,
    },
  ];

  /* =====================================================
     FEATURES
  ====================================================== */

  const features = [
    "প্রফেশনাল ও হাতে-কলমে প্রশিক্ষণ",
    "ক্যারিয়ার ফোকাসড কোর্স",
    "কোর্স শেষে লাইফটাইম সাপোর্ট",
  ];

  /* =====================================================
     TECHNOLOGIES
  ====================================================== */

  const technologies = [
    {
      icon: SiReact,
      name: "React",
      color: "text-cyan-400",
      position: "top-[5%] left-[4%]",
    },
    {
      icon: SiJavascript,
      name: "JavaScript",
      color: "text-yellow-300",
      position: "top-[6%] right-[4%]",
    },
    {
      icon: SiTypescript,
      name: "TypeScript",
      color: "text-blue-400",
      position: "bottom-[10%] left-[3%]",
    },
    {
      icon: SiNextdotjs,
      name: "Next.js",
      color: "text-white",
      position: "bottom-[9%] right-[3%]",
    },
    {
      icon: SiMongodb,
      name: "MongoDB",
      color: "text-green-400",
      position: "top-[42%] -left-[6%]",
    },
    {
      icon: SiNodedotjs,
      name: "Node.js",
      color: "text-green-500",
      position: "top-[42%] -right-[6%]",
    },
  ];

  return (
    <section className="relative isolate h-auto min-h-[600px] overflow-hidden bg-[#06111f] text-white lg:min-h-[650px]">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(0,190,255,0.15),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(79,70,229,0.13),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(0,212,255,0.08),transparent_35%)]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Left Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-[110px]"
      />

      {/* Right Glow */}
      <motion.div
        animate={{
          scale: [1.15, 1, 1.15],
          opacity: [0.1, 0.22, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]"
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[600px] max-w-7xl items-center px-4 py-10 sm:px-6 lg:min-h-[650px] lg:px-8 lg:py-12">

        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">

          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <div className="max-w-2xl">

            {/* Status */}
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
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-300 backdrop-blur-md sm:text-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
              </span>

              ভর্তি চলছে — সীমিত আসন
            </motion.div>

            {/* Heading */}
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
            >
              <p className="mb-2 text-base font-medium text-slate-400">
                স্বাগতম
              </p>

              <h1 className="min-h-[90px] text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:min-h-[105px] lg:text-6xl">
                <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  {displayText}
                </span>

                <span className="ml-1 animate-pulse text-cyan-400">
                  |
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
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
                delay: 0.2,
              }}
              className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base"
            >
              আধুনিক প্রযুক্তি ও বাস্তবভিত্তিক প্রশিক্ষণের মাধ্যমে
              নিজেকে দক্ষ করে তুলুন। আপনার শেখার পথকে রূপ দিন
              একটি সফল ক্যারিয়ারে।
            </motion.p>

            {/* Features */}
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
                delay: 0.3,
              }}
              className="mt-5 flex flex-wrap gap-x-5 gap-y-2"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs text-slate-200 sm:text-sm"
                >
                  <FaCheckCircle className="shrink-0 text-cyan-400" />

                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Buttons */}
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
                delay: 0.4,
              }}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/admission"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold shadow-[0_12px_35px_rgba(6,182,212,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(6,182,212,0.35)]"
              >
                ভর্তি হতে চাই

                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/courses"
                className="group inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.08]"
              >
                <FaPlayCircle className="text-cyan-400" />

                কোর্সগুলো দেখুন
              </Link>
            </motion.div>

            {/* Stats */}
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
                delay: 0.5,
              }}
              className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={index}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
                  >
                    <Icon className="mb-1.5 text-sm text-cyan-400" />

                    <div className="text-lg font-black sm:text-xl">
                      {stat.number}
                    </div>

                    <div className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative mx-auto w-full max-w-[520px]"
          >

            {/* Technology Icons */}
            <div className="pointer-events-none absolute inset-0 z-20 hidden sm:block">

              {technologies.map((tech, index) => {
                const Icon = tech.icon;

                return (
                  <motion.div
                    key={tech.name}
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 3, 0],
                    }}
                    transition={{
                      duration: 4 + index * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2,
                    }}
                    className={`absolute ${tech.position} flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/85 shadow-xl backdrop-blur-xl`}
                  >
                    <Icon
                      className={`text-lg ${tech.color}`}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* 3D Dashboard */}
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformPerspective: 1200,
              }}
              className="relative rounded-[1.8rem] border border-white/10 bg-white/[0.055] p-2.5 shadow-[0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-4"
            >

              {/* Dashboard */}
              <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#081827]">

                {/* Browser Bar */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">

                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                    <FaShieldAlt className="text-green-400" />

                    Secure Learning Platform
                  </div>
                </div>

                {/* Dashboard Body */}
                <div className="px-4 pb-4 pt-4 sm:px-5">

                  {/* Header */}
                  <div className="mb-3 flex items-center justify-between">

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-cyan-400">
                        Open IT Institute
                      </p>

                      <h3 className="mt-1 text-lg font-bold sm:text-xl">
                        Learn. Build. Grow.
                      </h3>
                    </div>

                    <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-2.5">
                      <FaAward className="text-lg text-yellow-300" />
                    </div>
                  </div>

                  {/* Logo Section */}
                  <div className="relative flex h-[190px] items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/10 bg-gradient-to-br from-[#0b2136] via-[#071827] to-[#06111f] sm:h-[215px]">

                    {/* Ring */}
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 28,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute h-44 w-44 rounded-full border border-cyan-400/10 sm:h-52 sm:w-52"
                    />

                    <motion.div
                      animate={{
                        rotate: -360,
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute h-32 w-32 rounded-full border border-blue-500/10 sm:h-40 sm:w-40"
                    />

                    {/* Glow */}
                    <div className="absolute h-36 w-36 rounded-full bg-cyan-400/10 blur-[55px]" />

                    {/* Logo */}
                    <motion.div
                      animate={{
                        y: [0, -6, 0],
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative z-10 flex h-28 w-28 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5 shadow-[0_0_50px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:h-32 sm:w-32"
                    >
                      <img
                        src={logo}
                        alt="Open IT Institute"
                        className="h-full w-full object-contain"
                      />
                    </motion.div>

                    {/* Rating */}
                    <motion.div
                      animate={{
                        y: [0, -4, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute left-3 top-3 rounded-xl border border-white/10 bg-slate-950/75 px-2.5 py-2 shadow-xl backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-1.5">

                        <FaStar className="text-xs text-yellow-400" />

                        <div>
                          <p className="text-xs font-bold">
                            4.9/5
                          </p>

                          <p className="text-[8px] text-slate-500">
                            Student Rating
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Success */}
                    <motion.div
                      animate={{
                        y: [0, 4, 0],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute bottom-3 right-3 rounded-xl border border-white/10 bg-slate-950/75 px-2.5 py-2 shadow-xl backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-1.5">

                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-400/10">
                          <FaChartLine className="text-xs text-green-400" />
                        </div>

                        <div>
                          <p className="text-xs font-bold">
                            95%
                          </p>

                          <p className="text-[8px] text-slate-500">
                            Success Rate
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Cards */}
                  <div className="mt-3 grid grid-cols-2 gap-2.5">

                    {/* Students */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">

                      <div className="flex items-center gap-2.5">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10">
                          <FaUserGraduate className="text-sm text-cyan-400" />
                        </div>

                        <div>
                          <p className="text-sm font-black">
                            2500+
                          </p>

                          <p className="text-[9px] text-slate-500">
                            Active Students
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Courses */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">

                      <div className="flex items-center gap-2.5">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/10">
                          <FaLaptopCode className="text-sm text-purple-400" />
                        </div>

                        <div>
                          <p className="text-sm font-black">
                            15+
                          </p>

                          <p className="text-[9px] text-slate-500">
                            Professional Courses
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-2.5 rounded-xl border border-white/10 bg-white/[0.035] p-3">

                    <div className="mb-2 flex items-center justify-between">

                      <div className="flex items-center gap-1.5">
                        <FaRocket className="text-xs text-cyan-400" />

                        <span className="text-[10px] font-semibold">
                          Career Growth
                        </span>
                      </div>

                      <span className="text-[10px] text-cyan-400">
                        95%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">

                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: "95%",
                        }}
                        transition={{
                          duration: 1.5,
                          delay: 0.8,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      />

                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Badge */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
                delay: 0.9,
              }}
              className="absolute -bottom-4 left-1/2 z-30 -translate-x-1/2"
            >
              <div className="flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-yellow-400/20 bg-slate-950/90 px-4 py-2.5 shadow-2xl backdrop-blur-xl">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400/10">
                  <FaCertificate className="text-sm text-yellow-300" />
                </div>

                <div>
                  <p className="text-[9px] font-bold text-yellow-300">
                    PROFESSIONAL TRAINING
                  </p>

                  <p className="text-[8px] text-slate-500">
                    Learn From Industry Experts
                  </p>
                </div>

              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#06111f] to-transparent" />
    </section>
  );
};

export default HeroSection;