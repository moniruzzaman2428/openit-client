import { motion } from 'framer-motion';
import {
  FaBook, FaLayerGroup, FaUserGraduate, FaClipboardCheck,
  FaCalendarAlt, FaTrophy
} from 'react-icons/fa';

const stats = [
  { title: 'My Courses', value: '4', icon: FaBook, color: 'bg-blue-500' },
  { title: 'My Batches', value: '6', icon: FaLayerGroup, color: 'bg-cyan-500' },
  { title: 'My Students', value: '142', icon: FaUserGraduate, color: 'bg-green-500' },
  { title: 'Today\'s Classes', value: '3', icon: FaCalendarAlt, color: 'bg-orange-500' }
];

const todayClasses = [
  { batch: 'Batch A', course: 'Web Development', time: '10:00 AM - 12:00 PM', room: 'Lab 1', students: 25 },
  { batch: 'Batch C', course: 'Web Design', time: '01:00 PM - 03:00 PM', room: 'Lab 2', students: 18 },
  { batch: 'Batch E', course: 'Freelancing', time: '04:30 PM - 06:00 PM', room: 'Room 3', students: 28 }
];

const recentNotices = [
  { title: 'Monthly Exam Schedule Released', date: '2026-08-28' },
  { title: 'New Batch Orientation', date: '2026-08-26' },
  { title: 'Holiday Notice - Independence Day', date: '2026-08-25' }
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Teacher Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your classes, students and academic activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-dark">{stat.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${stat.color} text-white flex items-center justify-center shadow-lg`}>
                <stat.icon className="text-lg" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-secondary" /> Today's Classes
          </h3>
          <div className="space-y-3">
            {todayClasses.map((cls, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-light hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-dark text-sm">{cls.batch} — {cls.course}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cls.time} · {cls.room}</p>
                </div>
                <span className="text-xs font-semibold bg-secondary/10 text-secondary px-2.5 py-1 rounded-lg">
                  {cls.students} students
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
            <FaTrophy className="text-accent" /> Recent Notices
          </h3>
          <div className="space-y-3">
            {recentNotices.map((notice, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <p className="text-sm font-medium text-dark">{notice.title}</p>
                <span className="text-xs text-gray-400">{notice.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-dark mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Mark Attendance', path: '/teacher/attendance', color: 'bg-blue-50 text-blue-600' },
            { label: 'View Students', path: '/teacher/students', color: 'bg-green-50 text-green-600' },
            { label: 'Create Exam', path: '/teacher/exams', color: 'bg-orange-50 text-orange-600' },
            { label: 'Enter Results', path: '/teacher/results', color: 'bg-purple-50 text-purple-600' }
          ].map((action) => (
            <a
              key={action.label}
              href={action.path}
              className={`flex items-center justify-center py-3 rounded-xl text-sm font-semibold ${action.color} hover:opacity-80 transition`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
