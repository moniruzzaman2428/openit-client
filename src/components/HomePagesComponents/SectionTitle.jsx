import { motion } from 'framer-motion';
import { fadeUp, sectionViewport } from '../data/motionVariants';

const SectionTitle = ({
  badge,
  title,
  description,
  align = 'center',
  light = false,
}) => {
  const alignment =
    align === 'left'
      ? 'text-left items-start'
      : 'text-center items-center';

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      className={`flex flex-col ${alignment}`}
    >
      {badge && (
        <span
          className={`mb-4 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
            light
              ? 'border border-white/15 bg-white/10 text-white/80'
              : 'bg-primary/10 text-primary'
          }`}
        >
          {badge}
        </span>
      )}

      <h2
        className={`max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl ${
          light ? 'text-white' : 'text-dark'
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 max-w-2xl text-base leading-7 sm:text-lg ${
            light ? 'text-white/65' : 'text-gray-500'
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
