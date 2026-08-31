import { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const mockTeachers = [
  { id: 1, name: 'Md. Hasan Ali', phone: '01811111111', email: 'hasan@openit.com', designation: 'Senior Instructor', courses: 3, status: 'active' },
  { id: 2, name: 'Sadia Rahman', phone: '01822222222', email: 'sadia@openit.com', designation: 'Graphic Design Lead', courses: 2, status: 'active' },
  { id: 3, name: 'Tanvir Ahmed', phone: '01833333333', email: 'tanvir@openit.com', designation: 'Web Development Instructor', courses: 4, status: 'active' },
  { id: 4, name: 'Nusrat Amin', phone: '01844444444', email: 'nusrat@openit.com', designation: 'Digital Marketing Expert', courses: 2, status: 'inactive' }
];

const Teachers = () => {
  const [search, setSearch] = useState('');

  const filtered = mockTeachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Teachers</h1>
          <p className="text-gray-500 text-sm">Manage teaching staff</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition">
          <FaPlus /> Add Teacher
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search teachers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                {teacher.name.charAt(0)}
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${teacher.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {teacher.status}
              </span>
            </div>
            <h3 className="font-bold text-dark mb-0.5">{teacher.name}</h3>
            <p className="text-xs text-primary font-medium mb-2">{teacher.designation}</p>
            <p className="text-sm text-gray-500 mb-1">{teacher.email}</p>
            <p className="text-sm text-gray-500 mb-3">{teacher.phone}</p>
            <p className="text-xs text-gray-400 mb-4">{teacher.courses} courses assigned</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 transition">
                <FaEye className="inline mr-1" /> View
              </button>
              <button className="flex-1 py-2 rounded-lg text-xs font-medium text-secondary bg-secondary/5 hover:bg-secondary/10 transition">
                <FaEdit className="inline mr-1" /> Edit
              </button>
              <button className="py-2 px-3 rounded-lg text-xs text-danger bg-danger/5 hover:bg-danger/10 transition">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teachers;
