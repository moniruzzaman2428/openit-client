import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSpinner, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../../services/contentService';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', image: '', category: 'classroom' });

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await getGallery();
      setItems(res.data.gallery || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createGalleryItem(form);
      Swal.fire({ icon: 'success', title: 'Added', timer: 1500, showConfirmButton: false });
      setShowModal(false);
      setForm({ title: '', image: '', category: 'classroom' });
      fetchGallery();
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
      await deleteGalleryItem(id);
      fetchGallery();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Gallery</h1>
          <p className="text-gray-500 text-sm">Manage gallery images</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition">
          <FaPlus /> Add Image
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-primary animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group">
              <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                {item.image && item.image.startsWith('http') ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">{item.title}</span>
                )}
                <button onClick={() => handleDelete(item._id)} className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition hover:bg-danger">
                  <FaTrash className="text-xs" />
                </button>
              </div>
              <div className="p-3">
                <p className="font-medium text-dark text-sm">{item.title}</p>
                <p className="text-xs text-gray-400 capitalize">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && items.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">No gallery items yet. Add images with URL.</div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-dark">Add Gallery Image</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="classroom">Classroom</option>
                  <option value="events">Events</option>
                  <option value="workshops">Workshops</option>
                  <option value="students">Students</option>
                  <option value="certificate">Certificate</option>
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

export default Gallery;
