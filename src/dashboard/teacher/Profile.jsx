import { useEffect, useState } from 'react';
import { FaSave, FaSpinner, FaUserTie } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getMe, updateMe } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', profileImage: '' });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMe().then((res) => {
      const user = res.data?.user || {};
      setProfile(res.data?.profile || null);
      setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', profileImage: user.profileImage || '' });
    }).catch((err) => Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not load profile.' })).finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateMe(form);
      if (res.data?.user) updateUser(res.data.user);
      Swal.fire({ icon: 'success', title: 'Profile Updated', timer: 1300, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not update profile.' });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="text-2xl text-secondary animate-spin" /></div>;

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-dark">Teacher Profile</h1><p className="text-sm text-gray-500">Update your account information stored in the database.</p></div>
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><FaUserTie /></div><div><h2 className="font-bold">{profile?.designation || 'Teacher'}</h2><p className="text-xs text-gray-500">{profile?.skills?.join(', ') || 'Teacher account'}</p></div></div>
      <form onSubmit={submit}><div className="grid gap-4 md:grid-cols-2"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="rounded-xl border px-4 py-2.5" /><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-xl border px-4 py-2.5" /><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-xl border px-4 py-2.5" /><input value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} placeholder="Profile image URL" className="rounded-xl border px-4 py-2.5" /></div><button disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Profile</button></form>
    </div>
  </div>;
};

export default Profile;
