import { useEffect, useMemo, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { getMe } from '../../services/authService';
import { getBatches } from '../../services/batchService';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, batchRes, studentRes] = await Promise.all([
          getMe(),
          getBatches({ limit: 500 }),
          api.get('/students', { params: { limit: 500 } }),
        ]);
        setCourses(meRes.data?.profile?.assignedCourses || []);
        setBatches(batchRes.data?.batches || []);
        setStudents(studentRes.data?.data?.students || []);
      } catch (err) {
        setCourses([]);
        setBatches([]);
        setStudents([]);
        Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not load assigned courses.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const metrics = useMemo(() => {
    const map = new Map();
    courses.forEach((course) => map.set(String(course._id), { batches: 0, students: 0 }));
    batches.forEach((batch) => {
      const id = String(batch.course?._id || batch.course || '');
      const current = map.get(id) || { batches: 0, students: 0 };
      current.batches += 1;
      map.set(id, current);
    });
    students.forEach((student) => {
      const id = String(student.course?._id || student.course || '');
      const current = map.get(id) || { batches: 0, students: 0 };
      current.students += 1;
      map.set(id, current);
    });
    return map;
  }, [courses, batches, students]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">My Courses</h1><p className="text-gray-500 text-sm">Courses assigned to your teacher profile</p></div>
      {loading ? <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-secondary animate-spin" /></div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const counts = metrics.get(String(course._id)) || { batches: 0, students: 0 };
            return (
              <div key={course._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-lg font-bold mb-4">{course.title?.charAt(0) || 'C'}</div>
                <h3 className="font-bold text-dark mb-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{course.duration || 'Duration not set'}</p>
                <div className="flex gap-4 text-xs text-gray-400"><span>{counts.batches} batches</span><span>{counts.students} students</span></div>
              </div>
            );
          })}
        </div>
      )}
      {!loading && courses.length === 0 && <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">No courses are assigned to you.</div>}
    </div>
  );
};

export default Courses;
