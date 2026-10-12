// ============================================================
// FILE: src/components/students/studentShared.jsx
// Helpers + small components shared by StudentInfo (list)
// and StudentProfileDetails (profile).
// ============================================================
import { useEffect, useState } from 'react';

// ------------------------------------------------------------
// Data helpers
// ------------------------------------------------------------

export const getCourseName = (student) => {
  const course = student?.course;
  if (!course) return 'Not assigned';
  if (typeof course === 'string') return course;
  return course.title || course.name || course.courseName || 'Not assigned';
};

export const getBatchName = (student) => {
  const batch = student?.batch;
  if (!batch) return 'Not assigned';
  if (typeof batch === 'string') return batch;
  return batch.name || batch.title || batch.batchName || 'Not assigned';
};

export const formatDate = (date, month = 'short') => {
  if (!date) return 'Not available';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Not available';
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month,
    year: 'numeric',
  });
};

export const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 'ST';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

// ------------------------------------------------------------
// Status
// ------------------------------------------------------------

export const STATUS_CONFIG = {
  active: {
    label: 'Active',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  inactive: {
    label: 'Inactive',
    dot: 'bg-slate-400',
    badge: 'bg-slate-50 text-slate-600 ring-slate-200',
  },
  completed: {
    label: 'Completed',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 ring-blue-200',
  },
  suspended: {
    label: 'Suspended',
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
  },
};

export const getStatusConfig = (status) => {
  const key = String(status || 'active').toLowerCase();
  return STATUS_CONFIG[key] || STATUS_CONFIG.active;
};

export const StatusBadge = ({ status, className = '' }) => {
  const config = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${config.badge} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

// ------------------------------------------------------------
// Avatar (photo with automatic fallback to initials)
// ------------------------------------------------------------

export const StudentAvatar = ({
  photo,
  name,
  className = 'h-14 w-14 rounded-2xl',
  textClass = 'text-lg',
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [photo]);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-[#0F4C81]/10 ring-1 ring-slate-200 ${className}`}
    >
      {photo && !failed ? (
        <img
          src={photo}
          alt={name || 'Student'}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className={`font-bold text-[#0F4C81] ${textClass}`}>
          {getInitials(name)}
        </span>
      )}
    </div>
  );
};
