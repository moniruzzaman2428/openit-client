import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaBook, FaLayerGroup, FaUserGraduate,
  FaCalendarAlt, FaClipboardCheck, FaFileAlt, FaTrophy,
  FaBullhorn, FaUser, FaKey, FaSignOutAlt, FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { name: 'Dashboard', path: '/teacher/dashboard', icon: FaTachometerAlt },
  { name: 'My Courses', path: '/teacher/courses', icon: FaBook },
  { name: 'My Batches', path: '/teacher/batches', icon: FaLayerGroup },
  { name: 'My Students', path: '/teacher/students', icon: FaUserGraduate },
  { name: 'Class Routine', path: '/teacher/routine', icon: FaCalendarAlt },
  { name: 'Attendance', path: '/teacher/attendance', icon: FaClipboardCheck },
  { name: 'Exams', path: '/teacher/exams', icon: FaFileAlt },
  { name: 'Results', path: '/teacher/results', icon: FaTrophy },
  { name: 'Notices', path: '/teacher/notices', icon: FaBullhorn },
  { name: 'Profile', path: '/teacher/profile', icon: FaUser },
  { name: 'Change Password', path: '/teacher/change-password', icon: FaKey }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-dark text-gray-300 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white text-sm font-bold">
              T
            </div>
            <div>
              <span className="text-white font-bold text-sm block leading-tight">OPEN IT</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-wider">Teacher Panel</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-white font-medium text-sm truncate">{user?.name || 'Teacher'}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="text-base flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-danger/20 hover:text-danger transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
