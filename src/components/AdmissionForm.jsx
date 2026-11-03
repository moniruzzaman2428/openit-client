// ============================================================
// FILE: src/components/admission/AdmissionForm.jsx
// The printable "ভর্তির আবেদন ফরম" (A4), laid out like your PDF.
// Submitted data is printed in blue; fields the website does not
// collect (roll, board, NID ...) stay empty for handwriting.
// Inline styles only, so the PDF and the printout are exact.
// ============================================================
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FaDownload, FaPrint, FaSpinner, FaTimes } from 'react-icons/fa';

import { formatLetterDate } from './notices/noticeExport';

export const FORM_WIDTH = 794; // A4 width at 96 dpi
const FORM_MIN_HEIGHT = 1123; // A4 height at 96 dpi
const LOGO_URL = '/logo.png';

const SERIF =
  "'Noto Serif Bengali', 'Kalpurush', 'SolaimanLipi', 'Nikosh', 'Noto Sans Bengali', 'Hind Siliguri', 'Nirmala UI', serif";
const SANS =
  "'Noto Sans Bengali', 'Hind Siliguri', 'Kalpurush', 'Nirmala UI', Arial, sans-serif";

const INK = '#111111';
const DATA = '#0b3a7a'; // colour of the student's submitted data
const LINE = '1px solid #222222';

// ------------------------------------------------------------
// Data helpers
// ------------------------------------------------------------

const hasBangla = (text = '') => /[\u0980-\u09FF]/.test(text);

// Put a name in the Bengali or English row depending on its script
const splitName = (name = '') => {
  const value = String(name).trim();
  return hasBangla(value) ? { bn: value, en: '' } : { bn: '', en: value };
};

const GENDER_BN = { male: 'পুরুষ', female: 'মহিলা', other: 'অন্যান্য' };

const phoneDigits = (phone = '') => {
  let digits = String(phone).replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('88')) digits = digits.slice(2);
  return digits.slice(0, 11);
};

const dateParts = (value) => {
  if (!value) return { day: '', month: '', year: '' };

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (match) return { day: match[3], month: match[2], year: match[1] };

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { day: '', month: '', year: '' };

  return {
    day: String(parsed.getDate()).padStart(2, '0'),
    month: String(parsed.getMonth() + 1).padStart(2, '0'),
    year: String(parsed.getFullYear()),
  };
};

// ------------------------------------------------------------
// Layout pieces
// ------------------------------------------------------------

const lbl = { fontSize: '12.5px', color: INK, whiteSpace: 'nowrap' };
const val = {
  fontSize: '14px',
  fontWeight: 700,
  color: DATA,
  lineHeight: 1.3,
  wordBreak: 'break-word',
};

const Row = ({ children }) => (
  <div style={{ display: 'flex', marginTop: '-1px', paddingLeft: '1px' }}>{children}</div>
);

const Cell = ({ flex = 1, width, minHeight = 29, children, style }) => (
  <div
    style={{
      border: LINE,
      marginLeft: '-1px',
      padding: '3px 8px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      flex: width ? `0 0 ${width}px` : flex,
      minHeight: `${minHeight}px`,
      minWidth: 0,
      ...style,
    }}
  >
    {children}
  </div>
);

const DigitBoxes = ({ count, value = '', size = 19 }) => (
  <div style={{ display: 'flex' }}>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        style={{
          width: `${size}px`,
          height: '23px',
          border: LINE,
          marginLeft: index === 0 ? 0 : '-1px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: 700,
          color: DATA,
          fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
        }}
      >
        {value[index] || ''}
      </div>
    ))}
  </div>
);

const Dots = ({ width, flex }) => (
  <span
    style={{
      display: 'inline-block',
      flex: flex ? 1 : undefined,
      width: width ? `${width}px` : undefined,
      borderBottom: '1px dotted #111',
      height: '14px',
      margin: '0 4px',
    }}
  />
);

// ------------------------------------------------------------
// The form
// ------------------------------------------------------------

const AdmissionFormDocument = forwardRef(function AdmissionFormDocument({ data = {} }, ref) {
  const student = splitName(data.studentName);
  const father = splitName(data.fatherName);
  const mother = splitName(data.motherName);
  const dob = dateParts(data.dateOfBirth);
  const phone = phoneDigits(data.phone);
  const gender = GENDER_BN[data.gender] || data.gender || '';
  const appliedOn = formatLetterDate(data.submittedAt);

  return (
    <div
      ref={ref}
      data-form-root
      style={{
        width: `${FORM_WIDTH}px`,
        minHeight: `${FORM_MIN_HEIGHT}px`,
        background: '#FFFFFF',
        color: INK,
        fontFamily: SERIF,
        boxSizing: 'border-box',
        padding: '26px 38px 26px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Watermark */}
      <img
        src={LOGO_URL}
        alt=""
        crossOrigin="anonymous"
        style={{
          position: 'absolute',
          left: '50%',
          top: '52%',
          width: '520px',
          transform: 'translate(-50%, -50%)',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />

      <div style={{ position: 'relative' }}>
        {/* ---------------- LETTERHEAD ---------------- */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '132px', flexShrink: 0 }}>
            <img
              src={LOGO_URL}
              alt="Open IT Institute"
              crossOrigin="anonymous"
              style={{ width: '124px', height: 'auto', display: 'block' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div style={{ flex: 1, textAlign: 'center', lineHeight: 1.3 }}>
            <div style={{ fontSize: '15px' }}>বিসমিল্লাহির রহমানির রাহিম</div>
            <div style={{ fontFamily: SANS, fontSize: '34px', fontWeight: 800, marginTop: '2px' }}>
              ওপেন আইটি ইনস্টিটিউট
            </div>
            <div style={{ fontSize: '16px', marginTop: '3px' }}>প্রতিষ্ঠান: ৫৮১৫৫</div>
            <div style={{ fontSize: '16px' }}>শান্তিবাগ, কেন্দুয়া, নেত্রকোনা</div>
            <div style={{ fontSize: '15px' }}>মোবাইল নম্বর :০১৭০৭-৫৩০৮১০ / ০১৫৮০-৬৪২০২৫</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '15px' }}>
              Email: openitinstitute@gmail.com
            </div>
          </div>

          <div
            style={{
              width: '92px',
              height: '110px',
              flexShrink: 0,
              border: '1px solid #b9b9b9',
              boxShadow: 'inset 0 0 0 4px #f3f3f3',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontFamily: SANS,
              boxSizing: 'border-box',
            }}
          >
            ছবি
            <span style={{ fontSize: '8.5px', color: '#777', marginTop: '2px' }}>পাসপোর্ট সাইজ</span>
          </div>
        </div>

        <div style={{ height: '3px', background: '#000', marginTop: '10px' }} />

        {/* ---------------- TITLE ---------------- */}
        <div
          style={{
            width: '470px',
            margin: '12px auto 0',
            border: '4px double #9a3412',
            borderRadius: '24px',
            textAlign: 'center',
            fontFamily: SANS,
            fontSize: '32px',
            fontWeight: 700,
            padding: '2px 0 4px',
          }}
        >
          ভর্তির আবেদন ফরম
        </div>

        {/* ---------------- SERIAL + COURSE ---------------- */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: SANS, fontSize: '22px', fontWeight: 600 }}>ক্রমিক নং</span>
            <div
              style={{
                border: LINE,
                minWidth: '190px',
                height: '30px',
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '15px',
                fontWeight: 700,
                color: DATA,
                letterSpacing: '1px',
                fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
                boxSizing: 'border-box',
              }}
            >
              {data.applicationId || ''}
            </div>
          </div>
          {appliedOn ? (
            <div style={{ fontSize: '13px' }}>
              আবেদনের তারিখ: <strong style={{ color: DATA }}>{appliedOn}</strong>
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: '10px', paddingLeft: '1px' }}>
          <Cell minHeight={40} style={{ marginLeft: 0 }}>
            <span style={{ fontFamily: SANS, fontSize: '19px', fontWeight: 600 }}>কোর্সের নাম:</span>
            <span style={{ ...val, fontSize: '17px' }}>{data.courseTitle || ''}</span>
          </Cell>
        </div>

        {/* ---------------- DETAILS ---------------- */}
        <div style={{ marginTop: '12px' }}>
          <Row>
            <Cell flex={3}>
              <span style={lbl}>১। আবেদনকারীর নাম (বাংলায়):</span>
              <span style={val}>{student.bn}</span>
            </Cell>
            <Cell flex={2}>
              <span style={{ ...lbl, fontSize: '12px' }}>শিক্ষাগত যোগ্যতা:</span>
              <span style={val}>{data.education || ''}</span>
            </Cell>
          </Row>

          <Row>
            <Cell flex={3}>
              <span style={lbl}>(ইংরেজীতে):</span>
              <span style={val}>{student.en}</span>
            </Cell>
            <Cell width={130}>
              <span style={lbl}>রোল:</span>
            </Cell>
            <Cell width={150}>
              <span style={lbl}>পাসের সন:</span>
            </Cell>
          </Row>

          <Row>
            <Cell flex={3}>
              <span style={lbl}>২। পিতার নাম (বাংলায়):</span>
              <span style={val}>{father.bn}</span>
            </Cell>
            <Cell width={280}>
              <span style={lbl}>রেজি নং:</span>
            </Cell>
          </Row>

          <Row>
            <Cell flex={3}>
              <span style={lbl}>(ইংরেজীতে):</span>
              <span style={val}>{father.en}</span>
            </Cell>
            <Cell width={280}>
              <span style={lbl}>বোর্ড:</span>
            </Cell>
          </Row>

          <Row>
            <Cell>
              <span style={lbl}>৩। মাতার নাম (বাংলায়):</span>
              <span style={val}>{mother.bn}</span>
            </Cell>
          </Row>

          <Row>
            <Cell flex={3}>
              <span style={lbl}>(ইংরেজীতে) :</span>
              <span style={val}>{mother.en}</span>
            </Cell>
            <Cell width={400} style={{ padding: '3px 6px' }}>
              <span style={lbl}>মোবাইল নম্বর:</span>
              <DigitBoxes count={11} value={phone} size={24} />
            </Cell>
          </Row>

          {/* Present address (single field on the website) */}
          <Row>
            <Cell minHeight={44}>
              <span style={lbl}>৪। বর্তমান ঠিকানা:-</span>
              <span style={{ ...val, fontSize: '13.5px' }}>{data.address || ''}</span>
            </Cell>
          </Row>

          {/* Permanent address (handwritten) */}
          <Row>
            <Cell width={170} minHeight={54} style={{ alignItems: 'flex-start', paddingTop: '8px' }}>
              <span style={lbl}>৫। স্থায়ী ঠিকানা:-</span>
            </Cell>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', marginLeft: '-1px' }}>
                <Cell minHeight={27}>
                  <span style={lbl}>গ্রাম:</span>
                </Cell>
                <Cell minHeight={27}>
                  <span style={lbl}>পোঃ</span>
                </Cell>
              </div>
              <div style={{ display: 'flex', marginLeft: '-1px', marginTop: '-1px' }}>
                <Cell minHeight={27}>
                  <span style={lbl}>উপজেলা:</span>
                </Cell>
                <Cell minHeight={27}>
                  <span style={lbl}>জেলা:</span>
                </Cell>
              </div>
            </div>
          </Row>

          <Row>
            <Cell width={330} minHeight={33} style={{ padding: '3px 8px' }}>
              <span style={{ ...lbl, fontSize: '12px' }}>৬। জাতীয় পরিচয় পত্র নং (যদি থাকে):</span>
            </Cell>
            <Cell minHeight={33} style={{ padding: '3px 6px' }}>
              <DigitBoxes count={17} size={20} />
            </Cell>
          </Row>

          <Row>
            <Cell width={170} minHeight={33}>
              <span style={lbl}>৭। জন্ম নিবন্ধন নং:</span>
            </Cell>
            <Cell minHeight={33} style={{ padding: '3px 6px' }}>
              <DigitBoxes count={17} size={17} />
            </Cell>
          </Row>

          <Row>
            <Cell flex={1} minHeight={33}>
              <span style={{ ...lbl, fontSize: '12px' }}>৮। জন্ম তারিখ (সার্টিফিকেট অনুযায়ী):</span>
            </Cell>
            <Cell width={60} minHeight={33} style={{ justifyContent: 'center' }}>
              <span style={{ ...val, fontFamily: 'ui-monospace, Menlo, Consolas, monospace' }}>{dob.day}</span>
              {!dob.day && <span style={{ ...lbl, color: '#aaa' }}>দিন</span>}
            </Cell>
            <Cell width={60} minHeight={33} style={{ justifyContent: 'center' }}>
              <span style={{ ...val, fontFamily: 'ui-monospace, Menlo, Consolas, monospace' }}>{dob.month}</span>
              {!dob.month && <span style={{ ...lbl, color: '#aaa' }}>মাস</span>}
            </Cell>
            <Cell width={80} minHeight={33} style={{ justifyContent: 'center' }}>
              <span style={{ ...val, fontFamily: 'ui-monospace, Menlo, Consolas, monospace' }}>{dob.year}</span>
              {!dob.year && <span style={{ ...lbl, color: '#aaa' }}>বছর</span>}
            </Cell>
          </Row>

          <Row>
            <Cell width={200}>
              <span style={lbl}>৯। লিঙ্গ:</span>
              <span style={val}>{gender}</span>
            </Cell>
            <Cell>
              <span style={lbl}>ইমেইল:</span>
              <span style={{ ...val, fontFamily: 'Arial, sans-serif', fontSize: '13px' }}>{data.email || ''}</span>
            </Cell>
          </Row>
        </div>

        {/* ---------------- DECLARATION ---------------- */}
        <p
          style={{
            margin: '12px 0 0',
            fontSize: '13px',
            lineHeight: 1.65,
            textAlign: 'justify',
          }}
        >
          আমি নিম্ন স্বাক্ষরকারী এই মর্মে স্বীকার ও অঙ্গীকার করিতেছি যে, উপরোক্ত সকল তথ্যাবলী সঠিক এবং উক্ত
          প্রতিষ্ঠানের সকল নিয়ম কানুন মেনে চলিব ও শৃংখলা বিরোধী কোন কাজ করিব না এবং যথা সময় ক্লাসে উপস্থিত
          হয়ে প্রশিক্ষণ নিব। এই অঙ্গীকার বদ্ধ হয়ে স্বাক্ষর করিলাম।
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '34px', padding: '0 6px' }}>
          <div style={{ width: '250px', textAlign: 'center' }}>
            <div style={{ borderTop: '1px dotted #111', paddingTop: '4px', fontSize: '12.5px' }}>
              অভিভাবকের স্বাক্ষর ও তারিখ
            </div>
          </div>
          <div style={{ width: '250px', textAlign: 'center' }}>
            <div style={{ borderTop: '1px dotted #111', paddingTop: '4px', fontSize: '12.5px' }}>
              আবেদনকারীর স্বাক্ষর ও তারিখ
            </div>
          </div>
        </div>

        {/* ---------------- OFFICE USE ---------------- */}
        <div
          style={{
            width: '440px',
            margin: '16px auto 0',
            border: '1.5px solid #111',
            borderRadius: '22px',
            textAlign: 'center',
            fontFamily: SANS,
            fontSize: '26px',
            fontWeight: 600,
            padding: '0 0 3px',
          }}
        >
          অফিস কর্তৃক পূরণীয়
        </div>

        <div style={{ marginTop: '14px', fontSize: '13.5px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <span>ভর্তি তারিখ:</span>
            <Dots flex />
            <span>কোর্স শুরুর তারিখ:</span>
            <Dots flex />
            <span>আইডি নং:</span>
            <Dots width={130} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '16px' }}>
            <span>কোর্সের মেয়াদ:</span>
            <Dots flex />
            <span>সেশন</span>
            <Dots width={110} />
            <span>থেকে</span>
            <Dots width={100} />
            <span>সন</span>
            <Dots width={110} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '26px' }}>
          <div style={{ width: '230px', textAlign: 'center' }}>
            <div style={{ borderTop: '1px dotted #111', paddingTop: '4px', fontSize: '12.5px' }}>
              কেন্দ্র পরিচালকের স্বাক্ষর
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ------------------------------------------------------------
// Preview modal
// ------------------------------------------------------------

export const AdmissionFormModal = ({
  data,
  onClose,
  onDownload,
  onPrint,
  downloading = false,
  printing = false,
}) => {
  const viewportRef = useRef(null);
  const docRef = useRef(null);
  const closeRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [docHeight, setDocHeight] = useState(FORM_MIN_HEIGHT);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const doc = docRef.current;
    if (!viewport || !doc) return undefined;

    const update = () => {
      setScale(Math.min(1, viewport.clientWidth / FORM_WIDTH));
      setDocHeight(doc.offsetHeight);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    observer.observe(doc);
    return () => observer.disconnect();
  }, [data]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const btn =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admission form preview"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-[900px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-900">Admission form</h2>
            <p className="truncate font-mono text-xs text-slate-500">{data?.applicationId}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onPrint}
              disabled={printing}
              className={`${btn} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
            >
              {printing ? <FaSpinner className="animate-spin" /> : <FaPrint />}
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={onDownload}
              disabled={downloading}
              className={`${btn} bg-[#0F4C81] text-white hover:bg-[#0b3b64]`}
            >
              {downloading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
              <span className="hidden sm:inline">{downloading ? 'Generating…' : 'Download PDF'}</span>
              <span className="sm:hidden">{downloading ? '' : 'PDF'}</span>
            </button>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81]"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100 p-3 sm:p-6">
          <div ref={viewportRef} className="mx-auto w-full" style={{ maxWidth: FORM_WIDTH }}>
            <div
              className="mx-auto overflow-hidden rounded-md bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/10"
              style={{ width: FORM_WIDTH * scale, height: docHeight * scale }}
            >
              <div style={{ width: FORM_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <AdmissionFormDocument ref={docRef} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionFormDocument;
