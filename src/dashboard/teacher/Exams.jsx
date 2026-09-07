import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSpinner, FaTimes, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { createExam, deleteExam, getExams, updateExam } from '../../services/examService';
import { getBatches } from '../../services/batchService';

const emptyForm = { title: '', batch: '', examDate: '', totalMarks: 50, passingMarks: 33, type: 'monthly', status: 'upcoming' };

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examRes, batchRes] = await Promise.all([getExams({ limit: 500 }), getBatches({ limit: 500 })]);
      setExams(examRes.data?.exams || []);
      setBatches(batchRes.data?.batches || []);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not load exams.' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (exam) => {
    setEditing(exam);
    setForm({
      title: exam.title || '', batch: exam.batch?._id || exam.batch || '',
      examDate: exam.examDate ? new Date(exam.examDate).toISOString().slice(0, 10) : '',
      totalMarks: exam.totalMarks || 50, passingMarks: exam.passingMarks ?? 33,
      type: exam.type || 'monthly', status: exam.status || 'upcoming',
    });
    setShowModal(true);
  };
  const closeModal = () => { if (!saving) { setShowModal(false); setEditing(null); setForm(emptyForm); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateExam(editing._id, {
          title: form.title, examDate: form.examDate, totalMarks: Number(form.totalMarks),
          passingMarks: Number(form.passingMarks), type: form.type, status: form.status,
        });
        Swal.fire({ icon: 'success', title: 'Exam Updated', timer: 1300, showConfirmButton: false });
      } else {
        const batch = batches.find((b) => b._id === form.batch);
        if (!batch) throw new Error('Select a valid batch.');
        await createExam({
          ...form, course: batch.course?._id || batch.course,
          totalMarks: Number(form.totalMarks), passingMarks: Number(form.passingMarks),
        });
        Swal.fire({ icon: 'success', title: 'Exam Created', timer: 1300, showConfirmButton: false });
      }
      closeModal();
      await fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || err.message || 'Could not save exam.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (exam) => {
    const result = await Swal.fire({ title: 'Delete Exam?', text: `Delete "${exam.title}" and all related results?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#EF4444', confirmButtonText: 'Delete' });
    if (!result.isConfirmed) return;
    try {
      await deleteExam(exam._id);
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1300, showConfirmButton: false });
      await fetchData();
    } catch (err) { Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not delete exam.' }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><h1 className="text-2xl font-bold text-dark">Exams</h1><p className="text-gray-500 text-sm">Create, update and delete exams for your assigned batches</p></div><button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary/90 shadow-lg shadow-secondary/25 transition"><FaPlus /> Create Exam</button></div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-secondary animate-spin" /></div> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left text-gray-500"><th className="px-5 py-3.5 font-medium">Exam</th><th className="px-5 py-3.5 font-medium hidden md:table-cell">Course</th><th className="px-5 py-3.5 font-medium hidden lg:table-cell">Batch</th><th className="px-5 py-3.5 font-medium">Date</th><th className="px-5 py-3.5 font-medium">Marks</th><th className="px-5 py-3.5 font-medium">Status</th><th className="px-5 py-3.5 font-medium text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-50">{exams.map((exam) => <tr key={exam._id} className="hover:bg-gray-50/50"><td className="px-5 py-3.5 font-medium text-dark">{exam.title}</td><td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{exam.course?.title || '—'}</td><td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{exam.batch?.name || '—'}</td><td className="px-5 py-3.5 text-gray-500">{new Date(exam.examDate).toLocaleDateString()}</td><td className="px-5 py-3.5 font-semibold text-dark">{exam.totalMarks}</td><td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${exam.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : exam.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{exam.status}</span></td><td className="px-5 py-3.5 text-right whitespace-nowrap"><button onClick={() => openEdit(exam)} className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50"><FaEdit /></button><button onClick={() => handleDelete(exam)} className="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10"><FaTrash /></button></td></tr>)}</tbody></table></div>}
        {!loading && exams.length === 0 && <div className="text-center py-12 text-gray-400">No exams yet.</div>}
      </div>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"><div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"><div className="flex items-center justify-between p-5 border-b border-gray-100"><h2 className="text-lg font-bold text-dark">{editing ? 'Update Exam' : 'Create Exam'}</h2><button onClick={closeModal} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><FaTimes /></button></div><form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Exam Title *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Batch *</label><select required disabled={Boolean(editing)} value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 disabled:bg-gray-100"><option value="">Select batch</option>{batches.map((b) => <option key={b._id} value={b._id}>{b.name} — {b.course?.title}</option>)}</select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Exam Date *</label><input required type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200" /></div>
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Total Marks *</label><input required type="number" min="1" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks *</label><input required type="number" min="0" max={form.totalMarks} value={form.passingMarks} onChange={(e) => setForm({ ...form, passingMarks: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200" /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200"><option value="monthly">Monthly Test</option><option value="midterm">Midterm</option><option value="final">Final</option><option value="practical">Practical</option><option value="other">Other</option></select></div>
        {editing && <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200"><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>}
        <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button><button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update Exam' : 'Create Exam'}</button></div>
      </form></div></div>}
    </div>
  );
};

export default Exams;
