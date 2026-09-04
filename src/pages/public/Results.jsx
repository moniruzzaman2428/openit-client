import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaSpinner, 
  FaUserGraduate, 
  FaAward, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaBookOpen, 
  FaCalendarAlt, 
  FaTrophy,
  FaExclamationTriangle,
  FaIdCard
} from 'react-icons/fa';
import { getResults } from '../../services/resultService'; // getResults ব্যবহার করা হয়েছে
import SEO from '../../components/seo/SEO';

// গ্রেড কালার সিস্টেম
const getGradeColor = (grade) => {
  if (!grade) return 'bg-gray-100 text-gray-600';
  if (['A+', 'A', 'A-'].includes(grade)) return 'bg-emerald-100 text-emerald-700';
  if (['B+', 'B', 'B-'].includes(grade)) return 'bg-blue-100 text-blue-700';
  if (['C+', 'C'].includes(grade)) return 'bg-yellow-100 text-yellow-700';
  if (['D'].includes(grade)) return 'bg-orange-100 text-orange-700';
  if (['F'].includes(grade)) return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-600';
};

const Results = () => {
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [allResults, setAllResults] = useState([]); // সব রেজাল্ট জমা রাখার state

  // রোল / স্টুডেন্ট আইডি দিয়ে রেজাল্ট খোঁজা
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!studentId.trim()) {
      setError('অনুগ্রহ করে আপনার রোল নম্বর বা স্টুডেন্ট আইডি লিখুন।');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: সব রেজাল্ট লোড করা
      const res = await getResults({ limit: 500 }); // অনেক ডেটা আনার চেষ্টা
      
      // Step 2: API রেসপন্স থেকে অ্যারে বের করা
      const data = res?.data?.results || res?.results || res?.data || [];
      
      // Step 3: অ্যারে হলে সেটা state এ রাখা
      if (Array.isArray(data)) {
        setAllResults(data);
        
        // Step 4: স্টুডেন্ট আইডি দিয়ে ফিল্টার করা
        const foundResult = data.find(
          (item) => 
            item.student?.studentId?.toString().toLowerCase() === studentId.trim().toLowerCase() ||
            item.student?._id?.toString() === studentId.trim() ||
            item.studentId?.toString().toLowerCase() === studentId.trim().toLowerCase()
        );

        if (foundResult) {
          // ডেটা ম্যাপ করা
          setResult({
            ...foundResult,
            studentName: foundResult.student?.name || 'Student',
            studentId: foundResult.student?.studentId || foundResult.student?._id || studentId,
            examTitle: foundResult.exam?.title || 'Final Exam',
            courseTitle: foundResult.course?.title || 'General Course',
            publishedAt: foundResult.publishedAt || foundResult.createdAt || new Date().toISOString(),
            marks: foundResult.marks || 0,
            grade: foundResult.grade || 'N/A',
            status: foundResult.status || 'fail'
          });
        } else {
          setError('দুঃখিত, এই রোল নম্বরে কোনো রেজাল্ট পাওয়া যায়নি।');
        }
      } else {
        setError('সার্ভার থেকে সঠিক ডেটা পাওয়া যায়নি।');
      }
    } catch (err) {
      console.error('Error fetching result:', err);
      setError(err.response?.data?.message || 'রেজাল্ট খুঁজতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStudentId('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Result Search" description="Search your examination results by Roll Number or Student ID at OPEN IT INSTITUTE" path="/results" />

      {/* ========== HERO SECTION ========== */}
      <section className="bg-gradient-to-br from-[#06111f] via-[#0b2440] to-[#07111d] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '55px 55px' }}></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10 mb-6">
              <FaTrophy className="text-cyan-300" />
              <span className="text-sm font-bold tracking-widest uppercase text-cyan-300">Result Search Portal</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-3">আপনার রেজাল্ট খুঁজুন</h1>
            <p className="text-white/80 text-lg md:text-xl">রোল নম্বর বা স্টুডেন্ট আইডি দিয়ে আপনার ফলাফল দেখুন</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ========== SEARCH FORM ========== */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg shadow-gray-100/50 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center shadow-lg">
                <FaIdCard className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Search Result</h2>
                <p className="text-sm text-gray-500">নিচে আপনার রোল / স্টুডেন্ট আইডি লিখুন</p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="যেমন: 2026001 বা STD-2026-01"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition text-center font-bold tracking-wider"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-900 to-cyan-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Searching...
                  </>
                ) : (
                  <>
                    <FaSearch /> Search Result
                  </>
                )}
              </motion.button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl"
              >
                <FaExclamationTriangle className="flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            )}
          </motion.div>

          {/* ========== RESULT DISPLAY ========== */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
              >
                {/* Result Header */}
                <div className={`p-6 text-white ${result.status === 'pass' ? 'bg-gradient-to-r from-emerald-600 to-green-600' : 'bg-gradient-to-r from-red-600 to-rose-600'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                        <FaUserGraduate className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Student Name</p>
                        <h3 className="text-xl font-bold">{result.studentName}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm">ID</p>
                      <p className="text-lg font-bold">{result.studentId}</p>
                    </div>
                  </div>
                </div>

                {/* Result Body */}
                <div className="p-6">
                  {/* Status */}
                  <div className="flex items-center justify-center mb-6">
                    <span className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold ${result.status === 'pass' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {result.status === 'pass' ? <FaCheckCircle className="text-lg" /> : <FaTimesCircle className="text-lg" />}
                      {result.status === 'pass' ? 'Congratulations! You Passed' : 'You Failed'}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Marks</p>
                      <p className={`text-3xl font-extrabold ${result.status === 'pass' ? 'text-emerald-600' : 'text-red-600'}`}>{result.marks}</p>
                    </div>
                    <div className={`rounded-2xl p-4 text-center border ${getGradeColor(result.grade)}`}>
                      <p className="text-xs uppercase tracking-wider mb-1 opacity-75">Grade</p>
                      <p className="text-3xl font-extrabold">{result.grade}</p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                      <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Exam</p>
                      <p className="text-sm font-bold text-blue-900 line-clamp-2">{result.examTitle}</p>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500 flex items-center gap-2">
                        <FaBookOpen className="text-purple-600" /> Course
                      </span>
                      <span className="text-sm font-bold text-gray-800">{result.courseTitle}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500 flex items-center gap-2">
                        <FaCalendarAlt className="text-cyan-600" /> Published
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {new Date(result.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => window.print()}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition text-sm"
                    >
                      Print Result
                    </button>
                    <button 
                      onClick={handleReset}
                      className="flex-1 px-4 py-3 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition text-sm"
                    >
                      Search Another
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Not Found State (যদি না পাওয়া যায়) */}
          {!loading && !result && !error && (
            <div className="text-center py-10">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-3xl text-gray-300" />
              </div>
              <p className="text-gray-400">আপনার রোল নম্বর লিখে রেজাল্ট খুঁজুন</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Results;