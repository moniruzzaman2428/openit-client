import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaExpand,
  FaGraduationCap,
  FaIdBadge,
  FaLayerGroup,
  FaPhoneAlt,
  FaQuoteLeft,
  FaShieldAlt,
  FaStar,
  FaTimes,
  FaUserGraduate,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

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
    month: 'long',
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

const parseExpertise = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim());
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const statusStyles = {
  active: {
    badge: 'border-emerald-200/60 bg-emerald-50 text-emerald-700',
    soft: 'bg-emerald-500',
    label: 'Active',
  },
  inactive: {
    badge: 'border-slate-200/60 bg-slate-100 text-slate-700',
    soft: 'bg-slate-500',
    label: 'Inactive',
  },
  completed: {
    badge: 'border-sky-200/60 bg-sky-50 text-sky-700',
    soft: 'bg-sky-500',
    label: 'Completed',
  },
  suspended: {
    badge: 'border-rose-200/60 bg-rose-50 text-rose-700',
    soft: 'bg-rose-500',
    label: 'Suspended',
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const StudentProfileDetails = () => {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get(`/students/${id}`);
        const loadedStudent =
          response?.data?.data?.student ||
          response?.data?.student ||
          response?.data?.data;

        setStudent(loadedStudent);
      } catch (err) {
        console.error('Student profile error:', err);
        setError(
          err?.response?.data?.message || 'Unable to load student profile.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') setShowPhoto(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const profile = useMemo(() => {
    if (!student) return null;

    const rawStatus = String(student.status || 'active').toLowerCase();
    const status = statusStyles[rawStatus] ? rawStatus : 'active';

    const fullName = student.name || 'Unnamed Student';
    const course = getCourseName(student);
    const batch = getBatchName(student);
    const admissionDate = formatDate(student.admissionDate);

    const bio =
      student.about ||
      student.bio ||
      student.description ||
      student.shortBio ||
      `${fullName} is an enrolled student of Open IT Institute. This profile highlights the student's academic information, enrollment record, and current status in a clean professional view.`;

    const expertise = parseExpertise(
      student.expertise || student.skills || student.specialties
    );

    const fallbackExpertise = [course, batch, 'Student Profile', 'Verified Record']
      .filter(Boolean)
      .filter((item) => item !== 'Not provided');

    return {
      fullName,
      photo: student.photo || '',
      studentId: student.studentId || student.id || 'N/A',
      status,
      statusConfig: statusStyles[status],
      course,
      batch,
      admissionDate,
      institute: student.institute || 'Open IT Institute',
      designation:
        student.designation || student.role || 'Enrolled Student',
      email: student.email || student.contactEmail || 'Not provided',
      phone: student.phone || student.mobile || student.contactNumber || 'Not provided',
      bio,
      expertise: expertise.length ? expertise : fallbackExpertise,
    };
  }, [student]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[76vh] max-w-7xl items-center justify-center">
          <div className="w-full max-w-md rounded-[2rem] border border-white bg-white/90 p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div className="relative mx-auto h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
            </div>
            <h2 className="mt-6 text-xl font-black tracking-tight text-slate-900">
              Loading Profile
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Please wait while we prepare the profile details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student || !profile) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[76vh] max-w-7xl items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-[2rem] border border-white bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)]"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-500">
              <FaUserGraduate className="text-3xl" />
            </div>
            <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
              Profile Not Found
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error || 'This profile is unavailable right now.'}
            </p>
            <Link
              to="/student-info"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-600"
            >
              <FaArrowLeft />
              Back to Students
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-[#f4f7fb]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-[-140px] h-[360px] w-[360px] rounded-full bg-blue-300/25 blur-[110px]" />
          <div className="absolute right-[-160px] top-[16%] h-[420px] w-[420px] rounded-full bg-cyan-300/25 blur-[120px]" />
          <div className="absolute bottom-[-160px] left-[24%] h-[380px] w-[380px] rounded-full bg-indigo-300/20 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.35 }}
            className="mb-5 flex flex-wrap items-center justify-between gap-3"
          >
            <Link
              to="/student-info"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-x-0.5 hover:border-blue-200 hover:text-blue-600"
            >
              <FaArrowLeft className="text-xs" />
              All Students
            </Link>

            <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 shadow-sm backdrop-blur-xl">
              Professional Detail View
            </div>
          </motion.div>

          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.05 }}
            className="overflow-hidden rounded-[2rem] border border-white/90 bg-white/70 shadow-[0_35px_120px_rgba(15,23,42,0.10)] backdrop-blur-xl"
          >
            <div className="grid lg:grid-cols-[380px_minmax(0,1fr)]">
              <aside className="relative overflow-hidden bg-[linear-gradient(180deg,#07162f_0%,#0a2c5f_42%,#0f7ad9_100%)] p-5 text-white sm:p-7 lg:min-h-[860px] lg:p-8">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full border-[40px] border-white/10" />
                  <div className="absolute -left-16 bottom-16 h-56 w-56 rounded-full border-[35px] border-cyan-200/10" />
                  <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
                      backgroundSize: '34px 34px',
                    }}
                  />
                </div>

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-blue-50 backdrop-blur-xl">
                      <FaShieldAlt className="text-cyan-200" />
                      Verified Profile
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] ${profile.statusConfig.badge}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${profile.statusConfig.soft}`} />
                      {profile.statusConfig.label}
                    </span>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => profile.photo && setShowPhoto(true)}
                    disabled={!profile.photo}
                    className={`group relative mx-auto mt-8 block ${
                      profile.photo ? 'cursor-zoom-in' : 'cursor-default'
                    }`}
                  >
                    <div className="absolute inset-[-16px] rounded-[2.2rem] bg-cyan-300/20 blur-2xl" />
                    <div className="relative h-[330px] w-[260px] overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.30)] backdrop-blur-xl sm:h-[360px] sm:w-[280px]">
                      {profile.photo ? (
                        <>
                          <img
                            src={profile.photo}
                            alt={profile.fullName}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 transition duration-300 group-hover:bg-slate-950/20">
                            <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-white/90 text-blue-700 opacity-0 shadow-lg transition duration-300 group-hover:scale-100 group-hover:opacity-100">
                              <FaExpand />
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100/90 via-cyan-100/80 to-white/80">
                          <span className="text-7xl font-black tracking-tight text-blue-700">
                            {getInitials(profile.fullName)}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.button>

                  <div className="mt-7 text-center">
                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-[2.1rem]">
                      {profile.fullName}
                    </h1>
                    <p className="mt-2 text-sm font-semibold text-cyan-100/95">
                      {profile.designation}
                    </p>
                    <p className="mt-1 text-sm text-blue-100/80">
                      {profile.institute}
                    </p>
                  </div>

                  <div className="mt-7 grid gap-3">
                    <StatCard label="Student ID" value={profile.studentId} />
                    <StatCard label="Enrolled Course" value={profile.course} />
                    <StatCard label="Assigned Batch" value={profile.batch} />
                    <StatCard label="Admission Date" value={profile.admissionDate} />
                  </div>

                  <div className="mt-auto pt-7">
                    <div className="rounded-[1.7rem] border border-white/12 bg-white/10 p-4 backdrop-blur-xl">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-cyan-200">
                          <FaCheckCircle />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">
                            Profile Authenticity
                          </p>
                          <p className="mt-1 text-xs leading-6 text-blue-100/78">
                            This profile is presented in a premium verified layout and is based on the enrollment information available in your system.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="p-5 sm:p-7 lg:p-9 xl:p-10">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                      Professional Profile
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-[2.15rem]">
                      About {profile.fullName}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                      A polished and executive-style detail page designed for a modern institute dashboard.
                    </p>
                  </div>

                  <Link
                    to="/student-info"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-950 hover:text-white"
                    aria-label="Close"
                  >
                    <FaTimes />
                  </Link>
                </div>

                <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="space-y-6">
                    <Panel>
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <FaQuoteLeft />
                        </div>
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-slate-900">
                            Profile Summary
                          </h3>
                          <p className="mt-3 text-[15px] leading-8 text-slate-600">
                            {profile.bio}
                          </p>
                        </div>
                      </div>
                    </Panel>

                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                          <FaStar className="text-sm" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-slate-900">
                            Professional Expertise
                          </h3>
                          <p className="text-xs font-medium text-slate-400">
                            Highlighted profile categories
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {profile.expertise.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="group flex items-center gap-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_35px_rgba(37,99,235,0.08)]"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                              <FaCheckCircle className="text-xs" />
                            </div>
                            <p className="text-sm font-bold text-slate-700">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
                          <FaGraduationCap className="text-sm" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-slate-900">
                            Academic Information
                          </h3>
                          <p className="text-xs font-medium text-slate-400">
                            Enrollment and academic record
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <InfoCard icon={FaIdBadge} label="Student ID" value={profile.studentId} />
                        <InfoCard icon={FaBookOpen} label="Course" value={profile.course} />
                        <InfoCard icon={FaLayerGroup} label="Batch" value={profile.batch} />
                        <InfoCard icon={FaCalendarAlt} label="Admission Date" value={profile.admissionDate} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <Panel className="bg-gradient-to-br from-slate-50 to-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                          <FaEnvelope />
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                            Email
                          </p>
                          <p className="mt-1 break-all text-sm font-extrabold text-slate-700">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                    </Panel>

                    <Panel className="bg-gradient-to-br from-slate-50 to-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                          <FaPhoneAlt />
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                            Contact Number
                          </p>
                          <p className="mt-1 text-sm font-extrabold text-slate-700">
                            {profile.phone}
                          </p>
                        </div>
                      </div>
                    </Panel>

                    <Panel className="bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_45%,#ecfeff_100%)]">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
                          <FaShieldAlt />
                        </div>
                        <div>
                          <h3 className="text-base font-black tracking-tight text-slate-900">
                            Verification Note
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            This detail page confirms the profile belongs to an enrolled student of {profile.institute}. The information displayed here reflects the available record in your management system.
                          </p>
                        </div>
                      </div>
                    </Panel>

                    <div className="rounded-[1.7rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-300">
                        Quick Overview
                      </p>
                      <div className="mt-4 space-y-3">
                        <QuickRow label="Institute" value={profile.institute} />
                        <QuickRow label="Status" value={profile.statusConfig.label} />
                        <QuickRow label="Course" value={profile.course} />
                        <QuickRow label="Batch" value={profile.batch} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {showPhoto && profile.photo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPhoto(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
          >
            <motion.button
              type="button"
              onClick={() => setShowPhoto(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
              aria-label="Close image"
            >
              <FaTimes />
            </motion.button>

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[92vh] max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 p-2 shadow-2xl"
            >
              <img
                src={profile.photo}
                alt={profile.fullName}
                className="max-h-[84vh] max-w-full rounded-[1.5rem] object-contain"
              />

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white backdrop-blur-xl">
                <p className="font-bold">{profile.fullName}</p>
                <p className="mt-0.5 text-xs text-slate-300">
                  {profile.studentId}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Panel = ({ children, className = '' }) => (
  <div
    className={`rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.04)] ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 backdrop-blur-xl">
    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-100/70">
      {label}
    </p>
    <p className="mt-1 text-sm font-extrabold text-white" title={value || 'Not provided'}>
      {value || 'Not provided'}
    </p>
  </div>
);

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="group rounded-[1.45rem] border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(37,99,235,0.08)]">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition group-hover:bg-blue-50 group-hover:text-blue-600">
        <Icon />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-extrabold text-slate-700" title={value || 'Not provided'}>
          {value || 'Not provided'}
        </p>
      </div>
    </div>
  </div>
);

const QuickRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3">
    <span className="text-xs font-bold text-slate-400">{label}</span>
    <span className="max-w-[65%] text-right text-xs font-extrabold text-white">
      {value || 'Not provided'}
    </span>
  </div>
);

export default StudentProfileDetails;