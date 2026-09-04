import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaTachometerAlt,
  FaUser,
  FaBook,
  FaLayerGroup,
  FaCalendarAlt,
  FaClipboardCheck,
  FaFileAlt,
  FaTrophy,
  FaMoneyBillWave,
  FaBullhorn,
  FaCertificate,
  FaKey,
  FaSignOutAlt,
  FaTimes,
  FaHome,
  FaChevronRight,
  FaGraduationCap,
  FaShieldAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";


/* =========================================================
   STUDENT MENU
========================================================= */

const menuItems = [
  {
    name: "Dashboard",
    path: "/student/dashboard",
    icon: FaTachometerAlt,
  },
  {
    name: "My Profile",
    path: "/student/profile",
    icon: FaUser,
  },
  {
    name: "My Course",
    path: "/student/course",
    icon: FaBook,
  },
  {
    name: "My Batch",
    path: "/student/batch",
    icon: FaLayerGroup,
  },
  {
    name: "Class Routine",
    path: "/student/routine",
    icon: FaCalendarAlt,
  },
  {
    name: "Attendance",
    path: "/student/attendance",
    icon: FaClipboardCheck,
  },
  {
    name: "Exams",
    path: "/student/exams",
    icon: FaFileAlt,
  },
  {
    name: "Results",
    path: "/student/results",
    icon: FaTrophy,
  },
  {
    name: "Payments",
    path: "/student/payments",
    icon: FaMoneyBillWave,
  },
  {
    name: "Notices",
    path: "/student/notices",
    icon: FaBullhorn,
  },
  {
    name: "Certificate",
    path: "/student/certificate",
    icon: FaCertificate,
  },
  {
    name: "Change Password",
    path: "/student/change-password",
    icon: FaKey,
  },
];


/* =========================================================
   SIDEBAR
========================================================= */

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();


  /* =======================================================
     HOME
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

    return "S";
  };


  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-40
              bg-black/60
              backdrop-blur-sm
              lg:hidden
            "
          />
        )}
      </AnimatePresence>


      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
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

        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-[90px]" />


        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="relative flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.07] px-5">

          <div className="flex items-center gap-3">

            {/* Student Logo */}

            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: 2,
              }}
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-emerald-400/20
                bg-gradient-to-br
                from-emerald-400/20
                to-cyan-500/20
                shadow-[0_0_25px_rgba(52,211,153,0.08)]
              "
            >

              <div className="absolute inset-1 rounded-lg border border-white/[0.05]" />

              <FaGraduationCap className="relative text-sm text-emerald-300" />

            </motion.div>


            {/* Brand */}

            <div>

              <h1 className="text-[14px] font-extrabold tracking-wide text-white">
                OPEN IT
              </h1>

              <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-emerald-400/70">
                Student Portal
              </p>

            </div>

          </div>


          {/* Mobile Close */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-white/5
              hover:text-white
              lg:hidden
            "
          >
            <FaTimes />
          </button>

        </div>


        {/* ===================================================
            STUDENT PROFILE
        ==================================================== */}

        <div className="relative shrink-0 border-b border-white/[0.07] px-4 py-4">

          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-white/[0.06]
              bg-white/[0.025]
              p-3
            "
          >

            {/* Avatar */}

            <div className="relative shrink-0">

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-emerald-400
                  to-cyan-500
                  text-sm
                  font-black
                  text-[#06111d]
                  shadow-lg
                  shadow-emerald-500/10
                "
              >
                {getInitial()}
              </motion.div>


              {/* Online Status */}

              <span
                className="
                  absolute
                  -bottom-0.5
                  -right-0.5
                  h-3
                  w-3
                  rounded-full
                  border-2
                  border-[#07111f]
                  bg-emerald-400
                "
              />

            </div>


            {/* Student Info */}

            <div className="min-w-0 flex-1">

              <p className="truncate text-[12px] font-bold text-white">
                {user?.name || "Student"}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-gray-500">
                {user?.email || "Student Account"}
              </p>

            </div>


            {/* Verified */}

            <FaShieldAlt className="shrink-0 text-xs text-emerald-400/60" />

          </div>

        </div>


        {/* ===================================================
            NAVIGATION TITLE
        ==================================================== */}

        <div className="shrink-0 px-5 pb-2 pt-4">

          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-600">
            Student Menu
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
                        ? "bg-gradient-to-r from-emerald-400/15 via-cyan-400/10 to-transparent text-emerald-300"
                        : "text-gray-500 hover:bg-white/[0.035] hover:text-gray-200"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}

                      {isActive && (
                        <motion.span
                          layoutId="studentActiveSidebar"
                          className="
                            absolute
                            left-0
                            top-1/2
                            h-6
                            w-[3px]
                            -translate-y-1/2
                            rounded-r-full
                            bg-gradient-to-b
                            from-emerald-300
                            to-cyan-400
                            shadow-[0_0_12px_rgba(52,211,153,0.5)]
                          "
                        />
                      )}


                      {/* Icon */}

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
                              ? "bg-emerald-400/10 text-emerald-300"
                              : "bg-white/[0.025] text-gray-500 group-hover:bg-white/[0.06] group-hover:text-gray-300"
                          }
                        `}
                      >
                        <Icon className="text-[13px]" />
                      </span>


                      {/* Menu Name */}

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
                              ? "translate-x-0 text-emerald-400/70 opacity-100"
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
            BOTTOM ACTIONS
        ==================================================== */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            z-10
            border-t
            border-white/[0.07]
            bg-[#07111f]/95
            p-3
            backdrop-blur-xl
          "
        >

          {/* Homepage */}

          <button
            type="button"
            onClick={goToHomePage}
            className="
              group
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-[12px]
              font-semibold
              text-gray-500
              transition-all
              duration-200
              hover:bg-emerald-400/[0.06]
              hover:text-emerald-300
            "
          >

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-white/[0.025]
                text-gray-500
                transition
                group-hover:bg-emerald-400/10
                group-hover:text-emerald-300
              "
            >
              <FaHome className="text-[12px]" />
            </span>

            <span className="flex-1 text-left">
              Go to Homepage
            </span>

            <FaChevronRight
              className="
                text-[8px]
                opacity-0
                transition
                group-hover:translate-x-1
                group-hover:opacity-100
              "
            />

          </button>


          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              group
              mt-1
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-[12px]
              font-semibold
              text-gray-500
              transition-all
              duration-200
              hover:bg-red-500/[0.07]
              hover:text-red-400
            "
          >

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-white/[0.025]
                text-gray-500
                transition
                group-hover:bg-red-500/10
                group-hover:text-red-400
              "
            >
              <FaSignOutAlt className="text-[12px]" />
            </span>

            <span className="flex-1 text-left">
              Logout
            </span>

            <FaChevronRight
              className="
                text-[8px]
                opacity-0
                transition
                group-hover:translate-x-1
                group-hover:opacity-100
              "
            />

          </button>

        </div>

      </aside>


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
          background: rgba(52, 211, 153, 0.25);
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