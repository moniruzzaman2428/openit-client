import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const students = [
  { id: 1, studentId: 'OIT26001', name: 'Rahim Ahmed', course: 'Web Development', batch: 'Batch A', phone: '01711111111', attendance: 92 },
  { id: 2, studentId: 'OIT26004', name: 'Nusrat Jahan', course: 'Web Design', batch: 'Batch C', phone: '01744444444', attendance: 88 },
  { id: 3, studentId: 'OIT26007', name: 'Imran Hossain', course: 'Web Development', batch: 'Batch A', phone: '01777777777', attendance: 95 },
  { id: 4, studentId: 'OIT26008', name: 'Sadia Islam', course: 'Freelancing', batch: 'Batch E', phone: '01788888888', attendance: 78 },
  { id: 5, studentId: 'OIT26009', name: 'Mahmud Hasan', course: 'Web Development', batch: 'Batch A', phone: '01799999999', attendance: 85 },
  { id: 6, studentId: 'OIT26010', name: 'Farzana Akter', course: 'Web Design', batch: 'Batch C', phone: '01611111111', attendance: 90 }
];

const Students = () => {
  const [search, setSearch] = useState('');

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Students</h1>
        <p className="text-gray-500 text-sm">Students in your assigned batches</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-5 py-3.5 font-medium">Student ID</th>
                <th className="px-5 py-3.5 font-medium">Name</th>
                <th className="px-5 py-3.5 font-medium hidden md:table-cell">Course</th>
                <th className="px-5 py-3.5 font-medium hidden lg:table-cell">Batch</th>
                <th className="px-5 py-3.5 font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-5 py-3.5 font-mono text-xs text-secondary font-semibold">{s.studentId}</td>
                  <td className="px-5 py-3.5 font-medium text-dark">{s.name}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{s.course}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{s.batch}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                        <div
                          className={`h-full rounded-full ${s.attendance >= 80 ? 'bg-success' : s.attendance >= 60 ? 'bg-accent' : 'bg-danger'}`}
                          style={{ width: `${s.attendance}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{s.attendance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
