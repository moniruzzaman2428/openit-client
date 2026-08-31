import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaClock, 
  FaUser, 
  FaCheckCircle, 
  FaArrowLeft, 
  FaSpinner,
  FaGraduationCap,
  FaBookOpen,
  FaAward,
  FaRocket,
  FaChartLine,
  FaUsers,
  FaTag,
  FaRegCalendarAlt,
  FaLayerGroup,
  FaStar,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLink,
  FaArrowRight
} from 'react-icons/fa';
import { getCourse } from '../../services/courseService';
import SEO from '../../components/seo/SEO';
import StructuredData, { courseSchema, breadcrumbSchema } from '../../components/seo/StructuredData';

const CourseDetails = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCourse(slug);
        setCourse(res.data.course);
      } catch (err) {
        setError(err.response?.data?.message || 'Course not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  const handleShare = async () => {
    const shareData = {
      title: course.title,
      text: `Learn ${course.title} at Open IT Institute`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="text-4xl text-primary animate-spin mb-4" />
        <p className="text-gray-500">Loading course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 px-4"
      >
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <FaBookOpen className="text-3xl text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">Course Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'The course you\'re looking for doesn\'t exist.'}</p>
          <Link 
            to="/courses" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition"
          >
            <FaArrowLeft /> Browse All Courses
          </Link>
        </div>
      </motion.div>
    );
  }

  const discounted = course.discount
    ? Math.round(course.fee - (course.fee * course.discount) / 100)
    : course.fee;

  const levelColors = {
    beginner: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    intermediate: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    advanced: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
  };

  const levelInfo = levelColors[course.level] || levelColors.beginner;

  return (
    <div className="overflow-hidden">
      <SEO
        title={course.title}
        description={course.description?.slice(0, 160) || course.title}
        path={`/courses/${course.slug}`}
      />
      <StructuredData
        data={[
          courseSchema(course),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Courses', url: '/courses' },
            { name: course.title, url: `/courses/${course.slug}` }
          ])
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-[#0a3a63] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            to="/courses" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition" />
            Back to Courses
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${levelInfo.bg} ${levelInfo.text} border ${levelInfo.border}`}>
                  {course.level || 'All Levels'}
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-semibold">
                  {course.category || 'General'}
                </span>
                {course.discount > 0 && (
                  <span className="px-3 py-1 rounded-lg bg-accent text-dark text-xs font-bold">
                    {course.discount}% OFF
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-white/80 text-lg max-w-2xl">
                {course.shortDescription || course.description?.slice(0, 150) + '...'}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mt-6 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <FaClock /> {course.duration}
                </span>
                {course.instructor && (
                  <span className="flex items-center gap-1.5">
                    <FaUser /> {course.instructor}
                  </span>
                )}
                {course.students && (
                  <span className="flex items-center gap-1.5">
                    <FaUsers /> {course.students} students
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex items-center justify-end"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-sm w-full">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">৳{discounted.toLocaleString()}</div>
                  {course.discount > 0 && (
                    <div className="text-sm text-white/50 line-through">৳{course.fee.toLocaleString()}</div>
                  )}
                  <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" /> 4.8
                    </span>
                    <span>|</span>
                    <span>{course.students || 0} enrolled</span>
                  </div>
                  <Link
                    to="/admission"
                    className="mt-4 block w-full py-3 bg-accent text-dark font-bold rounded-xl hover:shadow-xl transition hover:scale-105"
                  >
                    ভর্তি হোন এখনই
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <FaBookOpen className="text-primary" />
                  Course Description
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </motion.div>

              {/* Curriculum */}
              {course.curriculum?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                    <FaLayerGroup className="text-primary" />
                    Curriculum
                  </h2>
                  <div className="space-y-2">
                    {course.curriculum.map((item, i) => (
                      <div 
                        key={i} 
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition"
                      >
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Requirements & Benefits Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {course.requirements?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                      <FaCheckCircle className="text-primary" />
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {course.requirements.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {course.benefits?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                      <FaAward className="text-accent" />
                      Benefits
                    </h3>
                    <ul className="space-y-2">
                      {course.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <FaRocket className="text-accent mt-0.5 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              {/* What You'll Learn */}
              {course.whatYouWillLearn?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10"
                >
                  <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                    <FaGraduationCap className="text-primary" />
                    What You'll Learn
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <FaCheckCircle className="text-accent flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 space-y-6">
                {/* Course Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="text-center pb-4 border-b border-gray-100">
                    <div className="text-4xl font-bold text-primary mb-1">৳{discounted.toLocaleString()}</div>
                    {course.discount > 0 && (
                      <div className="text-sm text-gray-400 line-through">৳{course.fee.toLocaleString()}</div>
                    )}
                    {course.discount > 0 && (
                      <span className="inline-block mt-1 text-xs font-bold bg-accent/20 text-accent px-3 py-1 rounded-lg">
                        Save ৳{course.fee - discounted}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 py-4 border-b border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-medium text-dark">{course.duration}</span>
                    </div>
                    {course.classHours && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Class Hours</span>
                        <span className="font-medium text-dark">{course.classHours}</span>
                      </div>
                    )}
                    {course.instructor && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Instructor</span>
                        <span className="font-medium text-dark">{course.instructor}</span>
                      </div>
                    )}
                    {course.students && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Students</span>
                        <span className="font-medium text-dark">{course.students}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Level</span>
                      <span className={`font-medium capitalize ${levelInfo.text}`}>
                        {course.level || 'All Levels'}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/admission"
                    className="block w-full mt-4 py-3.5 text-center bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl transition hover:shadow-xl hover:scale-105"
                  >
                    ভর্তি হোন এখনই
                  </Link>
                </motion.div>

                {/* Share & Bookmark */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        {isBookmarked ? (
                          <FaBookmark className="text-primary text-lg" />
                        ) : (
                          <FaRegBookmark className="text-gray-400 text-lg" />
                        )}
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <FaShare className="text-gray-400 text-lg" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Share:</span>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                        <FaWhatsapp className="text-green-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                        <FaFacebook className="text-blue-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Related Info */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-4 border border-primary/10">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaRegCalendarAlt className="text-primary" />
                    <span>Last updated: {new Date(course.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
            <div>
              <h3 className="text-2xl font-bold">Ready to Start Your Learning Journey?</h3>
              <p className="text-white/80">Join thousands of students and start your IT career today</p>
            </div>
            <Link
              to="/admission"
              className="px-8 py-3 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition hover:scale-105"
            >
              Apply Now <FaArrowRight className="inline ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;