import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaClock } from 'react-icons/fa';
import { courses } from '../data/homeData';
import SectionTitle from './SectionTitle';
import {
  cardItem,
  sectionViewport,
  staggerContainer,
} from '../data/motionVariants';

const CoursesSection = () => {
  return (
    <section className="relative bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            align="left"
            badge="Popular Courses"
            title="ক্যারিয়ারের জন্য সঠিক স্কিল বেছে নিন"
            description="বর্তমান চাকরি ও ফ্রিল্যান্স মার্কেটের প্রয়োজন অনুযায়ী সাজানো আমাদের জনপ্রিয় কোর্সগুলো দেখুন।"
          />

          <motion.div whileHover={{ x: 4 }}>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 font-bold text-primary"
            >
              View All Courses
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {courses.map((course) => (
            <motion.article
              key={course.title}
              variants={cardItem}
              whileHover={{ y: -9 }}
              className="group overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_10px_35px_rgba(15,23,42,.05)] transition-shadow duration-300 hover:shadow-[0_28px_70px_rgba(15,23,42,.12)]"
            >
              <div
                className={`relative h-44 overflow-hidden bg-gradient-to-br ${course.color}`}
              >
                <motion.div
                  animate={{ rotate: [0, 7, 0], scale: [1, 1.06, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/20"
                />
                <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-xl" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/20 bg-white/15 text-white shadow-xl backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <course.icon className="text-3xl" />
                  </div>
                </div>

                <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                  Career Course
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-dark transition group-hover:text-primary">
                  {course.title}
                </h3>

                <div className="mt-5 flex items-center justify-between border-y border-gray-100 py-4 text-sm">
                  <span className="inline-flex items-center gap-2 text-gray-500">
                    <FaClock className="text-primary" />
                    {course.duration}
                  </span>
                  <span className="text-lg font-black text-primary">
                    ৳{course.fee}
                  </span>
                </div>

                <Link
                  to="/courses"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-50 px-4 py-3.5 text-sm font-bold text-dark transition duration-300 group-hover:bg-primary group-hover:text-white"
                >
                  View Course
                  <FaArrowRight />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;
