import { useEffect, useRef, useState } from 'react';
import { FaSpinner, FaReceipt, FaDownload, FaPrint, FaTimes, FaCheckCircle, FaMoneyBillWave, FaCalendarAlt, FaCreditCard, FaIdCard } from 'react-icons/fa';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getPaymentSummary, getPayment } from '../../services/paymentService';

const LOGO_URL = '/logo.png';

const Payments = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getPaymentSummary();
        setSummary(res.data);
      } catch (err) {
        console.error('Payment summary error:', err);
        setSummary(null);
        Swal.fire({ icon: 'error', title: 'Unable to Load', text: 'Could not load your payment information.', confirmButtonColor: '#0F4C81' });
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const formatCurrency = (value) => {
    const number = Number(value || 0);
    return `৳${number.toLocaleString('en-BD')}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const methodLabel = { cash: 'Cash', bkash: 'bKash', nagad: 'Nagad', bank: 'Bank Transfer' };

  const viewReceipt = async (id) => {
    try {
      setReceiptLoading(true);
      const res = await getPayment(id);
      const payment = res.data.payment;
      setSelectedPayment(payment);
    } catch (error) {
      console.error('Receipt error:', error);
      Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not load payment receipt.', confirmButtonColor: '#0F4C81' });
    } finally {
      setReceiptLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!receiptRef.current || !selectedPayment) return;
    try {
      setDownloading(true);
      const images = receiptRef.current.querySelectorAll('img');
      await Promise.all(Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
      }));
      const canvas = await html2canvas(receiptRef.current, { scale: 2, useCORS: true, allowTaint: false, backgroundColor: '#ffffff', logging: false });
      const imageData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const pdfWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * pdfWidth) / canvas.width;
      let finalHeight = imageHeight;
      const maxHeight = pageHeight - margin * 2;
      if (finalHeight > maxHeight) finalHeight = maxHeight;
      const x = (pageWidth - pdfWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;
      pdf.addImage(imageData, 'PNG', x, y, pdfWidth, finalHeight, undefined, 'FAST');
      const receiptNumber = selectedPayment.receiptNumber || 'payment-receipt';
      pdf.save(`${receiptNumber}.pdf`);
      Swal.fire({ icon: 'success', title: 'Receipt Downloaded', text: 'Your payment receipt has been saved as PDF.', confirmButtonColor: '#0F4C81', timer: 1800, showConfirmButton: false });
    } catch (error) {
      console.error('PDF generation error:', error);
      Swal.fire({ icon: 'error', title: 'PDF Failed', text: 'Could not generate the payment receipt PDF.', confirmButtonColor: '#0F4C81' });
    } finally {
      setDownloading(false);
    }
  };

  const printReceipt = () => {
    if (!receiptRef.current) return;
    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) {
      Swal.fire({ icon: 'warning', title: 'Popup Blocked', text: 'Please allow popups to print the receipt.', confirmButtonColor: '#0F4C81' });
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 30px; background: #f3f4f6; font-family: Arial, Helvetica, sans-serif; }
            .print-wrapper { max-width: 760px; margin: auto; background: white; }
            @media print { body { padding: 0; background: white; } .print-wrapper { max-width: none; } }
          </style>
        </head>
        <body>
          <div class="print-wrapper">${receiptRef.current.outerHTML}</div>
          <script>
            window.onload = function () { setTimeout(function () { window.print(); window.close(); }, 500); };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return <div className="flex justify-center items-center py-20"><FaSpinner className="text-3xl text-primary animate-spin" /></div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">My Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Payment history, receipts and outstanding balance</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium text-gray-500">Total Course Fee</p><p className="text-2xl font-bold text-dark mt-1">{formatCurrency(summary?.totalFee)}</p></div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center"><FaReceipt className="text-primary" /></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium text-gray-500">Total Paid</p><p className="text-2xl font-bold text-success mt-1">{formatCurrency(summary?.paidAmount)}</p></div>
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center"><FaCheckCircle className="text-success" /></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium text-gray-500">Outstanding Due</p><p className={`text-2xl font-bold mt-1 ${Number(summary?.dueAmount || 0) > 0 ? 'text-danger' : 'text-success'}`}>{formatCurrency(summary?.dueAmount)}</p></div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${Number(summary?.dueAmount || 0) > 0 ? 'bg-red-50' : 'bg-green-50'}`}><FaMoneyBillWave className={Number(summary?.dueAmount || 0) > 0 ? 'text-danger' : 'text-success'} /></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div><h3 className="font-bold text-dark text-sm">Payment History</h3><p className="text-xs text-gray-400 mt-0.5">Your recent payment transactions</p></div>
            <FaReceipt className="text-gray-300" />
          </div>
          {!summary?.payments?.length ? (
            <div className="text-center py-14 text-gray-400">
              <FaReceipt className="mx-auto text-3xl mb-3 text-gray-200" />
              <p className="font-medium">No payments recorded yet.</p>
              <p className="text-xs mt-1">Your payment history will appear here.</p>
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
                    <th className="px-5 py-3 font-medium text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {summary.payments.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/70 transition">
                      <td className="px-5 py-3"><span className="font-mono text-xs text-primary font-semibold">{p.receiptNumber}</span></td>
                      <td className="px-5 py-3"><span className="font-bold text-dark">{formatCurrency(p.amount)}</span></td>
                      <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{methodLabel[p.paymentMethod] || p.paymentMethod || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-500">{formatDate(p.paymentDate)}</td>
                      <td className="px-5 py-3 text-right">
                        <button type="button" onClick={() => viewReceipt(p._id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-primary bg-primary/5 hover:bg-primary hover:text-white transition text-xs font-semibold">
                          <FaReceipt /><span className="hidden sm:inline">View Receipt</span>
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

      {selectedPayment && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" onClick={() => setSelectedPayment(null)}>
          <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
              <div><h2 className="font-bold text-dark">Payment Receipt</h2><p className="text-xs text-gray-400">Official payment acknowledgement</p></div>
              <button type="button" onClick={() => setSelectedPayment(null)} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition"><FaTimes /></button>
            </div>
            <div className="p-3 sm:p-6">
              <div ref={receiptRef} className="bg-white" style={{ width: '100%', maxWidth: '760px', margin: '0 auto', padding: '35px', fontFamily: 'Arial, Helvetica, sans-serif', color: '#172033' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '22px', borderBottom: '2px solid #0F4C81' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={LOGO_URL} alt="OPEN IT INSTITUTE" crossOrigin="anonymous" style={{ width: '85px', height: '85px', objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F4C81', letterSpacing: '0.3px' }}>OPEN IT INSTITUTE</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Professional IT & Computer Training</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>Kendua, Netrokona, Bangladesh</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F4C81' }}>PAYMENT</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F4C81' }}>RECEIPT</div>
                    <div style={{ display: 'inline-block', marginTop: '8px', padding: '5px 12px', borderRadius: '20px', background: '#ECFDF5', color: '#059669', fontSize: '10px', fontWeight: '700' }}>PAYMENT RECEIVED</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '25px', padding: '15px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div><div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Receipt Number</div><div style={{ fontSize: '14px', fontWeight: '700', color: '#0F4C81' }}>{selectedPayment.receiptNumber || 'N/A'}</div></div>
                  <div style={{ textAlign: 'right' }}><div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Payment Date</div><div style={{ fontSize: '14px', fontWeight: '700' }}>{formatDate(selectedPayment.paymentDate)}</div></div>
                </div>
                <div style={{ marginTop: '25px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F4C81', marginBottom: '10px', paddingBottom: '7px', borderBottom: '1px solid #E2E8F0' }}>STUDENT INFORMATION</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div><div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '3px' }}>STUDENT NAME</div><div style={{ fontSize: '13px', fontWeight: '700' }}>{selectedPayment.student?.name || 'N/A'}</div></div>
                    <div><div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '3px' }}>STUDENT ID</div><div style={{ fontSize: '13px', fontWeight: '700' }}>{selectedPayment.student?.studentId || 'N/A'}</div></div>
                    <div style={{ gridColumn: '1 / -1' }}><div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '3px' }}>COURSE</div><div style={{ fontSize: '13px', fontWeight: '700' }}>{selectedPayment.course?.title || 'N/A'}</div></div>
                  </div>
                </div>
                <div style={{ marginTop: '25px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F4C81', marginBottom: '10px', paddingBottom: '7px', borderBottom: '1px solid #E2E8F0' }}>PAYMENT INFORMATION</div>
                  <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 15px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}><span style={{ fontSize: '12px', color: '#64748B' }}>Payment Amount</span><strong style={{ fontSize: '16px', color: '#0F4C81' }}>{formatCurrency(selectedPayment.amount)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', borderBottom: '1px solid #E2E8F0' }}><span style={{ fontSize: '12px', color: '#64748B' }}>Payment Method</span><strong style={{ fontSize: '12px' }}>{methodLabel[selectedPayment.paymentMethod] || selectedPayment.paymentMethod || 'N/A'}</strong></div>
                    {selectedPayment.transactionId && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px' }}><span style={{ fontSize: '12px', color: '#64748B' }}>Transaction ID</span><strong style={{ fontSize: '11px', fontFamily: 'monospace' }}>{selectedPayment.transactionId}</strong></div>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: '25px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F4C81', marginBottom: '10px', paddingBottom: '7px', borderBottom: '1px solid #E2E8F0' }}>ACCOUNT SUMMARY</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div style={{ padding: '13px', border: '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center' }}><div style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase' }}>Total Fee</div><div style={{ marginTop: '5px', fontSize: '15px', fontWeight: '800' }}>{formatCurrency(selectedPayment.totalFee)}</div></div>
                    <div style={{ padding: '13px', border: '1px solid #BBF7D0', background: '#F0FDF4', borderRadius: '8px', textAlign: 'center' }}><div style={{ fontSize: '9px', color: '#16A34A', textTransform: 'uppercase' }}>Total Paid</div><div style={{ marginTop: '5px', fontSize: '15px', fontWeight: '800', color: '#15803D' }}>{formatCurrency(selectedPayment.paidAmount)}</div></div>
                    <div style={{ padding: '13px', border: Number(selectedPayment.dueAmount || 0) > 0 ? '1px solid #FECACA' : '1px solid #BBF7D0', background: Number(selectedPayment.dueAmount || 0) > 0 ? '#FEF2F2' : '#F0FDF4', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', color: Number(selectedPayment.dueAmount || 0) > 0 ? '#DC2626' : '#16A34A', textTransform: 'uppercase' }}>Due Amount</div>
                      <div style={{ marginTop: '5px', fontSize: '15px', fontWeight: '800', color: Number(selectedPayment.dueAmount || 0) > 0 ? '#DC2626' : '#15803D' }}>{formatCurrency(selectedPayment.dueAmount)}</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '30px', paddingTop: '18px', borderTop: '1px dashed #CBD5E1', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F4C81' }}>Thank you for your payment!</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '5px' }}>This is a computer-generated payment receipt and does not require a signature.</div>
                  <div style={{ fontSize: '9px', color: '#CBD5E1', marginTop: '12px' }}>OPEN IT INSTITUTE • Professional IT & Computer Training</div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end">
              <button type="button" onClick={printReceipt} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition text-sm font-semibold"><FaPrint /> Print Receipt</button>
              <button type="button" onClick={downloadPDF} disabled={downloading} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
                {downloading ? <><FaSpinner className="animate-spin" /> Generating PDF...</> : <><FaDownload /> Download PDF</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {receiptLoading && (
        <div className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl px-7 py-6 shadow-2xl text-center">
            <FaSpinner className="text-3xl text-primary animate-spin mx-auto mb-3" />
            <p className="font-semibold text-dark">Loading Receipt...</p>
            <p className="text-xs text-gray-400 mt-1">Please wait</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Payments;