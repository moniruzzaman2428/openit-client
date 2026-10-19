import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import BlogIcon from '../pages/BlogIcon';

const NAV = [
  { to: '/admin/blogs', label: 'Overview', icon: 'grid', end: true },
  { to: '/admin/blogs/articles', label: 'All articles', icon: 'file' },
  { to: '/admin/blogs/create', label: 'New article', icon: 'plus' },
];

export default function BlogAdminLayout() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-cyan-500/15 text-cyan-200' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

  const Sidebar = (
    <div className="flex h-full flex-col bg-[#082b55] p-4 text-white">
      <Link to="/admin/blogs" className="mb-8 flex items-center gap-3 px-2 pt-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-[#075b96] font-black">
          B
        </span>
        <span className="leading-tight">
          <span className="block font-black">Blog Dashboard</span>
          <span className="block text-xs text-slate-400">Open IT Institute</span>
        </span>
      </Link>

      <nav className="space-y-1">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={linkClass} onClick={() => setOpen(false)}>
            <BlogIcon name={n.icon} className="h-5 w-5" /> {n.label}
          </NavLink>
        ))}
        <Link
          to="/blogs"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <BlogIcon name="external" className="h-5 w-5" /> View blog
        </Link>
      </nav>

      <div className="mt-auto space-y-2 border-t border-white/10 pt-4">

        <Link
          to="/admin/dashboard"
         className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#082b55] transition hover:bg-cyan-100"
        >
          <BlogIcon name="external" className="h-5 w-5" /> Back to Main Website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      {/* ডেস্কটপ সাইডবার */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">{Sidebar}</div>
      </aside>

      {/* মোবাইল টপবার */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#082b55] px-4 py-3 text-white lg:hidden">
        <span className="font-black">Blog Dashboard</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg border border-white/20 p-2">
          <BlogIcon name="menu" />
        </button>
      </div>

      {/* মোবাইল ড্রয়ার */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">{Sidebar}</div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
