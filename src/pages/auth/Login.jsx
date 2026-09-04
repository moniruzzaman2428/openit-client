import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaGraduationCap,
  FaLaptopCode,
  FaBriefcase,
  FaArrowRight,
  FaShieldAlt,
  FaUserGraduate,
  FaRocket,
  FaStar,
  FaTimesCircle,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  /* =====================================================
     LOGIN SUBMIT
  ====================================================== */

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const user = await login(data.login, data.password);

      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, {
          replace: true,
        });
      } else if (user.role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard", {
          replace: true,
        });
      } else {
        navigate("/student/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      // Error handled by AuthContext
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
      title: "দক্ষতা অর্জন",
      description: "আধুনিক প্রযুক্তিতে হাতে-কলমে শিক্ষা",
    },
    {
      icon: FaLaptopCode,
      title: "প্রফেশনাল কোর্স",
      description: "ক্যারিয়ার ফোকাসড ট্রেনিং",
    },
    {
      icon: FaBriefcase,
      title: "ক্যারিয়ার সাপোর্ট",
      description: "চাকরি ও ফ্রিল্যান্সিং সহায়তা",
    },
  ];


  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020817] px-4 py-8 text-white sm:px-6">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Main glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]"
        />

        {/* Blue glow */}
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 -top-32 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[110px]"
        />

        {/* Purple glow */}
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

        {/* Small animated particles */}

        <motion.span
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute left-[12%] top-[25%] h-1.5 w-1.5 rounded-full bg-cyan-400"
        />

        <motion.span
          animate={{
            y: [0, 25, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 1,
          }}
          className="absolute right-[15%] top-[20%] h-2 w-2 rounded-full bg-blue-400"
        />

        <motion.span
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            delay: 0.5,
          }}
          className="absolute bottom-[20%] left-[18%] h-1.5 w-1.5 rounded-full bg-yellow-400"
        />

        <motion.span
          animate={{
            y: [0, 30, 0],
            opacity: [0.2, 0.8, 0.2],
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
          className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]"
        >

          {/* =================================================
              LEFT BRANDING
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

                {/* Logo glow */}
                <motion.div
                  animate={{
                    scale: [0.85, 1.15, 0.85],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl"
                />

                {/* Ring */}
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
                  src="/logo.png"
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

              আপনার সাফল্যের

              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                ডিজিটাল সঙ্গী
              </span>

            </h2>


            {/* Description */}

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
              বাংলাদেশের অন্যতম আধুনিক কম্পিউটার প্রশিক্ষণ
              কেন্দ্র। আমাদের সাথে শিখুন, দক্ষ হোন এবং গড়ে
              তুলুন আপনার উজ্জ্বল ক্যারিয়ার।
            </p>


            {/* Features */}

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
                        {feature.description}
                      </p>
                    </div>

                  </motion.div>
                );
              })}

            </div>


            {/* Trust */}

            <div className="mt-7 flex items-center gap-5">

              <div className="flex -space-x-2">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#020817] bg-gradient-to-br from-cyan-400/80 to-blue-600 text-[10px] font-bold"
                  >
                    <FaUserGraduate />
                  </div>
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
                  Trusted by 2500+ Students
                </p>

              </div>

            </div>

          </motion.div>


          {/* =================================================
              LOGIN CARD
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

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-1 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">

              {/* Card glow */}
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-[70px]" />

              <div className="relative rounded-[1.7rem] border border-white/[0.06] bg-[#081827]/90 p-6 sm:p-8">

                {/* =================================================
                    MOBILE LOGO
                ================================================== */}

                <div className="mb-7 text-center lg:hidden">

                  <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">

                    <motion.div
                      animate={{
                        scale: [0.9, 1.1, 0.9],
                        opacity: [0.2, 0.4, 0.2],
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
                      src="/logo.png"
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
                    LOGIN HEADER
                ================================================== */}

                <div className="mb-7 text-center">

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
                      delay: 0.4,
                    }}
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.08)]"
                  >
                    <FaLock className="text-xl" />
                  </motion.div>

                  <h2 className="text-2xl font-black text-white">
                    Welcome Back!
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    আপনার অ্যাকাউন্টে লগইন করুন
                  </p>

                </div>


                {/* =================================================
                    FORM
                ================================================== */}

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >

                  {/* =================================================
                      LOGIN INPUT
                  ================================================== */}

                  <div>

                    <div className="group relative">

                      <span
                        className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 transition duration-300 ${
                          errors.login
                            ? "text-red-400"
                            : "text-slate-500 group-focus-within:text-cyan-400"
                        }`}
                      >
                        <FaEnvelope />
                      </span>

                      <input
                        type="text"
                        id="login"
                        placeholder=" "
                        autoComplete="username"
                        {...register("login", {
                          required:
                            "Email, phone or Student ID is required",
                        })}
                        className={`peer w-full rounded-xl border bg-white/[0.035] px-12 pb-2.5 pt-5 text-sm text-white outline-none transition duration-300 placeholder-transparent ${
                          errors.login
                            ? "border-red-500/60 focus:ring-4 focus:ring-red-500/10"
                            : "border-white/10 focus:border-cyan-400/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-cyan-400/5"
                        }`}
                      />

                      <label
                        htmlFor="login"
                        className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold"
                      >
                        Email / Phone / Student ID
                      </label>

                    </div>


                    <AnimatePresence>
                      {errors.login && (
                        <motion.p
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="mt-1.5 flex items-center gap-1.5 px-1 text-[10px] text-red-400"
                        >
                          <FaTimesCircle />

                          {errors.login.message}
                        </motion.p>
                      )}
                    </AnimatePresence>

                  </div>


                  {/* =================================================
                      PASSWORD
                  ================================================== */}

                  <div>

                    <div className="group relative">

                      <span
                        className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 transition duration-300 ${
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
                        autoComplete="current-password"
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
                        className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold"
                      >
                        Password
                      </label>


                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-slate-500 transition duration-300 hover:scale-110 hover:text-cyan-400"
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


                    <AnimatePresence>
                      {errors.password && (
                        <motion.p
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="mt-1.5 flex items-center gap-1.5 px-1 text-[10px] text-red-400"
                        >
                          <FaTimesCircle />

                          {errors.password.message}
                        </motion.p>
                      )}
                    </AnimatePresence>

                  </div>


                  {/* =================================================
                      FORGOT PASSWORD
                  ================================================== */}

                  <div className="flex justify-end">

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300 hover:underline"
                    >
                      Forgot Password?
                    </Link>

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
                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-[0_12px_35px_rgba(37,99,235,0.25)] transition duration-300 hover:shadow-[0_18px_45px_rgba(37,99,235,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
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

                        Signing in...
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>

                        <FaArrowRight className="transition duration-300 group-hover:translate-x-1" />
                      </>
                    )}

                  </motion.button>

                </form>


                {/* =================================================
                    REGISTER
                ================================================== */}

                <div className="mt-6 text-center">

                  <p className="text-xs text-slate-500">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-bold text-cyan-400 transition hover:text-cyan-300 hover:underline"
                    >
                      Register
                    </Link>
                  </p>

                </div>


                {/* =================================================
                    SECURITY
                ================================================== */}

                <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-5 text-[9px] uppercase tracking-wider text-slate-600">

                  <FaShieldAlt className="text-green-400/70" />

                  Secure & Protected Login

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
            MOBILE TRUST
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
          className="mt-7 flex items-center justify-center gap-4 lg:hidden"
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

export default Login;