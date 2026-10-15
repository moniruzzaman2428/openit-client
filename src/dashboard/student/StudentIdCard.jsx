import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaIdCard, FaPrint, FaShieldAlt, FaSyncAlt, FaUserGraduate } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import api from '../../services/api';

const W = '85.725mm';
const H = '53.975mm';
const INSTITUTE = {
   name: 'OPEN IT INSTITUTE',
  subtitle: 'COMPUTER TRAINING CENTER',
  phone: '+880 1618160869',
  email: 'openit365@gmail.com',
  website: 'openitinstitute.com',
  address: 'Upazila Road, Shantibag, Kendua, Netrokona',
};
const getStudent = (r) => r?.data?.data?.student || r?.data?.student || r?.data?.data || null;
const fieldName = (v, fallback = 'Not assigned') => typeof v === 'string' ? v : v?.title || v?.name || v?.courseName || v?.batchName || fallback;
const shortName = (s = '') => String(s).trim().split(/\s+/).slice(0, 2).map(x => x[0] || '').join('').toUpperCase() || 'ST';
const safeFileName = (s) => String(s || 'student').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 50);

function Card({ side, children, cardRef }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <span className="no-print text-[11px] font-extrabold uppercase tracking-[.22em] text-slate-500">{side} Side</span>
      <div className="w-full max-w-[324px] sm:max-w-none" style={{ aspectRatio: '85.725 / 53.975' }}>
        <div ref={cardRef} className="id-card relative isolate origin-top-left overflow-hidden rounded-[3.2mm] bg-white shadow-[0_18px_45px_rgba(6,42,81,.18)] ring-1 ring-slate-200"
          style={{ width: W, height: H, transform: 'scale(var(--card-scale, 1))', transformOrigin: 'top left' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Logo() {
  const [failed, setFailed] = useState(false);
  return <div className="flex h-[11mm] w-[11mm] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-[1mm] shadow-md">
    {failed ? <FaIdCard className="text-xl text-[#075b96]" /> : <img src="/logo.png" alt="Institute logo" className="h-full w-full object-contain" crossOrigin="anonymous" onError={() => setFailed(true)} />}
  </div>;
}

function Front({ student, cardRef }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const name = student?.name || 'Student Name';
  const photo = student?.photo || student?.profileImage || student?.userId?.profileImage || '';
  useEffect(() => setPhotoFailed(false), [photo]);
  const fields = [
    ['Student ID', student?.studentId || 'N/A'],
    ['Course', fieldName(student?.course)],
    ['Batch', fieldName(student?.batch)],
    ['Blood Group', student?.bloodGroup || student?.blood_group || 'N/A'],
  ];
  return <Card side="Front" cardRef={cardRef}>
    <div className="absolute inset-0 bg-[#f5faff]" />
    <div className="absolute -right-[16mm] top-[16mm] h-[45mm] w-[45mm] rounded-full border-[5mm] border-cyan-100/80" />
    <div className="absolute inset-x-0 top-0 h-[17mm] bg-gradient-to-r from-[#06264e] via-[#075b96] to-[#00a7c9]" />
    <div className="absolute right-[-8mm] top-[-12mm] h-[29mm] w-[35mm] rotate-[-28deg] border-[3mm] border-white/10" />
    <div className="absolute left-[4mm] right-[4mm] top-[2.6mm] flex items-center gap-[2.5mm] text-white">
      <Logo />
      <div className="min-w-0"><div className="text-[11px] font-black leading-tight tracking-[.06em]">{INSTITUTE.name}</div><div className="mt-[.6mm] text-[6px] font-bold tracking-[.14em] text-cyan-100">{INSTITUTE.subtitle}</div></div>
    </div>
    <div className="absolute right-[3.5mm] top-[18.2mm] rounded-full bg-cyan-100 px-[2.5mm] py-[.9mm] text-[6px] font-black tracking-[.12em] text-[#075b96]">STUDENT ID CARD</div>
    <div className="absolute left-[4mm] top-[19mm] h-[23mm] w-[19mm] overflow-hidden rounded-[2mm] border-[1mm] border-white bg-cyan-100 shadow-md">
      {photo && !photoFailed ? <img src={photo} crossOrigin="anonymous" alt={name} className="h-full w-full object-cover" onError={() => setPhotoFailed(true)} /> : <div className="flex h-full w-full items-center justify-center text-xl font-black text-[#075b96]">{shortName(name)}</div>}
    </div>
    <div className="absolute left-[25.5mm] right-[3mm] top-[25mm]">
      <div title={name} className="truncate text-[12px] font-black leading-tight text-[#082b55]">{name}</div>
      <div className="mt-[1.4mm] space-y-[1.15mm]">{fields.map(([label, value]) => <div key={label} className="grid grid-cols-[17mm_minmax(0,1fr)] gap-[1mm] text-[7px] leading-[1.2]"><span className="font-bold text-slate-500">{label}</span><span title={String(value)} className="truncate font-bold text-[#0b3765]">: {value}</span></div>)}</div>
    </div>
    <div className="absolute inset-x-[4mm] bottom-[2.7mm] flex justify-between border-t border-sky-200 pt-[1.2mm]">
      {['Student Signature', 'Authorized Signature'].map(x => <div key={x} className="w-[30mm] text-center"><div className="h-[2.5mm] border-b border-slate-400" /><div className="pt-[.6mm] text-[5.8px] font-bold text-[#17456c]">{x}</div></div>)}
    </div>
  </Card>;
}

function Back({ student, cardRef }) {
  const qrValue = JSON.stringify({ type: 'OII-STUDENT', studentId: student?.studentId || '', website: INSTITUTE.website });
  return <Card side="Back" cardRef={cardRef}>
    <div className="absolute inset-0 bg-[#f5faff]" />
    <div className="absolute inset-x-0 top-0 h-[10mm] bg-gradient-to-r from-[#06264e] to-[#009cbf]" />
    <div className="absolute -right-[12mm] -top-[13mm] h-[38mm] w-[38mm] rounded-full border-[5mm] border-white/10" />
    <div className="absolute left-[4mm] top-[2.8mm] flex items-center gap-[2mm] text-white"><FaShieldAlt className="text-[12px] text-cyan-200" /><span className="text-[10px] font-black tracking-[.12em]">TERMS & INFORMATION</span></div>
    <div className="absolute left-[4mm] right-[4mm] top-[12mm] flex gap-[3mm]">
      <div className="min-w-0 flex-1"><div className="mb-[1.4mm] text-[7.5px] font-black uppercase tracking-wide text-[#075b96]">Cardholder Rules</div><ol className="space-y-[1.5mm] text-[6.6px] font-medium leading-[1.35] text-[#234461]"><li>1. Carry this card during institute classes.</li><li>2. This card is personal and non-transferable.</li><li>3. Report loss or damage to the office.</li><li>4. Valid for the enrolled course duration only.</li></ol></div>
      <div className="flex flex-col items-center gap-[1mm]"><div className="rounded-[1.2mm] bg-white p-[1.2mm] ring-1 ring-cyan-100"><QRCodeSVG value={qrValue} size={64} level="M" fgColor="#082b55" /></div><span className="text-[5px] font-bold uppercase tracking-wider text-slate-400">Student Details</span></div>
    </div>
    <div className="absolute inset-x-[4mm] bottom-[3mm] rounded-[2mm] border border-cyan-100 bg-white/95 px-[2.5mm] py-[2mm]">
      <div className="mb-[1mm] text-[7px] font-black text-[#075b96]">CONTACT INFORMATION</div>
      <div className="grid grid-cols-[12mm_minmax(0,1fr)] gap-y-[.65mm] text-[6.3px] leading-[1.15] text-[#264c6d]">{Object.entries({ Phone: INSTITUTE.phone, Email: INSTITUTE.email, Website: INSTITUTE.website, Address: INSTITUTE.address }).map(([key, val]) => <div key={key} className="contents"><span className="font-bold">{key}</span><span className="truncate">: {val}</span></div>)}</div>
    </div>
  </Card>;
}

async function exportNode(node) {
  if (!node) throw new Error('Card not ready');
  if (document.fonts?.ready) await document.fonts.ready;
  return toPng(node, { pixelRatio: 4, cacheBust: true, backgroundColor: '#ffffff', width: node.offsetWidth, height: node.offsetHeight, style: { transform: 'none', boxShadow: 'none' } });
}
function downloadUrl(url, filename) { const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); }
function loadImage(url) { return new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = url; }); }

export default function StudentIdCard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState('');
  const [error, setError] = useState('');
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const fetchStudent = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const response = await api.get('/students/me');
      const data = getStudent(response);
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Student profile not found.');
      setStudent(data);
    } catch (err) { setError(err?.response?.data?.message || err?.message || 'Unable to load your ID card.'); setStudent(null); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { fetchStudent(); }, [fetchStudent]);

  const download = async (side) => {
    if (!student || exporting) return;
    setExporting(side);
    setError('');
    try {
      const file = `OpenIT-${safeFileName(student.studentId)}-${side}.png`;
      if (side !== 'both') {
        downloadUrl(await exportNode(side === 'front' ? frontRef.current : backRef.current), file);
      } else {
        const [a, b] = await Promise.all([exportNode(frontRef.current), exportNode(backRef.current)]);
        const [imgA, imgB] = await Promise.all([loadImage(a), loadImage(b)]);
        const gap = 80, pad = 80;
        const canvas = document.createElement('canvas');
        canvas.width = imgA.width + imgB.width + gap + pad * 2;
        canvas.height = Math.max(imgA.height, imgB.height) + pad * 2;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgA, pad, pad); ctx.drawImage(imgB, pad + imgA.width + gap, pad);
        downloadUrl(canvas.toDataURL('image/png'), file);
      }
    } catch (err) {
      console.error('PNG export error:', err);
      setError('PNG export failed. Check whether the student photo server permits CORS image access.');
    } finally { setExporting(''); }
  };

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 px-3 py-8 text-slate-800 sm:px-6">
    <style>{`
      @page { size: A4 portrait; margin: 12mm; }
      .id-card { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      @media print {
        body * { visibility: hidden !important; }
        #id-print-area, #id-print-area * { visibility: visible !important; }
        #id-print-area { position: absolute !important; top: 0 !important; left: 0 !important; display: flex !important; flex-direction: column !important; align-items: flex-start !important; gap: 8mm !important; }
        #id-print-area > div { width: 85.725mm !important; max-width: none !important; break-inside: avoid !important; }
        #id-print-area .id-card { width: 85.725mm !important; height: 53.975mm !important; transform: none !important; box-shadow: none !important; border-radius: 0 !important; }
        .no-print { display: none !important; }
      }
    `}</style>
    <div className="mx-auto max-w-6xl">
      <div className="no-print mb-7 flex flex-wrap items-end justify-between gap-5">
        <div><Link to="/student/profile" className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-sky-700"><FaArrowLeft /> Back to Profile</Link><h1 className="text-2xl font-black text-[#082b55] sm:text-3xl">Student Identity Card</h1><p className="mt-1 text-sm text-slate-500">Open IT Institute · CR80 · Front & Back · High-resolution PNG</p></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={loading || refreshing} onClick={() => fetchStudent(true)} className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-bold text-sky-800 disabled:opacity-50"><FaSyncAlt className={refreshing ? 'animate-spin' : ''} /> Refresh</button>
          <button type="button" disabled={!student || loading} onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-[#082b55] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><FaPrint /> Print</button>
        </div>
      </div>
      {loading ? <div className="rounded-3xl bg-white p-12 text-center text-slate-500">Loading your ID card...</div> : !student ? <div className="rounded-3xl bg-white p-10 text-center"><p className="text-rose-600">{error}</p><button onClick={() => fetchStudent(true)} className="mt-4 rounded-xl bg-sky-700 px-5 py-2 text-white">Try Again</button></div> : <>
        <div className="no-print mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-sky-100 bg-white px-5 py-3 text-sm shadow-sm"><FaUserGraduate className="text-cyan-600" /><strong>{student.name || 'Student'}</strong><span className="text-slate-300">•</span><span className="font-mono text-sky-800">{student.studentId || 'No student ID'}</span><span className="text-slate-300">•</span><span className="capitalize">{student.status || 'unknown'}</span></div>
        <div className="rounded-3xl border border-sky-100 bg-white/90 px-2 py-8 shadow-[0_20px_60px_rgba(8,43,85,.08)] sm:px-8">
          <div id="id-print-area" className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-8 xl:gap-12">
            <Front student={student} cardRef={frontRef} /><Back student={student} cardRef={backRef} />
          </div>
        </div>
        <div className="no-print mt-6 flex flex-wrap justify-center gap-3">
          {[['front', 'Download Front'], ['back', 'Download Back'], ['both', 'Download Both PNG']].map(([side, label]) => <button key={side} disabled={!!exporting} onClick={() => download(side)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#075b96] to-[#04a7c8] px-5 py-3 text-sm font-bold text-white shadow-md disabled:opacity-50"><FaDownload />{exporting === side ? 'Generating...' : label}</button>)}
        </div>
        {error && <p role="alert" className="no-print mt-4 text-center text-sm font-semibold text-rose-600">{error}</p>}
        <p className="no-print mt-5 text-center text-xs leading-6 text-slate-500">For printing, select 100% / Actual size and enable Background graphics. QR contains card details; it is not a live verification endpoint.</p>
      </>}
    </div>
  </div>;
}
