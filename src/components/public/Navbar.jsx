import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaUserGraduate, 
  FaChevronDown,
  FaKeyboard,
  FaMousePointer,
  FaHome,
  FaInfoCircle,
  FaBookOpen,
  FaUserPlus,
  FaBell,
  FaImages,
  FaChartBar,
  FaEnvelope,
  FaRocket
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png'; 

const navLinks = [
  { name: 'Home', path: '/', icon: FaHome },
  { name: 'About', path: '/about', icon: FaInfoCircle },
  { name: 'Courses', path: '/courses', icon: FaBookOpen },
  { name: 'Admission', path: '/admission', icon: FaUserPlus },
  { name: 'Notice', path: '/notices', icon: FaBell },
  { name: 'Gallery', path: '/gallery', icon: FaImages },
  { name: 'Results', path: '/results', icon: FaChartBar },
  { name: 'Contact', path: '/contact', icon: FaEnvelope }
];

const accuracyLinks = [
  { name: 'Typing Test', path: '/TypingTest', icon: FaKeyboard },
  { name: 'Mouse Accuracy', path: '/MouseAccuracyGame', icon: FaMousePointer }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAccuracyOpen, setIsAccuracyOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsAccuracyOpen(false);
  }, [location]);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  const isAccuracyActive = accuracyLinks.some(link => location.pathname === link.path);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200/50' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      {/* Animated Gradient Line */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-lg shadow-cyan-500/20">
                <img 
                  src={logo} 
                  alt="Open IT Institute" 
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<FaUserGraduate className="text-base text-cyan-500" />';
                  }}
                />
              </div>
              <motion.div
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
            
            <div className="hidden sm:block">
              <span className="font-black text-gray-800 text-sm leading-tight block">
                OPEN IT
              </span>
              <span className="text-[9px] text-cyan-500 font-medium tracking-[0.2em] uppercase">
                Institute
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-cyan-600 bg-cyan-50/80'
                      : 'text-gray-600 hover:text-cyan-600 hover:bg-cyan-50/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* Accuracy Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccuracyOpen(!isAccuracyOpen)}
                onMouseEnter={() => setIsAccuracyOpen(true)}
                onMouseLeave={() => setIsAccuracyOpen(false)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1 ${
                  isAccuracyActive
                    ? 'text-cyan-600 bg-cyan-50/80'
                    : 'text-gray-600 hover:text-cyan-600 hover:bg-cyan-50/50'
                }`}
              >
                <span className="relative z-10">Accuracy</span>
                <motion.div
                  animate={{ rotate: isAccuracyOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronDown className="text-[10px]" />
                </motion.div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isAccuracyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setIsAccuracyOpen(true)}
                    onMouseLeave={() => setIsAccuracyOpen(false)}
                    className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-2xl shadow-gray-200/50 border border-gray-100/80 py-1.5 min-w-[200px] z-50 backdrop-blur-sm"
                  >
                    {accuracyLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`flex items-center gap-2.5 px-4 py-2 text-xs transition-all duration-200 ${
                            isActive
                              ? 'text-cyan-600 bg-cyan-50/80'
                              : 'text-gray-600 hover:bg-gray-50/80'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isActive ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <Icon className="text-sm" />
                          </div>
                          <span className="font-medium">{link.name}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={getDashboardLink()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                >
                  <FaRocket className="text-xs" />
                  Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-cyan-600 transition-colors"
                >
                  Login
                </Link>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/admission"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                  >
                    <FaUserPlus className="text-xs" />
                    ভর্তি হোন
                  </Link>
                </motion.div>
              </>
            )}

            {/* Mobile Toggle */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100/80 overflow-hidden"
          >
            <nav className="px-4 py-3 space-y-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'text-cyan-600 bg-cyan-50/80'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <Icon className="text-base" />
                    {link.name}
                  </NavLink>
                );
              })}

              {/* Mobile Accuracy Section */}
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Accuracy Tests
                </div>
                {accuracyLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'text-cyan-600 bg-cyan-50/80'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-cyan-100' : 'bg-gray-100'
                      }`}>
                        <Icon className="text-sm" />
                      </div>
                      {link.name}
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1">
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                )}
                {isAuthenticated && (
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                  >
                    <FaRocket className="text-sm" />
                    Dashboard
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;