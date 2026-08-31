import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaSpinner, FaTimes, FaReceipt, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getPayments, createPayment, getPayment } from '../../services/paymentService';
import api from '../../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    student: '', course: '', amount: '', paymentMethod: 'cash', transactionId: '', remarks: ''
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await getPayments({ limit: 50 });
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data?.data?.students || res.data?.students || []);
    } catch {
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  const handleStudentChange = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    setForm({
      ...form,
      student: studentId,
      course: student?.course?._id || student?.course || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await createPayment({
        ...form,
        amount: Number(form.amount)
      });
      Swal.fire({
        icon: 'success',
        title: 'Payment Recorded!',
        html: `
          <p><strong>Receipt:</strong> ${res.data.payment.receiptNumber}</p>
          <p class="mt-1">Paid: ৳${res.data.summary.paidAmount} · Due: ৳${res.data.summary.dueAmount}</p>
        `,
        confirmButtonColor: '#0F4C81'
      });
      setShowModal(false);
      setForm({ student: '', course: '', amount: '', paymentMethod: 'cash', transactionId: '', remarks: '' });
      fetchPayments();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not record payment' });
    } finally {
      setSaving(false);
    }
  };

  const viewReceipt = async (id) => {
    try {
      const res = await getPayment(id);
      const p = res.data.payment;
      Swal.fire({
        title: 'Payment Receipt',
        html: `
          <div class="text-left text-sm space-y-1.5 border border-gray-200 rounded-xl p-4">
            <p class="text-center font-bold text-lg text-blue-800 mb-3">OPEN IT INSTITUTE</p>
            <p><strong>Receipt No:</strong> ${p.receiptNumber}</p>
            <p><strong>Date:</strong> ${new Date(p.paymentDate).toLocaleDateString()}</p>
            <hr class="my-2"/>
            <p><strong>Student:</strong> ${p.student?.name}</p>
            <p><strong>Student ID:</strong> ${p.student?.studentId}</p>
            <p><strong>Course:</strong> ${p.course?.title}</p>
            <hr class="my-2"/>
            <p><strong>Amount:</strong> ৳${p.amount?.toLocaleString()}</p>
            <p><strong>Method:</strong> ${p.paymentMethod}</p>
            ${p.transactionId ? `<p><strong>Txn ID:</strong> ${p.transactionId}</p>` : ''}
            <p><strong>Total Fee:</strong> ৳${p.totalFee?.toLocaleString()}</p>
            <p><strong>Paid Total:</strong> ৳${p.paidAmount?.toLocaleString()}</p>
            <p><strong>Due:</strong> ৳${p.dueAmount?.toLocaleString()}</p>
            <p><strong>Received By:</strong> ${p.receivedBy?.name || 'Admin'}</p>
            <hr class="my-2"/>
            <p class="text-center text-xs text-gray-400 mt-2">Thank you for your payment</p>
          </div>
        `,
        confirmButtonColor: '#0F4C81',
        width: 420,
        showCloseButton: true
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not load receipt' });
    }
  };

  const filtered = payments.filter((p) =>
    !search ||
    p.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.receiptNumber?.toLowerCase().includes(search.toLowerCase()) ||
    p.student?.studentId?.toLowerCase().includes(search.toLowerCase())
  );

  const methodLabel = { cash: 'Cash', bkash: 'bKash', nagad: 'Nagad', bank: 'Bank' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Payments</h1>
          <p className="text-gray-500 text-sm">Record and manage student payments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition">
          <FaPlus /> Add Payment
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name, receipt or student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-primary animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-5 py-3.5 font-medium">Receipt</th>
                  <th className="px-5 py-3.5 font-medium">Student</th>
                  <th className="px-5 py-3.5 font-medium hidden md:table-cell">Course</th>
                  <th className="px-5 py-3.5 font-medium">Amount</th>
                  <th className="px-5 py-3.5 font-medium hidden lg:table-cell">Method</th>
                  <th className="px-5 py-3.5 font-medium">Date</th>
                  <th className="px-5 py-3.5 font-medium text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-mono text-xs text-primary font-semibold">{p.receiptNumber}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-dark">{p.student?.name}</p>
                      <p className="text-xs text-gray-400">{p.student?.studentId}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{p.course?.title}</td>
                    <td className="px-5 py-3.5 font-semibold text-dark">৳{p.amount?.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{methodLabel[p.paymentMethod] || p.paymentMethod}</td>
                    <td className="px-5 py-3.5 text-gray-500">{new Date(p.paymentDate).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => viewReceipt(p._id)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition" title="View Receipt">
                        <FaReceipt className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No payments found.</div>
        )}
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-dark">Record Payment</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <select required value={form.student} onChange={(e) => handleStudentChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>
                  ))}
                </select>
                {students.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">No students found. Approve admissions first.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳) *</label>
                <input required type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                <select required value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="cash">Cash</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              {(form.paymentMethod === 'bkash' || form.paymentMethod === 'nagad' || form.paymentMethod === 'bank') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                  <input value={form.transactionId} onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Txn ID" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <input value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60">
                  {saving ? 'Saving...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
