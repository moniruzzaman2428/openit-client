// ============================================================
// FILE: Admin Payments page (replaces your admin Payments.jsx)
// ============================================================
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FaCalendarAlt,
  FaCheck,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaExclamationTriangle,
  FaIdCard,
  FaMoneyBillWave,
  FaPhone,
  FaPlus,
  FaReceipt,
  FaRedo,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaTrash,
  FaUserGraduate,
  FaWallet,
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

import {
  METHOD_LABEL,
  formatCurrency,
  formatDate,
} from '../../utils/paymentUtils.js';
import PaymentReceiptModal from '../../components/PaymentReceiptModal';

// ============================================================
// CONSTANTS
// ============================================================

const BRAND = '#0F4C81';
const PAGE_SIZE = 10;

const emptyForm = {
  student: '',
  course: '',
  amount: '',
  paymentMethod: 'cash',
  transactionId: '',
  paymentDate: '',
  remarks: '',
};

const METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bkash', label: 'bKash' },
  { value: 'nagad', label: 'Nagad' },
  { value: 'bank', label: 'Bank' },
];

const METHOD_STYLE = {
  cash: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  bkash: 'bg-pink-50 text-pink-700 ring-pink-200',
  nagad: 'bg-orange-50 text-orange-700 ring-orange-200',
  bank: 'bg-blue-50 text-blue-700 ring-blue-200',
};

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
});

const todayISO = () => new Date().toISOString().slice(0, 10);

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';

// ============================================================
// SMALL UI PIECES
// ============================================================

const MethodBadge = ({ method }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
      METHOD_STYLE[method] || 'bg-slate-50 text-slate-600 ring-slate-200'
    }`}
  >
    {METHOD_LABEL[method] || method || 'N/A'}
  </span>
);

const StatCard = ({ icon: Icon, label, value, hint, tone = 'brand' }) => {
  const tones = {
    brand: 'bg-[#0F4C81]/10 text-[#0F4C81]',
    green: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
};

const IconAction = ({ label, onClick, tone = 'default', children }) => {
  const tones = {
    default: 'hover:bg-[#0F4C81]/10 hover:text-[#0F4C81]',
    edit: 'hover:bg-amber-50 hover:text-amber-600',
    danger: 'hover:bg-rose-50 hover:text-rose-600',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] ${tones[tone]}`}
    >
      {children}
    </button>
  );
};

const inputClass = (hasError) =>
  `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-4 ${
    hasError
      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
      : 'border-slate-200 hover:border-slate-300 focus:border-[#0F4C81] focus:ring-[#0F4C81]/10'
  }`;

// ============================================================
// SEARCHABLE STUDENT SELECT (keyboard friendly)
// ============================================================

const StudentSelect = ({ students, value, onChange, disabled, hasError }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const selected = useMemo(
    () => students.find((s) => s._id === value) || null,
    [students, value]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return students;
    return students.filter((s) => {
      const name = (s.name || '').toLowerCase();
      const studentId = (s.studentId || '').toLowerCase();
      const phone = (s.phone || s.mobile || s.contactNumber || '').toString().toLowerCase();
      return name.includes(needle) || studentId.includes(needle) || phone.includes(needle);
    });
  }, [students, query]);

  // outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // reset when opening
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // keep active option visible
  useEffect(() => {
    if (!open) return;
    listRef.current?.children?.[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const choose = (student) => {
    onChange(student);
    setOpen(false);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (filtered[activeIndex]) choose(filtered[activeIndex]);
    } else if (event.key === 'Escape') {
      event.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm transition focus:outline-none focus:ring-4 ${
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-50'
            : hasError
            ? 'border-rose-300 focus:ring-rose-500/10'
            : open
            ? 'border-[#0F4C81] ring-4 ring-[#0F4C81]/10'
            : 'border-slate-200 hover:border-slate-300 focus:border-[#0F4C81] focus:ring-[#0F4C81]/10'
        }`}
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F4C81]/10 text-xs font-bold text-[#0F4C81]">
              {initials(selected.name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium text-slate-900">{selected.name}</span>
              <span className="block truncate text-xs text-slate-500">
                {selected.studentId || 'No ID'}
                {selected.phone ? ` · ${selected.phone}` : ''}
              </span>
            </span>
          </span>
        ) : (
          <span className="text-slate-400">Search by name, ID or phone…</span>
        )}
        <FaChevronDown
          className={`shrink-0 text-xs text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type name, student ID or phone…"
                className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-sm focus:border-[#0F4C81] focus:outline-none focus:ring-4 focus:ring-[#0F4C81]/10"
              />
            </div>
          </div>

          <ul ref={listRef} role="listbox" className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-slate-400">
                <FaSearch className="mx-auto mb-2 text-slate-300" />
                No matching student found
              </li>
            ) : (
              filtered.map((s, index) => {
                const isSelected = s._id === value;
                const isActive = index === activeIndex;
                return (
                  <li key={s._id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => choose(s)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
                        isActive ? 'bg-slate-50' : ''
                      } ${isSelected ? 'bg-[#0F4C81]/5' : ''}`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F4C81]/10 text-xs font-bold text-[#0F4C81]">
                        {initials(s.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-900">
                          {s.name}
                        </span>
                        <span className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
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
                        </span>
                      </span>
                      {isSelected && <FaCheck className="shrink-0 text-xs text-[#0F4C81]" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN PAGE
// ============================================================

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const [receipt, setReceipt] = useState(null);
  const [receiptLoadingId, setReceiptLoadingId] = useState(null);

  // ------------------------------------------------------------
  // DATA
  // ------------------------------------------------------------

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await getPayments({ limit: 200, sort: '-paymentDate' });
      setPayments(res.data?.payments || []);
    } catch (err) {
      console.error(err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await api.get('/students', { params: { limit: 500, sort: 'name' } });
      setStudents(res.data?.data?.students || res.data?.students || []);
    } catch {
      setStudents([]);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, [fetchPayments, fetchStudents]);

  // ------------------------------------------------------------
  // DERIVED
  // ------------------------------------------------------------

  const stats = useMemo(() => {
    const now = new Date();
    let total = 0;
    let month = 0;

    payments.forEach((p) => {
      const amount = Number(p.amount || 0);
      total += amount;
      const d = p.paymentDate ? new Date(p.paymentDate) : null;
      if (d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        month += amount;
      }
    });

    return { total, month, count: payments.length };
  }, [payments]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (methodFilter !== 'all' && p.paymentMethod !== methodFilter) return false;
      if (!needle) return true;
      return (
        p.student?.name?.toLowerCase().includes(needle) ||
        p.receiptNumber?.toLowerCase().includes(needle) ||
        p.student?.studentId?.toLowerCase().includes(needle) ||
        p.course?.title?.toLowerCase().includes(needle)
      );
    });
  }, [payments, search, methodFilter]);

  const filteredTotal = useMemo(
    () => filtered.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [filtered]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, methodFilter]);

  const selectedStudent = useMemo(
    () => students.find((s) => s._id === form.student) || null,
    [students, form.student]
  );

  // ------------------------------------------------------------
  // MODAL
  // ------------------------------------------------------------

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, paymentDate: todayISO() });
    setFormErrors({});
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
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = useCallback(() => {
    if (saving) return;
    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
  }, [saving]);

  // Esc closes the form + lock page scroll
  useEffect(() => {
    if (!showModal) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [showModal, closeModal]);

  const handleStudentChange = (student) => {
    setForm((current) => ({
      ...current,
      student: student._id,
      course: student?.course?._id || student?.course || '',
    }));
    setFormErrors((e) => ({ ...e, student: undefined }));
  };

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setFormErrors((e) => ({ ...e, [name]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!editing && !form.student) errors.student = 'Please select a student';
    if (!form.amount || Number(form.amount) <= 0) errors.amount = 'Enter an amount greater than 0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ------------------------------------------------------------
  // RECEIPT
  // ------------------------------------------------------------

  const openReceipt = async (id) => {
    try {
      setReceiptLoadingId(id);
      const res = await getPayment(id);
      setReceipt(res.data.payment);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Could not load receipt',
        text: err.response?.data?.message || 'Please try again.',
        confirmButtonColor: BRAND,
      });
    } finally {
      setReceiptLoadingId(null);
    }
  };

  // ------------------------------------------------------------
  // SAVE / DELETE
  // ------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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

        setShowModal(false);
        setEditing(null);
        setForm(emptyForm);
        Toast.fire({ icon: 'success', title: 'Payment updated' });
      } else {
        const res = await createPayment({
          ...form,
          amount: Number(form.amount),
          paymentDate: form.paymentDate || undefined,
        });

        const created = res.data.payment;
        const summary = res.data.summary;

        setShowModal(false);
        setForm(emptyForm);

        const result = await Swal.fire({
          icon: 'success',
          title: 'Payment recorded',
          html: `
            <p style="margin:0 0 4px"><strong>Receipt:</strong> ${escapeHtml(created.receiptNumber)}</p>
            <p style="margin:0">Paid: ৳${Number(summary.paidAmount || 0).toLocaleString()} · Due: ৳${Number(
              summary.dueAmount || 0
            ).toLocaleString()}</p>
          `,
          showCancelButton: true,
          confirmButtonText: 'View receipt',
          cancelButtonText: 'Done',
          confirmButtonColor: BRAND,
        });

        if (result.isConfirmed) openReceipt(created._id);
      }

      await fetchPayments();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Could not save payment.',
        confirmButtonColor: BRAND,
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
      Toast.fire({ icon: 'success', title: 'Payment deleted' });
      await fetchPayments();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Could not delete payment.',
        confirmButtonColor: BRAND,
      });
    }
  };

  const hasFilters = search.trim() !== '' || methodFilter !== 'all';

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments</h1>
          <p className="mt-1 text-sm text-slate-500">
            Record payments, manage the ledger and issue receipts
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-[#0b3b64] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
        >
          <FaPlus className="text-xs" />
          Add payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FaWallet} label="Total collected" value={formatCurrency(stats.total)} hint="From loaded records" />
        <StatCard icon={FaCalendarAlt} label="This month" value={formatCurrency(stats.month)} tone="green" />
        <StatCard icon={FaReceipt} label="Transactions" value={stats.count.toLocaleString()} tone="violet" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
          <input
            type="search"
            placeholder="Search by name, receipt, course or student ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search payments"
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 transition hover:border-slate-300 focus:border-[#0F4C81] focus:outline-none focus:ring-4 focus:ring-[#0F4C81]/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by payment method">
          {[{ value: 'all', label: 'All' }, ...METHODS].map((m) => {
            const active = methodFilter === m.value;
            return (
              <button
                key={m.value}
                type="button"
                aria-pressed={active}
                onClick={() => setMethodFilter(m.value)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] ${
                  active
                    ? 'bg-[#0F4C81] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loadError ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-xl text-rose-500">
              <FaExclamationTriangle />
            </div>
            <p className="mt-3 font-semibold text-slate-800">Could not load payments</p>
            <p className="mt-1 text-sm text-slate-500">Please check your connection and try again.</p>
            <button
              type="button"
              onClick={fetchPayments}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3b64]"
            >
              <FaRedo className="text-xs" /> Try again
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                    <th scope="col" className="px-5 py-3.5">Receipt</th>
                    <th scope="col" className="px-5 py-3.5">Student</th>
                    <th scope="col" className="hidden px-5 py-3.5 md:table-cell">Course</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Amount</th>
                    <th scope="col" className="hidden px-5 py-3.5 lg:table-cell">Method</th>
                    <th scope="col" className="px-5 py-3.5">Date</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((__, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-4 animate-pulse rounded bg-slate-100" />
                          </td>
                        ))}
                      </tr>
                    ))}

                  {!loading &&
                    pageRows.map((p) => (
                      <tr key={p._id} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-[#0F4C81]">
                          {p.receiptNumber}
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F4C81]/10 text-xs font-bold text-[#0F4C81]">
                              {initials(p.student?.name)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-900">
                                {p.student?.name || 'Unknown'}
                              </p>
                              <p className="text-xs text-slate-500">{p.student?.studentId || '-'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="hidden max-w-[220px] truncate px-5 py-3.5 text-slate-600 md:table-cell">
                          {p.course?.title || '-'}
                        </td>

                        <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-slate-900">
                          {formatCurrency(p.amount)}
                        </td>

                        <td className="hidden px-5 py-3.5 lg:table-cell">
                          <MethodBadge method={p.paymentMethod} />
                        </td>

                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                          {formatDate(p.paymentDate)}
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <IconAction label="View receipt" onClick={() => openReceipt(p._id)}>
                              {receiptLoadingId === p._id ? (
                                <FaSpinner className="animate-spin text-sm" />
                              ) : (
                                <FaReceipt className="text-sm" />
                              )}
                            </IconAction>
                            <IconAction label="Edit payment" tone="edit" onClick={() => openEdit(p)}>
                              <FaEdit className="text-sm" />
                            </IconAction>
                            <IconAction label="Delete payment" tone="danger" onClick={() => handleDelete(p)}>
                              <FaTrash className="text-sm" />
                            </IconAction>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Empty */}
            {!loading && filtered.length === 0 && (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-xl text-slate-300">
                  <FaReceipt />
                </div>
                <p className="mt-3 font-medium text-slate-700">
                  {hasFilters ? 'No payments match your filters' : 'No payments recorded yet'}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {hasFilters ? 'Try a different search or method.' : 'Add your first payment to get started.'}
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setMethodFilter('all');
                    }}
                    className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Footer / pagination */}
            {!loading && filtered.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 text-sm sm:flex-row">
                <p className="text-slate-500">
                  Showing{' '}
                  <span className="font-medium text-slate-700">
                    {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}
                  </span>{' '}
                  of <span className="font-medium text-slate-700">{filtered.length}</span>
                  <span className="mx-2 text-slate-300">|</span>
                  Total <span className="font-semibold text-slate-800">{formatCurrency(filteredTotal)}</span>
                </p>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaChevronLeft className="text-xs" />
                    </button>
                    <span className="px-2 text-slate-600">
                      Page <span className="font-semibold">{currentPage}</span> / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaChevronRight className="text-xs" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editing ? 'Update payment' : 'Record payment'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editing ? 'Update payment' : 'Record payment'}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  {editing ? editing.receiptNumber : 'Add a new payment to the ledger'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
                {/* Student */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Student <span className="text-rose-500">*</span>
                  </label>
                  <StudentSelect
                    students={students}
                    value={form.student}
                    onChange={handleStudentChange}
                    disabled={Boolean(editing)}
                    hasError={Boolean(formErrors.student)}
                  />
                  {formErrors.student && (
                    <p role="alert" className="mt-1.5 text-xs text-rose-600">{formErrors.student}</p>
                  )}
                  {editing && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      The student cannot be changed after a payment is recorded.
                    </p>
                  )}
                  {!editing && students.length === 0 && (
                    <p className="mt-1.5 text-xs text-amber-600">
                      No students found. Approve admissions first.
                    </p>
                  )}
                  {selectedStudent?.course?.title && (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200">
                      <FaUserGraduate className="text-[#0F4C81]" />
                      {selectedStudent.course.title}
                    </p>
                  )}
                </div>

                {/* Amount + Date */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pay-amount" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Amount (৳) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="pay-amount"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      step="any"
                      value={form.amount}
                      onChange={(e) => setField('amount', e.target.value)}
                      placeholder="0"
                      aria-invalid={Boolean(formErrors.amount)}
                      className={inputClass(formErrors.amount)}
                    />
                    {formErrors.amount && (
                      <p role="alert" className="mt-1.5 text-xs text-rose-600">{formErrors.amount}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="pay-date" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Payment date
                    </label>
                    <input
                      id="pay-date"
                      type="date"
                      max={todayISO()}
                      value={form.paymentDate}
                      onChange={(e) => setField('paymentDate', e.target.value)}
                      className={inputClass(false)}
                    />
                  </div>
                </div>

                {/* Method */}
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Payment method <span className="text-rose-500">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Payment method">
                    {METHODS.map((m) => {
                      const active = form.paymentMethod === m.value;
                      return (
                        <button
                          key={m.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setField('paymentMethod', m.value)}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] ${
                            active
                              ? 'border-[#0F4C81] bg-[#0F4C81]/5 text-[#0F4C81]'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {['bkash', 'nagad', 'bank'].includes(form.paymentMethod) && (
                  <div>
                    <label htmlFor="pay-txn" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Transaction ID
                    </label>
                    <input
                      id="pay-txn"
                      value={form.transactionId}
                      onChange={(e) => setField('transactionId', e.target.value)}
                      placeholder="e.g. 9H4K2L7M"
                      className={`${inputClass(false)} font-mono`}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="pay-remarks" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Remarks
                  </label>
                  <textarea
                    id="pay-remarks"
                    rows={2}
                    value={form.remarks}
                    onChange={(e) => setField('remarks', e.target.value)}
                    placeholder="Optional note"
                    className={`${inputClass(false)} resize-none`}
                  />
                </div>
              </div>

              {/* footer */}
              <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3b64] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <FaMoneyBillWave className="text-xs" />
                      {editing ? 'Update payment' : 'Record payment'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt (same modal as the student page) */}
      {receipt && <PaymentReceiptModal payment={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
};

export default Payments;
