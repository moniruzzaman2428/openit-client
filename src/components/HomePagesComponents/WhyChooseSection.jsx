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
  FaStar
} from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

const WhyChooseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [rotation, setRotation] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // ৬টি প্রধান কারণ
  const features = [
    {
      id: 1,
      icon: FaGraduationCap,
      title: 'শিক্ষার্থী ও শিক্ষা',
      desc: 'একাডেমিক পড়াশোনার পাশাপাশি হাতে-কলমে প্রযুক্তি শিখে শিক্ষার্থীদের ভবিষ্যৎ প্রস্তুত করা হয়।',
      color: 'from-blue-500 to-cyan-500',
      glow: 'rgba(59, 130, 246, 0.3)'
    },
    {
      id: 2,
      icon: FaLaptopCode,
      title: 'তরুণ প্রফেশনাল',
      desc: 'কর্পোরেট চাকরি বা উদ্যোক্তা হয়ে উঠতে প্রয়োজনীয় প্রফেশনাল আইটি স্কিল ডেভেলপমেন্ট।',
      color: 'from-purple-500 to-indigo-500',
      glow: 'rgba(139, 92, 246, 0.3)'
    },
    {
      id: 3,
      icon: FaBriefcase,
      title: 'ফ্রিল্যান্সিং ক্যারিয়ার',
      desc: 'Fiverr, Upwork সহ গ্লোবাল মার্কেটপ্লেসে কাজ করে ডলার আয়ের সুনিশ্চিত পথ দেখায়।',
      color: 'from-green-500 to-emerald-500',
      glow: 'rgba(34, 197, 94, 0.3)'
    },
    {
      id: 4,
      icon: FaUsers,
      title: 'নারী ক্ষমতায়ন',
      desc: 'ঘরে বসে আয়ের সুযোগ সৃষ্টি করে নারীদের স্বাবলম্বী, আত্মবিশ্বাসী এবং স্বাধীন করে গড়ে তোলে।',
      color: 'from-pink-500 to-rose-500',
      glow: 'rgba(236, 72, 153, 0.3)'
    },
    {
      id: 5,
      icon: FaHome,
      title: 'গ্রামীণ বাংলাদেশ',
      desc: 'শহরের সমান আধুনিক প্রশিক্ষণ এখন প্রান্তিক জনপদে। কেন্দুয়া থেকে শুরু হয়েছে ডিজিটাল বিপ্লব।',
      color: 'from-orange-500 to-yellow-500',
      glow: 'rgba(251, 146, 60, 0.3)'
    },
    {
      id: 6,
      icon: FaGlobe,
      title: 'বিশ্বব্যাপী সংযোগ',
      desc: 'স্থানীয়ভাবে শিখে আন্তর্জাতিক মানের সার্টিফিকেট অর্জন করে গ্লোবাল মার্কেটের সাথে যুক্ত হওয়া।',
      color: 'from-red-500 to-orange-500',
      glow: 'rgba(239, 68, 68, 0.3)'
    }
  ];

  // Animation loop for rotation
  useEffect(() => {
    if (!isInView) return;
    
    let animationFrame;
    let lastTime = 0;
    const speed = 0.3; // degrees per frame

    const animate = (time) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      
      if (!isHovering) {
        setRotation(prev => (prev + speed * (delta / 16)) % 360);
      }
      
      lastTime = time;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, isHovering]);

  // Calculate position on circle
  const getPosition = (index, total, radius, centerX, centerY) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2 + (rotation * Math.PI) / 180;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y, angle };
  };

  return (
    <section className="relative py-5 lg:py-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-100/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-100 mb-4">
            <motion.div 
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-red-500"
            />
            <span className="text-sm font-bold text-blue-700 tracking-widest uppercase">Why Choose Us</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-6 leading-tight">
            "দূরত্ব শুধু মানচিত্রে, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">স্বপ্নের পথে নয়।"</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto">
            একসাথে গড়ে তুলি আগামীর ডিজিটাল বাংলাদেশ। আমাদের আধুনিক ল্যাব, অভিজ্ঞ মেন্টর এবং যুগোপযোগী কারিকুলাম কেন আপনার সঠিক পছন্দ?
          </p>
        </motion.div>

        {/* Desktop: Circular Layout with Rotating Features */}
        <div 
          ref={ref} 
          className="hidden lg:block relative min-h-[750px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Center Logo - Fixed Position */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-56 h-56 rounded-full bg-white shadow-2xl border-4 border-blue-50 flex items-center justify-center"
          >
            {/* Rotating Rings */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
              className="absolute inset-[-20px] rounded-full border-2 border-dashed border-blue-300"
            />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
              className="absolute inset-[-40px] rounded-full border border-red-200"
            />
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
              className="absolute inset-[-60px] rounded-full border border-dashed border-cyan-300"
            />
            
            {/* Glow Effect */}
            <div className="absolute inset-[-70px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Pulsing Particles */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <motion.div
                key={angle}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: angle / 360 * 3
                }}
                className="absolute w-2 h-2 rounded-full bg-blue-400"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateX(-110px)`,
                  transformOrigin: '0 0'
                }}
              />
            ))}

            <div className="text-center relative z-10 p-6">
              <div className="w-32 h-32 mx-auto rounded-full bg-white flex items-center justify-center overflow-hidden shadow-lg border-2 border-blue-100">
                <img 
                  src={logo}
                  alt="Open IT Institute Logo" 
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="mt-3"
              >
                <span className="text-xs font-bold text-primary">OPEN IT INSTITUTE</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Rotating Feature Cards */}
          {features.map((feature, index) => {
            const total = features.length;
            const radius = 320; // Circle radius in pixels
            const centerX = 384; // Center of container (half of max-w-7xl)
            const centerY = 375; // Half of min-height
            
            const position = getPosition(index, total, radius, centerX, centerY);
            
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { 
                  opacity: 1, 
                  scale: 1,
                  x: position.x - centerX,
                  y: position.y - centerY
                } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.3 + (index * 0.1),
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.15,
                  zIndex: 50,
                  transition: { duration: 0.2 }
                }}
                className="absolute top-1/2 left-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(${position.x - centerX}px, ${position.y - centerY}px)`,
                }}
              >
                {/* Glow behind card */}
                <div 
                  className="absolute inset-0 rounded-2xl blur-xl opacity-30"
                  style={{ background: feature.glow }}
                />
                
                <div className={`relative bg-white p-5 rounded-2xl shadow-xl border border-gray-100 hover:border-blue-300 transition-all duration-300`}>
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center shadow-lg`}>
                      <feature.icon className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-0.5">{feature.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{feature.desc}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-600">Learn More</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight className="text-[10px] text-blue-600" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Ornamental Dots on Circle */}
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-blue-300/40"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 15 + rotation}deg) translateX(-315px)`,
                transformOrigin: '0 0'
              }}
            />
          ))}
        </div>

        {/* Mobile & Tablet: Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all`}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className={`w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center shadow-md`}>
                  <feature.icon className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{feature.title}</h3>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Badges with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {[
            { icon: FaBullseye, title: 'ডিজিটাল ট্রান্সফরমেশন', color: 'text-blue-600 bg-blue-50' },
            { icon: FaHandsHelping, title: 'নিরবচ্ছিন্ন সহায়তা', color: 'text-red-500 bg-red-50' },
            { icon: FaLaptopCode, title: '২৪/৭ সরবরাহ', color: 'text-green-600 bg-green-50' },
            { icon: FaCertificate, title: 'সরকারি সার্টিফিকেট', color: 'text-purple-600 bg-purple-50' },
            { icon: FaGlobe, title: 'গ্লোবাল কানেকশন', color: 'text-cyan-600 bg-cyan-50' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center bg-white p-5 rounded-xl shadow-md border border-gray-100 text-center cursor-pointer"
            >
              <motion.div 
                className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mb-3`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <item.icon className="text-xl" />
              </motion.div>
              <p className="text-xs font-bold text-slate-700">{item.title}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseSection;