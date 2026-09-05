import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { 
  FaArrowRight, 
  FaRocket, 
  FaUsers, 
  FaStar, 
  FaLayerGroup,
  FaCheckCircle
} from 'react-icons/fa';

// ============================================================
// ANIMATED COUNTER (Compact)
// ============================================================
const AnimatedCounter = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1000 });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(latest)}${suffix}`;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-[#030712] py-6 sm:py-8 lg:py-10">
      
      {/* Background Effects (Minimal) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[250px] w-[250px] rounded-full bg-cyan-500/15 blur-[90px]" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0a1a2f] via-[#0F4C81] to-[#061a2f] border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.2)]"
        >
          {/* Inner Gradient Lines */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

          <div className="relative grid lg:grid-cols-2 gap-6 p-6 sm:p-8 lg:p-10 items-center">
            
            {/* LEFT SIDE: TEXT */}
            <div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1"
              >
                <FaRocket className="text-cyan-400 text-xs" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-cyan-300">
                  Admission Open
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight"
              >
                আপনার ক্যারিয়ারের{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  নতুন অধ্যায়
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-2 text-xs sm:text-sm text-blue-100/80 leading-relaxed max-w-md"
              >
                সঠিক স্কিল, অভিজ্ঞ মেন্টর, এবং ১০০% প্র্যাকটিক্যাল প্রশিক্ষণ। আজই ভর্তি হোন।
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-5 flex flex-wrap gap-3"
              >
                <Link
                  to="/admission"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 font-bold text-white text-sm shadow-lg hover:scale-105 transition-all duration-300"
                >
                  ভর্তি হোন
                  <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/courses"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-5 py-2.5 font-semibold text-white text-sm hover:bg-white/10 transition-all duration-300"
                >
                  কোর্স দেখুন
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-4 flex flex-wrap gap-4"
              >
                {[
                  { icon: FaCheckCircle, text: 'BTEB অনুমোদিত' },
                  { icon: FaCheckCircle, text: 'সার্টিফিকেট' },
                  { icon: FaCheckCircle, text: 'ক্যারিয়ার সাপোর্ট' }
                ].map((item, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 text-[11px] text-blue-100/70">
                    <item.icon className="text-emerald-400 text-xs" />
                    {item.text}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* RIGHT SIDE: COMPACT STATS */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative grid grid-cols-2 gap-3"
            >
              {/* Stat Card 1 */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <FaUsers className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-[9px] text-blue-200/60 font-semibold uppercase">শিক্ষার্থী</p>
                    <div className="text-xl font-black text-white">
                      <AnimatedCounter value={2500} suffix="+" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stat Card 2 */}
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center">
                    <FaStar className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-[9px] text-blue-200/60 font-semibold uppercase">সাফল্য</p>
                    <div className="text-xl font-black text-white">
                      <AnimatedCounter value={95} suffix="%" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Floating Icon */}
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
              >
                <FaLayerGroup className="text-white text-sm" />
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Marquee (Compact) */}
          <div className="relative border-t border-white/10 py-2.5 overflow-hidden">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="flex whitespace-nowrap"
            >
              {[0, 1].map((idx) => (
                <div key={idx} className="flex items-center gap-5 px-3">
                  {['ওয়েব ডেভেলপমেন্ট', 'গ্রাফিক ডিজাইন', 'ফ্রিল্যান্সিং', 'ডিজিটাল মার্কেটিং', 'হার্ডওয়্যার ও নেটওয়ার্কিং', 'প্রোগ্রামিং'].map((course, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs font-semibold text-blue-100/40">
                      <span className="w-1 h-1 rounded-full bg-cyan-400" />
                      {course}
                    </span>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;