import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { BLOG_CATEGORIES } from '../constants/blogCategories';
import BlogIcon from '../pages/BlogIcon';
import { useAuth } from '../context/AuthContext';

const MAIN_SITE_URL = '/';
const BLOG_HOME_URL = '/blogs';

export default function BlogLayout() {
  const [params] = useSearchParams();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const categoryBarRef = useRef(null);
  const activeCategory = params.get('category') || '';

  // Replace this placeholder with your actual authentication context.
  // Example: const { user } = useAuth();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const closeMenus = useCallback(() => {
    setMenuOpen(false);
    setCategorySheetOpen(false);
  }, []);

  // Header shadow on scroll.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background scrolling while a mobile overlay is open.
  useEffect(() => {
    const isOverlayOpen = menuOpen || categorySheetOpen;
    if (!isOverlayOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, categorySheetOpen]);

  // Close mobile UI when the route or query changes.
  useEffect(() => {
    closeMenus();
  }, [location.pathname, location.search, closeMenus]);

  // Escape closes the currently open mobile UI.
  useEffect(() => {
    if (!menuOpen && !categorySheetOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeMenus();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, categorySheetOpen, closeMenus]);

  // Keep category overflow controls in sync.
  const updateArrows = useCallback(() => {
    const element = categoryBarRef.current;
    if (!element) return;

    setCanScrollLeft(element.scrollLeft > 4);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 4
    );
  }, []);

  useEffect(() => {
    const element = categoryBarRef.current;
    if (!element) return undefined;

    updateArrows();

    element.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);

    let resizeObserver;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateArrows);
      resizeObserver.observe(element);
    }

    return () => {
      element.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
      resizeObserver?.disconnect();
    };
  }, [updateArrows]);

  // Center the active category when it changes.
  useEffect(() => {
    const element = categoryBarRef.current;
    if (!element) return;

    const activeLink = element.querySelector('[data-active="true"]');

    activeLink?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeCategory]);

  const scrollCategories = (direction) => {
    categoryBarRef.current?.scrollBy({
      left: direction * 220,
      behavior: 'smooth',
    });
  };

  const categoryClass = (active) =>
    `inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full
    px-4 py-2 text-sm font-semibold transition-colors duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
    focus-visible:ring-offset-2 ${active
      ? 'bg-[#082b55] text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-[#082b55]'
    }`;

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold
    transition-colors duration-200 focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-cyan-500 ${isActive
      ? 'bg-cyan-50 text-[#075b96]'
      : 'text-slate-600 hover:bg-slate-100 hover:text-[#082b55]'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      {/* Main header */}
      <header
        className={`sticky top-0 z-40 border-b transition-shadow duration-200 ${scrolled
          ? 'border-slate-200 bg-white/95 shadow-md backdrop-blur-xl'
          : 'border-slate-100 bg-white'
          }`}
      >
        {/* Brand and desktop navigation */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6 lg:px-8">
          <Link
            to={BLOG_HOME_URL}
            onClick={closeMenus}
            aria-label="Open IT Blog home"
            className="group flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 sm:gap-3"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#082b55] to-cyan-600 text-lg font-black text-white shadow-md sm:h-11 sm:w-11">
              B
            </span>

            <span className="min-w-0 leading-tight">
              <span className="block truncate text-base font-black tracking-tight text-[#082b55] sm:text-lg">
                Open IT Blog
              </span>
              <span className="mt-0.5 hidden text-xs font-medium text-slate-500 sm:block">
                Ideas, skills &amp; insights
              </span>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            <NavLink to={BLOG_HOME_URL} end className={navLinkClass}>
              All articles
            </NavLink>

            {isAdmin && (
              <Link
                to="/admin/blogs"
                className="rounded-xl px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50"
              >
                Dashboard
              </Link>
            )}


            <Link
              to="/"
              className="ml-2 inline-flex items-center gap-2 rounded-xl border border-[#075b96]/20 bg-[#075b96] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#082b55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              Main Website
              <BlogIcon name="globe" className="h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="blog-mobile-menu"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 md:hidden"
          >
            <BlogIcon
              name={menuOpen ? 'x' : 'menu'}
              className="h-5 w-5"
            />
          </button>
        </div>

        {/* Category navigation */}
        <div className="relative border-t border-slate-100 bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-2 py-2 sm:px-4">
            <button
              type="button"
              onClick={() => scrollCategories(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll categories left"
              className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 disabled:pointer-events-none disabled:opacity-30 md:inline-flex ${canScrollLeft ? 'border-slate-200 bg-white' : 'border-transparent'
                }`}
            >
              <BlogIcon name="chevron-left" className="h-4 w-4" />
            </button>

            <div
              ref={categoryBarRef}
              aria-label="Blog categories"
              className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto scroll-smooth px-2 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2"
            >
              <Link
                to={BLOG_HOME_URL}
                data-active={!activeCategory}
                aria-current={!activeCategory ? 'page' : undefined}
                className={categoryClass(!activeCategory)}
              >
                All
              </Link>

              {BLOG_CATEGORIES.map((category) => {
                const active = activeCategory === category;

                return (
                  <Link
                    key={category}
                    to={`${BLOG_HOME_URL}?category=${encodeURIComponent(category)}`}
                    data-active={active}
                    aria-current={active ? 'page' : undefined}
                    className={categoryClass(active)}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollCategories(1)}
              disabled={!canScrollRight}
              aria-label="Scroll categories right"
              className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 disabled:pointer-events-none disabled:opacity-30 md:inline-flex ${canScrollRight ? 'border-slate-200 bg-white' : 'border-transparent'
                }`}
            >
              <BlogIcon name="chevron-right" className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setCategorySheetOpen(true)}
              aria-label="Show all blog categories"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 md:hidden"
            >
              <BlogIcon name="filter" className="h-3.5 w-3.5" />
              All
            </button>
          </div>
        </div>

        {/* Mobile navigation panel */}
        {menuOpen && (
          <div
            id="blog-mobile-menu"
            className="border-t border-slate-100 bg-white p-4 shadow-lg md:hidden"
          >
            <nav aria-label="Mobile navigation" className="grid gap-2">
              <NavLink
                to={BLOG_HOME_URL}
                end
                onClick={closeMenus}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                    ? 'bg-cyan-50 text-[#075b96]'
                    : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                All articles
              </NavLink>

              {isAdmin && (
                <Link
                  to="/admin/blogs"
                  onClick={closeMenus}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50"
                >
                  Dashboard
                </Link>
              )}

              <a
                href={MAIN_SITE_URL}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#075b96] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#082b55]"
              >
                <BlogIcon name="globe" className="h-4 w-4" />
                Main Website
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Mobile category selector */}
      {categorySheetOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close categories"
            onClick={() => setCategorySheetOpen(false)}
            className="absolute inset-0 h-full w-full bg-slate-950/45 backdrop-blur-sm"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-sheet-title"
            className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />

            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2
                  id="category-sheet-title"
                  className="text-lg font-black text-[#082b55]"
                >
                  Explore categories
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Choose a topic to explore
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCategorySheetOpen(false)}
                aria-label="Close category selector"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
              >
                <BlogIcon name="x" className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to={BLOG_HOME_URL}
                onClick={() => setCategorySheetOpen(false)}
                className={categoryClass(!activeCategory)}
              >
                All articles
              </Link>

              {BLOG_CATEGORIES.map((category) => (
                <Link
                  key={category}
                  to={`${BLOG_HOME_URL}?category=${encodeURIComponent(category)}`}
                  onClick={() => setCategorySheetOpen(false)}
                  className={categoryClass(activeCategory === category)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Page content */}
      <main className="w-full flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative mt-10 overflow-hidden bg-[#082b55] px-4 py-8 text-slate-300 sm:py-10">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
        />

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <Link
            to={BLOG_HOME_URL}
            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500 text-base font-black text-white">
              B
            </span>

            <span>
              <span className="block text-sm font-bold text-white">
                Open IT Blog
              </span>
              <span className="mt-0.5 block text-xs text-slate-400">
                Learn. Build. Grow.
              </span>
            </span>
          </Link>

          <p className="text-center text-xs text-slate-400 sm:text-sm">
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold text-white">Open IT Institute</span>.
            {' '}All rights reserved.
          </p>

          <a
            href={MAIN_SITE_URL}
            className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            Visit main website
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </footer>
    </div>
  );
}
