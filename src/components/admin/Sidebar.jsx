import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaLayerGroup,
  FaUserPlus,
  FaClipboardCheck,
  FaFileAlt,
  FaTrophy,
  FaMoneyBillWave,
  FaReceipt,
  FaCertificate,
  FaBullhorn,
  FaImages,
  FaQuoteLeft,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaHome,
  FaChevronRight,
  FaShieldAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";


/* =========================================================
   MENU ITEMS
========================================================= */

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: FaTachometerAlt,
  },
  {
    name: "Students",
    path: "/admin/students",
    icon: FaUserGraduate,
  },
  {
    name: "Teachers",
    path: "/admin/teachers",
    icon: FaChalkboardTeacher,
  },
  {
    name: "Courses",
    path: "/admin/courses",
    icon: FaBook,
  },
  {
    name: "Batches",
    path: "/admin/batches",
    icon: FaLayerGroup,
  },
  {
    name: "Admissions",
    path: "/admin/admissions",
    icon: FaUserPlus,
  },
  {
    name: "Attendance",
    path: "/admin/attendance",
    icon: FaClipboardCheck,
  },
  {
    name: "Exams",
    path: "/admin/exams",
    icon: FaFileAlt,
  },
  {
    name: "Results",
    path: "/admin/results",
    icon: FaTrophy,
  },
  {
    name: "Payments",
    path: "/admin/payments",
    icon: FaMoneyBillWave,
  },
  {
    name: "Receipts",
    path: "/admin/receipts",
    icon: FaReceipt,
  },
  {
    name: "Certificates",
    path: "/admin/certificates",
    icon: FaCertificate,
  },
  {
    name: "Notices",
    path: "/admin/notices",
    icon: FaBullhorn,
  },
  {
    name: "Gallery",
    path: "/admin/gallery",
    icon: FaImages,
  },
  {
    name: "Testimonials",
    path: "/admin/testimonials",
    icon: FaQuoteLeft,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: FaCog,
  },
  {
    name: "Profile",
    path: "/admin/profile",
    icon: FaUser,
  },
];


/* =========================================================
   SIDEBAR
========================================================= */

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();


  /* =======================================================
     GO HOME
  ======================================================== */

  const goToHomePage = () => {
    navigate("/");
    onClose?.();
  };


  /* =======================================================
     LOGOUT
  ======================================================== */

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login", {
        replace: true,
      });

      onClose?.();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  /* =======================================================
     USER INITIAL
  ======================================================== */

  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }

    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "A";
  };


  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>


      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : 0,
        }}
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[270px]
          flex-col
          overflow-hidden
          border-r
          border-white/[0.07]
          bg-[#07111f]
          text-gray-300
          shadow-[10px_0_50px_rgba(0,0,0,0.25)]
          transition-transform
          duration-300
          ease-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* ===================================================
            BACKGROUND GLOW
        ==================================================== */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-blue-600/10 blur-[90px]" />


        {/* ===================================================
            LOGO HEADER
        ==================================================== */}

        <div className="relative flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.07] px-5">

          <div className="flex items-center gap-3">

            {/* Logo */}

            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: 2,
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 shadow-[0_0_25px_rgba(34,211,238,0.08)]"
            >

              <div className="absolute inset-1 rounded-lg border border-white/[0.05]" />

              <span className="relative text-sm font-black tracking-tight text-cyan-300">
                OI
              </span>

            </motion.div>


            {/* Brand */}

            <div>

              <h1 className="text-[14px] font-extrabold tracking-wide text-white">
                OPEN IT
              </h1>

              <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.22em] text-cyan-400/70">
                Admin Panel
              </p>

            </div>

          </div>


          {/* Mobile Close */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <FaTimes />
          </button>

        </div>


        {/* ===================================================
            ADMIN PROFILE
        ==================================================== */}

        <div className="relative shrink-0 border-b border-white/[0.07] px-4 py-4">

          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3">

            {/* Avatar */}

            <div className="relative shrink-0">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-black text-white shadow-lg shadow-cyan-500/10">
                {getInitial()}
              </div>

              {/* Online */}

              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#07111f] bg-emerald-400" />

            </div>


            {/* User */}

            <div className="min-w-0 flex-1">

              <p className="truncate text-[12px] font-bold text-white">
                {user?.name || "Administrator"}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-gray-500">
                {user?.email || "admin@openitinstitute.com"}
              </p>

            </div>


            {/* Shield */}

            <FaShieldAlt className="shrink-0 text-xs text-emerald-400/60" />

          </div>

        </div>


        {/* ===================================================
            NAVIGATION TITLE
        ==================================================== */}

        <div className="shrink-0 px-5 pb-2 pt-4">

          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-600">
            Management
          </p>

        </div>


        {/* ===================================================
            NAVIGATION
        ==================================================== */}

        <nav
          className="
            sidebar-scrollbar
            relative
            flex-1
            overflow-y-auto
            px-3
            pb-28
          "
        >

          <div className="space-y-1">

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    group
                    relative
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-[10px]
                    text-[12px]
                    font-semibold
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-cyan-300"
                        : "text-gray-500 hover:bg-white/[0.035] hover:text-gray-200"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator */}

                      {isActive && (
                        <motion.span
                          layoutId="activeSidebarIndicator"
                          className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-300 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                        />
                      )}


                      {/* Icon Box */}

                      <span
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition-all
                          duration-200
                          ${
                            isActive
                              ? "bg-cyan-400/10 text-cyan-300"
                              : "bg-white/[0.025] text-gray-500 group-hover:bg-white/[0.06] group-hover:text-gray-300"
                          }
                        `}
                      >
                        <Icon className="text-[13px]" />
                      </span>


                      {/* Name */}

                      <span className="flex-1 truncate">
                        {item.name}
                      </span>


                      {/* Arrow */}

                      <FaChevronRight
                        className={`
                          text-[8px]
                          transition-all
                          duration-200
                          ${
                            isActive
                              ? "translate-x-0 text-cyan-400/70 opacity-100"
                              : "-translate-x-1 text-gray-700 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }
                        `}
                      />

                    </>
                  )}
                </NavLink>
              );

            })}

          </div>

        </nav>


        {/* ===================================================
            BOTTOM ACTION AREA
        ==================================================== */}

        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/[0.07] bg-[#07111f]/95 p-3 backdrop-blur-xl">

          {/* Homepage */}

          <button
            type="button"
            onClick={goToHomePage}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-gray-500 transition-all duration-200 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
          >

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-gray-500 transition group-hover:bg-cyan-400/10 group-hover:text-cyan-300">
              <FaHome className="text-[12px]" />
            </span>

            <span className="flex-1 text-left">
              Go to Homepage
            </span>

            <FaChevronRight className="text-[8px] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />

          </button>


          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-gray-500 transition-all duration-200 hover:bg-red-500/[0.07] hover:text-red-400"
          >

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-gray-500 transition group-hover:bg-red-500/10 group-hover:text-red-400">
              <FaSignOutAlt className="text-[12px]" />
            </span>

            <span className="flex-1 text-left">
              Logout
            </span>

            <FaChevronRight className="text-[8px] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />

          </button>

        </div>

      </motion.aside>


      {/* =====================================================
          CUSTOM SCROLLBAR
      ====================================================== */}

      <style>{`
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
        }

        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.25);
        }

        .sidebar-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
      `}</style>
    </>
  );
};


export default Sidebar;