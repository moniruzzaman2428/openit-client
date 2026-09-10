import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaEdit,
  FaPlus,
  FaReceipt,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaTrash,
  FaUserGraduate,
  FaChevronDown,
  FaCheck,
  FaPhone,
  FaIdCard,
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import {
  createPayment,
  deletePayment,
  getPayment,
  getPayments,
  updatePayment,
} from '../../services/paymentService';
import api from '../../services/api';

const emptyForm = {
  student: '',
  course: '',
  amount: '',
  paymentMethod: 'cash',
  transactionId: '',
  paymentDate: '',
  remarks: '',
};

// ============================================================
// SEARCHABLE STUDENT SELECT COMPONENT
// ============================================================

const StudentSelect = ({ students, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const selected = useMemo(
    () => students.find((s) => s._id === value) || null,
    [students, value]
  );

  // close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // reset query when opening
  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return students;
    const needle = query.trim().toLowerCase();
    return students.filter((s) => {
      const name = (s.name || '').toLowerCase();
      const studentId = (s.studentId || '').toLowerCase();
      const phone = (s.phone || s.mobile || s.contactNumber || '').toString().toLowerCase();
      return (
        name.includes(needle) ||
        studentId.includes(needle) ||
        phone.includes(needle)
      );
    });
  }, [students, query]);

  const handleSelect = (student) => {
    onChange(student._id);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* TRIGGER */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-left text-sm transition
          ${disabled ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-200 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30'}
          ${open ? 'ring-2 ring-primary/30 border-primary/50' : ''}
        `}
      >
        {selected ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <FaUserGraduate className="text-primary text-xs" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-dark truncate">{selected.name}</p>
              <p className="text-[10px] text-gray-400 truncate">
                {selected.studentId || 'N/A'}
                {selected.phone ? ` · ${selected.phone}` : ''}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Search student by name, ID or phone...</span>
        )}
        <FaChevronDown
          className={`text-gray-400 text-xs shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          {/* SEARCH INPUT */}
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type name, student ID or phone..."
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* RESULTS */}
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                <FaSearch className="mx-auto mb-2 text-gray-300" />
                No matching student found
              </div>
            ) : (
              filtered.map((s) => {
                const isActive = s._id === value;
                return (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => handleSelect(s)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition border-b border-gray-50 last:border-0
                      ${isActive ? 'bg-primary/5' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <FaUserGraduate className="text-primary text-xs" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark truncate">{s.name}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <FaIdCard className="text-[9px]" />
                          {s.studentId || 'N/A'}
                        </span>
                        {s.phone && (
                          <span className="inline-flex items-center gap-1">
                            <FaPhone className="text-[9px]" />
                            {s.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    {isActive && <FaCheck className="text-primary text-xs shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN PAYMENTS COMPONENT
// ============================================================

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await getPayments({ limit: 200, sort: '-paymentDate' });
      setPayments(res.data?.payments || []);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Could not load payments.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students', { params: { limit: 500, sort: 'name' } });
      setStudents(res.data?.data?.students || res.data?.students || []);
    } catch {
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (payment) => {
    setEditing(payment);
    setForm({
      student: payment.student?._id || payment.student || '',
      course: payment.course?._id || payment.course || '',
      amount: payment.amount ?? '',
      paymentMethod: payment.paymentMethod || 'cash',
      transactionId: payment.transactionId || '',
      paymentDate: payment.paymentDate
        ? new Date(payment.paymentDate).toISOString().slice(0, 10)
        : '',
      remarks: payment.remarks || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleStudentChange = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    setForm((current) => ({
      ...current,
      student: studentId,
      course: student?.course?._id || student?.course || '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updatePayment(editing._id, {
          amount: Number(form.amount),
          paymentMethod: form.paymentMethod,
          transactionId: form.transactionId,
          paymentDate: form.paymentDate || undefined,
          remarks: form.remarks,
        });
        Swal.fire({
          icon: 'success',
          title: 'Payment Updated',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const res = await createPayment({
          ...form,
          amount: Number(form.amount),
          paymentDate: form.paymentDate || undefined,
        });
        Swal.fire({
          icon: 'success',
          title: 'Payment Recorded!',
          html: `
            <p><strong>Receipt:</strong> ${res.data.payment.receiptNumber}</p>
            <p class="mt-1">Paid: ৳${res.data.summary.paidAmount} · Due: ৳${res.data.summary.dueAmount}</p>
          `,
          confirmButtonColor: '#0F4C81',
        });
      }
      closeModal();
      await fetchPayments();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Could not save payment.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (payment) => {
    const result = await Swal.fire({
      title: 'Delete payment?',
      text: `${payment.receiptNumber} will be permanently removed and the student ledger will be recalculated.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;

    try {
      await deletePayment(payment._id);
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        timer: 1300,
        showConfirmButton: false,
      });
      await fetchPayments();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Could not delete payment.',
      });
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
            <p><strong>Student:</strong> ${p.student?.name || '-'}</p>
            <p><strong>Student ID:</strong> ${p.student?.studentId || '-'}</p>
            <p><strong>Course:</strong> ${p.course?.title || '-'}</p>
            <hr class="my-2"/>
            <p><strong>Amount:</strong> ৳${Number(p.amount || 0).toLocaleString()}</p>
            <p><strong>Method:</strong> ${p.paymentMethod || '-'}</p>
            ${p.transactionId ? `<p><strong>Txn ID:</strong> ${p.transactionId}</p>` : ''}
            <p><strong>Total Fee:</strong> ৳${Number(p.totalFee || 0).toLocaleString()}</p>
            <p><strong>Paid Total:</strong> ৳${Number(p.paidAmount || 0).toLocaleString()}</p>
            <p><strong>Due:</strong> ৳${Number(p.dueAmount || 0).toLocaleString()}</p>
            <p><strong>Received By:</strong> ${p.receivedBy?.name || 'Admin'}</p>
            <hr class="my-2"/>
            <p class="text-center text-xs text-gray-400 mt-2">Thank you for your payment</p>
          </div>
        `,
        confirmButtonColor: '#0F4C81',
        width: 420,
        showCloseButton: true,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Could not load receipt.',
      });
    }
  };

  const filtered = payments.filter((p) => {
    if (!search) return true;
    const needle = search.toLowerCase();
    return (
      p.student?.name?.toLowerCase().includes(needle) ||
      p.receiptNumber?.toLowerCase().includes(needle) ||
      p.student?.studentId?.toLowerCase().includes(needle) ||
      p.course?.title?.toLowerCase().includes(needle)
    );
  });

  const methodLabel = { cash: 'Cash', bkash: 'bKash', nagad: 'Nagad', bank: 'Bank' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Payments</h1>
          <p className="text-gray-500 text-sm">Real payment ledger loaded from the database</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition"
        >
          <FaPlus /> Add Payment
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name, receipt, course or student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <FaSpinner className="text-2xl text-primary animate-spin" />
          </div>
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
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-mono text-xs text-primary font-semibold">
                      {p.receiptNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-dark">{p.student?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{p.student?.studentId || '-'}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">
                      {p.course?.title || '-'}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-dark">
                      ৳{Number(p.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">
                      {methodLabel[p.paymentMethod] || p.paymentMethod}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => viewReceipt(p._id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition"
                        title="View Receipt"
                      >
                        <FaReceipt className="text-sm" />
                      </button>
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition"
                        title="Edit"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <FaTrash className="text-sm" />
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-20">
              <div>
                <h2 className="text-lg font-bold text-dark">
                  {editing ? 'Update Payment' : 'Record Payment'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editing ? 'Modify payment details' : 'Add a new payment to the ledger'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student <span className="text-red-500">*</span>
                </label>
                <StudentSelect
                  students={students}
                  value={form.student}
                  onChange={handleStudentChange}
                  disabled={Boolean(editing)}
                />
                {editing && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    Student cannot be changed after payment is recorded.
                  </p>
                )}
                {students.length === 0 && !editing && (
                  <p className="text-xs text-amber-600 mt-1">
                    No students found. Approve admissions first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="cash">Cash</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              {['bkash', 'nagad', 'bank'].includes(form.paymentMethod) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <input
                    value={form.transactionId}
                    onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Txn ID"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <input
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60 hover:bg-primary/90 transition"
                >
                  {saving ? 'Saving...' : editing ? 'Update Payment' : 'Record Payment'}
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