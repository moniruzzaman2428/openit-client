import { useState, useEffect } from 'react';
import { FaPlus, FaSpinner, FaTimes, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getExams } from '../../services/examService';
import { getResults, createResult, publishExamResults } from '../../services/resultService';
import { getBatchStudents } from '../../services/attendanceService';

const Results = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resultRes, examRes] = await Promise.all([
        getResults(),
        getExams({ limit: 50 })
      ]);
      setResults(resultRes.data.results || []);
      setExams(examRes.data.exams || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openEnterMarks = async () => {
    setShowModal(true);
    setSelectedExam('');
    setStudents([]);
    setMarks({});
  };

  const handleExamSelect = async (examId) => {
    setSelectedExam(examId);
    if (!examId) { setStudents([]); return; }

    const exam = exams.find((e) => e._id === examId);
    if (!exam?.batch?._id && !exam?.batch) return;

    setLoadingStudents(true);
    try {
      const batchId = exam.batch._id || exam.batch;
      const res = await getBatchStudents(batchId);
      setStudents(res.data.students || []);
      const initial = {};
      (res.data.students || []).forEach((s) => { initial[s._id] = ''; });
      setMarks(initial);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSubmitMarks = async (e) => {
    e.preventDefault();
    const exam = exams.find((e) => e._id === selectedExam);
    if (!exam) return;

    const resultsData = students
      .filter((s) => marks[s._id] !== '' && marks[s._id] !== undefined)
      .map((s) => ({
        student: s._id,
        exam: selectedExam,
        course: exam.course?._id || exam.course,
        marks: Number(marks[s._id]),
        isPublished: false
      }));

    if (resultsData.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Enter at least one mark', confirmButtonColor: '#00AEEF' });
      return;
    }

    setSaving(true);
    try {
      const res = await createResult({ results: resultsData });
      Swal.fire({
        icon: 'success',
        title: 'Results Saved!',
        text: res.message,
        confirmButtonColor: '#00AEEF'
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not save results' });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (examId, title) => {
    const result = await Swal.fire({
      title: 'Publish Results?',
      text: `Publish all results for "${title}"? Students will be able to see them.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      confirmButtonText: 'Publish'
    });
    if (!result.isConfirmed) return;

    try {
      const res = await publishExamResults(examId);
      Swal.fire({ icon: 'success', title: 'Published!', text: res.message, confirmButtonColor: '#00AEEF' });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not publish' });
    }
  };

  const exam = exams.find((e) => e._id === selectedExam);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Results</h1>
          <p className="text-gray-500 text-sm">Enter and manage student results</p>
        </div>
        <button onClick={openEnterMarks} className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary/90 shadow-lg shadow-secondary/25 transition">
          <FaPlus /> Enter Result
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
                  <th className="px-5 py-3.5 font-medium">Student</th>
                  <th className="px-5 py-3.5 font-medium hidden md:table-cell">Exam</th>
                  <th className="px-5 py-3.5 font-medium">Marks</th>
                  <th className="px-5 py-3.5 font-medium">Grade</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-medium text-dark">{r.student?.name}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{r.exam?.title}</td>
                    <td className="px-5 py-3.5 font-semibold text-dark">{r.marks}/{r.exam?.totalMarks || '?'}</td>
                    <td className="px-5 py-3.5"><span className="font-bold text-secondary">{r.grade}</span></td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                        r.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>{r.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        r.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>{r.isPublished ? 'Yes' : 'No'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && results.length === 0 && (
          <div className="text-center py-12 text-gray-400">No results yet. Enter marks for an exam.</div>
        )}
      </div>

      {/* Publish buttons for exams */}
      {exams.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-dark mb-3 text-sm">Publish Results by Exam</h3>
          <div className="flex flex-wrap gap-2">
            {exams.map((ex) => (
              <button
                key={ex._id}
                onClick={() => handlePublish(ex._id, ex.title)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition"
              >
                Publish: {ex.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enter Marks Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-dark">Enter Results</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmitMarks} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Exam *</label>
                <select required value={selectedExam} onChange={(e) => handleExamSelect(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/30">
                  <option value="">Choose exam</option>
                  {exams.map((ex) => (
                    <option key={ex._id} value={ex._id}>{ex.title} — {ex.batch?.name} (Total: {ex.totalMarks})</option>
                  ))}
                </select>
              </div>

              {loadingStudents ? (
                <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-secondary" /></div>
              ) : students.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <p className="text-xs text-gray-500 mb-2">Enter marks (max: {exam?.totalMarks || '?'})</p>
                  {students.map((s) => (
                    <div key={s._id} className="flex items-center gap-3">
                      <span className="text-sm text-dark flex-1 truncate">{s.name}</span>
                      <span className="text-xs text-gray-400 font-mono">{s.studentId}</span>
                      <input
                        type="number"
                        min="0"
                        max={exam?.totalMarks || 100}
                        value={marks[s._id] || ''}
                        onChange={(e) => setMarks({ ...marks, [s._id]: e.target.value })}
                        placeholder="Marks"
                        className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-secondary/30"
                      />
                    </div>
                  ))}
                </div>
              ) : selectedExam ? (
                <p className="text-sm text-gray-400 text-center py-4">No students in this batch.</p>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving || !selectedExam} className="px-5 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Results'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
