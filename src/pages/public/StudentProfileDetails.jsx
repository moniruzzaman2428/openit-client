// ============================================================
// FILE: StudentProfileDetails.jsx  (single student profile)
// Requires: src/components/students/studentShared.jsx
//
// IMPORTANT: this page now calls  GET /students/info/:id
// (the same family of endpoint as the list page, /students/info).
// The old call  GET /students/:id  is admin-only on your server,
// which is why normal users saw "Access denied".
// See studentInfo.backend.example.js for the route to add.
// ============================================================
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaBookOpen,
  FaCalendarAlt,
  FaEnvelope,
  FaExclamationTriangle,
  FaExpand,
  FaIdBadge,
  FaLayerGroup,
  FaLock,
  FaPhoneAlt,
  FaRedo,
  FaTimes,
  FaUserGraduate,
} from 'react-icons/fa';

import api from '../../services/api';
import {
  StatusBadge,
  StudentAvatar,
  formatDate,
  getBatchName,
  getCourseName,
} from '../../components/student/studentShared';

const PROFILE_ENDPOINT = (id) => `/students/info/${id}`;

const parseList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map((v) => String(v).trim());
  if (typeof value === 'string') {
    return value.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

// ============================================================
// SMALL PIECES
// ============================================================

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81]/10 text-[#0F4C81]">
      <Icon />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 break-words text-sm font-semibold text-slate-900">{value || 'Not provided'}</p>
    </div>
  </div>
);

const PageState = ({ icon: Icon, tone, title, message, children }) => (
  <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-xl ${tone}`}>
        <Icon />
      </div>
      <h1 className="mt-4 text-xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  </div>
);

const BackLink = ({ className = '' }) => (
  <Link
    to="/student-info"
    className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 ${className}`}
  >
    <FaArrowLeft className="text-xs" />
    All students
  </Link>
);

const PhotoPreview = ({ name, photo, studentId, onClose }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo of ${name}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close photo"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <FaTimes />
      </button>

      <motion.figure
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <img src={photo} alt={name} className="max-h-[75vh] w-full bg-slate-100 object-contain" />
        <figcaption className="px-5 py-3">
          <p className="font-semibold text-slate-900">{name}</p>
          <p className="font-mono text-sm text-slate-500">{studentId}</p>
        </figcaption>
      </motion.figure>
    </motion.div>
  );
};

// ============================================================
// PAGE
// ============================================================

const StudentProfileDetails = () => {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // { status, message }
  const [showPhoto, setShowPhoto] = useState(false);

  const requestId = useRef(0);

  const loadStudent = useCallback(async () => {
    if (!id) return;
    const current = (requestId.current += 1);

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(PROFILE_ENDPOINT(id));
      if (current !== requestId.current) return;

      const loaded =
        response?.data?.data?.student ||
        response?.data?.student ||
        response?.data?.data;

      if (!loaded || typeof loaded !== 'object') {
        setError({ status: 404, message: '' });
        setStudent(null);
        return;
      }

      setStudent(loaded);
    } catch (err) {
      if (current !== requestId.current) return;
      console.error('Student profile error:', err);
      setStudent(null);
      setError({
        status: err?.response?.status || 0,
        message: err?.response?.data?.message || '',
      });
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStudent();
    window.scrollTo({ top: 0 });
  }, [loadStudent]);

  const closePhoto = useCallback(() => setShowPhoto(false), []);

  const profile = useMemo(() => {
    if (!student) return null;

    const fullName = student.name || 'Unnamed Student';
    const course = getCourseName(student);
    const institute = student.institute || 'Open IT Institute';
    const email = student.email || student.contactEmail || '';
    const phone = student.phone || student.mobile || student.contactNumber || '';

    const bio =
      student.about ||
      student.bio ||
      student.description ||
      student.shortBio ||
      (course !== 'Not assigned'
        ? `${fullName} is a student of ${institute}, enrolled in ${course}.`
        : `${fullName} is a student of ${institute}.`);

    return {
      fullName,
      photo: student.photo || '',
      studentId: student.studentId || student.id || 'N/A',
      status: student.status,
      course,
      batch: getBatchName(student),
      admissionDate: formatDate(student.admissionDate, 'long'),
      institute,
      designation: student.designation || student.role || 'Student',
      email,
      phone,
      bio,
      skills: parseList(student.expertise || student.skills || student.specialties),
    };
  }, [student]);

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8" aria-busy="true">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-10 w-36 rounded-xl bg-slate-200" />
          <div className="h-44 rounded-2xl bg-slate-200" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-64 rounded-2xl bg-slate-200 lg:col-span-2" />
            <div className="h-40 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ERRORS ----------------
  if (error || !profile) {
    const status = error?.status;

    if (status === 401 || status === 403) {
      return (
        <PageState
          icon={FaLock}
          tone="bg-amber-50 text-amber-600"
          title="Access restricted"
          message="You do not have permission to view this profile. Please sign in with an account that can view student information, or contact an administrator."
        >
          <BackLink />
        </PageState>
      );
    }

    if (status === 404) {
      return (
        <PageState
          icon={FaUserGraduate}
          tone="bg-slate-100 text-slate-400"
          title="Profile not found"
          message="This student profile does not exist or may have been removed."
        >
          <BackLink />
        </PageState>
      );
    }

    return (
      <PageState
        icon={FaExclamationTriangle}
        tone="bg-rose-50 text-rose-500"
        title="Could not load profile"
        message={error?.message || 'Something went wrong. Please check your connection and try again.'}
      >
        <button
          type="button"
          onClick={loadStudent}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3b64]"
        >
          <FaRedo className="text-xs" /> Try again
        </button>
        <BackLink />
      </PageState>
    );
  }

  const hasContact = Boolean(profile.email || profile.phone);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <BackLink />

        {/* Header card */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#0b3b64] to-[#0F4C81] sm:h-32" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end">
              <button
                type="button"
                onClick={() => profile.photo && setShowPhoto(true)}
                disabled={!profile.photo}
                aria-label={profile.photo ? `View photo of ${profile.fullName}` : `${profile.fullName} has no photo`}
                className={`group relative w-fit rounded-3xl ring-4 ring-white focus:outline-none focus-visible:ring-[#0F4C81] ${
                  profile.photo ? 'cursor-zoom-in' : 'cursor-default'
                }`}
              >
                <StudentAvatar
                  photo={profile.photo}
                  name={profile.fullName}
                  className="h-28 w-28 rounded-3xl sm:h-32 sm:w-32"
                  textClass="text-4xl"
                />
                {profile.photo && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-3xl bg-slate-950/0 text-white opacity-0 transition group-hover:bg-slate-950/30 group-hover:opacity-100">
                    <FaExpand />
                  </span>
                )}
              </button>

              <div className="min-w-0 flex-1 sm:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {profile.fullName}
                  </h1>
                  <StatusBadge status={profile.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {profile.designation} · {profile.institute}
                </p>
                <p className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-700">
                  <FaIdBadge className="text-[#0F4C81]" />
                  {profile.studentId}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className={`mt-6 grid gap-6 ${hasContact ? 'lg:grid-cols-[minmax(0,1fr)_300px]' : ''}`}>
          <div className="space-y-6">
            {/* About */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">About</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-slate-600">{profile.bio}</p>
            </section>

            {/* Academic */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Academic information</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoItem icon={FaIdBadge} label="Student ID" value={profile.studentId} />
                <InfoItem icon={FaBookOpen} label="Course" value={profile.course} />
                <InfoItem icon={FaLayerGroup} label="Batch" value={profile.batch} />
                <InfoItem icon={FaCalendarAlt} label="Admission date" value={profile.admissionDate} />
              </div>
            </section>

            {/* Skills (only when the student has any) */}
            {profile.skills.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Contact (shown only when the server returns it) */}
          {hasContact && (
            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
                <div className="mt-4 space-y-3">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81] text-white">
                        <FaEnvelope />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-slate-500">Email</span>
                        <span className="block break-all text-sm font-semibold text-slate-800">
                          {profile.email}
                        </span>
                      </span>
                    </a>
                  )}

                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white">
                        <FaPhoneAlt />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-slate-500">Phone</span>
                        <span className="block text-sm font-semibold text-slate-800">{profile.phone}</span>
                      </span>
                    </a>
                  )}
                </div>
              </section>
            </aside>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showPhoto && profile.photo && (
          <PhotoPreview
            key="photo"
            name={profile.fullName}
            photo={profile.photo}
            studentId={profile.studentId}
            onClose={closePhoto}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentProfileDetails;
