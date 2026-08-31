import { motion } from 'framer-motion';
import { whyChoose } from '../data/homeData';
import SectionTitle from './SectionTitle';
import {
  cardItem,
  sectionViewport,
  staggerContainer,
} from '../data/motionVariants';

const WhyChooseSection = () => {
  return (
    <section className="relative bg-[#f7f9fc] py-20 sm:py-24 lg:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Why Open IT"
          title="কেন Open IT Institute বেছে নেবেন?"
          description="আমরা শুধু কোর্স পড়াই না—প্র্যাকটিক্যাল স্কিল, আত্মবিশ্বাস এবং ক্যারিয়ার প্রস্তুতি তৈরি করি।"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {whyChoose.map((item, index) => (
            <motion.article
              key={item.title}
              variants={cardItem}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[26px] border border-gray-100 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(15,23,42,.10)]"
            >
              <div className="absolute right-0 top-0 h-28 w-28 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/[0.05] transition duration-500 group-hover:scale-150" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:rotate-3 group-hover:bg-primary group-hover:text-white">
                <item.icon className="text-xl" />
              </div>

              <span className="absolute right-6 top-6 text-xs font-black tracking-[0.16em] text-gray-200">
                0{index + 1}
              </span>

              <h3 className="relative mt-6 text-xl font-black text-dark">
                {item.title}
              </h3>
              <p className="relative mt-3 text-sm leading-7 text-gray-500">
                {item.desc}
              </p>

              <div className="relative mt-6 h-1 w-10 rounded-full bg-primary/20 transition-all duration-300 group-hover:w-20 group-hover:bg-primary" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
