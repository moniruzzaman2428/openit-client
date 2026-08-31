import { useState, useEffect } from 'react';
import { FaPlus, FaSpinner, FaTimes, FaBan, FaCertificate } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getCertificates, createCertificate, revokeCertificate } from '../../services/certificateService';
import api from '../../services/api';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    student: '', course: '', completionDate: '', duration: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [certRes, studentRes] = await Promise.all([
        getCertificates(),
        api.get('/students').catch(() => ({ data: { data: { students: [] } } }))
      ]);
      setCertificates(certRes.data.certificates || []);
      setStudents(studentRes.data?.data?.students || studentRes.data?.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStudentChange = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    setForm({
      ...form,
      student: studentId,
      course: student?.course?._id || student?.course || '',
      duration: student?.course?.duration || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await createCertificate(form);
      Swal.fire({
        icon: 'success',
        title: 'Certificate Issued!',
        html: `
          <p><strong>Certificate ID:</strong> ${res.data.certificate.certificateId}</p>
          <p class="mt-1 text-sm">Verification Code: ${res.data.certificate.verificationCode}</p>
        `,
        confirmButtonColor: '#0F4C81'
      });
      setShowModal(false);
      setForm({ student: '', course: '', completionDate: '', duration: '' });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not issue certificate' });
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (id, certId) => {
    const result = await Swal.fire({
      title: 'Revoke Certificate?',
      text: `Revoke ${certId}? This cannot be easily undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Revoke'
    });
    if (!result.isConfirmed) return;

    try {
      await revokeCertificate(id);
      Swal.fire({ icon: 'success', title: 'Revoked', timer: 1500, showConfirmButton: false });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not revoke' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Certificates</h1>
          <p className="text-gray-500 text-sm">Issue and manage student certificates</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition">
          <FaPlus /> Issue Certificate
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-primary animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-5 py-3.5 font-medium">Certificate ID</th>
                  <th className="px-5 py-3.5 font-medium">Student</th>
                  <th className="px-5 py-3.5 font-medium hidden md:table-cell">Course</th>
                  <th className="px-5 py-3.5 font-medium">Completion</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {certificates.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-mono text-xs text-primary font-semibold">{c.certificateId}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-dark">{c.student?.name}</p>
                      <p className="text-xs text-gray-400">{c.student?.studentId}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{c.course?.title}</td>
                    <td className="px-5 py-3.5 text-gray-500">{new Date(c.completionDate).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                        c.status === 'valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {c.status === 'valid' && (
                        <button onClick={() => handleRevoke(c._id, c.certificateId)} className="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition" title="Revoke">
                          <FaBan className="text-sm" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && certificates.length === 0 && (
          <div className="text-center py-12 text-gray-400">No certificates issued yet.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-dark">Issue Certificate</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <select required value={form.student} onChange={(e) => handleStudentChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} ({s.studentId}) — {s.course?.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date *</label>
                <input required type="date" value={form.completionDate} onChange={(e) => setForm({ ...form, completionDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 6 Months"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60">
                  {saving ? 'Issuing...' : 'Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
