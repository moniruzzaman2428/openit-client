// ============================================================
// FILE: Student Payments page (replaces your student Payments.jsx)
// ============================================================
import { useCallback, useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaReceipt,
  FaRedo,
  FaSpinner,
  FaWallet,
} from 'react-icons/fa';
import Swal from 'sweetalert2';

import { getPayment, getPaymentSummary } from '../../services/paymentService';
import {
  METHOD_LABEL,
  formatCurrency,
  formatDate,
} from '../../utils/paymentUtils';
import PaymentReceiptModal from '../../components/PaymentReceiptModal';

const METHOD_STYLE = {
  cash: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  bkash: 'bg-pink-50 text-pink-700 ring-pink-200',
  nagad: 'bg-orange-50 text-orange-700 ring-orange-200',
  bank: 'bg-blue-50 text-blue-700 ring-blue-200',
};

const MethodBadge = ({ method }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
      METHOD_STYLE[method] || 'bg-slate-50 text-slate-600 ring-slate-200'
    }`}
  >
    {METHOD_LABEL[method] || method || 'N/A'}
  </span>
);

const ReceiptButton = ({ onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0F4C81] transition hover:border-[#0F4C81] hover:bg-[#0F4C81] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2 disabled:opacity-60"
  >
    {loading ? <FaSpinner className="animate-spin" /> : <FaReceipt />}
    View receipt
  </button>
);

const Payments = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [receiptLoadingId, setReceiptLoadingId] = useState(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getPaymentSummary();
      setSummary(res.data);
    } catch (err) {
      console.error('Payment summary error:', err);
      setSummary(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const openReceipt = async (id) => {
    try {
      setReceiptLoadingId(id);
      const res = await getPayment(id);
      setReceipt(res.data.payment);
    } catch (err) {
      console.error('Receipt error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Could not load receipt',
        text: err.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#0F4C81',
      });
    } finally {
      setReceiptLoadingId(null);
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-100" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  // ---------------- ERROR ----------------
  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-xl text-rose-500">
          <FaExclamationTriangle />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">Unable to load payments</h2>
        <p className="mt-1 text-sm text-slate-500">
          We could not load your payment information. Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={loadSummary}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3b64]"
        >
          <FaRedo className="text-xs" /> Try again
        </button>
      </div>
    );
  }

  const totalFee = Number(summary?.totalFee || 0);
  const paidAmount = Number(summary?.paidAmount || 0);
  const dueAmount = Number(summary?.dueAmount || 0);
  const paidPercent = totalFee > 0 ? Math.min(100, Math.round((paidAmount / totalFee) * 100)) : 0;
  const settled = dueAmount <= 0 && totalFee > 0;
  const payments = summary?.payments || [];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Payments</h1>
          <p className="mt-1 text-sm text-slate-500">
            Payment history, receipts and outstanding balance
          </p>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total course fee</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F4C81]/10 text-[#0F4C81]">
                <FaWallet />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
              {formatCurrency(totalFee)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total paid</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FaCheckCircle />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-600">
              {formatCurrency(paidAmount)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Outstanding due</p>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  dueAmount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                <FaMoneyBillWave />
              </div>
            </div>
            <p
              className={`mt-2 text-2xl font-bold tabular-nums ${
                dueAmount > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {formatCurrency(dueAmount)}
            </p>
          </div>
        </div>

        {/* Progress */}
        {totalFee > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Payment progress</h3>
                <p className="text-xs text-slate-500">
                  {settled ? 'Your course fee is fully paid.' : `${formatCurrency(dueAmount)} remaining`}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  settled ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                }`}
              >
                {paidPercent}% paid
              </span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={paidPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Payment progress"
            >
              <div
                className={`h-full rounded-full ${settled ? 'bg-emerald-500' : 'bg-[#0F4C81]'}`}
                style={{ width: `${paidPercent}%`, transition: 'width 700ms ease-out' }}
              />
            </div>
          </div>
        )}

        {/* History */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Payment history</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {payments.length} {payments.length === 1 ? 'transaction' : 'transactions'}
              </p>
            </div>
          </div>

          {payments.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-xl text-slate-300">
                <FaReceipt />
              </div>
              <p className="mt-3 font-medium text-slate-700">No payments recorded yet</p>
              <p className="mt-1 text-xs text-slate-500">Your payment history will appear here.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                      <th scope="col" className="px-5 py-3">Receipt no.</th>
                      <th scope="col" className="px-5 py-3">Date</th>
                      <th scope="col" className="px-5 py-3">Method</th>
                      <th scope="col" className="px-5 py-3 text-right">Amount</th>
                      <th scope="col" className="px-5 py-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <tr key={p._id} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-[#0F4C81]">
                          {p.receiptNumber}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">{formatDate(p.paymentDate)}</td>
                        <td className="px-5 py-3.5">
                          <MethodBadge method={p.paymentMethod} />
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-slate-900">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <ReceiptButton
                            onClick={() => openReceipt(p._id)}
                            loading={receiptLoadingId === p._id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <ul className="divide-y divide-slate-100 md:hidden">
                {payments.map((p) => (
                  <li key={p._id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs font-semibold text-[#0F4C81]">
                          {p.receiptNumber}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">{formatDate(p.paymentDate)}</p>
                      </div>
                      <p className="text-base font-bold tabular-nums text-slate-900">
                        {formatCurrency(p.amount)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <MethodBadge method={p.paymentMethod} />
                      <ReceiptButton
                        onClick={() => openReceipt(p._id)}
                        loading={receiptLoadingId === p._id}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {receipt && <PaymentReceiptModal payment={receipt} onClose={() => setReceipt(null)} />}
    </>
  );
};

export default Payments;
