// ============================================================
// FILE: src/components/notices/NoticeLetter.jsx
// The official notice letter (A4) + a preview modal.
// Inline styles only, so the PDF and the printout are exact.
// ============================================================
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FaDownload, FaPrint, FaSpinner, FaTimes } from 'react-icons/fa';

import { toBengaliDigits } from './noticeExport';

// ------------------------------------------------------------
// Letterhead settings (edit here)
// ------------------------------------------------------------

export const LETTER_WIDTH = 794; // A4 width at 96 dpi
const LETTER_MIN_HEIGHT = 1123; // A4 height at 96 dpi

const LOGO_URL = '/logo.png';
const SIGNATURE_URL = '/signatute.png'; // change to '/signature.png' if your file is spelled that way

const INSTITUTE = {
  name: 'ওপেন আইটি ইনস্টিটিউট',
  code: 'প্রতিষ্ঠান কোডঃ ৫৮১৫৫',
  address: 'শান্তিবাগ, কেন্দুয়া, নেত্রকোনা',
  mobile: 'মোবাইল নম্বর :০১৭০৭-৫৩০৮১০',
  email: 'openitinstitute@gmail.com',
};

const SIGNATORY = {
  name: 'মোঃনুরুজ্জামান',
  designation: 'পরিচালক',
  organization: 'ওপেন আইটি ইনস্টিটিউট',
  address: 'শান্তিবাগ, কেন্দুয়া, নেত্রকোনা',
};

const SERIF =
  "'Noto Serif Bengali', 'Kalpurush', 'SolaimanLipi', 'Nikosh', 'Noto Sans Bengali', 'Hind Siliguri', 'Nirmala UI', serif";
const SANS =
  "'Noto Sans Bengali', 'Hind Siliguri', 'Kalpurush', 'Nirmala UI', Arial, sans-serif";

// Supports **bold** inside notice text
export const RichText = ({ text = '' }) =>
  String(text)
    .split('**')
    .map((part, index) =>
      index % 2 ? <strong key={index}>{part}</strong> : <span key={index}>{part}</span>
    );

// ------------------------------------------------------------
// The letter
// ------------------------------------------------------------

const NoticeLetter = forwardRef(function NoticeLetter(
  { title, description, additionalInfo, dateText, memoNo },
  ref
) {
  const paragraphs = String(description || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      ref={ref}
      data-letter-root
      style={{
        width: `${LETTER_WIDTH}px`,
        minHeight: `${LETTER_MIN_HEIGHT}px`,
        background: '#FFFFFF',
        color: '#111111',
        fontFamily: SERIF,
        boxSizing: 'border-box',
        padding: '44px 64px 56px',
        position: 'relative',
      }}
    >
      {/* ---------------- LETTERHEAD ---------------- */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '150px', flexShrink: 0 }}>
          <img
            src={LOGO_URL}
            alt="Open IT Institute"
            crossOrigin="anonymous"
            style={{ width: '140px', height: 'auto', display: 'block' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div style={{ flex: 1, textAlign: 'center', lineHeight: 1.25 }}>
          <div style={{ fontFamily: SANS, fontSize: '30px', fontWeight: 800, letterSpacing: '0.2px' }}>
            {INSTITUTE.name}
          </div>
          <div style={{ fontFamily: SANS, fontSize: '21px', fontWeight: 700, marginTop: '8px' }}>
            {INSTITUTE.code}
          </div>
          <div style={{ fontSize: '17px', marginTop: '6px' }}>{INSTITUTE.address}</div>
          <div style={{ fontSize: '15px', marginTop: '3px' }}>{INSTITUTE.mobile}</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', marginTop: '3px' }}>
            Gmail:-{' '}
            <span style={{ color: '#E8860B', textDecoration: 'underline' }}>{INSTITUTE.email}</span>
          </div>
        </div>

        {/* balances the logo so the text is centred on the page */}
        <div style={{ width: '150px', flexShrink: 0 }} />
      </div>

      {/* rule */}
      <div style={{ height: '5px', background: '#000000', marginTop: '16px' }} />
      <div style={{ height: '1px', background: '#000000', marginTop: '3px' }} />

      {/* ---------------- MEMO + DATE ---------------- */}
      <div
        style={{
          display: 'flex',
          justifyContent: memoNo ? 'space-between' : 'flex-end',
          marginTop: '20px',
          fontSize: '15.5px',
          fontStyle: 'italic',
          fontWeight: 700,
        }}
      >
        {memoNo ? <span>স্মারক নং {toBengaliDigits(memoNo)}</span> : null}
        {dateText ? <span>তারিখ: {dateText}</span> : null}
      </div>

      {/* ---------------- HEADING ---------------- */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '34px',
          fontFamily: SANS,
          fontSize: '21px',
          fontWeight: 700,
          textDecoration: 'underline',
          textUnderlineOffset: '4px',
        }}
      >
        নোটিশ
      </div>

      {/* ---------------- SUBJECT ---------------- */}
      {title ? (
        <div style={{ marginTop: '22px', fontSize: '15.5px', fontWeight: 700, lineHeight: 1.6 }}>
          বিষয়: {title}
        </div>
      ) : null}

      {/* ---------------- BODY ---------------- */}
      <div style={{ marginTop: '14px' }}>
        {paragraphs.length === 0 ? (
          <p style={{ margin: 0, fontSize: '15.5px' }}>বিস্তারিত বিবরণ পাওয়া যায়নি।</p>
        ) : (
          paragraphs.map((paragraph, index) => (
            <p
              key={index}
              style={{
                margin: index === 0 ? 0 : '12px 0 0',
                fontSize: '15.5px',
                lineHeight: 1.8,
                textAlign: 'justify',
                textIndent: '2.2em',
                whiteSpace: 'pre-line',
              }}
            >
              <RichText text={paragraph} />
            </p>
          ))
        )}
      </div>

      {/* ---------------- NOTE ---------------- */}
      {additionalInfo ? (
        <p
          style={{
            margin: '26px 0 0',
            fontSize: '15.5px',
            lineHeight: 1.8,
            textAlign: 'justify',
            whiteSpace: 'pre-line',
          }}
        >
          <strong>
            <em>বিঃদ্রঃ</em>
          </strong>{' '}
          <RichText text={additionalInfo} />
        </p>
      ) : null}

      {/* ---------------- SIGNATURE ---------------- */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '64px' }}>
        <div style={{ width: '270px', textAlign: 'center', fontSize: '14.5px', lineHeight: 1.55 }}>
          <img
            src={SIGNATURE_URL}
            alt=""
            crossOrigin="anonymous"
            style={{ height: '62px', maxWidth: '190px', objectFit: 'contain', display: 'block', margin: '0 auto 2px' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>{SIGNATORY.name}</div>
          <div style={{ fontStyle: 'italic', fontWeight: 700 }}>{SIGNATORY.designation}</div>
          <div>{SIGNATORY.organization}</div>
          <div>{SIGNATORY.address}</div>
        </div>
      </div>
    </div>
  );
});

// ------------------------------------------------------------
// Preview modal
// ------------------------------------------------------------

export const NoticeLetterModal = ({
  letter,
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
  const [docHeight, setDocHeight] = useState(LETTER_MIN_HEIGHT);

  // Fit the A4 letter into any screen width (preview only)
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const doc = docRef.current;
    if (!viewport || !doc) return undefined;

    const update = () => {
      setScale(Math.min(1, viewport.clientWidth / LETTER_WIDTH));
      setDocHeight(doc.offsetHeight);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    observer.observe(doc);
    return () => observer.disconnect();
  }, [letter]);

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
      aria-label="Official notice preview"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-[900px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-900">Official notice</h2>
            <p className="truncate text-xs text-slate-500">A4 letter · PDF and print ready</p>
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
          <div ref={viewportRef} className="mx-auto w-full" style={{ maxWidth: LETTER_WIDTH }}>
            <div
              className="mx-auto overflow-hidden rounded-md bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/10"
              style={{ width: LETTER_WIDTH * scale, height: docHeight * scale }}
            >
              <div style={{ width: LETTER_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <NoticeLetter ref={docRef} {...letter} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeLetter;
