import { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../services/courseService';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', duration: '', classHours: '', fee: '', discount: 0,
    instructor: '', status: 'active', curriculum: '', requirements: '', benefits: ''
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getCourses({ search: search || undefined, limit: 50 });
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '', description: '', duration: '', classHours: '', fee: '', discount: 0,
      instructor: '', status: 'active', curriculum: '', requirements: '', benefits: ''
    });
    setShowModal(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      title: course.title || '',
      description: course.description || '',
      duration: course.duration || '',
      classHours: course.classHours || '',
      fee: course.fee || '',
      discount: course.discount || 0,
      instructor: course.instructor || '',
      status: course.status || 'active',
      curriculum: (course.curriculum || []).join('\n'),
      requirements: (course.requirements || []).join('\n'),
      benefits: (course.benefits || []).join('\n')
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      fee: Number(form.fee),
      discount: Number(form.discount) || 0,
      curriculum: form.curriculum.split('\n').map((s) => s.trim()).filter(Boolean),
      requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
      benefits: form.benefits.split('\n').map((s) => s.trim()).filter(Boolean)
    };

    try {
      if (editing) {
        await updateCourse(editing._id, payload);
        Swal.fire({ icon: 'success', title: 'Course Updated', timer: 1500, showConfirmButton: false });
      } else {
        await createCourse(payload);
        Swal.fire({ icon: 'success', title: 'Course Created', timer: 1500, showConfirmButton: false });
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Course?',
      text: `Delete "${title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Delete'
    });
    if (!result.isConfirmed) return;

    try {
      await deleteCourse(id);
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1500, showConfirmButton: false });
      fetchCourses();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not delete' });
    }
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Courses</h1>
          <p className="text-gray-500 text-sm">Manage all courses</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition">
          <FaPlus /> Add Course
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-primary animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-5 py-3.5 font-medium">Course</th>
                  <th className="px-5 py-3.5 font-medium hidden md:table-cell">Duration</th>
                  <th className="px-5 py-3.5 font-medium">Fee</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((course) => {
                  const discounted = course.discount
                    ? Math.round(course.fee - (course.fee * course.discount) / 100)
                    : course.fee;
                  return (
                    <tr key={course._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-dark">{course.title}</p>
                        <p className="text-xs text-gray-400">{course.slug}</p>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{course.duration}</td>
                      <td className="px-5 py-3.5">
                        {course.discount > 0 ? (
                          <div>
                            <span className="text-xs text-gray-400 line-through">৳{course.fee}</span>
                            <span className="font-semibold text-primary ml-1">৳{discounted}</span>
                          </div>
                        ) : (
                          <span className="font-semibold text-primary">৳{course.fee}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                          course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(course)} className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/10 transition">
                            <FaEdit className="text-sm" />
                          </button>
                          <button onClick={() => handleDelete(course._id, course.title)} className="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition">
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No courses found. Create one or run seed:courses.</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-dark">{editing ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <input required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 6 Months"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Hours</label>
                  <input value={form.classHours} onChange={(e) => setForm({ ...form, classHours: e.target.value })} placeholder="e.g. 2 hours/day"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee (৳) *</label>
                  <input required type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input type="number" min="0" max="100" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                  <input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Curriculum (one per line)</label>
                  <textarea rows={3} value={form.curriculum} onChange={(e) => setForm({ ...form, curriculum: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="HTML5&#10;CSS3&#10;JavaScript" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                  <textarea rows={2} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (one per line)</label>
                  <textarea rows={2} value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
