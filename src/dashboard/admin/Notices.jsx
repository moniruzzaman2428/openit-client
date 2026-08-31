import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSpinner, FaTimes, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getNotices, createNotice, updateNotice, deleteNotice } from '../../services/contentService';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'general', status: 'published' });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await getNotices({ limit: 50 });
      setNotices(res.data.notices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', category: 'general', status: 'published' });
    setShowModal(true);
  };

  const openEdit = (n) => {
    setEditing(n);
    setForm({ title: n.title, description: n.description, category: n.category, status: n.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateNotice(editing._id, form);
        Swal.fire({ icon: 'success', title: 'Updated', timer: 1500, showConfirmButton: false });
      } else {
        await createNotice(form);
        Swal.fire({ icon: 'success', title: 'Created', timer: 1500, showConfirmButton: false });
      }
      setShowModal(false);
      fetchNotices();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete Notice?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#EF4444', confirmButtonText: 'Delete' });
    if (!result.isConfirmed) return;
    try {
      await deleteNotice(id);
      fetchNotices();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Notices</h1>
          <p className="text-gray-500 text-sm">Manage institute notices</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition">
          <FaPlus /> Add Notice
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-primary animate-spin" /></div>
        ) : notices.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No notices yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notices.map((n) => (
              <div key={n._id} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-50/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-lg capitalize">{n.category}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg capitalize ${n.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{n.status}</span>
                  </div>
                  <h3 className="font-bold text-dark">{n.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{n.description}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(n)} className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/10"><FaEdit className="text-sm" /></button>
                  <button onClick={() => handleDelete(n._id)} className="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10"><FaTrash className="text-sm" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-dark">{editing ? 'Edit Notice' : 'Add Notice'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="general">General</option>
                    <option value="admission">Admission</option>
                    <option value="exam">Exam</option>
                    <option value="class">Class</option>
                    <option value="result">Result</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
