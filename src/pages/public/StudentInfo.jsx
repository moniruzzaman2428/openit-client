import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaArrowRight,
  FaBook,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaGraduationCap,
  FaIdCard,
  FaRedo,
  FaSearch,
  FaTimes,
  FaUserGraduate,
  FaUsers,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

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

  return (
    course?.title ||
    course?.name ||
    course?.courseName ||
    'Course not assigned'
  );
};

const getBatchName = (student) => {
  const batch = student?.batch;

  if (!batch) return 'Batch not assigned';
  if (typeof batch === 'string') return batch;

  return (
    batch?.name ||
    batch?.title ||
    batch?.batchName ||
    'Batch not assigned'
  );
};

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
    active: {
      label: 'Active',
      dot: 'bg-emerald-500',
      badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
    inactive: {
      label: 'Inactive',
      dot: 'bg-slate-400',
      badge: 'border-slate-200 bg-slate-50 text-slate-600',
    },
    completed: {
      label: 'Completed',
      dot: 'bg-blue-500',
      badge: 'border-blue-200 bg-blue-50 text-blue-700',
    },
    suspended: {
      label: 'Suspended',
      dot: 'bg-red-500',
      badge: 'border-red-200 bg-red-50 text-red-700',
    },
  };

  return configs[status] || configs.active;
};

const InfoPill = ({ icon: Icon, label, value, color = 'blue' }) => {
  const colorStyles = {
    blue: {
      wrapper: 'border-blue-100 bg-blue-50/70',
      icon: 'bg-white text-blue-600',
      label: 'text-blue-500',
    },
    purple: {
      wrapper: 'border-violet-100 bg-violet-50/70',
      icon: 'bg-white text-violet-600',
      label: 'text-violet-500',
    },
    orange: {
      wrapper: 'border-orange-100 bg-orange-50/70',
      icon: 'bg-white text-orange-500',
      label: 'text-orange-500',
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-3 ${style.wrapper}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ${style.icon}`}
      >
        <Icon className="text-xs" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[9px] font-extrabold uppercase tracking-wider ${style.label}`}
        >
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-bold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
};

const StudentCard = ({ student, onViewDetails }) => {
  const status = getStatusConfig(student.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 25 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -7 }}
      className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.07)] transition-shadow duration-300 hover:shadow-[0_22px_50px_rgba(15,76,129,0.16)]"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-600" />

      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/20" />

      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FaUserGraduate className="text-xs" />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                Open IT
              </p>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-300">
                Institute
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wide ${status.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-blue-500 to-cyan-400 opacity-30 blur-xl transition duration-500 group-hover:opacity-50" />

            <div className="relative flex h-[78px] w-[78px] items-center justify-center overflow-hidden rounded-[20px] border-4 border-white bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg ring-1 ring-slate-200">
              {student.photo ? (
                <img
                  src={student.photo}
                  alt={student.name || 'Student'}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-2xl font-black text-blue-600">
                  {getInitials(student.name)}
                </span>
              )}
            </div>

            <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-white bg-emerald-500 text-white shadow-md">
              <FaCheckCircle className="text-[11px]" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[17px] font-extrabold tracking-tight text-slate-900">
              {student.name || 'Unnamed Student'}
            </h3>

            <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5">
              <FaIdCard className="shrink-0 text-[10px] text-blue-600" />
              <span className="truncate font-mono text-[10px] font-bold tracking-wide text-slate-600">
                {student.studentId || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {student.email && (
          <div className="mt-4 flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
            <FaEnvelope className="shrink-0 text-[10px] text-slate-400" />
            <p className="truncate text-[10px] font-semibold text-slate-500">
              {student.email}
            </p>
          </div>
        )}

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="grid grid-cols-2 gap-3">
          <InfoPill
            icon={FaBook}
            label="Course"
            value={getCourseName(student)}
          />

          <InfoPill
            icon={FaUsers}
            label="Batch"
            value={getBatchName(student)}
            color="purple"
          />
        </div>

        <div className="mt-3">
          <InfoPill
            icon={FaCalendarAlt}
            label="Admission Date"
            value={formatDate(student.admissionDate)}
            color="orange"
          />
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(student._id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-600 hover:via-blue-600 hover:to-cyan-500 hover:shadow-xl hover:shadow-blue-500/25"
        >
          <span>View Details</span>
          <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
};

const StudentInfo = () => {
  const navigate = useNavigate();
  const isFirstMount = useRef(true);

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const limit = 12;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const fetchStudents = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const params = {
          page,
          limit,
        };

        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }

        if (statusFilter !== 'all') {
          params.status = statusFilter;
        }

        const response = await api.get('/students/info', { params });
        const loadedStudents = getStudents(response);
        const safeStudents = Array.isArray(loadedStudents)
          ? loadedStudents
          : [];

        setStudents(safeStudents);
        setTotal(getTotal(response, safeStudents));
      } catch (error) {
        console.error('Failed to load students:', error);
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
    if (isFirstMount.current) {
      isFirstMount.current = false;
      fetchStudents();
      return;
    }

    fetchStudents();
  }, [fetchStudents]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const paginationPages = useMemo(() => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [page, totalPages]);

  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === page
    ) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleViewDetails = (studentId) => {
    navigate(`/student-info/${studentId}`);
  };

  const activeCount = students.filter(
    (student) => student.status === 'active'
  ).length;

  const completedCount = students.filter(
    (student) => student.status === 'completed'
  ).length;

  return (
    <div className="min-h-screen bg-[#f7faff] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0f4c81] via-blue-700 to-cyan-600 p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  <FaGraduationCap />
                  Open IT Institute
                </div>

                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Student Information
                </h1>

                <p className="mt-2 max-w-xl text-xs leading-6 text-blue-100 sm:text-sm">
                  Manage and view enrolled students, courses, batches and
                  admission information from one place.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center backdrop-blur-md">
                  <p className="text-xl font-black">{total}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-blue-100">
                    Students
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center backdrop-blur-md">
                  <p className="text-xl font-black">{activeCount}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-blue-100">
                    Active
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center backdrop-blur-md">
                  <p className="text-xl font-black">{completedCount}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-blue-100">
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_6px_25px_rgba(15,23,42,0.05)] sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name or ID..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                >
                  <FaTimes className="text-[10px]" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-600 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 lg:w-44"
            >
              <option value="all">All Students</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
            </select>

            <button
              type="button"
              onClick={() => fetchStudents(true)}
              disabled={refreshing}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-xs font-extrabold text-white shadow-lg shadow-slate-900/10 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaRedo
                className={refreshing ? 'animate-spin text-[11px]' : 'text-[11px]'}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
                      <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                    </div>
                    <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-[78px] w-[78px] animate-pulse rounded-[20px] bg-slate-200" />

                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                      <div className="h-6 w-24 animate-pulse rounded-lg bg-slate-200" />
                    </div>
                  </div>

                  <div className="mt-5 h-10 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="my-4 h-px bg-slate-100" />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                  </div>

                  <div className="mt-3 h-16 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="mt-4 h-12 animate-pulse rounded-2xl bg-slate-200" />
                </div>
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FaUserGraduate className="text-2xl" />
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-slate-800">
                No Students Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-400">
                No student matches your current search or filter. Try changing
                the search keyword or status filter.
              </p>

              {(search || statusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                  }}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
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
                  of{' '}
                  <span className="font-black text-slate-800">{total}</span>{' '}
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

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {students.map((student) => (
                    <StudentCard
                      key={student._id}
                      student={student}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </AnimatePresence>
              </div>

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
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaChevronLeft className="text-[10px]" />
                    </button>

                    {paginationPages.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => handlePageChange(pageNumber)}
                        className={`h-10 min-w-10 rounded-xl px-3 text-xs font-extrabold transition-all duration-300 ${
                          pageNumber === page
                            ? 'scale-105 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
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
                    Page{' '}
                    <span className="font-bold text-slate-700">{page}</span>{' '}
                    of{' '}
                    <span className="font-bold text-slate-700">
                      {totalPages}
                    </span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;