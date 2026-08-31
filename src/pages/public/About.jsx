import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  FaBullseye, 
  FaEye, 
  FaFlag, 
  FaCheckCircle,
  FaGraduationCap,
  FaLaptopCode,
  FaUsers,
  FaAward,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaFacebook,
  FaBuilding,
  FaChalkboardTeacher,
  FaCertificate,
  FaHandsHelping,
  FaRocket,
  FaStar,
  FaQuoteLeft,
  FaQuoteRight,
  FaArrowRight
} from 'react-icons/fa';
import { SiMozilla } from 'react-icons/si';
import SEO from '../../components/seo/SEO';
import StructuredData, { organizationSchema, breadcrumbSchema } from '../../components/seo/StructuredData';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const stats = [
    { number: '2500+', label: 'Students Trained', icon: FaUsers, color: 'from-blue-500 to-cyan-400' },
    { number: '30+', label: 'Expert Instructors', icon: FaChalkboardTeacher, color: 'from-purple-500 to-pink-400' },
    { number: '95%', label: 'Success Rate', icon: FaStar, color: 'from-yellow-500 to-orange-400' },
    { number: '15+', label: 'Career Courses', icon: FaGraduationCap, color: 'from-green-500 to-emerald-400' }
  ];

  const values = [
    {
      icon: FaHandsHelping,
      title: 'Quality Education',
      description: 'Industry-standard curriculum with practical, hands-on training'
    },
    {
      icon: FaRocket,
      title: 'Career Growth',
      description: 'Job placement support and freelancing opportunities'
    },
    {
      icon: FaUsers,
      title: 'Community Learning',
      description: 'Collaborative environment with peer-to-peer learning'
    },
    {
      icon: FaCertificate,
      title: 'Recognized Certification',
      description: 'BTEB approved certification for career advancement'
    },
    {
      icon: FaClock,
      title: 'Flexible Schedule',
      description: 'Morning, evening and weekend batches available'
    },
    {
      icon: FaLaptopCode,
      title: 'Modern Facilities',
      description: 'Digital labs with high-speed internet and modern equipment'
    }
  ];

  const courses = [
    'Computer Office Application (MS Office)',
    'Graphics Design & Multimedia',
    'Hardware & Networking',
    'Web Design & Development',
    'HSC ICT Special Course',
    'Typing & Mouse Accuracy Training'
  ];

  const features = [
    'BTEB Approved Certificate',
    'Digital Computer Lab',
    'Experienced Trainers',
    'Practical Training',
    'Online & Offline Exams',
    'Scholarship Facilities',
    'Installment Options',
    'Free Workshops',
    'Career Counseling',
    'Industry Projects'
  ];

  return (
    <div className="overflow-hidden">
      <SEO 
        title="About Us | Open IT Institute" 
        description="Learn about Open IT Institute — Bangladesh's premier computer training center offering practical IT education with BTEB certification in Netrokona." 
        path="/about" 
      />
      <StructuredData data={[organizationSchema(), breadcrumbSchema([{ name: "Home", url: "/" }, { name: "About", url: "/about" }])]} />

      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-r from-primary via-primary to-[#0a3a63] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        {/* Animated floating elements */}
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-10 opacity-10 hidden lg:block"
        >
          <FaGraduationCap className="text-8xl" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-10 opacity-10 hidden lg:block"
        >
          <FaLaptopCode className="text-8xl" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-12 bg-accent rounded-full" />
              <span className="text-sm font-semibold text-accent tracking-widest">ABOUT US</span>
              <div className="h-1 w-12 bg-accent rounded-full" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Open IT Institute
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto">
              বাংলাদেশের একটি আধুনিক কম্পিউটার প্রশিক্ষণ কেন্দ্র, 
              যেখানে দক্ষতা তৈরি হয়, গড়ে ওঠে ক্যারিয়ার
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm border border-white/10">
                🏛️ BTEB Approved
              </span>
              <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm border border-white/10">
                📍 Netrokona, Bangladesh
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
                <div className="text-3xl font-bold text-dark">{stat.number}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-10 bg-accent rounded-full" />
                <span className="text-sm font-semibold text-accent tracking-widest">ABOUT US</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                ওপেন আইটি ইনস্টিটিউট
                <span className="block text-primary text-2xl mt-2">Open IT Institute</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                ওপেন আইটি ইনস্টিটিউট (Open IT Institute) হলো বাংলাদেশের একটি আধুনিক কম্পিউটার প্রশিক্ষণ কেন্দ্র। 
                এটি প্রধানত নেত্রকোনার কেন্দুয়ায় অবস্থিত এবং এটি <span className="font-semibold text-primary">বাংলাদেশ কারিগরি শিক্ষা বোর্ড (BTEB)</span> দ্বারা অনুমোদিত একটি প্রতিষ্ঠান।
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                স্থানীয় পর্যায়ে তথ্য ও যোগাযোগ প্রযুক্তির (ICT) প্রসার এবং যুবসমাজকে দক্ষ করে গড়ে তোলার লক্ষ্যে 
                এই প্রতিষ্ঠানটি কাজ করে যাচ্ছে।
              </p>

              {/* Location & Contact Info */}
              <div className="space-y-3 p-6 bg-light rounded-2xl">
                <h4 className="font-bold text-dark mb-3">যোগাযোগের তথ্য</h4>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">কেন্দুয়া, নেত্রকোনা, বাংলাদেশ</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-primary flex-shrink-0" />
                  <span className="text-sm text-gray-600">+880 1707-530810</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaGlobe className="text-primary flex-shrink-0" />
                  <span className="text-sm text-gray-600">openit-edu.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaFacebook className="text-primary flex-shrink-0" />
                  <span className="text-sm text-gray-600">Open IT Institute Facebook Page</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Mission, Vision, Goals */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <FaBullseye className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-lg mb-2">আমাদের লক্ষ্য (Our Mission)</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      To provide quality, affordable, and practical IT education that transforms lives 
                      and builds skilled professionals for the digital economy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-2xl p-6 border border-secondary/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                    <FaEye className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-lg mb-2">আমাদের স্বপ্ন (Our Vision)</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      To become the leading digital skills institute in Bangladesh, recognized for 
                      excellence in technology education and innovation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-6 border border-accent/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <FaFlag className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-lg mb-2">আমাদের উদ্দেশ্য (Our Goals)</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Skill development, job placement, freelancing success, and entrepreneurial growth 
                      for every student who joins our programs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recognition Badge */}
              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <FaAward className="text-yellow-600 text-2xl" />
                <div>
                  <p className="text-sm font-semibold text-dark">BTEB Approved Institution</p>
                  <p className="text-xs text-gray-500">Bangladesh Technical Education Board</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Courses Offered */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-1 w-10 bg-accent rounded-full" />
              <span className="text-sm font-semibold text-accent tracking-widest">COURSES</span>
              <div className="h-1 w-10 bg-accent rounded-full" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark">আমাদের কোর্সসমূহ</h2>
            <p className="text-gray-500 mt-2">পেশাদার এবং কর্মমুখী আইটি কোর্স</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FaGraduationCap className="text-sm" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark text-sm">{course}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-accent">●</span>
                      <span className="text-xs text-gray-400">Professional Course</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-1 w-10 bg-accent rounded-full" />
              <span className="text-sm font-semibold text-accent tracking-widest">VALUES</span>
              <div className="h-1 w-10 bg-accent rounded-full" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark">আমাদের বিশেষত্ব</h2>
            <p className="text-gray-500 mt-2">যা আমাদের অনন্য করে তুলেছে</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group bg-light rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/10"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-white">
                  <value.icon className="text-2xl" />
                </div>
                <h3 className="font-bold text-dark mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features & Facilities */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-1 w-10 bg-accent rounded-full" />
              <span className="text-sm font-semibold text-accent tracking-widest">FACILITIES</span>
              <div className="h-1 w-10 bg-accent rounded-full" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark">সুবিধা সমূহ</h2>
            <p className="text-gray-500 mt-2">শিক্ষার্থীদের জন্য আমাদের সুযোগ-সুবিধা</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                <FaCheckCircle className="text-accent flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial/Quote */}
      <section className="py-16 bg-gradient-to-r from-primary to-[#0a3a63] text-white">
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
                className="inline-flex items-center gap-2 bg-accent text-dark px-8 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all hover:scale-105 shadow-lg"
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