import { motion } from 'framer-motion';
import { stats } from '../data/homeData';
import {
  cardItem,
  sectionViewport,
  staggerContainer,
} from '../data/motionVariants';

const StatsSection = () => {
  return (
    <section className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          className="grid grid-cols-2 overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_24px_70px_rgba(15,23,42,.10)] lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={cardItem}
              whileHover={{ y: -5 }}
              className={`group relative p-6 text-center sm:p-8 ${
                index !== stats.length - 1 ? 'lg:border-r lg:border-gray-100' : ''
              } ${index < 2 ? 'border-b border-gray-100 lg:border-b-0' : ''}`}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                <stat.icon className="text-xl" />
              </div>

              <p className="mt-4 text-3xl font-black tracking-tight text-dark sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
