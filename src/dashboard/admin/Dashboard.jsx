import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaLayerGroup,
  FaUserPlus,
  FaMoneyBillWave,
  FaChartLine,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaArrowRight,
  FaSyncAlt,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaChartBar,
  FaSpinner,
  FaDatabase,
} from "react-icons/fa";

import { getAdminDashboardData } from "../../services/adminDashboardService";

// ============================================================
// HELPERS
// ============================================================

const getId = (item, index) =>
  item?._id || item?.id || item?.studentId || item?.applicationId || index;

const getName = (item) => {
  // Handle populated student data
  if (item?.student?.name) return item.student.name;
  if (item?.studentName) return item.studentName;
  if (item?.name) return item.name;
  if (item?.fullName) return item.fullName;
  if (item?.user?.name) return item.user.name;
  if (item?.applicantName) return item.applicantName;
  return "Unknown Student";
};

const getCourseName = (item) => {
  // Handle populated course data
  if (item?.course?.title) return item.course.title;
  if (item?.courseName) return item.courseName;
  if (item?.courseTitle) return item.courseTitle;
  if (item?.course) return typeof item.course === 'string' ? item.course : "Course";
  return "Course not specified";
};

const getStatus = (item) =>
  String(
    item?.status ||
      item?.applicationStatus ||
      item?.paymentStatus ||
      "pending"
  ).toLowerCase();

const getDate = (item) => {
  // Check all possible date fields
  const dateFields = [
    'paymentDate',
    'appliedAt',
    'admissionDate',
    'applicationDate',
    'publishDate',
    'date',
    'createdAt',
    'updatedAt'
  ];
  
  for (const field of dateFields) {
    if (item?.[field]) return item[field];
  }
  return null;
};

const getAmount = (payment) => {
  const amount =
    payment?.amount ??
    payment?.paidAmount ??
    payment?.paymentAmount ??
    payment?.totalAmount ??
    payment?.price ??
    0;

  const numeric = Number(amount);
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatCurrency = (amount) => {
  const value = Number(amount) || 0;

  if (value >= 10000000) {
    return `৳${(value / 10000000).toFixed(2)}Cr`;
  }

  if (value >= 100000) {
    return `৳${(value / 100000).toFixed(2)}L`;
  }

  if (value >= 1000) {
    return `৳${(value / 1000).toFixed(1)}K`;
  }

  return `৳${value.toLocaleString("en-BD")}`;
};

const formatFullCurrency = (amount) => {
  return `৳${(Number(amount) || 0).toLocaleString("en-BD")}`;
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isActive = (item) => {
  const status = String(
    item?.status || item?.studentStatus || item?.isActive || ""
  ).toLowerCase();

  if (item?.isActive === true) return true;

  return [
    "active",
    "approved",
    "enrolled",
    "running",
    "present",
  ].includes(status);
};

// ============================================================
// STATUS CONFIG
// ============================================================

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: FaHourglassHalf,
  },

  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: FaCheckCircle,
  },

  accepted: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: FaCheckCircle,
  },

  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: FaTimesCircle,
  },

  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: FaCheckCircle,
  },

  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: FaCheckCircle,
  },

  partial: {
    label: "Partial",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: FaHourglassHalf,
  },
};

// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  iconBg,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      {/* Background glow */}
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-[0.06] blur-2xl transition-all duration-500 group-hover:scale-150`}
      />

      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
            {value}
          </h3>

          {subtitle && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              {subtitle}
            </div>
          )}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <Icon className="text-lg" />
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:w-full`}
      />
    </motion.div>
  );
};

// ============================================================
// MINI BAR CHART
// ============================================================

const StudentGrowthChart = ({ monthlyData = [] }) => {
  const max = Math.max(
    ...monthlyData.map((item) => item.count || 0),
    1
  );

  return (
    <div className="h-[280px]">
      <div className="flex h-[225px] items-end gap-2 sm:gap-3">
        {monthlyData.map((item, index) => {
          const count = item.count || 0;
          const height =
            count === 0
              ? 4
              : Math.max((count / max) * 100, 8);

          return (
            <div
              key={item.key || index}
              className="group flex h-full flex-1 flex-col justify-end"
            >
              {/* Tooltip */}
              <div className="relative mb-2 flex justify-center opacity-0 transition-all duration-200 group-hover:opacity-100">
                <span className="absolute -top-8 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
                  {count} students
                </span>
              </div>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.03,
                  ease: "easeOut",
                }}
                className="relative w-full overflow-hidden rounded-t-xl bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-300 shadow-sm transition-all duration-300 group-hover:brightness-110"
              >
                <div className="absolute inset-x-0 top-0 h-8 bg-white/20 blur-md" />
              </motion.div>

              <span className="mt-3 text-center text-[10px] font-semibold text-slate-400">
                {item.month || '---'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          New student registrations
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Last 12 months
        </span>
      </div>
    </div>
  );
};

// ============================================================
// RECENT ADMISSIONS
// ============================================================

const RecentAdmissions = ({ admissions }) => {
  const recent = useMemo(() => {
    return [...(admissions || [])]
      .sort(
        (a, b) =>
          new Date(getDate(b) || 0) -
          new Date(getDate(a) || 0)
      )
      .slice(0, 6);
  }, [admissions]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h3 className="font-bold text-slate-800">
            Recent Admissions
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Latest applications from database
          </p>
        </div>

        <Link
          to="/admin/admissions"
          className="group flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          View All
          <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <FaUserPlus className="text-xl text-slate-300" />
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-500">
            No admissions found
          </p>

          <p className="mt-1 text-xs text-slate-400">
            New applications will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recent.map((item, index) => {
            const status = getStatus(item);

            const config =
              statusConfig[status] || statusConfig.pending;

            const StatusIcon = config.icon;

            return (
              <motion.div
                key={getId(item, index)}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                }}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-sm font-black text-blue-600">
                  {getName(item)
                    .charAt(0)
                    .toUpperCase()}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-700">
                    {getName(item)}
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="truncate">
                      {getCourseName(item)}
                    </span>

                    <span>•</span>

                    <span className="whitespace-nowrap">
                      {formatDate(getDate(item))}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`hidden shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold sm:flex ${config.className}`}
                >
                  <StatusIcon className="text-[9px]" />
                  {config.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================
// PAYMENT SUMMARY (সংশোধিত)
// ============================================================

const PaymentSummary = ({ totalAmount = 0, count = 0 }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Payment Overview
          </p>

          <h3 className="mt-2 text-2xl font-black text-slate-800">
            {formatCurrency(totalAmount)}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
          <FaMoneyBillWave />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
        <span className="text-xs text-slate-400">
          Successful transactions
        </span>

        <span className="font-bold text-emerald-600">
          {count.toLocaleString("en-BD")}
        </span>
      </div>

      <Link
        to="/admin/payments"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
      >
        Manage Payments
        <FaArrowRight />
      </Link>
    </div>
  );
};

// ============================================================
// QUICK ACTIONS
// ============================================================

const quickActions = [
  {
    label: "Add Student",
    path: "/admin/students",
    icon: FaUserGraduate,
    className:
      "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white",
  },
  {
    label: "Add Course",
    path: "/admin/courses",
    icon: FaBook,
    className:
      "bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white",
  },
  {
    label: "Admissions",
    path: "/admin/admissions",
    icon: FaUserPlus,
    className:
      "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white",
  },
  {
    label: "Payments",
    path: "/admin/payments",
    icon: FaMoneyBillWave,
    className:
      "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white",
  },
];

// ============================================================
// MAIN DASHBOARD
// ============================================================

const Dashboard = () => {
  const [data, setData] = useState({
    generatedAt: null,
    stats: {
      totalStudents: 0, 
      activeStudents: 0, 
      teachers: 0, 
      courses: 0, 
      batches: 0,
      pendingAdmissions: 0, 
      totalPayments: 0, 
      monthlyRevenue: 0,
      successfulTransactions: 0, 
      monthlyTransactions: 0,
    },
    collectionCounts: {},
    studentGrowth: [],
    recentAdmissions: [],
    recentPayments: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");
      const result = await getAdminDashboardData();

      setData({
        generatedAt: result?.generatedAt || new Date().toISOString(),
        stats: {
          totalStudents: Number(result?.stats?.totalStudents) || 0,
          activeStudents: Number(result?.stats?.activeStudents) || 0,
          teachers: Number(result?.stats?.teachers) || 0,
          courses: Number(result?.stats?.courses) || 0,
          batches: Number(result?.stats?.batches) || 0,
          pendingAdmissions: Number(result?.stats?.pendingAdmissions) || 0,
          totalPayments: Number(result?.stats?.totalPayments) || 0,
          monthlyRevenue: Number(result?.stats?.monthlyRevenue) || 0,
          successfulTransactions: Number(result?.stats?.successfulTransactions) || 0,
          monthlyTransactions: Number(result?.stats?.monthlyTransactions) || 0,
        },
        collectionCounts: result?.collectionCounts || {},
        studentGrowth: Array.isArray(result?.studentGrowth) ? result.studentGrowth : [],
        recentAdmissions: Array.isArray(result?.recentAdmissions) ? result.recentAdmissions : [],
        recentPayments: Array.isArray(result?.recentPayments) ? result.recentPayments : [],
      });
    } catch (err) {
      console.error("Dashboard loading error:", err);
      
      // Better error handling
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          "Unable to load dashboard data from server.";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = data.stats;

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <FaSpinner className="animate-spin text-2xl text-blue-600" />
          </div>

          <h3 className="mt-4 font-bold text-slate-700">
            Loading Dashboard
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Fetching real-time data from database...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && !data.generatedAt) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <FaExclamationTriangle className="text-2xl text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-800">
            Dashboard Data Unavailable
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={() => loadDashboard()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <FaSyncAlt />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // DASHBOARD UI
  // ==========================================================

  return (
    <div className="space-y-6 pb-10">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
              Live Dashboard
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Real-time overview of Open IT Institute.
          </p>
        </div>

        <button
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaSyncAlt
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </motion.div>

      {/* ======================================================
          SERVER WARNING
      ====================================================== */}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700"
          >
            <FaExclamationTriangle />

            <span className="flex-1">
              {error} Some dashboard sections may be unavailable.
            </span>

            <button
              onClick={() => loadDashboard(true)}
              className="font-bold underline"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================
          DATABASE STATUS
      ====================================================== */}

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <FaDatabase className="text-sm" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Data Source
            </p>

            <p className="text-xs font-bold text-slate-700">
              MongoDB / API
            </p>
          </div>
        </div>

        <span className="hidden h-5 w-px bg-slate-200 sm:block" />

        <span className="text-xs text-slate-400">
          Last synced:{" "}
          <strong className="text-slate-600">
            {new Date(data.generatedAt || Date.now()).toLocaleTimeString("en-BD", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </strong>
        </span>
      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString("en-BD")}
          subtitle="Registered students"
          icon={FaUserGraduate}
          gradient="from-blue-600 to-cyan-500"
          delay={0}
        />

        <StatCard
          title="Active Students"
          value={stats.activeStudents.toLocaleString("en-BD")}
          subtitle="Currently active"
          icon={FaUsers}
          gradient="from-emerald-500 to-teal-500"
          delay={0.05}
        />

        <StatCard
          title="Teachers"
          value={stats.teachers.toLocaleString("en-BD")}
          subtitle="Teaching staff"
          icon={FaChalkboardTeacher}
          gradient="from-violet-600 to-purple-500"
          delay={0.1}
        />

        <StatCard
          title="Courses"
          value={stats.courses.toLocaleString("en-BD")}
          subtitle="Available courses"
          icon={FaBook}
          gradient="from-orange-500 to-amber-500"
          delay={0.15}
        />

        <StatCard
          title="Batches"
          value={stats.batches.toLocaleString("en-BD")}
          subtitle="Total batches"
          icon={FaLayerGroup}
          gradient="from-cyan-500 to-blue-500"
          delay={0.2}
        />

        <StatCard
          title="Pending Admissions"
          value={stats.pendingAdmissions.toLocaleString("en-BD")}
          subtitle="Needs attention"
          icon={FaUserPlus}
          gradient="from-amber-500 to-orange-500"
          delay={0.25}
        />

        <StatCard
          title="Total Payments"
          value={formatCurrency(stats.totalPayments)}
          subtitle="Successful payments"
          icon={FaMoneyBillWave}
          gradient="from-emerald-600 to-green-500"
          delay={0.3}
        />

        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          subtitle="Current month"
          icon={FaChartLine}
          gradient="from-rose-500 to-pink-500"
          delay={0.35}
        />

      </div>

      {/* ======================================================
          CHART + PAYMENT
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">

        {/* Student Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaChartBar />
                </div>

                <div>
                  <h3 className="font-black text-slate-800">
                    Student Growth
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    Based on registration dates
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-600 sm:flex">
              <FaArrowUp />
              Live Data
            </div>
          </div>

          <StudentGrowthChart monthlyData={data.studentGrowth} />
        </motion.div>

        {/* Payment - সংশোধিত */}
        <PaymentSummary 
          totalAmount={stats.totalPayments}
          count={stats.successfulTransactions}
        />

      </div>

      {/* ======================================================
          RECENT ADMISSIONS + DATABASE SUMMARY
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">

        <RecentAdmissions admissions={data.recentAdmissions} />

        {/* Database Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-5">
            <h3 className="font-black text-slate-800">
              Database Summary
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Current collection records
            </p>
          </div>

          <div className="space-y-3">

            {[
              {
                label: "Students",
                value: Number(data.collectionCounts.students) || 0,
                icon: FaUserGraduate,
                className: "bg-blue-50 text-blue-600",
              },
              {
                label: "Teachers",
                value: Number(data.collectionCounts.teachers) || 0,
                icon: FaChalkboardTeacher,
                className: "bg-purple-50 text-purple-600",
              },
              {
                label: "Courses",
                value: Number(data.collectionCounts.courses) || 0,
                icon: FaBook,
                className: "bg-orange-50 text-orange-600",
              },
              {
                label: "Batches",
                value: Number(data.collectionCounts.batches) || 0,
                icon: FaLayerGroup,
                className: "bg-cyan-50 text-cyan-600",
              },
              {
                label: "Admissions",
                value: Number(data.collectionCounts.admissions) || 0,
                icon: FaUserPlus,
                className: "bg-amber-50 text-amber-600",
              },
              {
                label: "Payments",
                value: Number(data.collectionCounts.payments) || 0,
                icon: FaMoneyBillWave,
                className: "bg-emerald-50 text-emerald-600",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.className}`}
                  >
                    <Icon className="text-sm" />
                  </div>

                  <span className="flex-1 text-xs font-semibold text-slate-500">
                    {item.label}
                  </span>

                  <span className="text-sm font-black text-slate-800">
                    {item.value.toLocaleString("en-BD")}
                  </span>
                </div>
              );
            })}

          </div>
        </motion.div>

      </div>

      {/* ======================================================
          QUICK ACTIONS
      ====================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="mb-5">
          <h3 className="font-black text-slate-800">
            Quick Actions
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Manage your institute quickly
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                to={action.path}
                className={`group flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-xs font-bold transition-all duration-300 ${action.className}`}
              >
                <Icon className="transition-transform group-hover:scale-110" />

                {action.label}

                <FaArrowRight className="ml-auto hidden text-[9px] transition-transform group-hover:translate-x-1 sm:block" />
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ======================================================
          FOOTER STATUS
      ====================================================== */}

      <div className="flex flex-col items-center justify-between gap-2 px-2 text-[10px] text-slate-400 sm:flex-row">
        <span>
          © {new Date().getFullYear()} Open IT Institute
        </span>

        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Dashboard connected
        </span>
      </div>

    </div>
  );
};

export default Dashboard;