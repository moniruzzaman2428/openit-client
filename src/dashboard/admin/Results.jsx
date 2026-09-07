import { useEffect, useMemo, useState } from 'react';
import { FaEdit, FaPlus, FaSpinner, FaTimes, FaTrash, FaUpload } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getExams } from '../../services/examService';
import { getBatchStudents } from '../../services/attendanceService';
import { createResult, deleteResult, getResults, publishExamResults, updateResult } from '../../services/resultService';

const Results = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [filterExam, setFilterExam] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ exam: '', student: '', marks: '', isPublished: false });

  const selectedExam = useMemo(() => exams.find((e) => e._id === form.exam), [exams, form.exam]);

  const load = async () => {
    setLoading(true);
    try {
      const [resultRes, examRes] = await Promise.all([
        getResults(filterExam ? { exam: filterExam } : {}),
        getExams({ limit: 100, sort: '-examDate' })
      ]);
      setResults(resultRes?.data?.results || []);
      setExams(examRes?.data?.exams || []);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Could not load results', text: err.response?.data?.message || 'Server error' });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterExam]);

  const openCreate = () => {
    setEditing(null);
    setForm({ exam: filterExam || '', student: '', marks: '', isPublished: false });
    setStudents([]);
    setShowModal(true);
    if (filterExam) loadStudentsForExam(filterExam);
  };

  const openEdit = (result) => {
    setEditing(result);
    setStudents([]);
    setForm({
      exam: result.exam?._id || '',
      student: result.student?._id || '',
      marks: result.marks ?? '',
      isPublished: Boolean(result.isPublished)
    });
    setShowModal(true);
  };

  const loadStudentsForExam = async (examId) => {
    const exam = exams.find((e) => e._id === examId);
    const batchId = exam?.batch?._id || exam?.batch;
    if (!batchId) { setStudents([]); return; }
    try {
      const res = await getBatchStudents(batchId);
      setStudents(res?.data?.students || []);
    } catch { setStudents([]); }
  };

  const chooseExam = (examId) => {
    setForm((prev) => ({ ...prev, exam: examId, student: '' }));
    loadStudentsForExam(examId);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateResult(editing._id, { marks: Number(form.marks), isPublished: form.isPublished });
      } else {
        if (!selectedExam) throw new Error('Please select an exam');
        await createResult({
          student: form.student,
          exam: form.exam,
          course: selectedExam.course?._id || selectedExam.course,
          marks: Number(form.marks),
          isPublished: form.isPublished
        });
      }
      setShowModal(false);
      await load();
      Swal.fire({ icon: 'success', title: editing ? 'Result updated' : 'Result saved', timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save failed', text: err.response?.data?.message || err.message || 'Could not save result' });
    } finally { setSaving(false); }
  };

  const publishAll = async () => {
    if (!filterExam) return Swal.fire({ icon: 'info', title: 'Select an exam first' });
    const ask = await Swal.fire({ title: 'Publish all results for this exam?', icon: 'question', showCancelButton: true, confirmButtonText: 'Publish' });
    if (!ask.isConfirmed) return;
    try { await publishExamResults(filterExam); await load(); Swal.fire({ icon: 'success', title: 'Results published', timer: 1200, showConfirmButton: false }); }
    catch (err) { Swal.fire({ icon: 'error', title: 'Publish failed', text: err.response?.data?.message || 'Server error' }); }
  };

  const remove = async (result) => {
    const ask = await Swal.fire({ title: 'Delete this result?', text: `${result.student?.name || 'Student'} — ${result.exam?.title || 'Exam'}`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Delete', confirmButtonColor: '#dc2626' });
    if (!ask.isConfirmed) return;
    try { await deleteResult(result._id); await load(); }
    catch (err) { Swal.fire({ icon: 'error', title: 'Delete failed', text: err.response?.data?.message || 'Server error' }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><h1 className="text-2xl font-bold text-dark">Result Management</h1><p className="text-sm text-gray-500">Enter marks, edit, publish and delete results stored in MongoDB.</p></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={publishAll} disabled={!filterExam} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold disabled:opacity-40"><FaUpload /> Publish Exam</button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"><FaPlus /> Add Result</button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <select value={filterExam} onChange={(e) => setFilterExam(e.target.value)} className="w-full max-w-md rounded-xl border px-4 py-2.5 text-sm"><option value="">All exams</option>{exams.map((e) => <option key={e._id} value={e._id}>{e.title} — {e.batch?.name || 'Batch'}</option>)}</select>
      </div>

      {loading ? <div className="flex justify-center py-16"><FaSpinner className="animate-spin text-2xl text-primary" /></div> : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Exam</th><th className="px-4 py-3">Marks</th><th className="px-4 py-3">Grade</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Published</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y">{results.map((r) => <tr key={r._id}>
              <td className="px-4 py-3"><p className="font-semibold">{r.student?.name || '—'}</p><p className="text-xs text-gray-400">{r.student?.studentId}</p></td>
              <td className="px-4 py-3"><p>{r.exam?.title || '—'}</p><p className="text-xs text-gray-400">{r.course?.title}</p></td>
              <td className="px-4 py-3 font-semibold">{r.marks}/{r.exam?.totalMarks || '—'}</td>
              <td className="px-4 py-3 font-bold">{r.grade}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.status === 'pass' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{r.status}</span></td>
              <td className="px-4 py-3">{r.isPublished ? <span className="text-emerald-600">Yes</span> : <span className="text-gray-400">No</span>}</td>
              <td className="px-4 py-3"><div className="flex justify-end gap-2"><button onClick={() => openEdit(r)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><FaEdit /></button><button onClick={() => remove(r)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FaTrash /></button></div></td>
            </tr>)}</tbody>
          </table></div>
          {!results.length && <div className="py-12 text-center text-sm text-gray-400">No results found.</div>}
        </div>
      )}

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"><form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold">{editing ? 'Edit Result' : 'Add Result'}</h2><button type="button" onClick={() => setShowModal(false)}><FaTimes /></button></div>
        {!editing && <>
          <select required value={form.exam} onChange={(e) => chooseExam(e.target.value)} className="w-full rounded-xl border px-4 py-2.5"><option value="">Select exam</option>{exams.map((e) => <option key={e._id} value={e._id}>{e.title} — {e.batch?.name || 'Batch'}</option>)}</select>
          <select required value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} className="w-full rounded-xl border px-4 py-2.5"><option value="">Select student</option>{students.map((s) => <option key={s._id} value={s._id}>{s.studentId} — {s.name}</option>)}</select>
        </>}
        {editing && <div className="rounded-xl bg-gray-50 p-3 text-sm"><strong>{editing.student?.name}</strong><br /><span className="text-gray-500">{editing.exam?.title}</span></div>}
        <input required type="number" min="0" max={selectedExam?.totalMarks || editing?.exam?.totalMarks || undefined} value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} placeholder="Marks" className="w-full rounded-xl border px-4 py-2.5" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Publish immediately</label>
        <button disabled={saving} className="w-full rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save Result'}</button>
      </form></div>}
    </div>
  );
};

export default Results;
