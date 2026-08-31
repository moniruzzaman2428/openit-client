import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaSpinner, FaClipboardCheck } from 'react-icons/fa';
import { getBatches } from '../../services/batchService';
import { getBatchStudents, markAttendance } from '../../services/attendanceService';

const Attendance = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [courseId, setCourseId] = useState('');
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load teacher's batches
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getBatches({ limit: 50 });
        setBatches(res.data.batches || []);
      } catch (err) {
        console.error(err);
        setBatches([]);
      } finally {
        setLoadingBatches(false);
      }
    };
    fetch();
  }, []);

  // Load students when batch or date changes
  useEffect(() => {
    if (!selectedBatch) {
      setStudents([]);
      setAttendance({});
      return;
    }

    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await getBatchStudents(selectedBatch, date);
        setStudents(res.data.students || []);
        setCourseId(res.data.batch?.course || '');

        // Pre-fill existing attendance or default to present
        const existing = res.data.existingAttendance || {};
        const initial = {};
        (res.data.students || []).forEach((s) => {
          initial[s._id] = existing[s._id] || 'present';
        });
        setAttendance(initial);
      } catch (err) {
        console.error(err);
        setStudents([]);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load students',
          text: err.response?.data?.message || 'Could not load batch students.',
          confirmButtonColor: '#00AEEF'
        });
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedBatch, date]);

  const handleStatus = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedBatch || students.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Select a batch first', confirmButtonColor: '#00AEEF' });
      return;
    }

    const records = students.map((s) => ({
      student: s._id,
      status: attendance[s._id] || 'present'
    }));

    setSubmitting(true);
    try {
      const res = await markAttendance({
        course: courseId,
        batch: selectedBatch,
        date,
        records
      });

      Swal.fire({
        icon: 'success',
        title: 'Attendance Saved!',
        text: res.message || `Marked for ${res.data?.marked || records.length} students.`,
        confirmButtonColor: '#00AEEF'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Could not save attendance.',
        confirmButtonColor: '#00AEEF'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const statusBtn = (id, status, label, activeColor) => (
    <button
      onClick={() => handleStatus(id, status)}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
        attendance[id] === status
          ? `${activeColor} text-white`
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const selectedBatchInfo = batches.find((b) => b._id === selectedBatch);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Mark Attendance</h1>
        <p className="text-gray-500 text-sm">Select batch and mark student attendance</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Batch</label>
          {loadingBatches ? (
            <div className="py-2.5"><FaSpinner className="animate-spin text-secondary" /></div>
          ) : (
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
            >
              <option value="">Select a batch</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} — {b.course?.title || 'Course'} ({b.time})
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
          />
        </div>
      </div>

      {selectedBatchInfo && (
        <div className="bg-secondary/5 rounded-xl px-4 py-3 text-sm text-secondary font-medium">
          <FaClipboardCheck className="inline mr-2" />
          {selectedBatchInfo.name} · {selectedBatchInfo.course?.title} · {selectedBatchInfo.time}
        </div>
      )}

      {/* Student List */}
      {loadingStudents ? (
        <div className="flex justify-center py-16">
          <FaSpinner className="text-2xl text-secondary animate-spin" />
        </div>
      ) : students.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500">
                    <th className="px-5 py-3.5 font-medium">#</th>
                    <th className="px-5 py-3.5 font-medium">Student ID</th>
                    <th className="px-5 py-3.5 font-medium">Name</th>
                    <th className="px-5 py-3.5 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map((s, i) => (
                    <tr key={s._id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3.5 text-gray-400">{i + 1}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-secondary font-semibold">{s.studentId}</td>
                      <td className="px-5 py-3.5 font-medium text-dark">{s.name}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          {statusBtn(s._id, 'present', 'Present', 'bg-success')}
                          {statusBtn(s._id, 'absent', 'Absent', 'bg-danger')}
                          {statusBtn(s._id, 'late', 'Late', 'bg-accent')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl shadow-lg shadow-secondary/25 transition disabled:opacity-60 flex items-center gap-2"
            >
              {submitting ? (
                <><FaSpinner className="animate-spin" /> Saving...</>
              ) : (
                'Submit Attendance'
              )}
            </button>
          </div>
        </>
      ) : selectedBatch ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p>No active students in this batch.</p>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p>Select a batch to mark attendance.</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;
