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
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-gradient-to-br from-primary via-[#0f5489] to-[#071d34] px-6 py-14 text-center text-white shadow-[0_30px_80px_rgba(7,29,52,.18)] sm:px-10 lg:py-20"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 25, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-accent backdrop-blur-xl">
            <FaGraduationCap className="text-3xl" />
          </div>

          <h2 className="mx-auto mt-7 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            আপনার ক্যারিয়ার শুরু হোক আজই
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            সঠিক স্কিল, সঠিক গাইডলাইন এবং নিয়মিত প্র্যাকটিস—এই তিনটি দিয়েই
            আপনার ডিজিটাল ক্যারিয়ারের নতুন শুরু।
          </p>

          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="mt-9 inline-block"
          >
            <Link
              to="/admission"
              className="inline-flex items-center gap-3 rounded-2xl bg-accent px-8 py-4 font-black text-dark shadow-xl transition hover:brightness-105"
            >
              ভর্তি করুন এখনই
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
