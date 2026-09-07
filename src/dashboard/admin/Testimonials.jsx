import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSpinner, FaStar, FaTimes, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
} from '../../services/contentService';

const emptyForm = { studentName: '', course: '', review: '', rating: 5 };

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getTestimonials();
      setItems(res.data?.testimonials || []);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not load testimonials.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      studentName: item.studentName || '',
      course: item.course || '',
      review: item.review || '',
      rating: item.rating || 5,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateTestimonial(editing._id, form);
        Swal.fire({ icon: 'success', title: 'Updated', timer: 1300, showConfirmButton: false });
      } else {
        await createTestimonial(form);
        Swal.fire({ icon: 'success', title: 'Added', timer: 1300, showConfirmButton: false });
      }
      closeModal();
      await fetchItems();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not save testimonial.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete testimonial?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#EF4444', confirmButtonText: 'Delete' });
    if (!result.isConfirmed) return;
    try {
      await deleteTestimonial(id);
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
      await fetchItems();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not delete testimonial.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Testimonials</h1>
          <p className="text-gray-500 text-sm">Manage database-backed student reviews</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition"><FaPlus /> Add Testimonial</button>
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
                <div className="flex items-center gap-0.5">{[...Array(5)].map((_, i) => <FaStar key={i} className={`text-xs ${i < t.rating ? 'text-accent' : 'text-gray-200'}`} />)}</div>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3">{t.review}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(t)} className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:underline"><FaEdit /> Edit</button>
                <button onClick={() => handleDelete(t._id)} className="inline-flex items-center gap-1.5 text-xs text-danger hover:underline"><FaTrash /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && items.length === 0 && <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">No testimonials yet.</div>}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-dark">{editing ? 'Update Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={closeModal} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label><input required value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Course *</label><input required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Review *</label><textarea required rows={4} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating</label><select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">{[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}</select></div>
              <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button><button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Add'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
