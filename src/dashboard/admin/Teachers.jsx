import { useEffect, useState } from 'react';
import {
  FaSearch, FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes, FaCamera
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { getCourses } from '../../services/courseService';

const emptyForm = {
  name: '', email: '', phone: '', password: '', designation: '',
  skills: '', experience: '', bio: '', status: 'active', photoFile: null
};

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState('');

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/teachers', { params: { search: search || undefined, limit: 500 } });
      setTeachers(data?.data?.teachers || []);
    } catch (err) {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeachers(); }, []);
  useEffect(() => {
    getCourses({ limit: 500 }).then((res) => setCourses(res.data?.courses || [])).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreview('');
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      name: t.name || '',
      email: t.email || '',
      phone: t.phone || '',
      password: '',
      designation: t.designation || '',
      skills: (t.skills || []).join(', '),
      experience: t.experience || '',
      bio: t.bio || '',
      status: t.status || 'active',
      photoFile: null,
      assignedCourses: (t.assignedCourses || []).map((c) => c._id || c)
    });
    setPreview(t.photo || t.userId?.profileImage || '');
    setShowModal(true);
  };

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Swal.fire({ icon: 'error', title: 'Invalid file', text: 'Select an image.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'Too large', text: 'Max 5MB.' });
      return;
    }
    setForm((p) => ({ ...p, photoFile: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      ['name', 'email', 'phone', 'designation', 'experience', 'bio', 'status'].forEach((k) => {
        if (form[k] !== undefined) fd.append(k, form[k]);
      });
      if (form.password) fd.append('password', form.password);
      fd.append('skills', form.skills);
      if (form.assignedCourses) fd.append('assignedCourses', JSON.stringify(form.assignedCourses));
      if (form.photoFile) fd.append('photo', form.photoFile);
      if (editing) await api.patch(`/teachers/${editing._id}`, fd);
      else await api.post('/teachers', fd);
      Swal.fire({ icon: 'success', title: editing ? 'Teacher updated' : 'Teacher added', timer: 1400, showConfirmButton: false });
      setShowModal(false);
      fetchTeachers();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not save teacher' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (t) => {
    const ok = await Swal.fire({ title: `Delete ${t.name}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#EF4444' });
    if (!ok.isConfirmed) return;
    try {
      await api.delete(`/teachers/${t._id}`);
      fetchTeachers();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Delete failed' });
    }
  };

  const filtered = teachers.filter((t) =>
    `${t.name} ${t.email} ${t.phone} ${t.designation}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Teachers</h1>
          <p className="text-gray-500 text-sm">Manage teaching staff with live data</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25">
          <FaPlus /> Add Teacher
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teachers..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-primary animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((teacher) => {
            const photo = teacher.photo || teacher.userId?.profileImage;
            return (
              <div key={teacher._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  {photo ? (
                    <img src={photo} alt={teacher.name} className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                      {teacher.name?.charAt(0)}
                    </div>
                  )}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${teacher.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {teacher.status}
                  </span>
                </div>
                <h3 className="font-bold text-dark">{teacher.name}</h3>
                <p className="text-xs text-primary font-medium mb-2">{teacher.designation}</p>
                <p className="text-sm text-gray-500">{teacher.email}</p>
                <p className="text-sm text-gray-500 mb-3">{teacher.phone}</p>
                <p className="text-xs text-gray-400 mb-4">{(teacher.assignedCourses || []).length} courses assigned</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(teacher)} className="flex-1 py-2 rounded-lg text-xs font-medium text-secondary bg-secondary/5 hover:bg-secondary/10">
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button onClick={() => handleDelete(teacher)} className="py-2 px-3 rounded-lg text-xs text-danger bg-danger/5 hover:bg-danger/10">
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
          {!filtered.length && <p className="text-gray-500 col-span-full text-center py-10">No teachers found.</p>}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{editing ? 'Edit Teacher' : 'Add Teacher'}</h2>
              <button type="button" onClick={() => setShowModal(false)}><FaTimes className="text-gray-400" /></button>
            </div>
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center">
                {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <FaCamera className="text-gray-400 text-xl" />}
              </div>
              <span className="text-xs text-primary font-medium">Upload photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full px-4 py-2.5 rounded-xl border" />
            <div className="grid grid-cols-2 gap-3">
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="px-4 py-2.5 rounded-xl border" />
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="px-4 py-2.5 rounded-xl border" />
            </div>
            {!editing && (
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password (default Teacher@123)" className="w-full px-4 py-2.5 rounded-xl border" />
            )}
            <input required value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Designation" className="w-full px-4 py-2.5 rounded-xl border" />
            <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Skills (comma separated)" className="w-full px-4 py-2.5 rounded-xl border" />
            <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Experience" className="w-full px-4 py-2.5 rounded-xl border" />
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" rows={3} className="w-full px-4 py-2.5 rounded-xl border" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div>
              <p className="text-xs text-gray-500 mb-1">Assign courses</p>
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                {courses.map((c) => {
                  const selected = (form.assignedCourses || []).includes(c._id);
                  return (
                    <button type="button" key={c._id} onClick={() => {
                      const cur = form.assignedCourses || [];
                      setForm({ ...form, assignedCourses: selected ? cur.filter((id) => id !== c._id) : [...cur, c._id] });
                    }} className={`text-xs px-2 py-1 rounded-lg border ${selected ? 'bg-primary text-white border-primary' : 'bg-white'}`}>
                      {c.title}
                    </button>
                  );
                })}
              </div>
            </div>
            <button disabled={saving} className="w-full py-3 bg-primary text-white rounded-xl font-semibold">
              {saving ? 'Saving...' : 'Save Teacher'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Teachers;