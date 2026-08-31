import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUserGraduate } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Courses', path: '/courses' },
  { name: 'Admission', path: '/admission' },
  { name: 'Notice', path: '/notices' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Results', path: '/results' },
  { name: 'Contact', path: '/contact' }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition">
              <FaUserGraduate className="text-lg" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-primary text-lg leading-tight block">OPEN IT</span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Institute</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={getDashboardLink()}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-xl hover:bg-primary hover:text-white transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition"
                >
                  Login
                </Link>
                <Link
                  to="/admission"
                  className="inline-flex px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/25 transition"
                >
                  ভর্তি করুন
                </Link>
              </>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
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
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                )}
                {isAuthenticated && (
                  <Link
                    to={getDashboardLink()}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-primary bg-primary/10"
                  >
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
