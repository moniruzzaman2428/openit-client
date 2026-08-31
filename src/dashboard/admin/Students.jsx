import { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaFilter } from 'react-icons/fa';

const mockStudents = [
  { id: 1, studentId: 'OIT26001', name: 'Rahim Ahmed', phone: '01711111111', course: 'Web Development', batch: 'Batch A', status: 'active' },
  { id: 2, studentId: 'OIT26002', name: 'Fatima Khan', phone: '01722222222', course: 'Graphic Design', batch: 'Batch B', status: 'active' },
  { id: 3, studentId: 'OIT26003', name: 'Karim Hassan', phone: '01733333333', course: 'Digital Marketing', batch: 'Batch A', status: 'completed' },
  { id: 4, studentId: 'OIT26004', name: 'Nusrat Jahan', phone: '01744444444', course: 'Web Design', batch: 'Batch C', status: 'active' },
  { id: 5, studentId: 'OIT26005', name: 'Sakib Al Hasan', phone: '01755555555', course: 'Freelancing', batch: 'Batch B', status: 'inactive' },
  { id: 6, studentId: 'OIT26006', name: 'Ayesha Siddique', phone: '01766666666', course: 'Basic Computer', batch: 'Batch D', status: 'active' }
];

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-700',
  suspended: 'bg-red-100 text-red-700'
};

const Students = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockStudents.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Students</h1>
          <p className="text-gray-500 text-sm">Manage all enrolled students</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition">
          <FaPlus /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name, ID or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-5 py-3.5 font-medium">Student ID</th>
                <th className="px-5 py-3.5 font-medium">Name</th>
                <th className="px-5 py-3.5 font-medium hidden md:table-cell">Phone</th>
                <th className="px-5 py-3.5 font-medium hidden lg:table-cell">Course</th>
                <th className="px-5 py-3.5 font-medium hidden lg:table-cell">Batch</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-5 py-3.5 font-mono text-xs text-primary font-semibold">{student.studentId}</td>
                  <td className="px-5 py-3.5 font-medium text-dark">{student.name}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{student.phone}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{student.course}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{student.batch}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusColors[student.status]}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition" title="View">
                        <FaEye className="text-sm" />
                      </button>
                      <button className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/10 transition" title="Edit">
                        <FaEdit className="text-sm" />
                      </button>
                      <button className="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition" title="Delete">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No students found</div>
        )}
      </div>
    </div>
  );
};

export default Students;
