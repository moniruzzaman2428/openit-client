
// FILE: src/components/Navbar.jsx
// Professional sticky navbar for Open IT Institute
// ============================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaBookOpen,
  FaUserPlus,
  FaBell,
  FaImages,
  FaChartBar,
  FaEnvelope,
  FaKeyboard,
  FaMousePointer,
  FaRocket,
  FaNewspaper,
  FaGraduationCap,
  FaSignInAlt,
  FaLongArrowAltUp,
  FaClipboardList,
  FaChevronDown,
  FaTools,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';

const BLOG_PATH = '/blogs';

/* ── NAVIGATION STRUCTURE ─────────────────────── */
// Primary links – always visible in desktop bottom bar
const primaryLinks = [
  { name: 'Home', path: '/', icon: FaHome },
  { name: 'About', path: '/about', icon: FaInfoCircle },
  { name: 'Courses', path: '/courses', icon: FaBookOpen },
  { name: 'Admission', path: '/admission', icon: FaUserPlus },
  { name: 'Notice', path: '/notices', icon: FaBell },
  { name: 'Gallery', path: '/gallery', icon: FaImages },
  { name: 'Results', path: '/results', icon: FaChartBar },
  { name: 'Student Info', path: '/student-info', icon: FaGraduationCap },
  { name: 'Contact', path: '/contact', icon: FaEnvelope },
];

// Practice / student tools – grouped under "Practice"
const practiceLinks = [
  { name: 'Online Exam', path: '/OnlineExam', icon: FaClipboardList },
  { name: 'Typing Test', path: '/TypingTest', icon: FaKeyboard },
  { name: 'Mouse Accuracy', path: '/MouseAccuracyGame', icon: FaMousePointer }
];

// Flat list for mobile (order = visual priority)
const allLinks = [
  ...primaryLinks,
  ...practiceLinks,
];

/* ── DESKTOP NAV LINK ─────────────────────────── */
const bottomLinkClass = ({ isActive }) =>
  `group relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
    isActive
      ? 'bg-white text-cyan-700 shadow-[0_4px_14px_-4px_rgba(6,182,212,0.45)] ring-1 ring-cyan-200/80'
      : 'text-slate-500 hover:bg-white/70 hover:text-cyan-700 hover:shadow-sm'
  }`;

/* ── MOBILE NAV LINK ──────────────────────────── */
const mobileLinkClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
    isActive
      ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm shadow-cyan-100 ring-1 ring-cyan-100'
      : 'text-slate-600 hover:bg-slate-50 hover:text-cyan-700'
  }`;

/* ── DESKTOP MENU ITEM ────────────────────────── */
function BottomMenuLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink to={item.path} end={item.path === '/'} className={bottomLinkClass}>
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="bottom-active-glow"
              className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-100/60 via-white to-blue-100/60"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Icon
            aria-hidden="true"
            className={`text-[10px] transition-transform duration-300 group-hover:scale-125 ${
              isActive ? 'text-cyan-500' : 'opacity-70'
            }`}
          />
          <span>{item.name}</span>
        </>
      )}
    </NavLink>
  );
}

/* ── MOBILE MENU ITEM ─────────────────────────── */
function MobileMenuLink({ item, onClick }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      onClick={onClick}
      className={mobileLinkClass}
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-200'
                : 'bg-slate-100 text-slate-500 group-hover:bg-cyan-50 group-hover:text-cyan-600'
            }`}
          >
            <Icon aria-hidden="true" className="text-xs" />
          </span>
          <span>{item.name}</span>
          {isActive && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-500" />
          )}
        </>
      )}
    </NavLink>
  );
}

/* ── PRACTICE DROPDOWN (Desktop) ──────────────── */
function PracticeDropdown({ links, isOpen, onToggle, onClose }) {
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const location = useLocation();
  const isAnyActive = links.some(
    (l) =>
      location.pathname === l.path ||
      location.pathname.startsWith(`${l.path}/`)
  );

  // Position menu under the button (fixed → not clipped by overflow-x nav)
  const updatePosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const menuWidth = 224; // w-56
    let left = rect.left + rect.width / 2 - menuWidth / 2;
    // Keep inside viewport
    left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
    setPos({ top: rect.bottom + 8, left });
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const onPointer = (e) => {
      const t = e.target;
      if (
        buttonRef.current?.contains(t) ||
        menuRef.current?.contains(t)
      ) {
        return;
      }
      onClose();
    };

    // Use click (not pointerdown) so the toggle click finishes first
    document.addEventListener('click', onPointer);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('click', onPointer);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`group relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
          isAnyActive || isOpen
            ? 'bg-white text-cyan-700 shadow-[0_4px_14px_-4px_rgba(6,182,212,0.45)] ring-1 ring-cyan-200/80'
            : 'text-slate-500 hover:bg-white/70 hover:text-cyan-700 hover:shadow-sm'
        }`}
      >
        <FaTools
          aria-hidden="true"
          className={`text-[10px] transition-transform duration-300 group-hover:scale-125 ${
            isAnyActive || isOpen ? 'text-cyan-500' : 'opacity-70'
          }`}
        />
        <span>Practice</span>
        <FaChevronDown
          aria-hidden="true"
          className={`text-[9px] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            role="menu"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-[60] w-56 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl shadow-slate-900/10"
          >
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  role="menuitem"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-cyan-50 text-cyan-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-cyan-700'
                    }`
                  }
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon className="text-xs" />
                  </span>
                  {item.name}
                </NavLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);

  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const bottomBarRef = useRef(null);

  const closePractice = useCallback(() => setPracticeOpen(false), []);
  const togglePractice = useCallback(() => setPracticeOpen((v) => !v), []);

  const isBlog =
    location.pathname === BLOG_PATH ||
    location.pathname.startsWith(`${BLOG_PATH}/`);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  /* Close menus on route change */
  useEffect(() => {
    setMobileOpen(false);
    setPracticeOpen(false);
  }, [location.pathname]);

  /* Scroll state */
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  /* Escape closes menus */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setPracticeOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? 'hidden' : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  /* Keep active desktop link in view */
  useEffect(() => {
    const active = bottomBarRef.current?.querySelector('[aria-current="page"]');
    active?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [location.pathname, prefersReducedMotion]);

  /* ── BLOG CTA ───────────────────────────────── */
  const blogButton = (
    <Link
      to={BLOG_PATH}
      onClick={() => setMobileOpen(false)}
      aria-label="Explore the Open IT Institute Blog"
      aria-current={isBlog ? 'page' : undefined}
      className={`group relative inline-flex min-h-10 shrink-0 items-center justify-center gap-1 overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 px-2 text-[11px] font-bold text-white shadow-lg shadow-cyan-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 sm:gap-2 sm:px-3.5 sm:text-xs ${
        isBlog ? 'ring-2 ring-cyan-400 ring-offset-1' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
      <FaNewspaper
        aria-hidden="true"
        className="relative shrink-0 text-cyan-200 transition-transform duration-300 group-hover:scale-110"
      />
      <span className="relative sm:hidden">Blog</span>
      <span className="relative hidden sm:inline">Explore Blog</span>
      <FaLongArrowAltUp
        aria-hidden="true"
        className="relative hidden text-[10px] text-cyan-200 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
      />
    </Link>
  );

  /* ── ADMISSION CTA ──────────────────────────── */
  const admissionButton = (
    <Link
      to="/admission"
      onClick={() => setMobileOpen(false)}
      aria-label="Apply for admission at Open IT Institute"
      aria-current={location.pathname === '/admission' ? 'page' : undefined}
      className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-2 text-[11px] font-bold text-white shadow-md shadow-cyan-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 sm:gap-1.5 sm:px-3.5 sm:text-xs ${
        location.pathname === '/admission'
          ? 'ring-2 ring-cyan-300 ring-offset-1'
          : ''
      }`}
    >
      <FaUserPlus aria-hidden="true" className="shrink-0" />
      <span>ভর্তি হোন</span>
    </Link>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/70 bg-white/90 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] backdrop-blur-2xl'
          : 'border-b border-transparent bg-white/70 backdrop-blur-xl'
      }`}
    >
      {/* ═════════════ TOP BAR ═════════════ */}
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-1.5 px-2.5 min-[380px]:gap-2 min-[380px]:px-4 sm:gap-3 sm:px-6 xl:px-10">
        {/* Logo */}
        <Link
          to="/"
          aria-label="Open IT Institute home"
          className="group flex min-w-0 shrink-0 items-center gap-1.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 sm:gap-2.5"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-50 via-white to-blue-100 ring-1 ring-cyan-200/60 transition-all duration-300 group-hover:ring-cyan-300 group-hover:shadow-lg group-hover:shadow-cyan-200/50 sm:h-10 sm:w-10">
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            {logoFailed ? (
              <FaGraduationCap className="relative text-xl text-cyan-700" />
            ) : (
              <img
                src={logo}
                alt="Open IT Institute"
                className="relative h-7 w-7 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8"
                onError={() => setLogoFailed(true)}
              />
            )}
          </span>
          <span className="hidden leading-tight min-[390px]:block">
            <span className="block bg-gradient-to-r from-slate-900 to-cyan-800 bg-clip-text text-xs font-black tracking-tight text-transparent sm:text-sm">
              OPEN IT
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-600 sm:text-[10px] sm:tracking-[0.22em]">
              Institute
            </span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1 min-[380px]:gap-1.5 sm:gap-2">
          {blogButton}
          {admissionButton}

          {isAuthenticated ? (
            <Link
              to={getDashboardLink()}
              className="group hidden items-center gap-2 rounded-xl border border-cyan-200/60 bg-gradient-to-r from-cyan-50 to-blue-50 px-3.5 py-2.5 text-xs font-bold text-cyan-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md hover:shadow-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 md:inline-flex"
            >
              <FaRocket
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 md:inline-flex"
            >
              <FaSignInAlt className="mr-1.5" />
              Login
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-site-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 sm:h-10 sm:w-10 md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <FaTimes aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <FaBars aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ═════════════ DESKTOP NAV ═════════════ */}
      <div className="hidden border-t border-slate-100/80 bg-gradient-to-r from-slate-50/90 via-cyan-50/40 to-blue-50/90 md:block">
        <nav
          ref={bottomBarRef}
          aria-label="Main navigation"
          className="mx-auto flex h-14 max-w-[1440px] items-center justify-start gap-1 overflow-x-auto px-4 py-2 sm:justify-center sm:px-6 xl:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {primaryLinks.map((item) => (
            <BottomMenuLink key={item.path} item={item} />
          ))}

          {/* Practice tools dropdown */}
          <PracticeDropdown
            links={practiceLinks}
            isOpen={practiceOpen}
            onToggle={togglePractice}
            onClose={closePractice}
          />
        </nav>
      </div>

      {/* ═════════════ MOBILE MENU ═════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 top-16 z-40 bg-slate-900/30 backdrop-blur-sm md:hidden"
            />

            <motion.div
              id="mobile-site-menu"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-50 border-t border-slate-100 bg-white shadow-2xl shadow-slate-900/10 md:hidden"
            >
              <nav
                aria-label="Mobile navigation"
                className="mx-auto max-h-[calc(100dvh-4rem)] max-w-2xl space-y-5 overflow-y-auto overscroll-contain px-4 py-5"
              >
                {/* Main pages */}
                <div>
                  <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Main
                  </p>
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {primaryLinks.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={
                          prefersReducedMotion ? false : { opacity: 0, x: -8 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: prefersReducedMotion ? 0 : index * 0.02,
                          duration: 0.2,
                        }}
                      >
                        <MobileMenuLink
                          item={item}
                          onClick={() => setMobileOpen(false)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Practice tools – highlighted group */}
                <div>
                  <p className="mb-2 flex items-center gap-2 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    <FaTools className="text-[9px]" />
                    Practice Tools
                  </p>
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {practiceLinks.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={
                          prefersReducedMotion ? false : { opacity: 0, x: -8 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: prefersReducedMotion
                            ? 0
                            : (primaryLinks.length + index) * 0.02,
                          duration: 0.2,
                        }}
                      >
                        <MobileMenuLink
                          item={item}
                          onClick={() => setMobileOpen(false)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Account */}
                <div className="border-t border-slate-100 pt-4">
                  {isAuthenticated ? (
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setMobileOpen(false)}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 px-4 font-bold text-cyan-800 shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      <FaRocket aria-hidden="true" />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <FaSignInAlt aria-hidden="true" />
                      Login
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}