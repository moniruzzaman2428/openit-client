import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { getAttendance } from '../../services/attendanceService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [studentRes, attendanceRes] = await Promise.all([
          api.get('/students', { params: { limit: 500, sort: 'name' } }),
          getAttendance(),
        ]);
        setStudents(studentRes.data?.data?.students || []);
        setAttendance(attendanceRes.data?.attendance || []);
      } catch (err) {
        setStudents([]);
        setAttendance([]);
        Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not load assigned students.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const attendanceByStudent = useMemo(() => {
    const map = new Map();
    attendance.forEach((record) => {
      const id = record.student?._id || record.student;
      if (!id) return;
      const stats = map.get(String(id)) || { total: 0, score: 0 };
      stats.total += 1;
      if (record.status === 'present') stats.score += 1;
      if (record.status === 'late') stats.score += 0.5;
      map.set(String(id), stats);
    });
    return map;
  }, [attendance]);

  const filtered = students.filter((s) => {
    const needle = search.toLowerCase();
    return !needle || s.name?.toLowerCase().includes(needle) || s.studentId?.toLowerCase().includes(needle) || s.phone?.toLowerCase().includes(needle);
  });

  const getPercentage = (id) => {
    const stats = attendanceByStudent.get(String(id));
    return stats?.total ? Math.round((stats.score / stats.total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Students</h1>
        <p className="text-gray-500 text-sm">Only students from your assigned batches</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-secondary animate-spin" /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-left text-gray-500"><th className="px-5 py-3.5 font-medium">Student ID</th><th className="px-5 py-3.5 font-medium">Name</th><th className="px-5 py-3.5 font-medium hidden md:table-cell">Course</th><th className="px-5 py-3.5 font-medium hidden lg:table-cell">Batch</th><th className="px-5 py-3.5 font-medium">Attendance</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s) => {
                  const percentage = getPercentage(s._id);
                  return (
                    <tr key={s._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-5 py-3.5 font-mono text-xs text-secondary font-semibold">{s.studentId}</td>
                      <td className="px-5 py-3.5"><p className="font-medium text-dark">{s.name}</p><p className="text-xs text-gray-400">{s.phone}</p></td>
                      <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{s.course?.title || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{s.batch?.name || '—'}</td>
                      <td className="px-5 py-3.5"><div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-gray-100 rounded-full"><div className={`h-full rounded-full ${percentage >= 80 ? 'bg-success' : percentage >= 60 ? 'bg-accent' : 'bg-danger'}`} style={{ width: `${percentage}%` }} /></div><span className="text-xs font-semibold text-gray-600">{percentage}%</span></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-gray-400">No students found.</div>}
      </div>
    </div>
  );
};

export default Students;
