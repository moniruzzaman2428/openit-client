import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaCalendarAlt, FaLayerGroup, FaSpinner, FaTrophy, FaUserGraduate } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { getMe } from '../../services/authService';
import { getBatches } from '../../services/batchService';
import { getNotices } from '../../services/contentService';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [batches, setBatches] = useState([]);
  const [studentTotal, setStudentTotal] = useState(0);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, batchRes, studentRes, noticeRes] = await Promise.all([
          getMe(),
          getBatches({ limit: 500 }),
          api.get('/students', { params: { limit: 1 } }),
          getNotices({ limit: 5, sort: '-publishDate' }),
        ]);
        setProfile(meRes.data?.profile || null);
        setBatches(batchRes.data?.batches || []);
        setStudentTotal(Number(studentRes.data?.total || 0));
        setNotices(noticeRes.data?.notices || []);
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Dashboard Error', text: err.response?.data?.message || 'Could not load teacher dashboard data.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const todayName = useMemo(() => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()], []);
  const todayClasses = useMemo(() => batches.filter((batch) => (batch.days || []).includes(todayName) && batch.status !== 'cancelled'), [batches, todayName]);

  const stats = [
    { title: 'My Courses', value: profile?.assignedCourses?.length || 0, icon: FaBook, color: 'bg-blue-500' },
    { title: 'My Batches', value: batches.length, icon: FaLayerGroup, color: 'bg-cyan-500' },
    { title: 'My Students', value: studentTotal, icon: FaUserGraduate, color: 'bg-green-500' },
    { title: "Today's Classes", value: todayClasses.length, icon: FaCalendarAlt, color: 'bg-orange-500' },
  ];

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="text-3xl text-secondary animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">Teacher Dashboard</h1><p className="text-gray-500 text-sm mt-1">Live teaching overview from the database</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between"><div><p className="text-sm text-gray-500 mb-1">{stat.title}</p><p className="text-2xl font-bold text-dark">{stat.value}</p></div><div className={`w-11 h-11 rounded-xl ${stat.color} text-white flex items-center justify-center shadow-lg`}><stat.icon className="text-lg" /></div></div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2"><FaCalendarAlt className="text-secondary" /> Today's Classes</h3>
          <div className="space-y-3">
            {todayClasses.map((cls) => <div key={cls._id} className="flex items-center justify-between p-3 rounded-xl bg-light hover:bg-gray-50 transition"><div><p className="font-medium text-dark text-sm">{cls.name} — {cls.course?.title || 'Course'}</p><p className="text-xs text-gray-400 mt-0.5">{cls.time || 'Time not set'} · {cls.room || 'Room not set'}</p></div><span className="text-xs font-semibold bg-secondary/10 text-secondary px-2.5 py-1 rounded-lg">{Number(cls.currentStudents || 0)} students</span></div>)}
            {todayClasses.length === 0 && <p className="text-sm text-gray-400 py-4">No classes scheduled for {todayName}.</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2"><FaTrophy className="text-accent" /> Recent Notices</h3>
          <div className="space-y-3">
            {notices.map((notice) => <div key={notice._id} className="flex items-center justify-between gap-4 py-2.5 border-b border-gray-50 last:border-0"><p className="text-sm font-medium text-dark">{notice.title}</p><span className="text-xs text-gray-400 shrink-0">{new Date(notice.publishDate || notice.createdAt).toLocaleDateString()}</span></div>)}
            {notices.length === 0 && <p className="text-sm text-gray-400 py-4">No notices available.</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-dark mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Mark Attendance', path: '/teacher/attendance', color: 'bg-blue-50 text-blue-600' },
            { label: 'View Students', path: '/teacher/students', color: 'bg-green-50 text-green-600' },
            { label: 'Create Exam', path: '/teacher/exams', color: 'bg-orange-50 text-orange-600' },
            { label: 'Enter Results', path: '/teacher/results', color: 'bg-purple-50 text-purple-600' },
          ].map((action) => <a key={action.label} href={action.path} className={`flex items-center justify-center py-3 rounded-xl text-sm font-semibold ${action.color} hover:opacity-80 transition`}>{action.label}</a>)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
