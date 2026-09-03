import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaGraduationCap } from 'react-icons/fa';
import { fadeUp, sectionViewport } from '../data/motionVariants';

const CTASection = () => {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0a1a2f] via-[#0f5489] to-[#071d34] px-6 py-14 text-center text-white shadow-2xl shadow-blue-900/20 sm:px-10 lg:py-20"
      >
        {/* Animated Background Orbs - Simplified */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 25, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl"
        />

        <div className="relative">
          {/* Icon */}
          <motion.div 
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-400 backdrop-blur-xl shadow-xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FaGraduationCap className="text-3xl" />
          </motion.div>

          {/* Heading */}
          <h2 className="mx-auto mt-7 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            আপনার ক্যারিয়ার শুরু হোক{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              আজই
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            সঠিক স্কিল, সঠিক গাইডলাইন এবং নিয়মিত প্র্যাকটিস—এই তিনটি দিয়েই
            আপনার ডিজিটাল ক্যারিয়ারের নতুন শুরু।
          </p>

          {/* CTA Button */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-9 inline-block"
          >
            <Link
              to="/admission"
              className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-extrabold text-white shadow-xl shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50"
            >
              ভর্তি করুন এখনই
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;