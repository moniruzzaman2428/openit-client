import { motion } from 'framer-motion';
import {
  FaClipboardCheck, FaMoneyBillWave, FaCalendarAlt, FaTrophy,
  FaBook, FaLayerGroup, FaBullhorn, FaUserGraduate
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-[#0a3a63] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Student'}!</h1>
            <p className="text-white/70 text-sm mt-0.5">Student ID: OIT26001 · Web Development · Batch A</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Attendance', value: '92%', icon: FaClipboardCheck, color: 'bg-green-500', sub: 'Present: 46/50' },
          { title: 'Payment Due', value: '৳3,000', icon: FaMoneyBillWave, color: 'bg-amber-500', sub: 'Partial paid' },
          { title: 'Upcoming Class', value: 'Today', icon: FaCalendarAlt, color: 'bg-blue-500', sub: '10:00 AM' },
          { title: 'Latest Result', value: 'A+', icon: FaTrophy, color: 'bg-purple-500', sub: 'Monthly Test' }
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} text-white flex items-center justify-center mb-3 shadow-lg`}>
              <stat.icon />
            </div>
            <p className="text-xs text-gray-500">{stat.title}</p>
            <p className="text-xl font-bold text-dark mt-0.5">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Course Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
            <FaBook className="text-primary" /> My Course
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Course</span>
              <span className="font-medium text-dark">Web Development</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium text-dark">6 Months</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Batch</span>
              <span className="font-medium text-dark">Batch A (10:00 AM)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Instructor</span>
              <span className="font-medium text-dark">Tanvir Ahmed</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-lg">Active</span>
            </div>
          </div>
        </div>

        {/* Latest Notice */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
            <FaBullhorn className="text-accent" /> Latest Notices
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Monthly Exam on 30th August', date: '2026-08-28' },
              { title: 'Assignment submission deadline', date: '2026-08-26' },
              { title: 'Holiday Notice', date: '2026-08-25' }
            ].map((n, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <p className="text-sm font-medium text-dark">{n.title}</p>
                <span className="text-xs text-gray-400">{n.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Progress */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
          <FaClipboardCheck className="text-success" /> Attendance Overview
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-xl bg-green-50">
            <p className="text-2xl font-bold text-success">46</p>
            <p className="text-xs text-gray-500">Present</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-red-50">
            <p className="text-2xl font-bold text-danger">3</p>
            <p className="text-xs text-gray-500">Absent</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-amber-50">
            <p className="text-2xl font-bold text-accent">1</p>
            <p className="text-xs text-gray-500">Late</p>
          </div>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full" style={{ width: '92%' }} />
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">Overall Attendance: <span className="font-bold text-success">92%</span></p>
      </div>
    </div>
  );
};

export default Dashboard;
