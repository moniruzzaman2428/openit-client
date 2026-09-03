import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  FaBullseye,
  FaEye,
  FaFlag,
  FaCheckCircle,
  FaGraduationCap,
  FaUsers,
  FaAward,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaBuilding,
  FaChalkboardTeacher,
  FaStar,
  FaQuoteLeft,
  FaArrowRight,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaLaptop,
  FaPaintBrush,
  FaNetworkWired,
  FaVideo,
  FaHandsHelping,
  FaRocket,
  FaCertificate,
  FaMicrochip,
  FaCrown,
  FaShieldAlt
} from 'react-icons/fa';
import SEO from '../../components/seo/SEO';
import StructuredData, { organizationSchema, breadcrumbSchema } from '../../components/seo/StructuredData';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [rotation, setRotation] = useState(0);

  // Animation loop for processor rotation
  useEffect(() => {
    if (!isInView) return;
    let animationFrame;
    const animate = () => {
      setRotation(prev => (prev + 0.2) % 360);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView]);

  const stats = [
    { number: '2500+', label: 'Students Trained', icon: FaUsers, color: 'from-blue-500 to-cyan-400' },
    { number: '30+', label: 'Expert Instructors', icon: FaChalkboardTeacher, color: 'from-purple-500 to-pink-400' },
    { number: '95%', label: 'Success Rate', icon: FaStar, color: 'from-yellow-500 to-orange-400' },
    { number: '15+', label: 'Career Courses', icon: FaGraduationCap, color: 'from-green-500 to-emerald-400' }
  ];

  // Founders Data for Processor Layout
  const founders = [
    {
      id: 1,
      name: 'মো: নুরুজ্জামান',
      designation: 'প্রতিষ্ঠাতা ও সিইও',
      subTitle: 'আইটি প্রশিক্ষক ও উদ্যোক্তা',
      description: 'দক্ষতা ও নৈতিকতার সমন্বয়ে আধুনিক আইটি শিক্ষার বিস্তারে নিবেদিত।',
      image: 'https://i.ibb.co.com/7JgcS1m7/nur.jpg',
      social: { facebook: '#', linkedin: '#', twitter: '#' }
    },
    {
      id: 2,
      name: 'মো: মনিরুজ্জামান',
      designation: 'প্রধান প্রশিক্ষক',
      subTitle: 'আইটি বিশেষজ্ঞ ও মেন্টর',
      description: 'তরুণ প্রজন্মকে প্রযুক্তিতে দক্ষ করে গড়ে তোলার লক্ষ্যে নিরলসভাবে কাজ করে যাচ্ছেন।',
      image: 'https://i.ibb.co.com/3Hzx3sB/DSC03830.jpg',
      social: { facebook: '#', linkedin: '#', twitter: '#' }
    }
  ];

  const featuredCourses = [
    { icon: FaLaptop, title: 'বেসিক কম্পিউটার ও অফিস অ্যাপ্লিকেশন', desc: 'MS Word, Excel, PowerPoint' },
    { icon: FaPaintBrush, title: 'গ্রাফিক ডিজাইন', desc: 'Photoshop, Illustrator' },
    { icon: FaGlobe, title: 'ওয়েব ডিজাইন', desc: 'HTML, CSS, JavaScript' },
    { icon: FaNetworkWired, title: 'হার্ডওয়্যার ও নেটওয়ার্কিং', desc: 'PC Maintenance, CCNA' },
    { icon: FaVideo, title: 'ফ্রিল্যান্সিং', desc: 'Fiverr, Upwork, Freelancing' }
  ];

  const values = [
    {
      icon: FaHandsHelping,
      title: 'মানসম্মত শিক্ষা',
      description: 'ইন্ডাস্ট্রি-স্ট্যান্ডার্ড কারিকুলাম ও হাতে-কলমে প্রশিক্ষণ'
    },
    {
      icon: FaRocket,
      title: 'ক্যারিয়ার বৃদ্ধি',
      description: 'চাকরি ও ফ্রিল্যান্সিং সফলতার পূর্ণ সহায়তা'
    },
    {
      icon: FaUsers,
      title: 'কমিউনিটি লার্নিং',
      description: 'শিক্ষার্থীদের মধ্যে সহযোগিতামূলক পরিবেশ'
    },
    {
      icon: FaCertificate,
      title: 'সরকারি সার্টিফিকেট',
      description: 'BTEB অনুমোদিত সার্টিফিকেট প্রদান'
    }
  ];

  return (
    <div className="overflow-hidden bg-gray-50">
      <SEO
        title="About Us | Open IT Institute"
        description="Learn about Open IT Institute — Bangladesh's premier computer training center offering practical IT education with BTEB certification in Netrokona."
        path="/about"
      />
      <StructuredData data={[organizationSchema(), breadcrumbSchema([{ name: "Home", url: "/" }, { name: "About", url: "/about" }])]} />

      {/* ==================== HERO SECTION - PROFESSIONAL TECH COMMAND CENTER ==================== */}
      <section className="relative bg-gradient-to-br from-[#06111f] via-[#0b2440] to-[#07111d] text-white overflow-hidden">

        {/* Background Glow */}
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -30, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-32 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-3xl"
        />

        {/* Tech Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
      `,
            backgroundSize: "45px 45px"
          }}
        />

        {/* Decorative Lines */}
        <div className="absolute top-20 left-0 w-40 h-px bg-gradient-to-r from-transparent to-blue-500/40" />
        <div className="absolute bottom-24 right-0 w-56 h-px bg-gradient-to-l from-transparent to-cyan-500/40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Main Hero Layout */}
          <div className="min-h-[620px] lg:min-h-[650px] flex items-center py-14 lg:py-16">

            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center w-full">

              {/* =====================================================
            LEFT SIDE - CONTENT
        ===================================================== */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="relative"
              >

                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 backdrop-blur-md px-4 py-2 rounded-full mb-5"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                  </span>

                  <FaCertificate className="text-yellow-400 text-sm" />

                  <span className="text-xs sm:text-sm font-semibold text-blue-100">
                    BTEB অনুমোদিত প্রতিষ্ঠান
                  </span>
                </motion.div>


                {/* Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.2rem] font-black leading-[1.08] tracking-tight"
                >
                  আপনার সাফল্যের

                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-[length:200%_auto] animate-gradient">
                    ডিজিটাল সঙ্গী
                  </span>
                </motion.h1>


                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="text-sm sm:text-base lg:text-lg text-blue-100/70 max-w-xl mt-5 leading-relaxed"
                >
                  নেত্রকোনার কেন্দুয়ায় আধুনিক ল্যাব, অভিজ্ঞ প্রশিক্ষক
                  এবং হাতে-কলমে প্রশিক্ষণের মাধ্যমে গড়ে তুলুন আপনার
                  সফল ডিজিটাল ক্যারিয়ার।
                </motion.p>


                {/* Feature Pills */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                  className="flex flex-wrap gap-2.5 mt-6"
                >

                  {[
                    {
                      icon: FaCheckCircle,
                      text: "Practical Learning"
                    },
                    {
                      icon: FaCertificate,
                      text: "BTEB Certificate"
                    },
                    {
                      icon: FaUsers,
                      text: "2500+ Students"
                    }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg backdrop-blur-sm"
                    >
                      <item.icon className="text-cyan-400 text-xs" />

                      <span className="text-[11px] sm:text-xs text-gray-300">
                        {item.text}
                      </span>
                    </div>
                  ))}

                </motion.div>


                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.6 }}
                  className="flex flex-wrap gap-3 mt-7"
                >

                  <a
                    href="/admission"
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 sm:px-7 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/30 hover:scale-[1.03] transition-all duration-300"
                  >
                    ভর্তি হোন এখনই

                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </a>


                  <a
                    href="/courses"
                    className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 px-6 sm:px-7 py-3 rounded-xl font-semibold text-sm transition-all"
                  >
                    কোর্স দেখুন
                  </a>

                </motion.div>


                {/* Small Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                  className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10 max-w-lg"
                >

                  <div>
                    <div className="text-xl font-bold text-white">
                      2500+
                    </div>
                    <div className="text-[11px] text-gray-500">
                      শিক্ষার্থী
                    </div>
                  </div>

                  <div className="w-px h-8 bg-white/10" />

                  <div>
                    <div className="text-xl font-bold text-white">
                      15+
                    </div>
                    <div className="text-[11px] text-gray-500">
                      কোর্স
                    </div>
                  </div>

                  <div className="w-px h-8 bg-white/10" />

                  <div>
                    <div className="text-xl font-bold text-white">
                      95%
                    </div>
                    <div className="text-[11px] text-gray-500">
                      সফলতার হার
                    </div>
                  </div>

                </motion.div>

              </motion.div>


              {/* =====================================================
            RIGHT SIDE - TECH COMMAND CENTER
        ===================================================== */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative flex justify-center lg:justify-end"
              >

                <div className="relative w-full max-w-[540px]">

                  {/* =================================================
                CENTRAL CHIP
            ================================================= */}
                  <div className="relative h-[470px] sm:h-[500px]">

                    {/* Large Glow */}
                    <motion.div
                      animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.2, 0.35, 0.2]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
                    />


                    {/* Outer Circle */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-blue-400/15 border-dashed"
                    />

                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-cyan-400/20"
                    />


                    {/* Orbit Dots */}
                    {[0, 60, 120, 180, 240, 300].map((angle, index) => (
                      <motion.div
                        key={index}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute left-1/2 top-1/2 w-[330px] h-[330px] -translate-x-1/2 -translate-y-1/2"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${angle}deg)`
                        }}
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/70" />
                      </motion.div>
                    ))}


                    {/* =================================================
                  CHIP
              ================================================= */}
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                        boxShadow: [
                          "0 0 30px rgba(59,130,246,0.15)",
                          "0 0 60px rgba(59,130,246,0.35)",
                          "0 0 30px rgba(59,130,246,0.15)"
                        ]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-[#102d4e] to-cyan-500/10 backdrop-blur-xl border border-blue-300/20 flex flex-col items-center justify-center overflow-hidden"
                    >

                      {/* Chip Grid */}
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                          backgroundSize: "18px 18px"
                        }}
                      />

                      {/* Inner Border */}
                      <div className="absolute inset-3 rounded-[1.5rem] border border-white/10" />

                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute inset-7 rounded-xl border border-cyan-400/10"
                      />

                      <FaMicrochip className="relative text-5xl sm:text-6xl text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />

                      <h3 className="relative text-lg font-bold mt-3">
                        OPEN IT
                      </h3>

                      <p className="relative text-[9px] text-gray-400 text-center tracking-wider">
                        DIGITAL EDUCATION
                        <br />
                        FOR FUTURE LEADERS
                      </p>

                    </motion.div>


                    {/* =================================================
                  FOUNDER CARD - TOP LEFT
              ================================================= */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                      className="absolute top-3 left-0 sm:left-2 w-[225px] sm:w-[245px] bg-[#0c2037]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
                    >

                      <div className="flex items-center gap-3">

                        <div className="relative flex-shrink-0">

                          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-40 blur-sm" />

                          <img
                            src="https://i.ibb.co.com/7JgcS1m7/nur.jpg"
                            alt="মো: নুরুজ্জামান"
                            className="relative w-14 h-14 rounded-full object-cover border-2 border-white/20"
                          />

                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <FaCrown className="text-yellow-400 text-[10px]" />

                            <span className="text-[9px] text-yellow-400 font-bold tracking-wider">
                              FOUNDER
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-white mt-0.5">
                            মো: নুরুজ্জামান
                          </h3>

                          <p className="text-[10px] text-blue-300">
                            প্রতিষ্ঠাতা ও সিইও
                          </p>
                        </div>

                      </div>

                      <p className="text-[10px] text-gray-400 leading-relaxed mt-3">
                        দক্ষতা ও নৈতিকতার সমন্বয়ে আধুনিক আইটি শিক্ষার বিস্তারে নিবেদিত।
                      </p>

                    </motion.div>


                    {/* =================================================
                  INSTRUCTOR CARD - BOTTOM RIGHT
              ================================================= */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                      className="absolute bottom-4 right-0 sm:right-2 w-[225px] sm:w-[245px] bg-[#0c2037]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
                    >

                      <div className="flex items-center gap-3">

                        <div className="relative flex-shrink-0">

                          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 opacity-40 blur-sm" />

                          <img
                            src="https://i.ibb.co.com/3Hzx3sB/DSC03830.jpg"
                            alt="মো: মনিরুজ্জামান"
                            className="relative w-14 h-14 rounded-full object-cover border-2 border-white/20"
                          />

                        </div>

                        <div>

                          <div className="flex items-center gap-1.5">
                            <FaGraduationCap className="text-cyan-400 text-[10px]" />

                            <span className="text-[9px] text-cyan-400 font-bold tracking-wider">
                              HEAD INSTRUCTOR
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-white mt-0.5">
                            মো: মনিরুজ্জামান
                          </h3>

                          <p className="text-[10px] text-cyan-300">
                            প্রধান প্রশিক্ষক
                          </p>

                        </div>

                      </div>

                      <p className="text-[10px] text-gray-400 leading-relaxed mt-3">
                        তরুণ প্রজন্মকে প্রযুক্তিতে দক্ষ করে গড়ে তোলার লক্ষ্যে নিরলসভাবে কাজ করছেন।
                      </p>

                    </motion.div>


                    {/* =================================================
                  FLOATING TECH BADGES
              ================================================= */}

                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute top-[48%] -left-3 sm:-left-7 bg-blue-500/10 backdrop-blur-md border border-blue-400/20 px-3 py-2 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <FaLaptop className="text-blue-400 text-sm" />
                        <span className="text-[10px] font-semibold text-gray-300">
                          DIGITAL SKILLS
                        </span>
                      </div>
                    </motion.div>


                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute top-[28%] -right-2 sm:-right-5 bg-cyan-500/10 backdrop-blur-md border border-cyan-400/20 px-3 py-2 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <FaCertificate className="text-cyan-400 text-sm" />
                        <span className="text-[10px] font-semibold text-gray-300">
                          BTEB CERTIFIED
                        </span>
                      </div>
                    </motion.div>


                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute bottom-[24%] left-[8%] bg-white/5 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <FaRocket className="text-yellow-400 text-sm" />
                        <span className="text-[10px] font-semibold text-gray-300">
                          CAREER READY
                        </span>
                      </div>
                    </motion.div>

                  </div>

                </div>

              </motion.div>

            </div>

          </div>

        </div>


        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[35px]"
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C150,80 300,0 450,35 C600,70 750,15 900,40 C1050,65 1120,20 1200,35 V80 H0Z"
              className="fill-white"
            />
          </svg>
        </div>

      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{stat.number}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content & Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-10 bg-blue-600 rounded-full" />
                <span className="text-sm font-semibold text-blue-600 tracking-widest">ABOUT US</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                ওপেন আইটি ইনস্টিটিউট
                <span className="block text-gray-500 text-2xl mt-2 font-medium">Open IT Institute</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                ওপেন আইটি ইনস্টিটিউট (Open IT Institute) হলো বাংলাদেশের একটি আধুনিক কম্পিউটার প্রশিক্ষণ কেন্দ্র।
                এটি প্রধানত নেত্রকোনার কেন্দুয়ায় অবস্থিত এবং এটি <span className="font-semibold text-blue-600">বাংলাদেশ কারিগরি শিক্ষা বোর্ড (BTEB)</span> দ্বারা অনুমোদিত একটি প্রতিষ্ঠান। প্রতিষ্ঠান কোড: 58155।
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                স্থানীয় পর্যায়ে তথ্য ও যোগাযোগ প্রযুক্তির (ICT) প্রসার এবং যুবসমাজকে দক্ষ করে গড়ে তোলার লক্ষ্যে
                এই প্রতিষ্ঠানটি কাজ করে যাচ্ছে। আধুনিক ডিজিটাল ল্যাব, অভিজ্ঞ শিক্ষকমণ্ডলী এবং মানসম্মত প্রশিক্ষণের মাধ্যমে আমরা শিক্ষার্থীদের সফল ক্যারিয়ারের পথে এগিয়ে নিয়ে যাচ্ছি।
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {['চাকরিমুখী ও মানসম্মত কোর্স', 'আধুনিক ল্যাব ও প্র্যাকটিক্যাল ক্লাস', 'সহজ কিস্তিতে কোর্স ফি', 'সার্টিফিকেট প্রদান'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 p-6 bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><FaBuilding className="text-blue-600" /> যোগাযোগের তথ্য</h4>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-blue-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">উপজেলা রোড, শান্তিবাগ (NRBC ব্যাংক সংলগ্ন), কেন্দুয়া, নেত্রকোনা।</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-600">+880 1716-160869</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaGlobe className="text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-600">www.openitinstitute.com</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Mission, Vision & Values */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FaBullseye className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">আমাদের লক্ষ্য (Our Mission)</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      সাশ্রয়ী, মানসম্মত এবং হাতে-কলমে প্রশিক্ষণের মাধ্যমে ডিজিটাল অর্থনীতির জন্য দক্ষ প্রযুক্তি পেশাদার তৈরি করা।
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center flex-shrink-0">
                    <FaEye className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">আমাদের স্বপ্ন (Our Vision)</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      প্রযুক্তি শিক্ষায় বাংলাদেশের শীর্ষস্থানীয় প্রতিষ্ঠান হয়ে ওঠা, যা উদ্ভাবন এবং ডিজিটাল দক্ষতার স্বীকৃতি পাবে।
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <FaFlag className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">আমাদের উদ্দেশ্য (Our Goals)</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      প্রতিটি শিক্ষার্থীর জন্য দক্ষতা উন্নয়ন, কর্মসংস্থান, ফ্রিল্যান্সিং সাফল্য এবং উদ্যোক্তা বৃদ্ধি নিশ্চিত করা।
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all group"
                  >
                    <div className="w-10 h-10 bg-white text-blue-600 rounded-lg flex items-center justify-center mb-3 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <value.icon className="text-xl" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{value.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial/Quote */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-[#0a3a63] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FaQuoteLeft className="text-5xl text-white/20 mx-auto mb-6" />
            <p className="text-xl md:text-2xl font-light leading-relaxed">
              "ওপেন আইটি ইনস্টিটিউট শুধু একটি প্রশিক্ষণ কেন্দ্র নয়,
              এটি একটি স্বপ্নের সেতু — যেখানে প্রযুক্তি শিক্ষার মাধ্যমে
              গড়ে ওঠে একটি স্মার্ট বাংলাদেশ।"
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-12 bg-white/30" />
              <span className="text-sm text-white/60">Open IT Institute</span>
              <div className="h-px w-12 bg-white/30" />
            </div>
            <div className="mt-8">
              <a
                href="/admission"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
              >
                ভর্তি হোন এখনই
                <FaArrowRight className="text-sm" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;