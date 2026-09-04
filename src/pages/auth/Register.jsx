import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserGraduate,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaLaptopCode,
  FaGraduationCap,
  FaRocket,
  FaStar,
  FaTimesCircle,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/images/logo.png";


const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  /* =====================================================
     SUBMIT
  ====================================================== */

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      navigate("/student/dashboard", {
        replace: true,
      });
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };


  /* =====================================================
     FEATURES
  ====================================================== */

  const features = [
    {
      icon: FaGraduationCap,
      title: "প্রফেশনাল শিক্ষা",
      text: "আধুনিক প্রযুক্তিতে হাতে-কলমে শেখার সুযোগ",
    },
    {
      icon: FaLaptopCode,
      title: "বাস্তব প্রজেক্ট",
      text: "প্রজেক্ট ভিত্তিক শেখার মাধ্যমে দক্ষতা অর্জন",
    },
    {
      icon: FaRocket,
      title: "ক্যারিয়ার সাপোর্ট",
      text: "ক্যারিয়ার গঠনে প্রয়োজনীয় গাইডলাইন",
    },
  ];


  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020817] px-4 py-8 text-white sm:px-6">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Main Cyan Glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.24, 0.12],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]"
        />

        {/* Blue Glow */}
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 -top-32 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[110px]"
        />

        {/* Purple Glow */}
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[120px]"
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />

        {/* =================================================
            FLOATING PARTICLES
        ================================================== */}

        <motion.span
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.8, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute left-[12%] top-[20%] h-1.5 w-1.5 rounded-full bg-cyan-400"
        />

        <motion.span
          animate={{
            y: [0, 25, 0],
            opacity: [0.15, 0.7, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 1,
          }}
          className="absolute right-[15%] top-[18%] h-2 w-2 rounded-full bg-blue-400"
        />

        <motion.span
          animate={{
            y: [0, -25, 0],
            opacity: [0.15, 0.8, 0.15],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            delay: 0.7,
          }}
          className="absolute bottom-[20%] left-[17%] h-1.5 w-1.5 rounded-full bg-yellow-400"
        />

        <motion.span
          animate={{
            y: [0, 30, 0],
            opacity: [0.15, 0.8, 0.15],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            delay: 1.5,
          }}
          className="absolute bottom-[18%] right-[12%] h-1.5 w-1.5 rounded-full bg-purple-400"
        />

      </div>


      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 w-full max-w-6xl">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.97,
            y: 25,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]"
        >

          {/* =================================================
              LEFT SIDE
          ================================================== */}

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
              delay: 0.15,
            }}
            className="hidden lg:block"
          >

            {/* Logo */}

            <div className="mb-7 flex items-center gap-4">

              <div className="relative flex h-20 w-20 items-center justify-center">

                {/* Glow */}

                <motion.div
                  animate={{
                    scale: [0.85, 1.15, 0.85],
                    opacity: [0.15, 0.35, 0.15],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl"
                />

                {/* Rotating Ring */}

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full border border-cyan-400/20"
                />

                <img
                  src={logo}
                  alt="Open IT Institute"
                  className="relative z-10 h-16 w-16 object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                />

              </div>

              <div>

                <h1 className="text-3xl font-black tracking-tight">
                  Open IT
                </h1>

                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                  Institute
                </p>

              </div>

            </div>


            {/* Heading */}

            <h2 className="text-4xl font-black leading-[1.15] xl:text-5xl">

              আজই শুরু করুন

              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                আপনার ক্যারিয়ার
              </span>

            </h2>


            {/* Description */}

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
              Open IT Institute-এ আপনার নিজের অ্যাকাউন্ট তৈরি
              করুন এবং আধুনিক প্রযুক্তির মাধ্যমে দক্ষতা অর্জনের
              যাত্রা শুরু করুন।
            </p>


            {/* =================================================
                FEATURES
            ================================================== */}

            <div className="mt-7 space-y-3">

              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      x: -15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.45 + index * 0.12,
                    }}
                    className="group flex items-center gap-3"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-cyan-400 transition duration-300 group-hover:border-cyan-400/20 group-hover:bg-cyan-400/10">
                      <Icon />
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-200">
                        {feature.title}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {feature.text}
                      </p>

                    </div>

                  </motion.div>
                );
              })}

            </div>


            {/* =================================================
                TRUST AREA
            ================================================== */}

            <div className="mt-7 flex items-center gap-5">

              <div className="flex -space-x-2">

                {[1, 2, 3, 4].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{
                      y: -3,
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#020817] bg-gradient-to-br from-cyan-400/80 to-blue-600 text-[10px] font-bold"
                  >
                    <FaUserGraduate />
                  </motion.div>
                ))}

              </div>

              <div>

                <div className="flex items-center gap-1">

                  {[1, 2, 3, 4, 5].map((item) => (
                    <FaStar
                      key={item}
                      className="text-[10px] text-yellow-400"
                    />
                  ))}

                </div>

                <p className="mt-1 text-[10px] text-slate-500">
                  Join 2500+ Students
                </p>

              </div>

            </div>

          </motion.div>


          {/* =================================================
              REGISTER CARD
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.75,
              delay: 0.1,
            }}
            className="w-full"
          >

            {/* Glass Outer */}

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-1 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">

              {/* Glow */}

              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-[70px]" />

              <div className="relative rounded-[1.7rem] border border-white/[0.06] bg-[#081827]/90 p-6 sm:p-8">

                {/* =================================================
                    MOBILE LOGO
                ================================================== */}

                <div className="mb-6 text-center lg:hidden">

                  <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center">

                    <motion.div
                      animate={{
                        scale: [0.9, 1.1, 0.9],
                        opacity: [0.15, 0.35, 0.15],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl"
                    />

                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full border border-cyan-400/20"
                    />

                    <img
                      src={logo}
                      alt="Open IT Institute"
                      className="relative z-10 h-16 w-16 object-contain"
                    />

                  </div>

                  <h2 className="text-xl font-black">
                    Open IT Institute
                  </h2>

                  <p className="mt-1 text-xs text-cyan-400">
                    Learn • Build • Grow
                  </p>

                </div>


                {/* =================================================
                    REGISTER HEADER
                ================================================== */}

                <div className="mb-6 text-center">

                  <motion.div
                    initial={{
                      scale: 0,
                      rotate: -20,
                    }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.35,
                    }}
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.08)]"
                  >
                    <FaUserGraduate className="text-xl" />
                  </motion.div>

                  <h2 className="text-2xl font-black">
                    Create Account
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    আপনার Student Account তৈরি করুন
                  </p>

                </div>


                {/* =================================================
                    FORM
                ================================================== */}

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >

                  {/* =================================================
                      NAME
                  ================================================== */}

                  <div>

                    <div className="group relative">

                      <span
                        className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 transition ${
                          errors.name
                            ? "text-red-400"
                            : "text-slate-500 group-focus-within:text-cyan-400"
                        }`}
                      >
                        <FaUser />
                      </span>

                      <input
                        type="text"
                        id="name"
                        placeholder=" "
                        autoComplete="name"
                        {...register("name", {
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name is too short",
                          },
                        })}
                        className={`peer w-full rounded-xl border bg-white/[0.035] px-12 pb-2.5 pt-5 text-sm text-white outline-none transition duration-300 placeholder-transparent ${
                          errors.name
                            ? "border-red-500/60 focus:ring-4 focus:ring-red-500/10"
                            : "border-white/10 focus:border-cyan-400/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-cyan-400/5"
                        }`}
                      />

                      <label
                        htmlFor="name"
                        className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition-all duration-300 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold"
                      >
                        Full Name
                      </label>

                    </div>

                    <ErrorMessage
                      error={errors.name}
                    />

                  </div>


                  {/* =================================================
                      EMAIL
                  ================================================== */}

                  <div>

                    <div className="group relative">

                      <span
                        className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 transition ${
                          errors.email
                            ? "text-red-400"
                            : "text-slate-500 group-focus-within:text-cyan-400"
                        }`}
                      >
                        <FaEnvelope />
                      </span>

                      <input
                        type="email"
                        id="email"
                        placeholder=" "
                        autoComplete="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Invalid email address",
                          },
                        })}
                        className={`peer w-full rounded-xl border bg-white/[0.035] px-12 pb-2.5 pt-5 text-sm text-white outline-none transition duration-300 placeholder-transparent ${
                          errors.email
                            ? "border-red-500/60 focus:ring-4 focus:ring-red-500/10"
                            : "border-white/10 focus:border-cyan-400/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-cyan-400/5"
                        }`}
                      />

                      <label
                        htmlFor="email"
                        className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition-all duration-300 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold"
                      >
                        Email Address
                      </label>

                    </div>

                    <ErrorMessage
                      error={errors.email}
                    />

                  </div>


                  {/* =================================================
                      PHONE
                  ================================================== */}

                  <div>

                    <div className="group relative">

                      <span
                        className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 transition ${
                          errors.phone
                            ? "text-red-400"
                            : "text-slate-500 group-focus-within:text-cyan-400"
                        }`}
                      >
                        <FaPhone />
                      </span>

                      <input
                        type="tel"
                        id="phone"
                        placeholder=" "
                        autoComplete="tel"
                        {...register("phone", {
                          required: "Phone number is required",
                          minLength: {
                            value: 10,
                            message: "Invalid phone number",
                          },
                        })}
                        className={`peer w-full rounded-xl border bg-white/[0.035] px-12 pb-2.5 pt-5 text-sm text-white outline-none transition duration-300 placeholder-transparent ${
                          errors.phone
                            ? "border-red-500/60 focus:ring-4 focus:ring-red-500/10"
                            : "border-white/10 focus:border-cyan-400/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-cyan-400/5"
                        }`}
                      />

                      <label
                        htmlFor="phone"
                        className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition-all duration-300 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold"
                      >
                        Phone Number
                      </label>

                    </div>

                    <ErrorMessage
                      error={errors.phone}
                    />

                  </div>


                  {/* =================================================
                      PASSWORD
                  ================================================== */}

                  <div>

                    <div className="group relative">

                      <span
                        className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 transition ${
                          errors.password
                            ? "text-red-400"
                            : "text-slate-500 group-focus-within:text-cyan-400"
                        }`}
                      >
                        <FaLock />
                      </span>

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        id="password"
                        placeholder=" "
                        autoComplete="new-password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message:
                              "Password must be at least 6 characters",
                          },
                        })}
                        className={`peer w-full rounded-xl border bg-white/[0.035] px-12 pb-2.5 pt-5 text-sm text-white outline-none transition duration-300 placeholder-transparent ${
                          errors.password
                            ? "border-red-500/60 focus:ring-4 focus:ring-red-500/10"
                            : "border-white/10 focus:border-cyan-400/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-cyan-400/5"
                        }`}
                      />

                      <label
                        htmlFor="password"
                        className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition-all duration-300 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold"
                      >
                        Password
                      </label>


                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-slate-500 transition hover:scale-110 hover:text-cyan-400"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>

                    </div>

                    <ErrorMessage
                      error={errors.password}
                    />

                  </div>


                  {/* =================================================
                      PASSWORD NOTE
                  ================================================== */}

                  <div className="flex items-center gap-2 px-1 text-[10px] text-slate-500">

                    <FaCheckCircle className="text-green-400/70" />

                    Password must contain at least 6 characters.

                  </div>


                  {/* =================================================
                      SUBMIT BUTTON
                  ================================================== */}

                  <motion.button
                    whileHover={{
                      scale: isSubmitting ? 1 : 1.015,
                    }}
                    whileTap={{
                      scale: isSubmitting ? 1 : 0.985,
                    }}
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-[0_12px_35px_rgba(37,99,235,0.25)] transition duration-300 hover:shadow-[0_18px_45px_rgba(37,99,235,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {/* Shine */}

                    <motion.span
                      animate={{
                        x: ["-120%", "150%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-y-0 w-20 -skew-x-12 bg-white/15 blur-sm"
                    />

                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Creating Account...
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>

                        <FaArrowRight className="transition duration-300 group-hover:translate-x-1" />
                      </>
                    )}

                  </motion.button>

                </form>


                {/* =================================================
                    LOGIN LINK
                ================================================== */}

                <div className="mt-6 text-center">

                  <p className="text-xs text-slate-500">

                    Already have an account?{" "}

                    <Link
                      to="/login"
                      className="font-bold text-cyan-400 transition hover:text-cyan-300 hover:underline"
                    >
                      Sign In
                    </Link>

                  </p>

                </div>


                {/* =================================================
                    SECURITY
                ================================================== */}

                <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-5 text-[9px] uppercase tracking-wider text-slate-600">

                  <FaShieldAlt className="text-green-400/70" />

                  Your information is secure & protected

                </div>

              </div>
            </div>


            {/* Copyright */}

            <p className="mt-5 text-center text-[10px] text-slate-600">
              © {new Date().getFullYear()} Open IT Institute.
              All rights reserved.
            </p>

          </motion.div>

        </motion.div>


        {/* =====================================================
            MOBILE TRUST BADGES
        ====================================================== */}

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
            delay: 0.8,
          }}
          className="mt-7 flex items-center justify-center gap-3 lg:hidden"
        >

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 backdrop-blur-xl">

            <FaUserGraduate className="text-cyan-400" />

            <span className="text-[10px] text-slate-400">
              2500+ Students
            </span>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 backdrop-blur-xl">

            <FaRocket className="text-yellow-400" />

            <span className="text-[10px] text-slate-400">
              Career Focused
            </span>

          </div>

        </motion.div>

      </div>


      {/* =====================================================
          CORNER DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute left-5 top-5 hidden h-14 w-14 border-l border-t border-cyan-400/15 sm:block" />

      <div className="pointer-events-none absolute bottom-5 right-5 hidden h-14 w-14 border-b border-r border-cyan-400/15 sm:block" />

    </div>
  );
};


/* ============================================================
   ERROR MESSAGE COMPONENT
============================================================ */

const ErrorMessage = ({ error }) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{
            opacity: 0,
            height: 0,
            y: -5,
          }}
          animate={{
            opacity: 1,
            height: "auto",
            y: 0,
          }}
          exit={{
            opacity: 0,
            height: 0,
            y: -5,
          }}
          className="mt-1.5 flex items-center gap-1.5 px-1 text-[10px] text-red-400"
        >
          <FaTimesCircle />

          {error.message}
        </motion.p>
      )}
    </AnimatePresence>
  );
};


export default Register;