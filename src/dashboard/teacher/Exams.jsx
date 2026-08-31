import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSpinner, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getExams, createExam, deleteExam } from '../../services/examService';
import { getBatches } from '../../services/batchService';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', batch: '', examDate: '', totalMarks: 50, passingMarks: 33, type: 'monthly'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examRes, batchRes] = await Promise.all([
        getExams({ limit: 50 }),
        getBatches({ limit: 50 })
      ]);
      setExams(examRes.data.exams || []);
      setBatches(batchRes.data.batches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const batch = batches.find((b) => b._id === form.batch);
    if (!batch) return;

    setSaving(true);
    try {
      await createExam({
        ...form,
        course: batch.course?._id || batch.course,
        totalMarks: Number(form.totalMarks),
        passingMarks: Number(form.passingMarks)
      });
      Swal.fire({ icon: 'success', title: 'Exam Created', timer: 1500, showConfirmButton: false });
      setShowModal(false);
      setForm({ title: '', batch: '', examDate: '', totalMarks: 50, passingMarks: 33, type: 'monthly' });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not create exam' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Exam?',
      text: `Delete "${title}" and all related results?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Delete'
    });
    if (!result.isConfirmed) return;

    try {
      await deleteExam(id);
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1500, showConfirmButton: false });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not delete' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Exams</h1>
          <p className="text-gray-500 text-sm">Manage exams for your batches</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary/90 shadow-lg shadow-secondary/25 transition">
          <FaPlus /> Create Exam
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-secondary animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-5 py-3.5 font-medium">Exam</th>
                  <th className="px-5 py-3.5 font-medium hidden md:table-cell">Course</th>
                  <th className="px-5 py-3.5 font-medium hidden lg:table-cell">Batch</th>
                  <th className="px-5 py-3.5 font-medium">Date</th>
                  <th className="px-5 py-3.5 font-medium">Marks</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {exams.map((exam) => (
                  <tr key={exam._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-medium text-dark">{exam.title}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{exam.course?.title}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{exam.batch?.name}</td>
                    <td className="px-5 py-3.5 text-gray-500">{new Date(exam.examDate).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 font-semibold text-dark">{exam.totalMarks}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                        exam.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => handleDelete(exam._id, exam.title)} className="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition">
                        <FaTrash className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && exams.length === 0 && (
          <div className="text-center py-12 text-gray-400">No exams yet. Create one to get started.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-dark">Create Exam</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><FaTimes /></button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Monthly Test - August"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch *</label>
                <select required value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/30">
                  <option value="">Select batch</option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>{b.name} — {b.course?.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date *</label>
                <input required type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks *</label>
                  <input required type="number" min="1" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks *</label>
                  <input required type="number" min="0" value={form.passingMarks} onChange={(e) => setForm({ ...form, passingMarks: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/30">
                  <option value="monthly">Monthly Test</option>
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="practical">Practical</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
