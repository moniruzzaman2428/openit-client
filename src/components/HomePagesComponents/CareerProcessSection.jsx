import { motion } from 'framer-motion';
import { careerSteps } from '../data/homeData';
import SectionTitle from './SectionTitle';
import {
  cardItem,
  sectionViewport,
  staggerContainer,
} from '../data/motionVariants';

const CareerProcessSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#071d34] py-20 text-white sm:py-24 lg:py-28">
      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          light
          badge="Your Career Journey"
          title="শেখা থেকে ক্যারিয়ার—৪টি সহজ ধাপ"
          description="একটি পরিষ্কার learning journey যাতে আপনি শুধু কোর্স শেষ না করে কাজের জন্য প্রস্তুত হতে পারেন।"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          className="relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          <div className="absolute left-[10%] right-[10%] top-10 hidden h-px bg-gradient-to-r from-transparent via-white/20 to-transparent lg:block" />

          {careerSteps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardItem}
              whileHover={{ y: -7 }}
              className="group relative rounded-[26px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
            >
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-black text-accent transition duration-300 group-hover:bg-accent group-hover:text-dark">
                {step.number}
              </div>

              <h3 className="mt-6 text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CareerProcessSection;
