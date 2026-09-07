import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaTimes,
  FaSpinner,
  FaUserGraduate,
  FaChevronLeft,
  FaChevronRight,
  FaSave,
  FaSyncAlt,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

// আপনার project-এ studentService থাকলে এখানে path ঠিক করুন
import api from '../../services/api';

const statusColors = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  inactive: 'bg-gray-100 text-gray-600 border border-gray-200',
  completed: 'bg-blue-50 text-blue-700 border border-blue-100',
  suspended: 'bg-red-50 text-red-700 border border-red-100',
};

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  fatherName: '',
  motherName: '',
  dateOfBirth: '',
  gender: 'male',
  address: '',
  education: '',
  course: '',
  batch: '',
  photo: '',
  status: 'active',
};

const normalizeStudents = (response) => {
  return (
    response?.data?.data?.students ||
    response?.data?.students ||
    response?.data?.data ||
    response?.data ||
    []
  );
};

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong.'
  );
};

const Students = () => {
  // =========================
  // STATE
  // =========================
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // =========================
  // REAL COURSE / BATCH OPTIONS
  // =========================
  useEffect(() => {
    let mounted = true;

    const loadOptions = async () => {
      try {
        const [courseRes, batchRes] = await Promise.all([
          api.get('/courses', { params: { limit: 500, sort: 'title' } }),
          api.get('/batches', { params: { limit: 500, sort: 'name' } }),
        ]);

        if (!mounted) return;
        setCourses(courseRes.data?.data?.courses || []);
        setBatches(batchRes.data?.data?.batches || []);
      } catch (err) {
        console.error('Student form options loading error:', err);
        if (mounted) {
          setCourses([]);
          setBatches([]);
        }
      }
    };

    loadOptions();
    return () => { mounted = false; };
  }, []);

  const availableBatches = useMemo(() => {
    if (!form.course) return batches;
    return batches.filter((batch) => {
      const courseId = batch?.course?._id || batch?.course;
      return String(courseId || '') === String(form.course);
    });
  }, [batches, form.course]);

  // =========================
  // FETCH STUDENTS
  // =========================
  const fetchStudents = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError('');

        const params = {
          page,
          limit,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (statusFilter !== 'all') {
          params.status = statusFilter;
        }

        const response = await api.get('/students', { params });

        const data = normalizeStudents(response);

        setStudents(Array.isArray(data) ? data : []);

        setTotal(
          Number(
            response?.data?.total ??
              response?.data?.data?.total ??
              response?.data?.count ??
              data?.length ??
              0
          )
        );
      } catch (err) {
        console.error('Student loading error:', err);

        setStudents([]);
        setError(getErrorMessage(err));

        if (err?.response?.status === 401) {
          Swal.fire({
            icon: 'warning',
            title: 'Authentication Required',
            text: 'Your login session may have expired. Please login again.',
            confirmButtonText: 'OK',
          });
        }

        if (err?.response?.status === 403) {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not have permission to view students.',
          });
        }
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

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const paginationPages = useMemo(() => {
    const pages = [];

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [page, totalPages]);

  // =========================
  // FORM HANDLERS
  // =========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === 'course') {
        const currentBatch = batches.find((batch) => batch._id === prev.batch);
        const batchCourse = currentBatch?.course?._id || currentBatch?.course;
        return {
          ...prev,
          course: value,
          batch: String(batchCourse || '') === String(value) ? prev.batch : '',
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedStudent(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setModalMode('edit');
    setSelectedStudent(student);

    setForm({
      name: student?.name || '',
      email: student?.email || '',
      phone: student?.phone || '',
      password: '',
      fatherName: student?.fatherName || '',
      motherName: student?.motherName || '',
      dateOfBirth: student?.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().split('T')[0]
        : '',
      gender: student?.gender || 'male',
      address: student?.address || '',
      education: student?.education || '',
      course: student?.course?._id || student?.course || '',
      batch: student?.batch?._id || student?.batch || '',
      photo: student?.photo || '',
      status: student?.status || 'active',
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setSelectedStudent(null);
    setForm(emptyForm);
  };

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      Swal.fire('Required', 'Student name is required.', 'warning');
      return;
    }

    if (!form.email.trim()) {
      Swal.fire('Required', 'Email is required.', 'warning');
      return;
    }

    if (!form.phone.trim()) {
      Swal.fire('Required', 'Phone number is required.', 'warning');
      return;
    }

    if (!form.fatherName.trim() || !form.motherName.trim() || !form.dateOfBirth || !form.address.trim() || !form.education.trim()) {
      Swal.fire('Required', 'Father name, mother name, date of birth, address and education are required.', 'warning');
      return;
    }

    if (modalMode === 'add') {
      if (!form.course) {
        Swal.fire('Required', 'Course is required.', 'warning');
        return;
      }

      if (!form.batch) {
        Swal.fire('Required', 'Batch is required.', 'warning');
        return;
      }
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        fatherName: form.fatherName.trim(),
        motherName: form.motherName.trim(),
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender,
        address: form.address.trim(),
        education: form.education.trim(),
        course: form.course,
        batch: form.batch,
        photo: form.photo.trim(),
        status: form.status,
      };

      // Password only needed during creation
      if (modalMode === 'add' && form.password.trim()) {
        payload.password = form.password.trim();
      }

      if (modalMode === 'add') {
        await api.post('/students', payload);

        await Swal.fire({
          icon: 'success',
          title: 'Student Created',
          text: 'Student has been added successfully.',
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await api.patch(`/students/${selectedStudent._id}`, payload);

        await Swal.fire({
          icon: 'success',
          title: 'Student Updated',
          text: 'Student information has been updated.',
          timer: 1800,
          showConfirmButton: false,
        });
      }

      closeModal();

      await fetchStudents(true);
    } catch (err) {
      console.error('Student save error:', err);

      Swal.fire({
        icon: 'error',
        title: modalMode === 'add' ? 'Create Failed' : 'Update Failed',
        text: getErrorMessage(err),
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // VIEW STUDENT
  // =========================
  const handleView = async (student) => {
    try {
      const response = await api.get(`/students/${student._id}`);

      const data =
        response?.data?.data?.student ||
        response?.data?.student ||
        response?.data?.data;

      setSelectedStudent(data || student);
      setModalMode('view');
      setShowModal(true);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Unable to Load',
        text: getErrorMessage(err),
      });
    }
  };

  // =========================
  // DELETE STUDENT
  // =========================
  const handleDelete = async (student) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Student?',
      html: `
        <div style="font-size:14px">
          You are about to delete
          <strong>${student?.name || 'this student'}</strong>.
          <br/>
          This action cannot be undone.
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/students/${student._id}`);

      await Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Student has been deleted successfully.',
        timer: 1600,
        showConfirmButton: false,
      });

      // If last item of last page was deleted
      if (students.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchStudents(true);
      }
    } catch (err) {
      console.error('Delete student error:', err);

      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: getErrorMessage(err),
      });
    }
  };

  // =========================
  // DISPLAY HELPERS
  // =========================
  const getCourseName = (student) => {
    if (!student?.course) return '—';

    if (typeof student.course === 'object') {
      return student.course.title || student.course.name || '—';
    }

    return student.course;
  };

  const getBatchName = (student) => {
    if (!student?.batch) return '—';

    if (typeof student.batch === 'object') {
      return student.batch.name || '—';
    }

    return student.batch;
  };

  const getInitials = (name = '') => {
    return (
      name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase() || 'ST'
    );
  };

  const formatDate = (date) => {
    if (!date) return '—';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return '—';

    return parsed.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6 pb-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FaUserGraduate />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-dark">
                Students
              </h1>

              <p className="text-gray-500 text-sm">
                Manage all enrolled students
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchStudents(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            <FaSyncAlt className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition"
          >
            <FaPlus />
            Add Student
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-dark mt-1">
            {total}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Current Page</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {students.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Page</p>
          <p className="text-2xl font-bold text-dark mt-1">
            {page} / {totalPages}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Per Page</p>
          <p className="text-2xl font-bold text-dark mt-1">
            {limit}
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

            <input
              type="text"
              placeholder="Search by name, ID, phone or email..."
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

              <p className="text-sm text-red-600 mt-1">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchStudents(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
            >
              <FaSyncAlt />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[850px]">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-4 font-semibold">
                  Student
                </th>

                <th className="px-5 py-4 font-semibold">
                  Student ID
                </th>

                <th className="px-5 py-4 font-semibold">
                  Phone
                </th>

                <th className="px-5 py-4 font-semibold">
                  Course
                </th>

                <th className="px-5 py-4 font-semibold">
                  Batch
                </th>

                <th className="px-5 py-4 font-semibold">
                  Status
                </th>

                <th className="px-5 py-4 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <motion.tr
                      key={`skeleton-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {Array.from({ length: 7 }).map((__, i) => (
                        <td key={i} className="px-5 py-4">
                          <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : students.length > 0 ? (
                  students.map((student) => (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="hover:bg-gray-50/70 transition"
                    >
                      {/* STUDENT */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
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

                          <div className="min-w-0">
                            <p className="font-semibold text-dark truncate">
                              {student.name || 'Unnamed Student'}
                            </p>

                            <p className="text-xs text-gray-400 truncate">
                              {student.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2.5 py-1.5 rounded-lg">
                          {student.studentId || '—'}
                        </span>
                      </td>

                      {/* PHONE */}
                      <td className="px-5 py-4 text-gray-600">
                        {student.phone || '—'}
                      </td>

                      {/* COURSE */}
                      <td className="px-5 py-4 text-gray-600">
                        {getCourseName(student)}
                      </td>

                      {/* BATCH */}
                      <td className="px-5 py-4 text-gray-600">
                        {getBatchName(student)}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                            statusColors[student.status] ||
                            statusColors.inactive
                          }`}
                        >
                          {student.status || 'unknown'}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleView(student)}
                            className="p-2.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition"
                            title="View"
                          >
                            <FaEye className="text-sm" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(student)}
                            className="p-2.5 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/10 transition"
                            title="Edit"
                          >
                            <FaEdit className="text-sm" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(student)}
                            className="p-2.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td
                      colSpan="7"
                      className="px-5 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl mb-4">
                          <FaUserGraduate />
                        </div>

                        <h3 className="font-semibold text-gray-700">
                          No students found
                        </h3>

                        <p className="text-sm text-gray-400 mt-1">
                          Try changing your search or filter.
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && students.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
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
              <span className="font-semibold text-gray-700">
                {total}
              </span>{' '}
              students
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((prev) => Math.max(1, prev - 1))
                }
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
                  setPage((prev) =>
                    Math.min(totalPages, prev + 1)
                  )
                }
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}
      <AnimatePresence>
        {showModal && modalMode !== 'view' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
            >
              {/* MODAL HEADER */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-dark">
                    {modalMode === 'add'
                      ? 'Add New Student'
                      : 'Edit Student'}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    {modalMode === 'add'
                      ? 'Create a new student account and enrollment.'
                      : 'Update student information.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="w-9 h-9 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition"
                >
                  <FaTimes />
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Student Name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />

                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                  />

                  <FormInput
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    required
                  />

                  {modalMode === 'add' && (
                    <FormInput
                      label="Password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleInputChange}
                      placeholder="Leave empty to use phone"
                    />
                  )}

                  <FormInput
                    label="Father Name"
                    name="fatherName"
                    value={form.fatherName}
                    onChange={handleInputChange}
                    required
                  />

                  <FormInput
                    label="Mother Name"
                    name="motherName"
                    value={form.motherName}
                    onChange={handleInputChange}
                    required
                  />

                  <FormInput
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />

                  <FormSelect
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleInputChange}
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />

                  <FormInput
                    label="Education"
                    name="education"
                    value={form.education}
                    onChange={handleInputChange}
                    placeholder="e.g. HSC"
                    required
                  />

                  <FormSelect
                    label="Course"
                    name="course"
                    value={form.course}
                    onChange={handleInputChange}
                    required
                    options={[
                      { value: '', label: 'Select course' },
                      ...courses.map((course) => ({ value: course._id, label: course.title })),
                    ]}
                  />

                  <FormSelect
                    label="Batch"
                    name="batch"
                    value={form.batch}
                    onChange={handleInputChange}
                    required
                    options={[
                      { value: '', label: form.course ? 'Select batch' : 'Select a course first' },
                      ...availableBatches.map((batch) => ({
                        value: batch._id,
                        label: `${batch.name}${batch.status ? ` (${batch.status})` : ''}`,
                      })),
                    ]}
                  />

                  <FormSelect
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'suspended', label: 'Suspended' },
                    ]}
                  />

                  <FormInput
                    label="Photo URL"
                    name="photo"
                    value={form.photo}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      placeholder="Student address"
                      required
                    />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition shadow-lg shadow-primary/20"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        {modalMode === 'add'
                          ? 'Create Student'
                          : 'Save Changes'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================
          VIEW MODAL
      ========================= */}
      <AnimatePresence>
        {showModal && modalMode === 'view' && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
            >
              {/* HEADER */}
              <div className="relative bg-gradient-to-br from-primary to-blue-700 px-6 py-7 text-white">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
                >
                  <FaTimes />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/15 flex items-center justify-center text-xl font-bold">
                    {selectedStudent.photo ? (
                      <img
                        src={selectedStudent.photo}
                        alt={selectedStudent.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(selectedStudent.name)
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedStudent.name}
                    </h2>

                    <p className="text-white/70 text-sm mt-1">
                      {selectedStudent.email}
                    </p>

                    <span className="inline-flex mt-2 px-2.5 py-1 rounded-lg bg-white/15 text-xs font-semibold">
                      {selectedStudent.studentId || 'No ID'}
                    </span>
                  </div>
                </div>
              </div>

              {/* DETAILS */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem
                    label="Phone"
                    value={selectedStudent.phone}
                  />

                  <InfoItem
                    label="Status"
                    value={
                      <span
                        className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                          statusColors[selectedStudent.status] ||
                          statusColors.inactive
                        }`}
                      >
                        {selectedStudent.status || '—'}
                      </span>
                    }
                  />

                  <InfoItem
                    label="Course"
                    value={getCourseName(selectedStudent)}
                  />

                  <InfoItem
                    label="Batch"
                    value={getBatchName(selectedStudent)}
                  />

                  <InfoItem
                    label="Father Name"
                    value={selectedStudent.fatherName}
                  />

                  <InfoItem
                    label="Mother Name"
                    value={selectedStudent.motherName}
                  />

                  <InfoItem
                    label="Date of Birth"
                    value={formatDate(selectedStudent.dateOfBirth)}
                  />

                  <InfoItem
                    label="Gender"
                    value={selectedStudent.gender}
                  />

                  <InfoItem
                    label="Education"
                    value={selectedStudent.education}
                  />

                  <InfoItem
                    label="Created"
                    value={formatDate(selectedStudent.createdAt)}
                  />

                  <div className="sm:col-span-2">
                    <InfoItem
                      label="Address"
                      value={selectedStudent.address}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => openEditModal(selectedStudent)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
                  >
                    <FaEdit />
                    Edit Student
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// FORM INPUT
// ============================================
const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-2">
        {label}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
      />
    </div>
  );
};

// ============================================
// FORM SELECT
// ============================================
const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// ============================================
// INFO ITEM
// ============================================
const InfoItem = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
        {label}
      </p>

      <div className="mt-1 text-sm font-semibold text-gray-700 break-words">
        {value || '—'}
      </div>
    </div>
  );
};

export default Students;