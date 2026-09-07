import { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaSave, FaSpinner, FaSyncAlt, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getBatches } from '../../services/batchService';
import {
  deleteAttendance,
  getAttendance,
  getBatchStudents,
  markAttendance,
  updateAttendance,
} from '../../services/attendanceService';

const today = new Date().toISOString().split('T')[0];
const statusClass = {
  present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  absent: 'bg-red-50 text-red-700 border-red-200',
  late: 'bg-amber-50 text-amber-700 border-amber-200',
};

const Attendance = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [date, setDate] = useState(today);
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const batch = useMemo(
    () => batches.find((item) => item._id === selectedBatch),
    [batches, selectedBatch]
  );

  const loadBatches = async () => {
    setLoading(true);
    try {
      const res = await getBatches({ limit: 100, sort: '-createdAt' });
      const list = res?.data?.batches || [];
      setBatches(list);
      if (!selectedBatch && list.length) setSelectedBatch(list[0]._id);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Could not load batches', text: err.response?.data?.message || 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async () => {
    if (!selectedBatch || !date) {
      setStudents([]);
      setRecords([]);
      return;
    }

    setLoadingStudents(true);
    try {
      const [studentRes, attendanceRes] = await Promise.all([
        getBatchStudents(selectedBatch, date),
        getAttendance({ batch: selectedBatch, date }),
      ]);

      const studentList = studentRes?.data?.students || [];
      const existing = studentRes?.data?.existingAttendance || {};
      setStudents(studentList);
      setAttendanceMap(
        studentList.reduce((map, student) => {
          map[student._id] = existing[student._id] || 'present';
          return map;
        }, {})
      );
      setRecords(attendanceRes?.data?.attendance || []);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Could not load attendance', text: err.response?.data?.message || 'Server error' });
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => { loadBatches(); }, []);
  useEffect(() => { loadAttendance(); }, [selectedBatch, date]);

  const saveAttendance = async () => {
    if (!batch || !students.length) return;
    const courseId = batch.course?._id || batch.course;
    if (!courseId) {
      Swal.fire({ icon: 'warning', title: 'Batch course missing' });
      return;
    }

    setSaving(true);
    try {
      await markAttendance({
        course: courseId,
        batch: selectedBatch,
        date,
        records: students.map((student) => ({ student: student._id, status: attendanceMap[student._id] || 'present' })),
      });
      await loadAttendance();
      Swal.fire({ icon: 'success', title: 'Attendance saved', timer: 1300, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save failed', text: err.response?.data?.message || 'Could not save attendance' });
    } finally {
      setSaving(false);
    }
  };

  const changeExisting = async (id, status) => {
    try {
      await updateAttendance(id, { status });
      setRecords((items) => items.map((item) => item._id === id ? { ...item, status } : item));
      const record = records.find((item) => item._id === id);
      if (record?.student?._id) setAttendanceMap((map) => ({ ...map, [record.student._id]: status }));
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: err.response?.data?.message || 'Could not update record' });
    }
  };

  const removeRecord = async (record) => {
    const ask = await Swal.fire({
      title: 'Delete attendance record?',
      text: `${record.student?.name || 'Student'} - ${date}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });
    if (!ask.isConfirmed) return;
    try {
      await deleteAttendance(record._id);
      await loadAttendance();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Delete failed', text: err.response?.data?.message || 'Could not delete record' });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-2xl text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Attendance Management</h1>
          <p className="text-sm text-gray-500">Mark, update and delete attendance using live MongoDB data.</p>
        </div>
        <button onClick={loadAttendance} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold"><FaSyncAlt /> Refresh</button>
      </div>

      <div className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-2">
        <label className="text-sm font-medium text-gray-700">Batch
          <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="mt-1.5 w-full rounded-xl border px-4 py-2.5">
            <option value="">Select batch</option>
            {batches.map((item) => <option key={item._id} value={item._id}>{item.name} — {item.course?.title || 'Course'}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 w-full rounded-xl border px-4 py-2.5" />
        </label>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">Mark Attendance</h2>
            <p className="text-xs text-gray-500">{batch?.name || 'Select a batch'} · {students.length} active students</p>
          </div>
          <button disabled={saving || !students.length} onClick={saveAttendance} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Attendance
          </button>
        </div>
        {loadingStudents ? <div className="flex justify-center py-12"><FaSpinner className="animate-spin text-primary" /></div> : students.length ? (
          <div className="divide-y">
            {students.map((student) => (
              <div key={student._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.studentId} · {student.phone || 'No phone'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['present', 'absent', 'late'].map((status) => (
                    <button key={status} onClick={() => setAttendanceMap((map) => ({ ...map, [student._id]: status }))}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize ${attendanceMap[student._id] === status ? statusClass[status] : 'border-gray-200 text-gray-500'}`}>
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : <div className="py-12 text-center text-sm text-gray-400">No active students found for this batch.</div>}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b p-5"><h2 className="font-bold">Saved Records</h2><p className="text-xs text-gray-500">Changes here are written directly to the database.</p></div>
        {records.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></tr></thead>
              <tbody className="divide-y">
                {records.map((record) => (
                  <tr key={record._id}>
                    <td className="px-4 py-3"><p className="font-semibold">{record.student?.name}</p><p className="text-xs text-gray-400">{record.student?.studentId}</p></td>
                    <td className="px-4 py-3 text-gray-600">{record.course?.title || '—'}</td>
                    <td className="px-4 py-3"><select value={record.status} onChange={(e) => changeExisting(record._id, e.target.value)} className="rounded-lg border px-2 py-1.5 text-xs capitalize"><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></td>
                    <td className="px-4 py-3 text-right"><button onClick={() => removeRecord(record)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Delete"><FaTrash /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-400"><FaCheckCircle /> No saved records for this date.</div>}
      </div>
    </div>
  );
};

export default Attendance;
