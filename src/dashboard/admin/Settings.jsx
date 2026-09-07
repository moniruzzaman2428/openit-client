import { useEffect, useState } from 'react';
import { FaSave, FaSpinner, FaSyncAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getSettings, updateSettings } from '../../services/settingsService';

const defaultSettings = {
  instituteName: '', logo: '', favicon: '', phone: '', email: '', address: '',
  facebookUrl: '', youtubeUrl: '', googleMap: '', heroHeadline: '', heroSubheadline: '',
  aboutText: '', mission: '', vision: '', footerText: '',
  totalStudents: 0, totalCourses: 0, totalTeachers: 0, successfulStudents: 0
};

const Settings = () => {
  const [form, setForm] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getSettings();
      setForm({ ...defaultSettings, ...(res?.data?.settings || {}) });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Could not load settings', text: err.response?.data?.message || 'Server error' });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      ['totalStudents', 'totalCourses', 'totalTeachers', 'successfulStudents'].forEach((key) => { payload[key] = Number(payload[key]) || 0; });
      const res = await updateSettings(payload);
      setForm({ ...defaultSettings, ...(res?.data?.settings || payload) });
      Swal.fire({ icon: 'success', title: 'Settings updated', timer: 1300, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save failed', text: err.response?.data?.message || 'Could not save settings' });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-2xl text-primary" /></div>;

  const input = (label, key, type = 'text') => <label className="text-sm font-medium text-gray-700">{label}<input type={type} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1.5 w-full rounded-xl border px-4 py-2.5" /></label>;
  const textarea = (label, key, rows = 3) => <label className="text-sm font-medium text-gray-700">{label}<textarea rows={rows} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1.5 w-full rounded-xl border px-4 py-2.5" /></label>;

  return <form onSubmit={save} className="space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-dark">Website Settings</h1><p className="text-sm text-gray-500">All values are loaded from and saved to MongoDB.</p></div><div className="flex gap-2"><button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold"><FaSyncAlt /> Reload</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save</button></div></div>

    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Institute Information</h2><div className="grid gap-4 md:grid-cols-2">{input('Institute Name', 'instituteName')}{input('Phone', 'phone')}{input('Email', 'email', 'email')}{input('Logo URL', 'logo')}{input('Favicon URL', 'favicon')}<div className="md:col-span-2">{textarea('Address', 'address', 2)}</div></div></section>
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Homepage Content</h2><div className="grid gap-4">{input('Hero Headline', 'heroHeadline')}{textarea('Hero Subheadline', 'heroSubheadline', 2)}{textarea('About Text', 'aboutText', 4)}<div className="grid gap-4 md:grid-cols-2">{textarea('Mission', 'mission', 3)}{textarea('Vision', 'vision', 3)}</div>{textarea('Footer Text', 'footerText', 2)}</div></section>
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Social & Map</h2><div className="grid gap-4 md:grid-cols-2">{input('Facebook URL', 'facebookUrl')}{input('YouTube URL', 'youtubeUrl')}<div className="md:col-span-2">{textarea('Google Map Embed / URL', 'googleMap', 3)}</div></div></section>
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Public Statistics Overrides</h2><p className="mb-4 text-xs text-gray-500">These are website settings values. The Admin Dashboard itself uses live database counts.</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{input('Total Students', 'totalStudents', 'number')}{input('Total Courses', 'totalCourses', 'number')}{input('Total Teachers', 'totalTeachers', 'number')}{input('Successful Students', 'successfulStudents', 'number')}</div></section>
  </form>;
};

export default Settings;
