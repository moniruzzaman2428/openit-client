import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt,
  FaBook,
  FaLayerGroup,
  FaUserGraduate,
  FaCalendarAlt,
  FaClipboardCheck,
  FaFileAlt,
  FaTrophy,
  FaBullhorn,
  FaUser,
  FaKey,
  FaSignOutAlt,
  FaTimes,
  FaHome,
  FaChalkboardTeacher,
  FaShieldAlt,
  FaCircle
} from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';

const menuItems = [
  {
    name: 'Dashboard',
    path: '/teacher/dashboard',
    icon: FaTachometerAlt
  },
  {
    name: 'My Courses',
    path: '/teacher/courses',
    icon: FaBook
  },
  {
    name: 'My Batches',
    path: '/teacher/batches',
    icon: FaLayerGroup
  },
  {
    name: 'My Students',
    path: '/teacher/students',
    icon: FaUserGraduate
  },
  {
    name: 'Class Routine',
    path: '/teacher/routine',
    icon: FaCalendarAlt
  },
  {
    name: 'Attendance',
    path: '/teacher/attendance',
    icon: FaClipboardCheck
  },
  {
    name: 'Exams',
    path: '/teacher/exams',
    icon: FaFileAlt
  },
  {
    name: 'Results',
    path: '/teacher/results',
    icon: FaTrophy
  },
  {
    name: 'Notices',
    path: '/teacher/notices',
    icon: FaBullhorn
  },
  {
    name: 'Profile',
    path: '/teacher/profile',
    icon: FaUser
  },
  {
    name: 'Change Password',
    path: '/teacher/change-password',
    icon: FaKey
  }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const goToHomepage = () => {
    navigate('/');
  };

  // User initials
  const getInitials = () => {
    if (!user?.name) return 'T';

    return user.name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {/* ================= MOBILE BACKDROP ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[270px]
          bg-[#07111f]
          text-gray-300
          border-r border-white/[0.07]
          shadow-2xl shadow-black/40
          transform transition-transform duration-300 ease-in-out

          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >

        {/* ================= TOP GLOW ================= */}
        <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-56 bg-cyan-500/10 blur-[80px] rounded-full" />
        </div>

        {/* ================= HEADER ================= */}
        <div className="relative flex items-center justify-between h-[72px] px-5 border-b border-white/[0.07]">

          <div className="flex items-center gap-3">

            {/* Logo */}
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="
                relative
                w-10 h-10
                rounded-xl
                bg-gradient-to-br from-cyan-400 to-blue-600
                flex items-center justify-center
                text-white
                shadow-lg shadow-cyan-500/20
              "
            >
              <FaChalkboardTeacher className="text-lg" />

              <span className="absolute -right-1 -bottom-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#07111f]" />
            </motion.div>

            {/* Brand */}
            <div>
              <h1 className="text-white font-bold text-[15px] tracking-wide">
                OPEN IT
              </h1>

              <p className="text-[9px] text-cyan-400/70 uppercase tracking-[0.18em]">
                Teacher Panel
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            onClick={onClose}
            className="
              lg:hidden
              w-8 h-8
              rounded-lg
              flex items-center justify-center
              text-gray-400
              hover:text-white
              hover:bg-white/10
              transition
            "
          >
            <FaTimes />
          </button>
        </div>

        {/* ================= TEACHER PROFILE ================= */}
        <div className="relative px-4 py-4">

          <div
            className="
              relative
              flex items-center gap-3
              p-3
              rounded-2xl
              bg-white/[0.035]
              border border-white/[0.06]
              hover:bg-white/[0.05]
              transition
            "
          >

            {/* Avatar */}
            <div
              className="
                relative
                w-11 h-11
                rounded-xl
                bg-gradient-to-br
                from-cyan-400
                via-blue-500
                to-indigo-600
                flex items-center justify-center
                text-white
                font-bold
                text-sm
                shadow-lg shadow-blue-500/20
              "
            >
              {getInitials()}

              <span
                className="
                  absolute
                  -right-1
                  -bottom-1
                  flex items-center justify-center
                  w-4 h-4
                  rounded-full
                  bg-[#07111f]
                "
              >
                <FaCircle className="text-[8px] text-emerald-400" />
              </span>
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">

              <p className="text-white font-semibold text-sm truncate">
                {user?.name || 'Teacher'}
              </p>

              <p className="text-[11px] text-gray-500 truncate">
                {user?.email || 'teacher@openit.com'}
              </p>

              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                <span className="text-[9px] text-emerald-400 uppercase tracking-wider">
                  Online
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* ================= MENU TITLE ================= */}
        <div className="px-5 pb-2">
          <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-[0.2em]">
            Teacher Workspace
          </p>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav
          className="
            overflow-y-auto
            px-3
            pb-32
            space-y-1
            scrollbar-thin
            scrollbar-thumb-white/10
            scrollbar-track-transparent
          "
          style={{
            maxHeight: 'calc(100vh - 205px)'
          }}
        >

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="relative block"
              >
                {({ isActive }) => (
                  <motion.div
                    whileHover={{
                      x: 3
                    }}
                    transition={{
                      duration: 0.15
                    }}
                    className={`
                      relative
                      flex items-center
                      gap-3
                      px-3
                      py-3
                      rounded-xl
                      text-[13px]
                      font-medium
                      transition-all duration-200
                      group

                      ${
                        isActive
                          ? `
                            text-white
                            bg-gradient-to-r
                            from-cyan-500/15
                            via-blue-500/10
                            to-transparent
                            border
                            border-cyan-400/10
                          `
                          : `
                            text-gray-400
                            hover:text-white
                            hover:bg-white/[0.045]
                          `
                      }
                    `}
                  >

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="teacher-active-indicator"
                        className="
                          absolute
                          left-0
                          top-1/2
                          -translate-y-1/2
                          w-[3px]
                          h-7
                          rounded-r-full
                          bg-gradient-to-b
                          from-cyan-400
                          to-blue-500
                          shadow-lg
                          shadow-cyan-400/50
                        "
                      />
                    )}

                    {/* Icon Box */}
                    <div
                      className={`
                        flex items-center justify-center
                        w-8 h-8
                        rounded-lg
                        transition-all duration-200

                        ${
                          isActive
                            ? `
                              bg-cyan-400/10
                              text-cyan-400
                            `
                            : `
                              bg-white/[0.025]
                              text-gray-500
                              group-hover:text-cyan-400
                              group-hover:bg-cyan-400/5
                            `
                        }
                      `}
                    >
                      <Icon className="text-sm" />
                    </div>

                    {/* Name */}
                    <span className="flex-1 truncate">
                      {item.name}
                    </span>

                    {/* Active Dot */}
                    {isActive && (
                      <motion.span
                        initial={{
                          scale: 0,
                          opacity: 0
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1
                        }}
                        className="
                          w-1.5
                          h-1.5
                          rounded-full
                          bg-cyan-400
                          shadow-lg
                          shadow-cyan-400/60
                        "
                      />
                    )}

                  </motion.div>
                )}
              </NavLink>
            );
          })}

        </nav>

        {/* ================= BOTTOM AREA ================= */}
        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            p-3
            bg-[#07111f]/95
            backdrop-blur-xl
            border-t
            border-white/[0.07]
          "
        >

          {/* Security Badge */}
          <div
            className="
              flex items-center gap-2
              px-3
              py-2
              mb-2
              rounded-lg
              bg-cyan-400/[0.04]
              border border-cyan-400/[0.08]
            "
          >
            <FaShieldAlt className="text-cyan-400 text-xs" />

            <span className="text-[9px] text-gray-500">
              Teacher account secured
            </span>
          </div>

          {/* Homepage */}
          <button
            onClick={goToHomepage}
            className="
              flex items-center gap-3
              w-full
              px-3
              py-2.5
              rounded-xl
              text-[12px]
              font-medium
              text-gray-400
              hover:text-white
              hover:bg-white/[0.05]
              transition
              group
            "
          >
            <div
              className="
                w-7 h-7
                rounded-lg
                bg-white/[0.035]
                flex items-center justify-center
                group-hover:bg-cyan-400/10
                group-hover:text-cyan-400
                transition
              "
            >
              <FaHome className="text-xs" />
            </div>

            <span>Go to Homepage</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-3
              w-full
              px-3
              py-2.5
              rounded-xl
              text-[12px]
              font-medium
              text-gray-400
              hover:text-red-400
              hover:bg-red-500/[0.07]
              transition
              group
            "
          >
            <div
              className="
                w-7 h-7
                rounded-lg
                bg-white/[0.035]
                flex items-center justify-center
                group-hover:bg-red-500/10
                group-hover:text-red-400
                transition
              "
            >
              <FaSignOutAlt className="text-xs" />
            </div>

            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;