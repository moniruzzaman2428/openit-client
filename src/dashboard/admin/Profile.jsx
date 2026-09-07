import { useEffect, useState } from 'react';
import { FaKey, FaSave, FaSpinner, FaUserShield } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { changePassword, getMe, updateMe } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', profileImage: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    getMe().then((res) => {
      const u = res?.data?.user || {};
      setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '', profileImage: u.profileImage || '' });
    }).catch((err) => Swal.fire({ icon: 'error', title: 'Could not load profile', text: err.response?.data?.message || 'Server error' })).finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await updateMe(form);
      const user = res?.data?.user;
      if (user) updateUser(user);
      Swal.fire({ icon: 'success', title: 'Profile updated', timer: 1200, showConfirmButton: false });
    } catch (err) { Swal.fire({ icon: 'error', title: 'Update failed', text: err.response?.data?.message || 'Could not update profile' }); }
    finally { setSaving(false); }
  };

  const change = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return Swal.fire({ icon: 'warning', title: 'Passwords do not match' });
    if (passwords.newPassword.length < 6) return Swal.fire({ icon: 'warning', title: 'Password must be at least 6 characters' });
    setChanging(true);
    try {
      const res = await changePassword(passwords.currentPassword, passwords.newPassword);
      if (res?.token) localStorage.setItem('token', res.token);
      if (res?.data?.user) updateUser(res.data.user);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      Swal.fire({ icon: 'success', title: 'Password changed', timer: 1200, showConfirmButton: false });
    } catch (err) { Swal.fire({ icon: 'error', title: 'Password change failed', text: err.response?.data?.message || 'Could not change password' }); }
    finally { setChanging(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-2xl text-primary" /></div>;

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-dark">Admin Profile</h1><p className="text-sm text-gray-500">Update account information and password securely.</p></div>
    <form onSubmit={save} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><FaUserShield /></div><div><h2 className="font-bold">Account Details</h2><p className="text-xs text-gray-500">Changes are saved in the User collection.</p></div></div><div className="grid gap-4 md:grid-cols-2"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="rounded-xl border px-4 py-2.5" /><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-xl border px-4 py-2.5" /><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-xl border px-4 py-2.5" /><input value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} placeholder="Profile image URL" className="rounded-xl border px-4 py-2.5" /></div><button disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Profile</button></form>
    <form onSubmit={change} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><FaKey /></div><div><h2 className="font-bold">Change Password</h2><p className="text-xs text-gray-500">Current password verification is required.</p></div></div><div className="grid gap-4 md:grid-cols-3"><input required type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} placeholder="Current password" className="rounded-xl border px-4 py-2.5" /><input required type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} placeholder="New password" className="rounded-xl border px-4 py-2.5" /><input required type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} placeholder="Confirm password" className="rounded-xl border px-4 py-2.5" /></div><button disabled={changing} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{changing ? <FaSpinner className="animate-spin" /> : <FaKey />} Change Password</button></form>
  </div>;
};

export default Profile;
