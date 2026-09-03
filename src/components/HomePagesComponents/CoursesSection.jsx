import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaClock, FaUserGraduate, FaStar } from 'react-icons/fa';
import { courses } from '../data/homeData';
import SectionTitle from './SectionTitle';
import {
  cardItem,
  sectionViewport,
  staggerContainer,
} from '../data/motionVariants';

// Real course images (Unsplash)
const courseImages = {
  'Web Development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=400&fit=crop',
  'Mobile App Development': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
  'Digital Marketing': 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2f56c?w=800&h=400&fit=crop',
  'Graphic Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
  'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  'Cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
};

// Student count for each course
const studentCounts = {
  'Web Development': '1,250+',
  'Mobile App Development': '980+',
  'Digital Marketing': '850+',
  'Graphic Design': '720+',
  'Data Science': '640+',
  'Cybersecurity': '580+',
};

// Rating for each course
const courseRatings = {
  'Web Development': 4.9,
  'Mobile App Development': 4.8,
  'Digital Marketing': 4.7,
  'Graphic Design': 4.8,
  'Data Science': 4.9,
  'Cybersecurity': 4.7,
};

const CoursesSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-20 sm:py-24 lg:py-28">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-100/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            align="left"
            badge="🎓 Popular Courses"
            title="ক্যারিয়ারের জন্য সঠিক স্কিল বেছে নিন"
            description="বর্তমান চাকরি ও ফ্রিল্যান্স মার্কেটের প্রয়োজন অনুযায়ী সাজানো আমাদের জনপ্রিয় কোর্সগুলো দেখুন।"
            light={false}
          />

          <motion.div whileHover={{ x: 4 }}>
            <Link
              to="/courses"
              className="group inline-flex items-center gap-2 font-bold text-blue-600 transition-all hover:text-blue-700"
            >
              View All Courses
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
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
          {courses.map((course) => {
            const imageUrl = courseImages[course.title] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop';
            const students = studentCounts[course.title] || '500+';
            const rating = courseRatings[course.title] || 4.5;
            
            return (
              <motion.article
                key={course.title}
                variants={cardItem}
                whileHover={{ y: -10 }}
                className="group overflow-hidden rounded-3xl border border-gray-100/80 bg-white shadow-xl shadow-gray-200/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-300/50"
              >
                {/* Course Image */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700">
                  {/* Main Image */}
                  <img
                    src={imageUrl}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Decorative Elements */}
                  <motion.div
                    animate={{ rotate: [0, 7, 0], scale: [1, 1.06, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/10"
                  />
                  
                  {/* Course Category Badge */}
                  <span className="absolute left-4 top-4 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white border border-white/10">
                    {course.category || 'Career Course'}
                  </span>

                  {/* Rating Badge */}
                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/30 backdrop-blur-md px-3 py-1.5 border border-white/10">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="text-xs font-bold text-white">{rating}</span>
                  </div>

                  {/* Course Icon */}
                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <course.icon className="text-xl" />
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/30 backdrop-blur-md px-3 py-1.5 border border-white/10">
                    <FaClock className="text-white/70 text-xs" />
                    <span className="text-xs font-medium text-white">{course.duration}</span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                    {course.title}
                  </h3>

                  {/* Course Meta Info */}
                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <FaUserGraduate className="text-blue-500" />
                      {students} Students
                    </span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-xs" />
                      {rating} Rating
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="mt-4 h-px bg-gradient-to-r from-gray-200 to-transparent" />

                  {/* Price and Button */}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-blue-600">
                        ৳{course.fee}
                      </span>
                      <span className="ml-2 text-xs text-gray-400 line-through">
                        ৳{Math.round(course.fee * 1.4)}
                      </span>
                    </div>
                    
                    <Link
                      to={`/courses/${course.slug || course.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="group/btn inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-105"
                    >
                      Enroll Now
                      <FaArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;