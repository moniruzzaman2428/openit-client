import { useEffect, useState } from 'react';
import { FaClock, FaUser, FaTag, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';

const Course = () => {
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

  const course = student?.course || {};
  const teacher =
    course.instructor?.name ||
    course.teacher?.name ||
    student?.batch?.teacher?.name ||
    '—';
  const fee = course.fee != null ? Number(course.fee) : null;
  const discount = course.discount != null ? Number(course.discount) : 0;
  const payable = fee != null ? Math.max(fee - discount, 0) : null;
  const modules = course.curriculum || course.modules || course.topics || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Course</h1>
        <p className="text-gray-500 text-sm">Your enrolled course details</p>
      </div>

      {!course.title && !course.name ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400">
          No course assigned yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-secondary flex items-center justify-center px-4">
            <h2 className="text-2xl font-bold text-white text-center">
              {course.title || course.name}
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-gray-600 leading-relaxed">
              {course.description || course.shortDescription || 'Course details will appear here.'}
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-light">
                <FaClock className="text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="font-medium text-dark text-sm">{course.duration || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-light">
                <FaUser className="text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Instructor</p>
                  <p className="font-medium text-dark text-sm">{teacher}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-light">
                <FaTag className="text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Fee</p>
                  <p className="font-medium text-dark text-sm">
                    {payable != null ? `৳${payable.toLocaleString()}` : '—'}
                  </p>
                </div>
              </div>
            </div>

            {Array.isArray(modules) && modules.length > 0 && (
              <div>
                <h3 className="font-bold text-dark mb-3">Curriculum</h3>
                <ul className="space-y-2">
                  {modules.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-success text-xs" />
                      {typeof item === 'string' ? item : item.title || item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;