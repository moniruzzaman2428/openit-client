import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  FaArrowRight,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaGraduationCap,
  FaRedo,
  FaSearch,
  FaTimes,
  FaUserGraduate,
  FaUsers,
  FaEnvelope,
  FaPhoneAlt,
  FaFilter,
  FaFingerprint,
  FaShieldAlt,
  FaIdCard,
  FaExpand
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import OptimizedImage from '../../components/OptimizedImage';
const LOGO_URL = '/logo.png';
/* ============================================================
   HELPERS
\============================================================ */
const getStudents = (response) =>
  response?.data?.data?.students ||
  response?.data?.students ||
  response?.data?.data ||
  [];
const getTotal = (response, students) =>
  response?.data?.data?.total ||
  response?.data?.total ||
  response?.data?.results ||
  students.length;
const getCourseName = (student) => {
  const course = student?.course;
  if (!course) return 'Course not assigned';
  if (typeof course === 'string') return course;
  return course?.title || course?.name || course?.courseName || 'Course not assigned';
};
const getBatchName = (student) => {
  const batch = student?.batch;
  if (!batch) return 'Batch not assigned';
  if (typeof batch === 'string') return batch;
  return batch?.name || batch?.title || batch?.batchName || 'Batch not assigned';
};
const getPhone = (student) =>
  student?.phone || student?.mobile || student?.contactNumber || 'N/A';
const formatDate = (date) => {
  if (!date) return 'Not available';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return 'Not available';
  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 'ST';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};
const getStatusConfig = (status) => {
  const configs = {
    active: { label: 'Active', dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    inactive: { label: 'Inactive', dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
    completed: { label: 'Completed', dot: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    suspended: { label: 'Suspended', dot: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  };
  return configs[String(status || 'active').toLowerCase()] || configs.active;
};
/* ============================================================
   BARCODE (real-looking, dark, matches card image)
\============================================================ */
const buildBars = (seed = 'N/A') => {
  let state = 0;
  for (let i = 0; i < seed.length; i += 1) {
    state = (state * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const bars = [];
  for (let i = 0; i < 55; i += 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    bars.push({
      width: ((state >>> 24) % 3) + 1,
      gap: ((state >>> 16) % 2) + 1,
    });
  }
  return bars;
};
const Barcode = memo(({ value }) => {
  const bars = useMemo(() => buildBars(String(value || 'N/A')), [value]);
  return <div className="relative flex h-11 w-full items-stretch overflow-hidden">
    {bars.map((bar, index) => <span key={index} className="block origin-bottom bg-slate-900" style={{ width: bar.width * 1.15, marginRight: bar.gap * 1.05 }} />)}
  </div>;
});
const DotGrid = ({ className = '' }) => (
  <div className={`grid grid-cols-3 gap-1.5 ${className}`}>
    {Array.from({ length: 9 }).map((_, i) => (
      <span key={i} className="h-1 w-1 rounded-full bg-slate-800" />
    ))}
  </div>
);
/* ============================================================
   DETAIL ROW
\============================================================ */
const DetailRow = ({ label, value }) => (
  <div className="flex items-start gap-2 text-[12.5px] leading-snug">
    <span className="w-[58px] shrink-0 font-extrabold text-slate-800">{label}</span>
    <span className="shrink-0 font-bold text-slate-500">:</span>
    <span
      className="min-w-0 flex-1 truncate font-semibold text-slate-600"
      title={value}
    >
      {value}
    </span>
  </div>
);
/* ============================================================
   STUDENT CARD (ID-card style, white, professional)
\============================================================ */
const StudentCard = memo(({ student, onViewDetails, onPreviewPhoto }) => {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;
  const status = getStatusConfig(student.status);
  const [logoFailed, setLogoFailed] = useState(false);
  const showPhoto = Boolean(student.photo);
  return (
    <motion.article
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        delay: 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={animate ? { y: -8 } : undefined}
      className="group relative mx-auto flex w-full max-w-[360px] flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.10)] transition-shadow duration-300 hover:shadow-[0_22px_60px_rgba(15,23,42,0.20)]"
    >
      {/* TOP HEADER: dot grid + logo */}
      <div className="relative flex items-center justify-between px-5 pt-5 pb-2">
        <DotGrid />
        <div className="flex items-center gap-2">
          {logoFailed ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md">
              <FaGraduationCap className="text-sm" />
            </div>
          ) : (
            <img
              src={LOGO_URL}
              alt="Open IT Institute"
              className="h-9 w-9 object-contain"
              onError={() => setLogoFailed(true)}
            />
          )}
          <div className="text-right">
            <p className="text-[11px] font-black leading-none text-slate-800">
              Open IT
            </p>
            <p className="text-[9px] font-semibold leading-none text-slate-400 mt-0.5">
              Institute
            </p>
          </div>
        </div>
      </div>
      {/* NAVY BAND + PHOTO */}
      <div className="relative mt-1">
        {/* Navy band */}
        <div className="h-16 w-full bg-[#0d223f]" />
        {/* Photo circle overlapping band */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="relative h-[120px] w-[120px] cursor-zoom-in"
            role="button"
            tabIndex={showPhoto ? 0 : -1}
            aria-label="View student photo"
            onClick={() => showPhoto && onPreviewPhoto(student)}
            onKeyDown={(e) => {
              if (showPhoto && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onPreviewPhoto(student);
              }
            }}

          >
            {/* white ring */}
            <div className="absolute -inset-1 rounded-full bg-white" />
            <div className="absolute -inset-1 rounded-full border-2 border-slate-200" />
            <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
              {showPhoto ? (
                <>
                  <OptimizedImage
                    key={student.photo}
                    src={student.photo}
                    alt={student.name || 'Student'}
                    className="h-full w-full object-cover group-hover:scale-105"
                    fallback={
                      <div className="flex h-full w-full items-center justify-center bg-slate-100">
                        <span className="text-3xl font-black text-slate-500">
                          {getInitials(student.name)}
                        </span>
                      </div>
                    }
                  />
                  {/* Hover zoom icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                    <FaExpand className="text-white text-lg" />
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-3xl font-black text-slate-500">
                    {getInitials(student.name)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      {/* NAME + DESIGNATION */}
      <div className="mt-[68px] px-5 text-center">
        <h3
          className="truncate text-[22px] font-black leading-tight tracking-tight text-slate-900"
          title={student.name}
        >
          {student.name || 'Unnamed Student'}
        </h3>
        <div className="mt-2 flex justify-center">
          <motion.span
            whileHover={{ scale: 1.04 }}
            className="inline-block max-w-full truncate rounded-md bg-blue-950 px-3.5 py-1.5 text-[11.5px] font-extrabold tracking-wide text-white shadow-sm"
            title={getCourseName(student)}
          >
            {getCourseName(student)}
          </motion.span>
        </div>
      </div>
      {/* DETAILS */}
      <div className="mt-5 space-y-2.5 px-5">
        <DetailRow label="ID No" value={student.studentId || 'N/A'} />
        <DetailRow label="Email" value="Protected •••••" />
        <DetailRow label="Batch" value={getBatchName(student)} />
        <DetailRow label="Phone" value="Hidden for Privacy" />
      </div>
      {/* STATUS STRIP */}
      <div className="mt-4 px-5">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
            <span className={`text-[10.5px] font-bold ${status.text}`}>
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
            <FaCalendarAlt className="text-[9px]" />
            {formatDate(student.admissionDate)}
          </div>
        </div>
      </div>
      {/* BARCODE + DOTS */}
      <div className="mt-4 flex items-end gap-3 px-5">
        <div className="flex-1 overflow-hidden">
          <Barcode value={student.studentId || student._id} />
          <p className="mt-1.5 text-center text-[8px] font-mono tracking-[0.25em] text-slate-500">
            {student.studentId || 'OPEN-IT-INSTITUTE'}
          </p>
        </div>
        <DotGrid className="pb-2" />
      </div>
      {/* BOTTOM ACTION */}
      <div className="mt-5 px-5 pb-5">
        <button
          type="button"
          onClick={() => onViewDetails(student._id)}
          className="group/btn relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-[#0d223f] px-5 py-3 text-xs font-extrabold text-white transition-all duration-300 hover:bg-blue-700"
        >
          <span className="relative">View Details</span>
          <FaArrowRight className="relative text-[10px] transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.article>
  );
});
/* ============================================================
   SKELETON
\============================================================ */
const CardSkeleton = () => (
  <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between px-5 pt-5">
      <div className="h-4 w-10 animate-pulse rounded bg-slate-200" />
      <div className="h-9 w-24 animate-pulse rounded bg-slate-200" />
    </div>
    <div className="relative mt-1">
      <div className="h-16 w-full bg-[#0d223f]/80" />
      <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
        <div className="h-[120px] w-[120px] animate-pulse rounded-full border-4 border-white bg-slate-200" />
      </div>
    </div>
    <div className="mt-[68px] flex flex-col items-center px-5">
      <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-7 w-32 animate-pulse rounded-md bg-slate-200" />
    </div>
    <div className="mt-5 space-y-2.5 px-5">
      <div className="h-3.5 w-full animate-pulse rounded bg-slate-200" />
      <div className="h-3.5 w-5/6 animate-pulse rounded bg-slate-200" />
      <div className="h-3.5 w-4/6 animate-pulse rounded bg-slate-200" />
      <div className="h-3.5 w-3/6 animate-pulse rounded bg-slate-200" />
    </div>
    <div className="mx-5 mt-4 h-9 animate-pulse rounded-lg bg-slate-200" />
    <div className="mx-5 mt-4 h-11 animate-pulse rounded bg-slate-200" />
    <div className="mx-5 my-5 h-11 animate-pulse rounded-xl bg-slate-200" />
  </div>
);
/* ============================================================
   MAIN
\============================================================ */
const StudentInfo = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [slowLoading, setSlowLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [previewStudent, setPreviewStudent] = useState(null);
  useEffect(() => {
    if (!previewStudent) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setPreviewStudent(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewStudent]);
  // Show a loading message only when the request takes longer than 700ms.
  useEffect(() => {
    if (!loading && !refreshing) {
      setSlowLoading(false);
      return;
    }
    const timer = setTimeout(() => setSlowLoading(true), 700);
    return () => clearTimeout(timer);
  }, [loading, refreshing]);
  const limit = 12;
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);
  const fetchStudents = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) setRefreshing(true);
        else setLoading(true);
        setError('');
        const params = { page, limit };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (statusFilter !== 'all') params.status = statusFilter;
        const response = await api.get('/students/info', { params });
        const loadedStudents = getStudents(response);
        const safeStudents = Array.isArray(loadedStudents) ? loadedStudents : [];
        setStudents(safeStudents);
        setTotal(getTotal(response, safeStudents));
      } catch (err) {
        console.error('Failed to load students:', err);
        setError(err?.response?.data?.message || 'Unable to load students right now.');
        setStudents([]);
        setTotal(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, debouncedSearch, statusFilter]
  );
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const paginationPages = useMemo(() => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, totalPages]);
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleViewDetails = (studentId) => {
    navigate(`/student-info/${studentId}`);
  };
  const activeCount = students.filter(
    (s) => String(s.status || 'active').toLowerCase() === 'active'
  ).length;
  const completedCount = students.filter(
    (s) => String(s.status || '').toLowerCase() === 'completed'
  ).length;
  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 lg:px-7 relative overflow-hidden">
      {/* soft background accents (light theme) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-100/40 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-[1320px]">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0d223f] via-[#123a63] to-[#0b4f7a] p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  <FaShieldAlt />
                  Open IT Institute
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Student Information
                </h1>
                <p className="mt-2 max-w-xl text-xs leading-6 text-blue-100/80 sm:text-sm">
                  Manage and view enrolled students, courses, batches and
                  admission information from one place.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur-md">
                  <p className="text-xl font-black">{total}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-blue-100/80">
                    Students
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur-md">
                  <p className="text-xl font-black">{activeCount}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-blue-100/80">
                    Active
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur-md">
                  <p className="text-xl font-black">{completedCount}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-blue-100/80">
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* FILTERS */}
        <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name or ID..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-xs font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                >
                  <FaTimes className="text-[10px]" />
                </button>
              )}
            </div>
            <div className="relative">
              <FaFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-8 text-xs font-bold text-slate-600 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 lg:w-48"
              >
                <option value="all">All Students</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => fetchStudents(true)}
              disabled={refreshing || loading}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0d223f] px-5 text-xs font-extrabold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaRedo className={refreshing ? 'animate-spin text-[11px]' : 'text-[11px]'} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
        {/* CONTENT */}
        <div className="mt-6">
          {loading ? (
            <div role="status" aria-live="polite">
              {slowLoading && (
                <p className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#0d223f]">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
                  Loading student information...
                </p>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-dashed border-rose-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <FaUserGraduate className="text-2xl" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-slate-800">
                Could not load students
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                {error}
              </p>
              <button
                type="button"
                onClick={() => fetchStudents()}
                className="mt-5 rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-800"
              >
                Try Again
              </button>
            </div>
          ) : students.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FaUserGraduate className="text-2xl" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-slate-800">
                No Students Found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                No student matches your current search or filter.
              </p>
              {(search || statusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                  }}
                  className="mt-5 rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-800"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-bold text-slate-500">
                  Showing{' '}
                  <span className="font-black text-slate-800">
                    {(page - 1) * limit + 1}
                  </span>{' '}
                  –{' '}
                  <span className="font-black text-slate-800">
                    {Math.min(page * limit, total)}
                  </span>{' '}
                  of <span className="font-black text-slate-800">{total}</span>{' '}
                  students
                </p>
                {debouncedSearch && (
                  <p className="text-[11px] text-slate-400">
                    Search:{' '}
                    <span className="font-bold text-blue-600">
                      "{debouncedSearch}"
                    </span>
                  </p>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence initial={false}>
                  {students.map((student) => (
                    <StudentCard
                      key={student._id}
                      student={student}
                      onViewDetails={handleViewDetails}
                      onPreviewPhoto={setPreviewStudent}
                    />
                  ))}
                </AnimatePresence>
              </div>
              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center gap-4">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => handlePageChange(1)}
                      className="hidden h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
                    >
                      First
                    </button>
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                      aria-label="Previous page"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaChevronLeft className="text-[10px]" />
                    </button>
                    {paginationPages.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => handlePageChange(pageNumber)}
                        className={`h-10 min-w-10 rounded-xl px-3 text-xs font-extrabold transition-all duration-300 ${pageNumber === page
                          ? 'scale-105 bg-[#0d223f] text-white shadow-md'
                          : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-blue-300 hover:text-blue-600'
                          }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(page + 1)}
                      aria-label="Next page"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaChevronRight className="text-[10px]" />
                    </button>
                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(totalPages)}
                      className="hidden h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
                    >
                      Last
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Page <span className="font-bold text-slate-700">{page}</span> of{' '}
                    <span className="font-bold text-slate-700">{totalPages}</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* PHOTO PREVIEW MODAL */}
      <AnimatePresence>
        {previewStudent?.photo && (
          <motion.div
            key="photo-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Student photo preview"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-5 backdrop-blur-md"
            onClick={() => setPreviewStudent(null)}
          >
            <button
              type="button"
              onClick={() => setPreviewStudent(null)}
              aria-label="Close photo preview"
              className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25 border border-white/10"
            >
              <FaTimes />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl rounded-3xl border border-white/15 bg-white/5 p-3 text-center shadow-2xl backdrop-blur-xl"
            >
              <img
                src={previewStudent.photo}
                alt={previewStudent.name || 'Student'}
                className="relative max-h-[75vh] max-w-full rounded-2xl object-contain"
              />
              <div className="mt-3 rounded-xl bg-white/95 px-4 py-2">
                <p className="font-bold text-slate-800">{previewStudent.name}</p>
                <p className="text-xs text-slate-500">
                  {previewStudent.studentId}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default StudentInfo;