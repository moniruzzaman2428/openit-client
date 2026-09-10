import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaSearch,
  FaUserGraduate,
  FaBook,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaVenusMars,
  FaIdCard,
  FaUserFriends,
  FaBirthdayCake,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

// ============================================================
// HELPERS
// ============================================================
const getStudents = (response) =>
  response?.data?.data?.students ||
  response?.data?.students ||
  response?.data?.data ||
  [];

const getTotal = (response, students) =>
  response?.data?.total ||
  response?.data?.data?.total ||
  response?.data?.results ||
  students.length;

const getCourseName = (student) => {
  if (!student?.course) return 'Course not assigned';
  if (typeof student.course === 'object') {
    return student.course.title || student.course.name || 'Course not assigned';
  }
  return student.course;
};

const getBatchName = (student) => {
  if (!student?.batch) return 'Batch not assigned';
  if (typeof student.batch === 'object') {
    return student.batch.name || 'Batch not assigned';
  }
  return student.batch;
};

const formatDate = (date) => {
  if (!date) return 'Not provided';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Not provided';
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || 'S';

const statusStyles = {
  active: 'bg-emerald-500/15 text-emerald-700 border-emerald-300/50',
  inactive: 'bg-slate-500/15 text-slate-700 border-slate-300/50',
  completed: 'bg-blue-500/15 text-blue-700 border-blue-300/50',
  suspended: 'bg-red-500/15 text-red-700 border-red-300/50',
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const StudentInfo = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [page, setPage] = useState(1);
  const limit = 12;

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) setRefreshing(true);
        else setLoading(true);

        const params = { page, limit };
        if (search.trim()) params.search = search.trim();
        if (statusFilter !== 'all') params.status = statusFilter;

        const response = await api.get('/students/info', { params });

        const loadedStudents = getStudents(response);
        setStudents(Array.isArray(loadedStudents) ? loadedStudents : []);
        setTotal(getTotal(response, loadedStudents));
      } catch (error) {
        console.error('Student info loading error:', error);
        setStudents([]);
        setTotal(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, search, statusFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 350);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const paginationPages = useMemo(() => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, totalPages]);

  const activeCount = students.filter((s) => s.status === 'active').length;
  const coursesCount = new Set(students.map((s) => getCourseName(s))).size;
  const batchesCount = new Set(students.map((s) => getBatchName(s))).size;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* ============================================================
          PROFESSIONAL BACKGROUND — Mesh gradients + grid pattern
      ============================================================ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left blue glow */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-400/25 to-cyan-400/15 blur-3xl" />

        {/* Top-right indigo glow */}
        <div className="absolute -right-40 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/15 blur-3xl" />

        {/* Bottom-left emerald glow */}
        <div className="absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-300/15 to-teal-300/10 blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(15,76,129,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,76,129,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Radial mask for focus */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(248,250,252,0.7) 100%)',
          }}
        />
      </div>

      {/* ============================================================
          CONTENT
      ============================================================ */}
      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 blur-lg opacity-40" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-600/30">
                  <FaUserGraduate className="text-2xl" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Student Information
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Open IT Institute ·{' '}
                  <span className="font-semibold text-blue-600">
                    {total} Enrolled Students
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fetchStudents(true)}
              disabled={refreshing}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition hover:border-blue-300 hover:bg-white hover:text-blue-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSyncAlt
                className={`transition ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}
              />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* ========== STATS CARDS ========== */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            icon={FaUsers}
            label="Total Students"
            value={total}
            gradient="from-blue-500 to-cyan-500"
            shadow="shadow-blue-500/25"
            delay={0}
          />
          <StatCard
            icon={FaUserGraduate}
            label="Active"
            value={activeCount}
            gradient="from-emerald-500 to-teal-500"
            shadow="shadow-emerald-500/25"
            delay={0.05}
          />
          <StatCard
            icon={FaBook}
            label="Courses"
            value={coursesCount}
            gradient="from-purple-500 to-pink-500"
            shadow="shadow-purple-500/25"
            delay={0.1}
          />
          <StatCard
            icon={FaUserFriends}
            label="Batches"
            value={batchesCount}
            gradient="from-orange-500 to-amber-500"
            shadow="shadow-orange-500/25"
            delay={0.15}
          />
        </div>

        {/* ========== SEARCH / FILTER ========== */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-lg shadow-slate-200/50 backdrop-blur-xl"
        >
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student by name, ID, email or phone..."
                className="w-full rounded-xl border border-slate-200/70 bg-white/70 py-3 pl-11 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="all">All Students</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </motion.div>

        {/* ========== LOADING SKELETON ========== */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-5 backdrop-blur-md"
              >
                <div className="mx-auto mb-5 h-28 w-28 rounded-full bg-slate-200/80" />
                <div className="mx-auto mb-3 h-5 w-3/4 rounded bg-slate-200/80" />
                <div className="mx-auto mb-6 h-4 w-1/2 rounded bg-slate-200/80" />
                <div className="mb-3 h-12 rounded-xl bg-slate-100/80" />
                <div className="mb-3 h-12 rounded-xl bg-slate-100/80" />
                <div className="h-12 rounded-xl bg-slate-100/80" />
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          /* ========== EMPTY STATE ========== */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center shadow-sm backdrop-blur-md"
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600">
              <FaUserGraduate className="text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              No Students Found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              No student information matches your current search or filter.
            </p>
            {(search || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:shadow-xl hover:shadow-blue-600/40"
              >
                <FaTimes />
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            {/* ========== STUDENT CARDS ========== */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {students.map((student, index) => {
                  const photo =
                    student?.photo || student?.userId?.profileImage || '';
                  const status = student?.status || 'active';

                  return (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(index * 0.04, 0.25),
                      }}
                      className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-300/60 hover:shadow-2xl hover:shadow-blue-500/20"
                    >
                      {/* Top accent gradient */}
                      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500">
                        {/* Decorative circles */}
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                        <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-white/5" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_40%)]" />

                        {/* Status badge */}
                        <span
                          className={`absolute right-4 top-4 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur-md ${statusStyles[status] || statusStyles.active}`}
                        >
                          {status}
                        </span>

                        {/* Student ID badge */}
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                          <FaIdCard className="text-[9px]" />
                          {student.studentId || 'N/A'}
                        </span>
                      </div>

                      {/* Photo */}
                      <div className="relative -mt-16 flex justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 blur-md opacity-40" />
                          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl">
                            {photo ? (
                              <img
                                src={photo}
                                alt={student.name || 'Student'}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="text-3xl font-bold text-blue-600">
                                {getInitials(student.name)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 pt-4">
                        <div className="text-center">
                          <h2 className="truncate text-lg font-bold text-slate-800">
                            {student.name || 'Unnamed Student'}
                          </h2>
                          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                            {student.email || 'No email'}
                          </p>
                        </div>

                        <div className="mt-5 space-y-2.5">
                          <InfoPill
                            icon={FaBook}
                            label="Course"
                            value={getCourseName(student)}
                            color="blue"
                          />
                          <InfoPill
                            icon={FaUsers}
                            label="Batch"
                            value={getBatchName(student)}
                            color="purple"
                          />
                          <InfoPill
                            icon={FaCalendarAlt}
                            label="Admission"
                            value={formatDate(student.admissionDate)}
                            color="orange"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedStudent(student)}
                          className="mt-5 w-full rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:from-blue-600 hover:to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30"
                        >
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* ========== PAGINATION ========== */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/70 text-slate-600 shadow-sm backdrop-blur-md transition hover:border-blue-300 hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaChevronLeft />
                </button>

                {paginationPages.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition-all duration-300 ${
                      pageNumber === page
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/40'
                        : 'border border-white/60 bg-white/70 text-slate-600 shadow-sm backdrop-blur-md hover:border-blue-300 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/70 text-slate-600 shadow-sm backdrop-blur-md transition hover:border-blue-300 hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ============================================================
          STUDENT DETAILS MODAL
      ============================================================ */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
              {/* Modal header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 px-6 pb-20 pt-6">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
                <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-white/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_40%)]" />

                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30"
                >
                  <FaTimes />
                </button>

                <div className="relative text-center text-white">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                    <FaUserGraduate className="text-xl" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-100">
                    Open IT Institute
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">Student Details</h2>
                </div>
              </div>

              {/* Modal body */}
              <div className="relative -mt-16 px-6 pb-6">
                {/* Avatar */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 blur-md opacity-40" />
                    <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-slate-100 to-slate-200 shadow-2xl">
                      {selectedStudent.photo ||
                      selectedStudent?.userId?.profileImage ? (
                        <img
                          src={
                            selectedStudent.photo ||
                            selectedStudent?.userId?.profileImage
                          }
                          alt={selectedStudent.name || 'Student'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-blue-600">
                          {getInitials(selectedStudent.name)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name + ID */}
                <div className="mt-4 text-center">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedStudent.name || 'Unnamed Student'}
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
                    <FaIdCard className="text-xs text-blue-600" />
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {selectedStudent.studentId || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <ModalInfoItem
                    icon={FaBook}
                    label="Course"
                    value={getCourseName(selectedStudent)}
                    color="blue"
                  />
                  <ModalInfoItem
                    icon={FaUsers}
                    label="Batch"
                    value={getBatchName(selectedStudent)}
                    color="purple"
                  />
                  <ModalInfoItem
                    icon={FaPhone}
                    label="Phone"
                    value={selectedStudent.phone || 'Not provided'}
                    color="emerald"
                  />
                  <ModalInfoItem
                    icon={FaEnvelope}
                    label="Email"
                    value={selectedStudent.email || 'Not provided'}
                    color="orange"
                  />
                  <ModalInfoItem
                    icon={FaGraduationCap}
                    label="Education"
                    value={selectedStudent.education || 'Not provided'}
                    color="indigo"
                  />
                  <ModalInfoItem
                    icon={FaVenusMars}
                    label="Gender"
                    value={selectedStudent.gender || 'Not provided'}
                    color="pink"
                  />
                  <ModalInfoItem
                    icon={FaBirthdayCake}
                    label="Date of Birth"
                    value={formatDate(selectedStudent.dateOfBirth)}
                    color="rose"
                  />
                  <ModalInfoItem
                    icon={FaCalendarAlt}
                    label="Admission Date"
                    value={formatDate(selectedStudent.admissionDate)}
                    color="cyan"
                  />
                  <ModalInfoItem
                    icon={FaUserFriends}
                    label="Father's Name"
                    value={selectedStudent.fatherName || 'Not provided'}
                    color="teal"
                  />
                  <ModalInfoItem
                    icon={FaUserFriends}
                    label="Mother's Name"
                    value={selectedStudent.motherName || 'Not provided'}
                    color="violet"
                  />
                  <div className="sm:col-span-2">
                    <ModalInfoItem
                      icon={FaMapMarkerAlt}
                      label="Address"
                      value={selectedStudent.address || 'Not provided'}
                      color="red"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================
const StatCard = ({ icon: Icon, label, value, gradient, shadow, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    {/* Glow accent */}
    <div
      className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
    />

    <div className="relative">
      <div
        className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg ${shadow}`}
      >
        <Icon className="text-lg" />
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  </motion.div>
);

// ============================================================
// INFO PILL (for card)
// ============================================================
const colorMap = {
  blue: {
    bg: 'bg-blue-50/80',
    text: 'text-blue-600',
    label: 'text-blue-500',
  },
  purple: {
    bg: 'bg-purple-50/80',
    text: 'text-purple-600',
    label: 'text-purple-500',
  },
  orange: {
    bg: 'bg-orange-50/80',
    text: 'text-orange-600',
    label: 'text-orange-500',
  },
  emerald: {
    bg: 'bg-emerald-50/80',
    text: 'text-emerald-600',
    label: 'text-emerald-500',
  },
  indigo: {
    bg: 'bg-indigo-50/80',
    text: 'text-indigo-600',
    label: 'text-indigo-500',
  },
  pink: {
    bg: 'bg-pink-50/80',
    text: 'text-pink-600',
    label: 'text-pink-500',
  },
  rose: {
    bg: 'bg-rose-50/80',
    text: 'text-rose-600',
    label: 'text-rose-500',
  },
  cyan: {
    bg: 'bg-cyan-50/80',
    text: 'text-cyan-600',
    label: 'text-cyan-500',
  },
  teal: {
    bg: 'bg-teal-50/80',
    text: 'text-teal-600',
    label: 'text-teal-500',
  },
  violet: {
    bg: 'bg-violet-50/80',
    text: 'text-violet-600',
    label: 'text-violet-500',
  },
  red: {
    bg: 'bg-red-50/80',
    text: 'text-red-600',
    label: 'text-red-500',
  },
};

const InfoPill = ({ icon: Icon, label, value, color = 'blue' }) => {
  const style = colorMap[color] || colorMap.blue;
  return (
    <div className={`flex items-center gap-3 rounded-xl ${style.bg} px-3 py-2.5`}>
      <Icon className={`shrink-0 text-sm ${style.text}`} />
      <div className="min-w-0">
        <p className={`text-[10px] font-bold uppercase tracking-wide ${style.label}`}>
          {label}
        </p>
        <p className="truncate text-xs font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
};

// ============================================================
// MODAL INFO ITEM
// ============================================================
const ModalInfoItem = ({ icon: Icon, label, value, color = 'blue' }) => {
  const style = colorMap[color] || colorMap.blue;
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4 transition-all duration-300 hover:border-slate-300 hover:shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${style.bg} ${style.text}`}
        >
          <Icon className="text-xs" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>
      <p className="break-words text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
};

export default StudentInfo;