import { useEffect, useMemo, useState } from 'react';
import { FaEdit, FaPlus, FaSpinner, FaTimes, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getBatches } from '../../services/batchService';
import { createExam, deleteExam, getExams, updateExam } from '../../services/examService';

const emptyForm = {
  title: '', batch: '', course: '', examDate: '', totalMarks: 100,
  passingMarks: 33, type: 'other', status: 'upcoming'
};

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const selectedBatch = useMemo(() => batches.find((b) => b._id === form.batch), [batches, form.batch]);

  const load = async () => {
    setLoading(true);
    try {
      const [examRes, batchRes] = await Promise.all([
        getExams({ limit: 100, sort: '-examDate' }),
        getBatches({ limit: 100, sort: '-createdAt' })
      ]);
      setExams(examRes?.data?.exams || []);
      setBatches(batchRes?.data?.batches || []);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Could not load exams', text: err.response?.data?.message || 'Server error' });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (exam) => {
    setEditing(exam);
    setForm({
      title: exam.title || '',
      batch: exam.batch?._id || exam.batch || '',
      course: exam.course?._id || exam.course || '',
      examDate: exam.examDate ? exam.examDate.split('T')[0] : '',
      totalMarks: exam.totalMarks || 100,
      passingMarks: exam.passingMarks ?? 33,
      type: exam.type || 'other',
      status: exam.status || 'upcoming'
    });
    setShowModal(true);
  };

  const handleBatch = (batchId) => {
    const batch = batches.find((b) => b._id === batchId);
    setForm((prev) => ({ ...prev, batch: batchId, course: batch?.course?._id || batch?.course || '' }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.course) return Swal.fire({ icon: 'warning', title: 'Selected batch has no course' });
    setSaving(true);
    try {
      const payload = {
        ...form,
        totalMarks: Number(form.totalMarks),
        passingMarks: Number(form.passingMarks)
      };
      if (editing) await updateExam(editing._id, payload);
      else await createExam(payload);
      setShowModal(false);
      await load();
      Swal.fire({ icon: 'success', title: editing ? 'Exam updated' : 'Exam created', timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save failed', text: err.response?.data?.message || 'Could not save exam' });
    } finally { setSaving(false); }
  };

  const remove = async (exam) => {
    const ask = await Swal.fire({ title: `Delete ${exam.title}?`, text: 'Related results will also be deleted.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Delete', confirmButtonColor: '#dc2626' });
    if (!ask.isConfirmed) return;
    try { await deleteExam(exam._id); await load(); }
    catch (err) { Swal.fire({ icon: 'error', title: 'Delete failed', text: err.response?.data?.message || 'Could not delete exam' }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold text-dark">Exam Management</h1><p className="text-sm text-gray-500">Create, update and delete exams from the database.</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"><FaPlus /> Create Exam</button>
      </div>

      {loading ? <div className="flex justify-center py-16"><FaSpinner className="animate-spin text-2xl text-primary" /></div> : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-4 py-3">Exam</th><th className="px-4 py-3">Batch / Course</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Marks</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y">
                {exams.map((exam) => <tr key={exam._id}>
                  <td className="px-4 py-3"><p className="font-semibold text-gray-800">{exam.title}</p><p className="text-xs capitalize text-gray-400">{exam.type}</p></td>
                  <td className="px-4 py-3"><p>{exam.batch?.name || '—'}</p><p className="text-xs text-gray-400">{exam.course?.title || '—'}</p></td>
                  <td className="px-4 py-3 text-gray-600">{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{exam.totalMarks} / Pass {exam.passingMarks}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold capitalize">{exam.status}</span></td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-2"><button onClick={() => openEdit(exam)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><FaEdit /></button><button onClick={() => remove(exam)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FaTrash /></button></div></td>
                </tr>)}
              </tbody>
            </table>
          </div>
          {!exams.length && <div className="py-12 text-center text-sm text-gray-400">No exams found.</div>}
        </div>
      )}

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
        <form onSubmit={submit} className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold">{editing ? 'Edit Exam' : 'Create Exam'}</h2><button type="button" onClick={() => setShowModal(false)}><FaTimes /></button></div>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Exam title" className="w-full rounded-xl border px-4 py-2.5" />
          <select required value={form.batch} onChange={(e) => handleBatch(e.target.value)} className="w-full rounded-xl border px-4 py-2.5"><option value="">Select batch</option>{batches.map((b) => <option key={b._id} value={b._id}>{b.name} — {b.course?.title || 'Course'}</option>)}</select>
          <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">Course: <strong>{selectedBatch?.course?.title || editing?.course?.title || 'Select a batch'}</strong></div>
          <div className="grid grid-cols-2 gap-3"><input required type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} className="rounded-xl border px-4 py-2.5" /><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-xl border px-4 py-2.5"><option value="monthly">Monthly</option><option value="midterm">Midterm</option><option value="final">Final</option><option value="practical">Practical</option><option value="other">Other</option></select></div>
          <div className="grid grid-cols-2 gap-3"><input required type="number" min="1" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} placeholder="Total marks" className="rounded-xl border px-4 py-2.5" /><input required type="number" min="0" max={form.totalMarks} value={form.passingMarks} onChange={(e) => setForm({ ...form, passingMarks: e.target.value })} placeholder="Passing marks" className="rounded-xl border px-4 py-2.5" /></div>
          {editing && <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border px-4 py-2.5"><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>}
          <button disabled={saving} className="w-full rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : editing ? 'Update Exam' : 'Create Exam'}</button>
        </form>
      </div>}
    </div>
  );
};

export default Exams;
