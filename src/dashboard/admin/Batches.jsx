import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getBatches, createBatch, updateBatch, deleteBatch } from '../../services/batchService';
import { getCourses } from '../../services/courseService';
import api from '../../services/api';

const statusColors = {
  ongoing: 'bg-green-100 text-green-700',
  upcoming: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700'
};

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', course: '', teacher: '', startDate: '', endDate: '',
    days: [], time: '', room: '', maximumStudents: 30, status: 'upcoming'
  });

  const dayOptions = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchRes, courseRes] = await Promise.all([
        getBatches({ limit: 50 }),
        getCourses({ limit: 50 })
      ]);
      setBatches(batchRes.data.batches || []);
      setCourses(courseRes.data.courses || []);

      // Try to fetch teachers
      try {
        const teacherRes = await api.get('/teachers');
        setTeachers(teacherRes.data?.data?.teachers || teacherRes.data?.teachers || []);
      } catch {
        setTeachers([]);
      }
    } catch (err) {
      console.error(err);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '', course: '', teacher: '', startDate: '', endDate: '',
      days: [], time: '', room: '', maximumStudents: 30, status: 'upcoming'
    });
    setShowModal(true);
  };

  const openEdit = (batch) => {
    setEditing(batch);
    setForm({
      name: batch.name || '',
      course: batch.course?._id || batch.course || '',
      teacher: batch.teacher?._id || batch.teacher || '',
      startDate: batch.startDate ? batch.startDate.split('T')[0] : '',
      endDate: batch.endDate ? batch.endDate.split('T')[0] : '',
      days: batch.days || [],
      time: batch.time || '',
      room: batch.room || '',
      maximumStudents: batch.maximumStudents || 30,
      status: batch.status || 'upcoming'
    });
    setShowModal(true);
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.days.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Select at least one day', confirmButtonColor: '#0F4C81' });
      return;
    }
    if (!form.teacher) {
      Swal.fire({ icon: 'warning', title: 'Please select a teacher', text: 'Create teachers first from Teachers module.', confirmButtonColor: '#0F4C81' });
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, maximumStudents: Number(form.maximumStudents) };
      if (editing) {
        await updateBatch(editing._id, payload);
        Swal.fire({ icon: 'success', title: 'Batch Updated', timer: 1500, showConfirmButton: false });
      } else {
        await createBatch(payload);
        Swal.fire({ icon: 'success', title: 'Batch Created', timer: 1500, showConfirmButton: false });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Batch?',
      text: `Delete "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Delete'
    });
    if (!result.isConfirmed) return;

    try {
      await deleteBatch(id);
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1500, showConfirmButton: false });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not delete' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Batches</h1>
          <p className="text-gray-500 text-sm">Manage class batches and schedules</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition">
          <FaPlus /> Create Batch
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-primary animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <div key={batch._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-dark text-lg">{batch.name}</h3>
                  <p className="text-sm text-primary font-medium">{batch.course?.title || 'N/A'}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusColors[batch.status] || statusColors.upcoming}`}>
                  {batch.status}
                </span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                <p>Teacher: <span className="text-dark font-medium">{batch.teacher?.name || 'N/A'}</span></p>
                <p>Time: <span className="text-dark font-medium">{batch.time}</span></p>
                <p>Days: <span className="text-dark font-medium">{(batch.days || []).join(', ')}</span></p>
                <p>Room: <span className="text-dark font-medium">{batch.room || 'N/A'}</span></p>
                <p>Students: <span className="text-dark font-medium">{batch.currentStudents || 0}/{batch.maximumStudents}</span></p>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(((batch.currentStudents || 0) / batch.maximumStudents) * 100, 100)}%` }}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(batch)} className="flex-1 py-2 rounded-lg text-xs font-medium text-secondary bg-secondary/5 hover:bg-secondary/10 transition">
                  <FaEdit className="inline mr-1" /> Edit
                </button>
                <button onClick={() => handleDelete(batch._id, batch.name)} className="py-2 px-3 rounded-lg text-xs text-danger bg-danger/5 hover:bg-danger/10 transition">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && batches.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p>No batches yet. Create one to get started.</p>
          <p className="text-xs mt-1">Note: You need courses and teachers first.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-dark">{editing ? 'Edit Batch' : 'Create Batch'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Batch A"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                <select required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher *</label>
                <select required value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select teacher</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
                {teachers.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">No teachers found. Add teachers first from Teachers module.</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input required type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Days *</label>
                <div className="flex flex-wrap gap-2">
                  {dayOptions.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        form.days.includes(day)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="e.g. 10:00 AM"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="e.g. Lab 1"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Students *</label>
                  <input required type="number" min="1" value={form.maximumStudents} onChange={(e) => setForm({ ...form, maximumStudents: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? 'Update Batch' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Batches;
