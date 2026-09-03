import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaUserGraduate, FaChalkboardTeacher, FaBook,
  FaLayerGroup, FaUserPlus, FaClipboardCheck, FaFileAlt, FaTrophy,
  FaMoneyBillWave, FaReceipt, FaCertificate, FaBullhorn, FaImages,
  FaQuoteLeft, FaCog, FaUser, FaSignOutAlt, FaTimes,
  FaHome
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
  { name: 'Students', path: '/admin/students', icon: FaUserGraduate },
  { name: 'Teachers', path: '/admin/teachers', icon: FaChalkboardTeacher },
  { name: 'Courses', path: '/admin/courses', icon: FaBook },
  { name: 'Batches', path: '/admin/batches', icon: FaLayerGroup },
  { name: 'Admissions', path: '/admin/admissions', icon: FaUserPlus },
  { name: 'Attendance', path: '/admin/attendance', icon: FaClipboardCheck },
  { name: 'Exams', path: '/admin/exams', icon: FaFileAlt },
  { name: 'Results', path: '/admin/results', icon: FaTrophy },
  { name: 'Payments', path: '/admin/payments', icon: FaMoneyBillWave },
  { name: 'Receipts', path: '/admin/receipts', icon: FaReceipt },
  { name: 'Certificates', path: '/admin/certificates', icon: FaCertificate },
  { name: 'Notices', path: '/admin/notices', icon: FaBullhorn },
  { name: 'Gallery', path: '/admin/gallery', icon: FaImages },
  { name: 'Testimonials', path: '/admin/testimonials', icon: FaQuoteLeft },
  { name: 'Settings', path: '/admin/settings', icon: FaCog },
  { name: 'Profile', path: '/admin/profile', icon: FaUser }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const gotohomepage = async () => {
    
    navigate('/');
  };
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-dark text-gray-300 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
              OI
            </div>
            <div>
              <span className="text-white font-bold text-sm block leading-tight">OPEN IT</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-wider">Admin Panel</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>

        {/* User Info */}
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-white font-medium text-sm truncate">{user?.name || 'Admin'}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="text-base flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
        
          <button
            onClick={gotohomepage}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-danger/20 hover:text-danger transition"
          >
            <FaHome />
            Go to homepage
          </button>
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
