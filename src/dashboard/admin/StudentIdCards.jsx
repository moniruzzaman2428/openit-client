import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaSearch, FaFilter, FaTimes, FaSpinner, FaIdCard, FaEye, FaPrint, FaArrowLeft, FaChevronLeft, FaChevronRight, FaSyncAlt, FaUserGraduate, FaDownload, FaShieldAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
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

const statusColors = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  inactive: 'bg-gray-100 text-gray-600 border border-gray-200',
  completed: 'bg-blue-50 text-blue-700 border border-blue-100',
  suspended: 'bg-red-50 text-red-700 border border-red-100',
};

// =========================
// HELPERS
// =========================
const normalizeStudents = (response) =>
  response?.data?.data?.students ||
  response?.data?.students ||
  response?.data?.data ||
  response?.data ||
  [];

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  'Something went wrong.';

const readCourse = (student) => {
  const course = student?.course;
  return typeof course === 'string'
    ? course
    : course?.title || course?.name || course?.courseName || 'Not assigned';
};

const readBatch = (student) => {
  const batch = student?.batch;
  return typeof batch === 'string'
    ? batch
    : batch?.name || batch?.title || batch?.batchName || 'Not assigned';
};

const getInitials = (name = '') =>
  String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0] || '')
    .join('')
    .toUpperCase() || 'ST';

const getBloodGroup = (student) =>
  student?.bloodGroup || student?.blood_group || student?.bloodgroup || 'N/A';

function IdCardPreview({ student, onBack }) {
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [exporting, setExporting] = useState('');
  const [exportError, setExportError] = useState('');
  const download = async (side) => {
    if (exporting) return;
    setExporting(side); setExportError('');
    try {
      const filename = `OpenIT-${safeFileName(student?.studentId || student?._id)}-${side}.png`;
      if (side !== 'both') {
        downloadUrl(await exportNode(side === 'front' ? frontRef.current : backRef.current), filename);
      } else {
        const [a,b] = await Promise.all([exportNode(frontRef.current), exportNode(backRef.current)]);
        const [imgA,imgB] = await Promise.all([loadImage(a),loadImage(b)]);
        const canvas = document.createElement('canvas');
        const pad=80,gap=80;
        canvas.width=imgA.width+imgB.width+gap+pad*2;
        canvas.height=Math.max(imgA.height,imgB.height)+pad*2;
        const ctx=canvas.getContext('2d');
        ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(imgA,pad,pad);ctx.drawImage(imgB,pad+imgA.width+gap,pad);
        downloadUrl(canvas.toDataURL('image/png'),filename);
      }
    } catch (err) {
      console.error('PNG export error:',err);
      setExportError('PNG export failed. Ensure the photo server allows CORS requests.');
    } finally { setExporting(''); }
  };
  return <div className="space-y-5">
    <style>{`
      @page { size: A4 portrait; margin: 12mm; }
      .id-card { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      @media print {
        body * { visibility: hidden !important; }
        #id-print-area, #id-print-area * { visibility: visible !important; }
        #id-print-area { position: absolute !important; top: 0 !important; left: 0 !important; display: flex !important; flex-direction: column !important; gap: 8mm !important; align-items: flex-start !important; }
        #id-print-area .id-card { transform: none !important; box-shadow: none !important; border-radius: 0 !important; }
        .no-print { display: none !important; }
      }
    `}</style>
    <div className="no-print flex flex-wrap items-center justify-between gap-3">
      <button type="button" onClick={onBack} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"><FaArrowLeft className="mr-2 inline"/>Back to List</button>
      <div className="flex flex-wrap gap-2">
        {['front','back','both'].map(side => <button key={side} type="button" disabled={!!exporting} onClick={()=>download(side)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#075b96] to-[#04a7c8] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><FaDownload/>{exporting===side?'Generating...':`Download ${side==='both'?'Both PNG':side==='front'?'Front PNG':'Back PNG'}`}</button>)}
        <button type="button" onClick={()=>window.print()} className="inline-flex items-center gap-2 rounded-xl bg-[#082b55] px-4 py-2.5 text-sm font-bold text-white"><FaPrint/>Print</button>
      </div>
    </div>
    {exportError && <p role="alert" className="no-print rounded-xl bg-red-50 p-3 text-sm text-red-700">{exportError}</p>}
    <div className="no-print rounded-2xl border border-sky-100 bg-white px-5 py-3 text-sm text-slate-600"><FaUserGraduate className="mr-2 inline text-cyan-600"/><strong>{student?.name}</strong> · {student?.studentId || 'No ID'} · {student?.status || 'unknown'}</div>
    <div className="rounded-[28px] border border-sky-100 bg-white p-3 shadow-sm sm:p-8">
      <div id="id-print-area" className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-start lg:gap-12" style={{'--card-scale':'1'}}>
        <Front student={student} cardRef={frontRef}/>
        <Back student={student} cardRef={backRef}/>
      </div>
    </div>
    <p className="no-print text-center text-xs text-slate-500">Print at 100% actual size with background graphics enabled. PNG export requires CORS-enabled student photos.</p>
  </div>;
}

export default function AdminStudentIdCards() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // =========================
  // FETCH LIST
  // =========================
  const fetchStudents = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);

        setError('');

        const params = { page, limit };
        if (search.trim()) params.search = search.trim();
        if (statusFilter !== 'all') params.status = statusFilter;

        const response = await api.get('/students', { params });
        const data = normalizeStudents(response);

        setStudents(Array.isArray(data) ? data : []);
        setTotal(
          Number(
            response?.data?.total ??
              response?.data?.data?.total ??
              response?.data?.results ??
              data?.length ??
              0
          )
        );
      } catch (err) {
        console.error('Students loading error:', err);
        setStudents([]);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, search, statusFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchStudents(), 350);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  // =========================
  // FETCH SINGLE (for preview)
  // =========================
  const handleViewCard = async (student) => {
    try {
      setLoadingId(student._id);
      const response = await api.get(`/students/${student._id}`);
      const data =
        response?.data?.data?.student ||
        response?.data?.student ||
        response?.data?.data;

      setSelectedStudent(data || student);
    } catch (err) {
      console.error('Student load error:', err);
      // Fallback to list data if detail fetch fails
      setSelectedStudent(student);
    } finally {
      setLoadingId(null);
    }
  };

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const paginationPages = useMemo(() => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, totalPages]);

  // =========================
  // RENDER
  // =========================
  if (selectedStudent) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student ID Card</h1>
          <p className="text-gray-500 text-sm mt-1">
            Preview and print the selected student's identity card
          </p>
        </div>
        <IdCardPreview
          student={selectedStudent}
          onBack={() => setSelectedStudent(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FaIdCard />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Student ID Cards
              </h1>
              <p className="text-gray-500 text-sm">
                Generate, preview and print student identity cards
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchStudents(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50"
        >
          <FaSyncAlt className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">On This Page</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {students.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Page</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {page} / {totalPages}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Per Page</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{limit}</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name, student ID, phone or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="relative lg:w-56">
            <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-8 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-red-700">
                Failed to load students
              </h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => fetchStudents(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
            >
              <FaSyncAlt /> Try Again
            </button>
          </div>
        </div>
      )}

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl mx-auto mb-4">
            <FaUserGraduate />
          </div>
          <h3 className="font-semibold text-gray-700">No students found</h3>
          <p className="text-sm text-gray-400 mt-1">
            Try changing your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {students.map((student) => (
              <motion.div
                key={student._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
                      {student.photo ? (
                        <img
                          src={student.photo}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      ) : student.userId?.profileImage ? (
                        <img
                          src={student.userId.profileImage}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(student.name)
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 truncate">
                        {student.name || 'Unnamed'}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {student.email || 'No email'}
                      </p>
                      <span
                        className={`inline-flex mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize ${
                          statusColors[student.status] || statusColors.inactive
                        }`}
                      >
                        {student.status || 'unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">
                        {student.studentId || '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="truncate">
                        {readCourse(student)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="truncate">{readBatch(student)}</span>
                      <span>{student.phone || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    ID Card
                  </span>
                  <button
                    type="button"
                    onClick={() => handleViewCard(student)}
                    disabled={loadingId === student._id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 disabled:opacity-60 transition"
                  >
                    {loadingId === student._id ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <FaEye />
                        View &amp; Print
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* PAGINATION */}
      {!loading && students.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Showing{' '}
            <span className="font-semibold text-gray-700">
              {(page - 1) * limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-gray-700">
              {Math.min(page * limit, total)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-700">{total}</span>{' '}
            students
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            {paginationPages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`w-9 h-9 rounded-lg text-xs font-semibold transition ${
                  page === pageNumber
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}