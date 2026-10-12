// ============================================================
// FILE: src/components/payments/PaymentReceiptModal.jsx
// One receipt, used by both the Admin and the Student pages.
// Only the receipt can be downloaded as PDF or printed.
// ============================================================
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FaDownload, FaPrint, FaSpinner, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import {
  METHOD_LABEL,
  amountInWords,
  formatCurrency,
  formatDate,
} from '../utils/paymentUtils.js';

const LOGO_URL = '/logo.png';
const RECEIPT_WIDTH = 794; // A4 width at 96 dpi
const BRAND = '#0F4C81';
const FONT =
  "'Segoe UI', Arial, Helvetica, 'Noto Sans Bengali', 'Hind Siliguri', 'Nirmala UI', sans-serif";

// ------------------------------------------------------------
// helpers
// ------------------------------------------------------------

const waitForImages = (root) =>
  Promise.all(
    Array.from(root.querySelectorAll('img')).map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          })
    )
  );

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// ------------------------------------------------------------
// receipt document (inline styles only so PDF/print are exact)
// ------------------------------------------------------------

const label = {
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#64748B',
};

const Row = ({ name, value, mono = false, strong = false }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '7px 0',
      borderBottom: '1px solid #EEF2F7',
      fontSize: '12.5px',
    }}
  >
    <span style={{ color: '#64748B' }}>{name}</span>
    <span
      style={{
        color: '#0F172A',
        fontWeight: strong ? 700 : 600,
        fontFamily: mono ? 'ui-monospace, Menlo, Consolas, monospace' : 'inherit',
        textAlign: 'right',
        wordBreak: 'break-word',
      }}
    >
      {value}
    </span>
  </div>
);

const ReceiptDocument = ({ payment, innerRef }) => {
  const due = Number(payment.dueAmount || 0);
  const settled = due <= 0;
  const courseTitle = payment.course?.title || 'Course';

  return (
    <div
      ref={innerRef}
      data-receipt-root
      style={{
        width: `${RECEIPT_WIDTH}px`,
        background: '#FFFFFF',
        color: '#0F172A',
        fontFamily: FONT,
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* top band */}
      <div style={{ height: '8px', background: BRAND }} />

      <div style={{ padding: '36px 48px 40px' }}>
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '24px',
            paddingBottom: '22px',
            borderBottom: `2px solid ${BRAND}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={LOGO_URL}
              alt="Open IT Institute"
              crossOrigin="anonymous"
              style={{ width: '64px', height: '64px', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: BRAND,
                  letterSpacing: '0.2px',
                  lineHeight: 1.15,
                }}
              >
                OPEN IT INSTITUTE
              </div>
              <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '4px' }}>
                Professional IT &amp; Computer Training
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '6px', lineHeight: 1.5 }}>
                Upazila Road, Shantibag, Kendua, Netrokona, Bangladesh
                <br />
                +880 1616-160869 &nbsp;•&nbsp; openitinstitute@gmail.com
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '1px',
                lineHeight: 1.1,
              }}
            >
              PAYMENT RECEIPT
            </div>
            <div
              style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '5px 14px',
                borderRadius: '999px',
                border: `1px solid ${settled ? '#A7F3D0' : '#BFDBFE'}`,
                background: settled ? '#ECFDF5' : '#EFF6FF',
                color: settled ? '#047857' : '#1D4ED8',
                fontSize: '10.5px',
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              {settled ? 'FULLY PAID' : 'PAYMENT RECEIVED'}
            </div>
          </div>
        </div>

        {/* META STRIP */}
        <div
          style={{
            display: 'flex',
            marginTop: '22px',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            background: '#F8FAFC',
          }}
        >
          <div style={{ flex: 1, padding: '14px 18px' }}>
            <div style={label}>Receipt No.</div>
            <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 800, color: BRAND }}>
              {payment.receiptNumber || 'N/A'}
            </div>
          </div>
          <div style={{ width: '1px', background: '#E2E8F0' }} />
          <div style={{ flex: 1, padding: '14px 18px' }}>
            <div style={label}>Payment Date</div>
            <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 700 }}>
              {formatDate(payment.paymentDate)}
            </div>
          </div>
          <div style={{ width: '1px', background: '#E2E8F0' }} />
          <div style={{ flex: 1, padding: '14px 18px' }}>
            <div style={label}>Payment Method</div>
            <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 700 }}>
              {METHOD_LABEL[payment.paymentMethod] || payment.paymentMethod || 'N/A'}
            </div>
          </div>
        </div>

        {/* PARTIES */}
        <div style={{ display: 'flex', gap: '28px', marginTop: '26px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...label, color: BRAND, paddingBottom: '8px', borderBottom: '1px solid #E2E8F0' }}>
              Received From
            </div>
            <Row name="Student name" value={payment.student?.name || 'N/A'} strong />
            <Row name="Student ID" value={payment.student?.studentId || 'N/A'} mono />
            <Row name="Course" value={courseTitle} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ ...label, color: BRAND, paddingBottom: '8px', borderBottom: '1px solid #E2E8F0' }}>
              Payment Details
            </div>
            <Row
              name="Method"
              value={METHOD_LABEL[payment.paymentMethod] || payment.paymentMethod || 'N/A'}
            />
            <Row name="Transaction ID" value={payment.transactionId || '—'} mono />
            <Row name="Received by" value={payment.receivedBy?.name || 'Admin'} />
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div
          style={{
            marginTop: '28px',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              background: '#F1F5F9',
              padding: '10px 18px',
              ...label,
            }}
          >
            <div style={{ flex: 1 }}>Description</div>
            <div style={{ width: '160px', textAlign: 'right' }}>Amount</div>
          </div>
          <div style={{ display: 'flex', padding: '16px 18px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13.5px', fontWeight: 700 }}>Course fee payment</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px' }}>
                {courseTitle}
              </div>
            </div>
            <div style={{ width: '160px', textAlign: 'right', fontSize: '15px', fontWeight: 800 }}>
              {formatCurrency(payment.amount)}
            </div>
          </div>
        </div>

        {/* TOTALS */}
        <div style={{ display: 'flex', gap: '28px', marginTop: '22px', alignItems: 'stretch' }}>
          <div
            style={{
              flex: 1,
              border: '1px dashed #CBD5E1',
              borderRadius: '10px',
              padding: '14px 18px',
              background: '#FBFCFE',
            }}
          >
            <div style={label}>Amount in words</div>
            <div style={{ marginTop: '6px', fontSize: '12.5px', fontWeight: 600, lineHeight: 1.6 }}>
              {amountInWords(payment.amount)}
            </div>
            {payment.remarks ? (
              <div style={{ marginTop: '12px' }}>
                <div style={label}>Remarks</div>
                <div style={{ marginTop: '4px', fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                  {payment.remarks}
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ width: '300px' }}>
            <Row name="Total course fee" value={formatCurrency(payment.totalFee)} />
            <Row name="Total paid to date" value={formatCurrency(payment.paidAmount)} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '9px 0',
                borderBottom: '1px solid #EEF2F7',
                fontSize: '12.5px',
              }}
            >
              <span style={{ color: '#64748B' }}>Balance due</span>
              <strong style={{ color: settled ? '#047857' : '#DC2626' }}>
                {formatCurrency(due)}
              </strong>
            </div>
            <div
              style={{
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: BRAND,
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '12px 16px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>
                AMOUNT RECEIVED
              </span>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>
                {formatCurrency(payment.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* SIGNATURES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', marginTop: '56px' }}>
          <div style={{ width: '200px', textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #94A3B8', paddingTop: '6px', fontSize: '11px', color: '#475569' }}>
              Student signature
            </div>
          </div>
          <div style={{ width: '200px', textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #94A3B8', paddingTop: '6px', fontSize: '11px', color: '#475569' }}>
              Authorized signature
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            marginTop: '30px',
            paddingTop: '14px',
            borderTop: '1px solid #E2E8F0',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: BRAND }}>
            Thank you for your payment
          </div>
          <div style={{ marginTop: '4px', fontSize: '10px', color: '#94A3B8' }}>
            This is a computer-generated receipt. Please keep it for your records.
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// modal
// ------------------------------------------------------------

const PaymentReceiptModal = ({ payment, onClose }) => {
  const viewportRef = useRef(null);
  const receiptRef = useRef(null);
  const closeRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [docHeight, setDocHeight] = useState(1000);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  // Fit the A4 receipt into any screen width (preview only)
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const doc = receiptRef.current;
    if (!viewport || !doc) return undefined;

    const update = () => {
      setScale(Math.min(1, viewport.clientWidth / RECEIPT_WIDTH));
      setDocHeight(doc.offsetHeight);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    observer.observe(doc);
    return () => observer.disconnect();
  }, [payment]);

  // Esc to close, lock page scroll, focus close button
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const fileName = payment.receiptNumber || 'payment-receipt';

  // ---------------- PDF ----------------
  const downloadPDF = async () => {
    const node = receiptRef.current;
    if (!node || downloading) return;

    try {
      setDownloading(true);
      await waitForImages(node);
      if (document.fonts?.ready) await document.fonts.ready;

      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        // Render only the receipt, at its real A4 size (no preview scaling)
        onclone: (clonedDoc, clonedEl) => {
          const body = clonedDoc.body;
          body.innerHTML = '';
          body.style.margin = '0';
          body.style.padding = '0';
          body.style.background = '#ffffff';
          body.appendChild(clonedEl);
        },
      });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Keep the aspect ratio; never stretch
      const ratio = canvas.height / canvas.width;
      let width = pageWidth;
      let height = width * ratio;
      if (height > pageHeight) {
        height = pageHeight;
        width = height / ratio;
      }

      pdf.addImage(
        canvas.toDataURL('image/png', 1.0),
        'PNG',
        (pageWidth - width) / 2,
        0,
        width,
        height,
        undefined,
        'FAST'
      );
      pdf.setProperties({
        title: `Payment Receipt ${fileName}`,
        author: 'Open IT Institute',
      });
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download failed',
        text: 'Could not generate the receipt PDF. Please try again.',
        confirmButtonColor: BRAND,
      });
    } finally {
      setDownloading(false);
    }
  };

  // ---------------- PRINT (hidden iframe: no popup blockers) ----------------
  const printReceipt = async () => {
    const node = receiptRef.current;
    if (!node || printing) return;

    try {
      setPrinting(true);
      await waitForImages(node);

      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      Object.assign(iframe.style, {
        position: 'fixed',
        right: '0',
        bottom: '0',
        width: '0',
        height: '0',
        border: '0',
      });
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(fileName)}</title>
    <base href="${window.location.origin}/" />
    <style>
      @page { size: A4; margin: 0; }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      html, body { margin: 0; padding: 0; background: #fff; }
      .sheet { width: 210mm; margin: 0 auto; }
      .sheet > div { width: 210mm !important; }
    </style>
  </head>
  <body><div class="sheet">${node.outerHTML}</div></body>
</html>`);
      doc.close();

      await waitForImages(doc.body);

      const cleanup = () => {
        setTimeout(() => iframe.remove(), 300);
      };
      iframe.contentWindow.onafterprint = cleanup;
      setTimeout(() => iframe.remove(), 120000); // safety net

      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (error) {
      console.error('Print error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Print failed',
        text: 'Could not open the print dialog.',
        confirmButtonColor: BRAND,
      });
    } finally {
      setPrinting(false);
    }
  };

  const actionBtn =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Payment receipt"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-[900px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-900">Payment Receipt</h2>
            <p className="truncate font-mono text-xs text-slate-500">{fileName}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={printReceipt}
              disabled={printing}
              className={`${actionBtn} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
            >
              {printing ? <FaSpinner className="animate-spin" /> : <FaPrint />}
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={downloadPDF}
              disabled={downloading}
              className={`${actionBtn} bg-[#0F4C81] text-white hover:bg-[#0b3b64]`}
            >
              {downloading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
              <span className="hidden sm:inline">{downloading ? 'Generating…' : 'Download PDF'}</span>
              <span className="sm:hidden">{downloading ? '' : 'PDF'}</span>
            </button>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close receipt"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81]"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Paper preview */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100 p-3 sm:p-6">
          <div ref={viewportRef} className="mx-auto w-full" style={{ maxWidth: RECEIPT_WIDTH }}>
            <div
              className="mx-auto overflow-hidden rounded-md bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/10"
              style={{ width: RECEIPT_WIDTH * scale, height: docHeight * scale }}
            >
              <div style={{ width: RECEIPT_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <ReceiptDocument payment={payment} innerRef={receiptRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptModal;
