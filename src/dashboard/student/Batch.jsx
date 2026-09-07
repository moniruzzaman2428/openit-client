import { useEffect, useState } from 'react';
import {
  FaClock,
  FaCalendarAlt,
  FaDoorOpen,
  FaUser,
  FaUsers,
  FaSpinner,
} from 'react-icons/fa';
import api from '../../services/api';

const Batch = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/students/me');
        const data = res?.data?.data?.student || res?.data?.student || res?.data?.data;
        setStudent(data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <FaSpinner className="text-2xl text-primary animate-spin" />
      </div>
    );
  }

  const batch = student?.batch || {};
  const course = student?.course || {};
  const days = Array.isArray(batch.days)
    ? batch.days.join(', ')
    : batch.days || '—';
  const teacher =
    batch.teacher?.name || course.instructor?.name || course.teacher?.name || '—';
  const status = batch.status || student?.status || 'ongoing';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Batch</h1>
        <p className="text-gray-500 text-sm">Your batch information and schedule</p>
      </div>

      {!batch.name && !batch._id ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400">
          No batch assigned yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dark">{batch.name || 'Batch'}</h2>
              <p className="text-primary font-medium">{course.title || course.name || '—'}</p>
            </div>
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-lg capitalize">
              {status}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: FaClock, label: 'Class Time', value: batch.time || '—' },
              { icon: FaCalendarAlt, label: 'Class Days', value: days },
              { icon: FaDoorOpen, label: 'Room', value: batch.room || '—' },
              { icon: FaUser, label: 'Teacher', value: teacher },
              {
                icon: FaUsers,
                label: 'Total Students',
                value: batch.currentStudents ?? batch.totalStudents ?? '—',
              },
              {
                icon: FaCalendarAlt,
                label: 'Start Date',
                value: batch.startDate
                  ? new Date(batch.startDate).toLocaleDateString('en-GB')
                  : student?.admissionDate
                  ? new Date(student.admissionDate).toLocaleDateString('en-GB')
                  : '—',
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-light">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <item.icon className="text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="font-medium text-dark text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Batch;