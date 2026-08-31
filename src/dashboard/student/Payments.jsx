import { useState, useEffect } from 'react';
import { FaSpinner, FaReceipt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getPaymentSummary, getPayment } from '../../services/paymentService';

const Payments = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getPaymentSummary();
        setSummary(res.data);
      } catch (err) {
        console.error(err);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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
            <hr class="my-2"/>
            <p class="text-center text-xs text-gray-400 mt-2">Thank you for your payment</p>
          </div>
        `,
        confirmButtonColor: '#0F4C81',
        width: 420
      });
    } catch {
      Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not load receipt' });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><FaSpinner className="text-2xl text-primary animate-spin" /></div>;
  }

  const methodLabel = { cash: 'Cash', bkash: 'bKash', nagad: 'Nagad', bank: 'Bank' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Payments</h1>
        <p className="text-gray-500 text-sm">Payment history and due amount</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Total Fee</p>
          <p className="text-2xl font-bold text-dark">৳{(summary?.totalFee || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Paid</p>
          <p className="text-2xl font-bold text-success">৳{(summary?.paidAmount || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Due</p>
          <p className={`text-2xl font-bold ${(summary?.dueAmount || 0) > 0 ? 'text-danger' : 'text-success'}`}>
            ৳{(summary?.dueAmount || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="font-bold text-dark text-sm">Payment History</h3>
        </div>
        {!summary?.payments?.length ? (
          <div className="text-center py-12 text-gray-400">
            <p>No payments recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-5 py-3 font-medium">Receipt No</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Method</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {summary.payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-mono text-xs text-primary font-semibold">{p.receiptNumber}</td>
                    <td className="px-5 py-3 font-semibold text-dark">৳{p.amount?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{methodLabel[p.paymentMethod] || p.paymentMethod}</td>
                    <td className="px-5 py-3 text-gray-500">{new Date(p.paymentDate).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => viewReceipt(p._id)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition">
                        <FaReceipt className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
