import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import api from '../../services/api';

const WEEKDAYS = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

const Routine = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

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
  const rawDays = batch.days;
  const days = Array.isArray(rawDays)
    ? rawDays
    : typeof rawDays === 'string'
    ? rawDays.split(',').map((d) => d.trim()).filter(Boolean)
    : [];

  const ordered = WEEKDAYS.filter((d) =>
    days.some((x) => String(x).toLowerCase() === d.toLowerCase())
  );

  const teacher =
    batch.teacher?.name || course.instructor?.name || course.teacher?.name || '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Class Routine</h1>
        <p className="text-gray-500 text-sm">Your weekly class schedule</p>
      </div>

      {ordered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p>No class routine assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ordered.map((day) => (
            <div
              key={day}
              className={`bg-white rounded-2xl p-5 border shadow-sm ${
                day.toLowerCase() === today.toLowerCase()
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-gray-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-dark">{day}</h3>
                    {day.toLowerCase() === today.toLowerCase() && (
                      <span className="text-xs font-semibold bg-primary text-white px-2 py-0.5 rounded-lg">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {course.title || course.name || 'Course'} · {batch.room || 'Room TBA'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Teacher: {teacher}</p>
                </div>
                <span className="text-sm font-bold text-primary">{batch.time || '—'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Routine;