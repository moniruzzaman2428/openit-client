import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaYoutube,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaArrowRight,
  FaHeadset,
  FaComments,
  FaLocationArrow,
  FaUser,
} from 'react-icons/fa';

import { sendContactMessage } from '../../services/contentService';
import SEO from '../../components/seo/SEO';

import StructuredData, {
  contactPageSchema,
  organizationSchema,
  breadcrumbSchema,
} from '../../components/seo/StructuredData';


const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await sendContactMessage(data);

      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'We will get back to you soon.',
        confirmButtonColor: '#0F4C81',
        background: '#fff',
        timer: 2500,
        timerProgressBar: true,
      });

      reset();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text:
          err.response?.data?.message ||
          'Please try again.',
        confirmButtonColor: '#0F4C81',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // --------------------------------------------------
  // CONTACT INFORMATION
  // --------------------------------------------------
  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'ঠিকানা',
      value:
        'উপজেলা রোড, শান্তিবাগ (NRBC ব্যাংক সংলগ্ন), কেন্দুয়া, নেত্রকোনা।',
      color: 'from-red-500 to-orange-500',
      glow: 'group-hover:shadow-red-500/20',
    },
    {
      icon: FaPhone,
      title: 'ফোন নম্বর',
      value: '+880 1616-160869\n+880 1707-530810',
      color: 'from-blue-500 to-cyan-500',
      glow: 'group-hover:shadow-blue-500/20',
    },
    {
      icon: FaEnvelope,
      title: 'ইমেইল',
      value: 'openitinstitute@gmail.com',
      color: 'from-purple-500 to-pink-500',
      glow: 'group-hover:shadow-purple-500/20',
    },
    {
      icon: FaClock,
      title: 'অফিস সময়',
      value:
        'শনি - বৃহস্পতি: সকাল ৯টা - রাত ৮টা\nশুক্রবার: বন্ধ',
      color: 'from-green-500 to-emerald-500',
      glow: 'group-hover:shadow-green-500/20',
    },
  ];


  // --------------------------------------------------
  // HERO FLOATING PARTICLES
  // --------------------------------------------------
  const particles = [
    { left: '7%', top: '22%', size: 5, delay: 0 },
    { left: '15%', top: '70%', size: 4, delay: 1.2 },
    { left: '28%', top: '35%', size: 6, delay: 2 },
    { left: '42%', top: '78%', size: 4, delay: 0.8 },
    { left: '55%', top: '24%', size: 5, delay: 1.5 },
    { left: '68%', top: '68%', size: 6, delay: 2.5 },
    { left: '78%', top: '30%', size: 4, delay: 0.4 },
    { left: '88%', top: '72%', size: 5, delay: 1.8 },
    { left: '94%', top: '20%', size: 4, delay: 2.2 },
  ];


  return (
    <div className="overflow-hidden bg-gray-50">

      {/* ==========================================
          SEO
      ========================================== */}
      <SEO
        title="যোগাযোগ"
        description="ওপেন আইটি ইনস্টিটিউট, উপজেলা রোড, শান্তিবাগ, কেন্দুয়া, নেত্রকোনায় যোগাযোগ করুন।"
        path="/contact"
      />

      <StructuredData
        data={[
          organizationSchema(),
          contactPageSchema(),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Contact', url: '/contact' },
          ]),
        ]}
      />


      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section className="relative min-h-[560px] md:min-h-[620px] flex items-center overflow-hidden bg-gradient-to-br from-[#06111f] via-[#0b2440] to-[#07111d] text-white">

        {/* ------------------------------------------
            Animated Background Grid
        ------------------------------------------ */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)',
              backgroundSize: '55px 55px',
            }}
          />
        </div>


        {/* ------------------------------------------
            Glow Orbs
        ------------------------------------------ */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -70, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-blue-500/20 blur-[100px]"
        />

        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 60, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-40 -right-32 w-[480px] h-[480px] rounded-full bg-cyan-400/20 blur-[110px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-blue-400/10 blur-[80px]"
        />


        {/* ------------------------------------------
            Floating Particles
        ------------------------------------------ */}
        {particles.map((particle, index) => (
          <motion.span
            key={index}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + (index % 3),
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full bg-cyan-300"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              boxShadow: '0 0 15px rgba(103,232,249,0.8)',
            }}
          />
        ))}


        {/* ==========================================
            ANIMATED CONNECTION NETWORK
        ========================================== */}

        {/* Horizontal Connection */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: 2,
            delay: 0.5,
            ease: 'easeOut',
          }}
          className="absolute left-[8%] right-[8%] top-[30%] h-px origin-left bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
        />

        {/* Diagonal Lines */}
        <motion.div
          animate={{
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute left-[18%] top-[30%] w-[28%] h-px rotate-[18deg] origin-left bg-gradient-to-r from-cyan-400/50 to-transparent"
        />

        <motion.div
          animate={{
            opacity: [0.1, 0.45, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 1,
          }}
          className="absolute right-[18%] top-[30%] w-[28%] h-px -rotate-[18deg] origin-right bg-gradient-to-l from-cyan-400/50 to-transparent"
        />


        {/* ------------------------------------------
            Animated Connection Nodes
        ------------------------------------------ */}
        {[
          {
            left: '14%',
            top: '30%',
            delay: 0,
          },
          {
            left: '28%',
            top: '38%',
            delay: 1,
          },
          {
            left: '72%',
            top: '38%',
            delay: 2,
          },
          {
            left: '86%',
            top: '30%',
            delay: 1.5,
          },
        ].map((node, index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.35, 1, 0.35],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: node.delay,
            }}
            className="absolute w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.9)]"
            style={{
              left: node.left,
              top: node.top,
            }}
          />
        ))}


        {/* ------------------------------------------
            Animated Mail / Contact Icon
        ------------------------------------------ */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute right-[9%] bottom-[18%] hidden md:flex"
        >
          <div className="relative">

            <motion.div
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-2xl bg-cyan-400"
            />

            <div className="relative w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
              <FaEnvelope className="text-2xl text-cyan-300" />
            </div>
          </div>
        </motion.div>


        {/* ------------------------------------------
            Floating Phone Icon
        ------------------------------------------ */}
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, 8, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-[8%] bottom-[18%] hidden md:flex"
        >
          <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-300/20 backdrop-blur-md flex items-center justify-center">
            <FaPhone className="text-xl text-blue-300" />
          </div>
        </motion.div>


        {/* ==========================================
            HERO CONTENT
        ========================================== */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            initial={{
              opacity: 0,
              y: 45,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
            className="text-center max-w-4xl mx-auto"
          >

            {/* Top Label */}
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
                delay: 0.15,
              }}
              className="inline-flex items-center gap-3 mb-6 px-5 py-2.5 rounded-full border border-cyan-300/20 bg-white/5 backdrop-blur-md"
            >
              <motion.span
                animate={{
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]"
              />

              <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-cyan-300">
                CONTACT US
              </span>

              <FaArrowRight className="text-xs text-cyan-300" />
            </motion.div>


            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">

              আমরা আপনার{' '}

              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-[length:200%_auto]"
              >
                সাথে আছি
              </motion.span>
            </h1>


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
                duration: 0.7,
                delay: 0.45,
              }}
              className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/70 leading-relaxed"
            >
              ভর্তি, কোর্স বা যেকোনো তথ্যের জন্য
              আমাদের সাথে যোগাযোগ করুন।
              <br className="hidden sm:block" />
              আমরা দ্রুত আপনার প্রশ্নের উত্তর দেওয়ার চেষ্টা করি।
            </motion.p>


            {/* Mini Stats */}
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
                delay: 0.65,
              }}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <FaHeadset className="text-cyan-300" />
                <span className="text-sm text-white/80">
                  দ্রুত সাপোর্ট
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <FaComments className="text-blue-300" />
                <span className="text-sm text-white/80">
                  সহজ যোগাযোগ
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <FaLocationArrow className="text-cyan-300" />
                <span className="text-sm text-white/80">
                  কেন্দুয়া, নেত্রকোনা
                </span>
              </div>

            </motion.div>

          </motion.div>
        </div>


        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />

      </section>


      {/* ==========================================
          MAIN CONTACT CONTENT
      ========================================== */}
      <section className="relative py-16 md:py-20 bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          {/* ========================================
              CONTACT INFO CARDS
          ======================================== */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-14">

            {contactInfo.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    y: -10,
                  }}
                  className={`group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-2xl ${item.glow} transition-all duration-300 overflow-hidden`}
                >

                  {/* Card Glow */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gray-100 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

                  {/* Icon */}
                  <motion.div
                    whileHover={{
                      rotate: [0, -8, 8, 0],
                      scale: 1.08,
                    }}
                    className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-lg mb-5`}
                  >
                    <Icon className="text-xl" />

                    <span className="absolute inset-0 rounded-2xl ring-1 ring-white/30" />
                  </motion.div>

                  <h3 className="relative font-bold text-gray-800 text-lg mb-2">
                    {item.title}
                  </h3>

                  <p className="relative text-sm text-gray-500 whitespace-pre-line leading-relaxed">
                    {item.value}
                  </p>

                  {/* Bottom Accent */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  />

                </motion.div>
              );
            })}

          </div>


          {/* ========================================
              FORM + MAP
          ======================================== */}
          <div className="grid lg:grid-cols-5 gap-7 lg:gap-8 items-start">


            {/* ======================================
                CONTACT FORM
            ====================================== */}
            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.7,
              }}
              className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden"
            >

              {/* Form Header */}
              <div className="relative p-6 sm:p-8 border-b border-gray-100 overflow-hidden">

                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-blue-500/5" />

                <div className="relative flex items-start gap-4">

                  <motion.div
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 text-white flex items-center justify-center shadow-lg shrink-0"
                  >
                    <FaPaperPlane />
                  </motion.div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      আপনার বার্তা পাঠান
                    </h2>

                    <p className="text-gray-500 text-sm mt-1.5">
                      যেকোনো প্রশ্ন বা ভর্তি সংক্রান্ত তথ্যের জন্য
                      ফর্মটি পূরণ করুন।
                    </p>
                  </div>

                </div>
              </div>


              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 sm:p-8 space-y-5"
              >

                {/* Name + Phone */}
                <div className="grid sm:grid-cols-2 gap-5">

                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FaUser className="text-primary text-xs" />
                      আপনার নাম *
                    </label>

                    <input
                      {...register('name', {
                        required: 'নামটি অবশ্যই দিতে হবে',
                      })}
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        errors.name
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-primary'
                      } bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-300`}
                      placeholder="আপনার নাম লিখুন"
                    />

                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{
                            opacity: 0,
                            y: -5,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                          }}
                          className="text-red-500 text-xs mt-1.5"
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>


                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FaPhone className="text-primary text-xs" />
                      ফোন নম্বর *
                    </label>

                    <input
                      {...register('phone', {
                        required:
                          'ফোন নম্বরটি অবশ্যই দিতে হবে',
                      })}
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        errors.phone
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-primary'
                      } bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-300`}
                      placeholder="01XXXXXXXXX"
                    />

                    <AnimatePresence>
                      {errors.phone && (
                        <motion.p
                          initial={{
                            opacity: 0,
                            y: -5,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                          }}
                          className="text-red-500 text-xs mt-1.5"
                        >
                          {errors.phone.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                </div>


                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="text-primary text-xs" />
                    ইমেইল *
                  </label>

                  <input
                    type="email"
                    {...register('email', {
                      required:
                        'ইমেইলটি অবশ্যই দিতে হবে',
                    })}
                    className={`w-full px-4 py-3.5 rounded-xl border ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-primary'
                    } bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-300`}
                    placeholder="example@gmail.com"
                  />

                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{
                          opacity: 0,
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        className="text-red-500 text-xs mt-1.5"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>


                {/* Message */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaComments className="text-primary text-xs" />
                    আপনার বার্তা *
                  </label>

                  <textarea
                    {...register('message', {
                      required:
                        'বার্তাটি অবশ্যই দিতে হবে',
                    })}
                    rows={6}
                    className={`w-full px-4 py-3.5 rounded-xl border ${
                      errors.message
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-primary'
                    } bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-300 resize-none`}
                    placeholder="আপনার প্রশ্ন বা বার্তা লিখুন..."
                  />

                  <AnimatePresence>
                    {errors.message && (
                      <motion.p
                        initial={{
                          opacity: 0,
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        className="text-red-500 text-xs mt-1.5"
                      >
                        {errors.message.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>


                {/* Submit */}
                <motion.button
                  whileHover={{
                    scale: 1.015,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  type="submit"
                  disabled={isSubmitting}
                  className="relative overflow-hidden w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-cyan-600 hover:from-[#0a3a63] hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  {/* Button Shine */}
                  {!isSubmitting && (
                    <motion.span
                      animate={{
                        x: ['-120%', '120%'],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className="absolute inset-y-0 w-20 bg-white/20 skew-x-12"
                    />
                  )}

                  <span className="relative flex items-center gap-2">

                    {isSubmitting ? (
                      <>
                        <FaCheckCircle className="animate-pulse" />
                        পাঠানো হচ্ছে...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        বার্তা পাঠান
                        <FaArrowRight className="text-sm" />
                      </>
                    )}

                  </span>

                </motion.button>

              </form>

            </motion.div>


            {/* ======================================
                RIGHT SIDE
            ====================================== */}
            <motion.div
              initial={{
                opacity: 0,
                x: 40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
              className="lg:col-span-2 space-y-6"
            >

              {/* ==================================
                  MAP
              ================================== */}
              <div className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">

                <div className="relative h-[330px]">

                  <iframe
                    title="Open IT Institute Location"
                    src="https://www.google.com/maps?q=Kendua,Netrokona,Bangladesh&output=embed"
                    className="w-full h-full border-0 grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* Map Overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />


                  {/* Location Card */}
                  <motion.div
                    whileHover={{
                      y: -3,
                    }}
                    className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
                        <FaMapMarkerAlt />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          Open IT Institute
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          কেন্দুয়া, নেত্রকোনা
                        </p>
                      </div>

                    </div>

                  </motion.div>

                </div>

              </div>


              {/* ==================================
                  SOCIAL CARD
              ================================== */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0F4C81] via-[#12639B] to-[#082B4A] rounded-3xl p-7 text-white shadow-xl">

                {/* Decorative Circles */}
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute -right-20 -top-20 w-52 h-52 rounded-full border border-white/10"
                />

                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute -right-10 -top-10 w-32 h-32 rounded-full border border-cyan-300/10"
                />

                <div className="relative z-10">

                  <div className="flex items-center gap-3 mb-3">

                    <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                      <FaComments className="text-cyan-300" />
                    </div>

                    <h3 className="text-xl font-bold">
                      সোশ্যাল মিডিয়ায় যুক্ত হোন
                    </h3>

                  </div>

                  <p className="text-sm text-blue-100/80 leading-relaxed mb-6">
                    নিয়মিত আপডেট, নতুন কোর্স,
                    ফ্রি ওয়ার্কশপ এবং বিভিন্ন
                    শিক্ষামূলক কনটেন্ট পেতে আমাদের
                    সাথে যুক্ত থাকুন।
                  </p>


                  {/* Social Buttons */}
                  <div className="flex gap-3 mb-7">

                    <motion.a
                      whileHover={{
                        y: -5,
                        scale: 1.08,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      href="https://facebook.com/openitinstitute"
                      target="_blank"
                      rel="noreferrer"
                      className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all shadow-lg"
                      aria-label="Facebook"
                    >
                      <FaFacebook className="text-xl" />
                    </motion.a>

                    <motion.a
                      whileHover={{
                        y: -5,
                        scale: 1.08,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      href="https://youtube.com/@openitinstitute"
                      target="_blank"
                      rel="noreferrer"
                      className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all shadow-lg"
                      aria-label="YouTube"
                    >
                      <FaYoutube className="text-xl" />
                    </motion.a>

                  </div>


                  {/* Office Time */}
                  <div className="pt-5 border-t border-white/10">

                    <div className="flex items-center gap-2 mb-3">
                      <FaClock className="text-cyan-300 text-sm" />

                      <p className="text-sm font-bold">
                        অফিস সময়
                      </p>
                    </div>

                    <div className="space-y-1">

                      <p className="text-xs text-blue-100/80">
                        শনি - বৃহস্পতি:
                        সকাল ৯টা - রাত ৮টা
                      </p>

                      <p className="text-xs text-blue-100/80">
                        শুক্রবার: বন্ধ
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>


          {/* ========================================
              BOTTOM CTA
          ======================================== */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="relative overflow-hidden mt-12 rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8"
          >

            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-cyan-500 to-primary" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-5 pl-3">

              <div className="flex items-center gap-4">

                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="hidden sm:flex w-14 h-14 rounded-2xl bg-primary/5 text-primary items-center justify-center"
                >
                  <FaHeadset className="text-2xl" />
                </motion.div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    সাহায্যের প্রয়োজন?
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    আমাদের টিম আপনার প্রশ্নের উত্তর দিতে প্রস্তুত।
                  </p>
                </div>

              </div>


              <a
                href="tel:+8801616160869"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-[#0a3a63] transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                <FaPhone />
                এখনই কল করুন
                <FaArrowRight className="text-xs" />
              </a>

            </div>

          </motion.div>

        </div>

      </section>

    </div>
  );
};

export default Contact;