import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaClipboardCheck,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTrophy,
  FaBook,
  FaBullhorn,
  FaSpinner,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const pick = (res, ...paths) => {
  for (const p of paths) {
    const parts = p.split('.');
    let cur = res;
    for (const part of parts) {
      cur = cur?.[part];
    }
    if (cur !== undefined && cur !== null) return cur;
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0, percentage: 0 });
  const [due, setDue] = useState(0);
  const [paid, setPaid] = useState(0);
  const [notices, setNotices] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, attRes, payRes, noticeRes, resultRes] = await Promise.allSettled([
          api.get('/students/me'),
          api.get('/attendance'),
          api.get('/payments/summary'),
          api.get('/notices'),
          api.get('/results'),
        ]);

        if (meRes.status === 'fulfilled') {
          const data =
            pick(meRes.value, 'data.data.student', 'data.student', 'data.data') || null;
          setStudent(data);
        }

        if (attRes.status === 'fulfilled') {
          const att = attRes.value;
          const s =
            pick(att, 'data.stats', 'stats', 'data.data.stats') || {
              total: 0,
              present: 0,
              absent: 0,
              late: 0,
              percentage: 0,
            };
          setStats({
            total: s.total || 0,
            present: s.present || 0,
            absent: s.absent || 0,
            late: s.late || 0,
            percentage: s.percentage || 0,
          });
        }

        if (payRes.status === 'fulfilled') {
          const pay = pick(payRes.value, 'data.data', 'data') || {};
          setDue(pay.dueAmount || 0);
          setPaid(pay.paidAmount || 0);
        }

        if (noticeRes.status === 'fulfilled') {
          const list =
            pick(noticeRes.value, 'data.data.notices', 'data.notices', 'data.data') || [];
          setNotices(Array.isArray(list) ? list.slice(0, 5) : []);
        }

        if (resultRes.status === 'fulfilled') {
          const list =
            pick(resultRes.value, 'data.data.results', 'data.results', 'data.data') || [];
          if (Array.isArray(list) && list.length) {
            const sorted = [...list].sort((a, b) => {
              const da = new Date(a.publishedAt || a.createdAt || 0).getTime();
              const db = new Date(b.publishedAt || b.createdAt || 0).getTime();
              return db - da;
            });
            setLatestResult(sorted[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const courseTitle =
    student?.course?.title || student?.course?.name || 'Not assigned';
  const batchName = student?.batch?.name || 'Not assigned';
  const batchTime = student?.batch?.time || '';
  const teacherName =
    student?.batch?.teacher?.name ||
    student?.course?.instructor?.name ||
    student?.course?.teacher?.name ||
    '—';

  const days = student?.batch?.days;
  const dayList = Array.isArray(days) ? days : typeof days === 'string' ? days.split(',') : [];
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const hasClassToday = dayList.some(
    (d) => String(d).trim().toLowerCase() === todayName.toLowerCase()
  );

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <FaSpinner className="text-2xl text-primary animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Attendance',
      value: `${stats.percentage || 0}%`,
      icon: FaClipboardCheck,
      color: 'bg-green-500',
      sub: `Present: ${stats.present}/${stats.total}`,
    },
    {
      title: 'Payment Due',
      value: `৳${Number(due || 0).toLocaleString()}`,
      icon: FaMoneyBillWave,
      color: due > 0 ? 'bg-amber-500' : 'bg-green-500',
      sub: paid > 0 ? `Paid ৳${Number(paid).toLocaleString()}` : 'No payment yet',
    },
    {
      title: 'Upcoming Class',
      value: hasClassToday ? 'Today' : dayList[0] || '—',
      icon: FaCalendarAlt,
      color: 'bg-blue-500',
      sub: batchTime || 'See routine',
    },
    {
      title: 'Latest Result',
      value: latestResult?.grade || '—',
      icon: FaTrophy,
      color: 'bg-purple-500',
      sub: latestResult?.exam?.title || 'No result yet',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-[#0a3a63] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 overflow-hidden flex items-center justify-center text-2xl font-bold">
            {student?.photo || student?.userId?.profileImage || user?.profileImage ? (
              <img
                src={student?.photo || student?.userId?.profileImage || user?.profileImage}
                alt={student?.name || user?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              (student?.name || user?.name || 'S').charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {student?.name || user?.name || 'Student'}!
            </h1>
            <p className="text-white/70 text-sm mt-0.5">
              Student ID: {student?.studentId || '—'} · {courseTitle} · {batchName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-xl ${stat.color} text-white flex items-center justify-center mb-3 shadow-lg`}
            >
              <stat.icon />
            </div>
            <p className="text-xs text-gray-500">{stat.title}</p>
            <p className="text-xl font-bold text-dark mt-0.5">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
            <FaBook className="text-primary" /> My Course
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Course</span>
              <span className="font-medium text-dark">{courseTitle}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium text-dark">
                {student?.course?.duration || '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Batch</span>
              <span className="font-medium text-dark">
                {batchName}
                {batchTime ? ` (${batchTime})` : ''}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Instructor</span>
              <span className="font-medium text-dark">{teacherName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-lg capitalize">
                {student?.status || 'active'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
            <FaBullhorn className="text-accent" /> Latest Notices
          </h3>
          <div className="space-y-3">
            {notices.length === 0 ? (
              <p className="text-sm text-gray-400">No notices yet.</p>
            ) : (
              notices.map((n) => (
                <div
                  key={n._id || n.id}
                  className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 gap-3"
                >
                  <p className="text-sm font-medium text-dark">{n.title}</p>
                  <span className="text-xs text-gray-400 shrink-0">
                    {n.createdAt || n.date
                      ? new Date(n.createdAt || n.date).toLocaleDateString()
                      : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
          <FaClipboardCheck className="text-success" /> Attendance Overview
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-xl bg-green-50">
            <p className="text-2xl font-bold text-success">{stats.present}</p>
            <p className="text-xs text-gray-500">Present</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-red-50">
            <p className="text-2xl font-bold text-danger">{stats.absent}</p>
            <p className="text-xs text-gray-500">Absent</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-amber-50">
            <p className="text-2xl font-bold text-accent">{stats.late}</p>
            <p className="text-xs text-gray-500">Late</p>
          </div>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
            style={{ width: `${Math.min(stats.percentage || 0, 100)}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          Overall Attendance:{' '}
          <span className="font-bold text-success">{stats.percentage || 0}%</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;