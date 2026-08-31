import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSpinner, FaTimes, FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getTestimonials, createTestimonial, deleteTestimonial } from '../../services/contentService';

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ studentName: '', course: '', review: '', rating: 5 });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getTestimonials();
      setItems(res.data.testimonials || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createTestimonial(form);
      Swal.fire({ icon: 'success', title: 'Added', timer: 1500, showConfirmButton: false });
      setShowModal(false);
      setForm({ studentName: '', course: '', review: '', rating: 5 });
      fetchItems();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#EF4444', confirmButtonText: 'Delete' });
    if (!result.isConfirmed) return;
    try {
      await deleteTestimonial(id);
      fetchItems();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Testimonials</h1>
          <p className="text-gray-500 text-sm">Manage student reviews</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition">
          <FaPlus /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-primary animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((t) => (
            <div key={t._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-dark">{t.studentName}</h3>
                  <p className="text-xs text-primary">{t.course}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-xs ${i < t.rating ? 'text-accent' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-3">{t.review}</p>
              <button onClick={() => handleDelete(t._id)} className="text-xs text-danger hover:underline">Delete</button>
            </div>
          ))}
        </div>
      )}
      {!loading && items.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">No testimonials yet.</div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-dark">Add Testimonial</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                <input required value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                <input required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review *</label>
                <textarea required rows={3} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60">{saving ? 'Adding...' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
