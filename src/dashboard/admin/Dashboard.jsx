import { motion } from 'framer-motion';
import {
  FaUserGraduate, FaChalkboardTeacher, FaBook, FaLayerGroup,
  FaUserPlus, FaMoneyBillWave, FaChartLine, FaUsers
} from 'react-icons/fa';

const stats = [
  { title: 'Total Students', value: '1,248', icon: FaUserGraduate, color: 'bg-blue-500', change: '+12%' },
  { title: 'Active Students', value: '986', icon: FaUsers, color: 'bg-green-500', change: '+8%' },
  { title: 'Teachers', value: '24', icon: FaChalkboardTeacher, color: 'bg-purple-500', change: '+2' },
  { title: 'Courses', value: '15', icon: FaBook, color: 'bg-orange-500', change: '+3' },
  { title: 'Batches', value: '32', icon: FaLayerGroup, color: 'bg-cyan-500', change: '+5' },
  { title: 'Pending Admissions', value: '18', icon: FaUserPlus, color: 'bg-amber-500', change: '5 new' },
  { title: 'Total Payments', value: '৳4.2L', icon: FaMoneyBillWave, color: 'bg-emerald-500', change: '+15%' },
  { title: 'Monthly Revenue', value: '৳85K', icon: FaChartLine, color: 'bg-rose-500', change: '+22%' }
];

const recentAdmissions = [
  { name: 'Rahim Ahmed', course: 'Web Development', date: '2026-08-28', status: 'pending' },
  { name: 'Fatima Khan', course: 'Graphic Design', date: '2026-08-27', status: 'approved' },
  { name: 'Karim Hassan', course: 'Digital Marketing', date: '2026-08-27', status: 'pending' },
  { name: 'Nusrat Jahan', course: 'Web Design', date: '2026-08-26', status: 'approved' },
  { name: 'Sakib Al Hasan', course: 'Freelancing', date: '2026-08-25', status: 'rejected' }
];

const statusBadge = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening at Open IT Institute.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-dark">{stat.value}</p>
                <p className="text-xs text-success mt-1 font-medium">{stat.change}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${stat.color} text-white flex items-center justify-center shadow-lg`}>
                <stat.icon className="text-lg" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-dark mb-4">Student Growth</h3>
          <div className="h-56 flex items-end justify-around gap-2 px-2">
            {[40, 55, 45, 70, 60, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-gray-400">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Admissions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-dark">Recent Admissions</h3>
            <a href="/admin/admissions" className="text-sm text-primary font-medium hover:underline">View All</a>
          </div>
          <div className="space-y-3">
            {recentAdmissions.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-dark">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.course} · {item.date}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusBadge[item.status]}`}>
                  {item.status}
                </span>
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
            { label: 'Add Student', path: '/admin/students', color: 'bg-blue-50 text-blue-600' },
            { label: 'Add Course', path: '/admin/courses', color: 'bg-orange-50 text-orange-600' },
            { label: 'View Admissions', path: '/admin/admissions', color: 'bg-amber-50 text-amber-600' },
            { label: 'Add Payment', path: '/admin/payments', color: 'bg-emerald-50 text-emerald-600' }
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
