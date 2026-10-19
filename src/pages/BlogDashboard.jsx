import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogStats } from '../services/blogApi';
import BlogIcon from './BlogIcon';

const fmt = (n) => Number(n || 0).toLocaleString();

function StatCard({ label, value, icon, tone }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tone}`}>
        <BlogIcon name={icon} className="h-6 w-6" />
      </span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-black text-[#082b55]">{value}</p>
      </div>
    </div>
  );
}

export default function BlogDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    getBlogStats()
      .then((r) => live && setStats(r.data))
      .catch((e) => live && setError(e.response?.data?.message || 'Could not load dashboard'));
    return () => {
      live = false;
    };
  }, []);

  if (error) return <p role="alert" className="p-8 text-red-600">{error}</p>;
  if (!stats) return <p className="p-8">Loading dashboard...</p>;

  const maxCat = Math.max(1, ...stats.byCategory.map((c) => c.count));

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#082b55]">Overview</h1>
          <p className="text-sm text-slate-500">See how your blog is doing at a glance</p>
        </div>
        <Link
          to="/admin/blogs/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#075b96] px-5 py-3 font-bold text-white transition hover:bg-[#064a7a]"
        >
          <BlogIcon name="plus" className="h-4 w-4" /> New article
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total articles" value={fmt(stats.total)} icon="file" tone="bg-sky-100 text-sky-700" />
        <StatCard label="Published" value={fmt(stats.published)} icon="check" tone="bg-emerald-100 text-emerald-700" />
        <StatCard label="Drafts" value={fmt(stats.draft)} icon="edit" tone="bg-amber-100 text-amber-700" />
        <StatCard label="Total views" value={fmt(stats.totalViews)} icon="eye" tone="bg-violet-100 text-violet-700" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* সাম্প্রতিক আর্টিকেল */}
        <section className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-[#082b55]">Recently updated</h2>
            <Link to="/admin/blogs/articles" className="text-sm font-bold text-cyan-700">View all</Link>
          </div>
          {stats.recent.length ? (
            <ul className="divide-y">
              {stats.recent.map((b) => (
                <li key={b._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{b.title}</p>
                    <p className="text-xs text-slate-500">
                      {b.category} · {new Date(b.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        b.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {b.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <Link to={`/admin/blogs/edit/${b._id}`} className="text-sm font-bold text-cyan-700">
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center text-slate-500">
              <p>No articles yet.</p>
              <Link to="/admin/blogs/create" className="mt-2 inline-block font-bold text-cyan-700">
                Write your first article
              </Link>
            </div>
          )}
        </section>

        {/* ক্যাটাগরি */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-black text-[#082b55]">Articles by category</h2>
          {stats.byCategory.length ? (
            <ul className="space-y-4">
              {stats.byCategory.map((c) => (
                <li key={c._id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">{c._id}</span>
                    <span className="text-slate-500">{c.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#075b96] to-cyan-500"
                      style={{ width: `${(c.count / maxCat) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-slate-500">No data yet.</p>
          )}
        </section>
      </div>

      {/* সবচেয়ে বেশি পড়া */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-black text-[#082b55]">Most viewed</h2>
        {stats.top.length ? (
          <ol className="grid gap-3 md:grid-cols-2">
            {stats.top.map((b, i) => (
              <li key={b._id} className="flex items-center gap-4 rounded-xl border border-slate-100 p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 font-black text-slate-600">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link to={`/blogs/${b.slug}`} target="_blank" className="block truncate font-semibold hover:text-cyan-700">
                    {b.title}
                  </Link>
                  <p className="text-xs text-slate-500">{b.category}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-[#082b55]">{fmt(b.views)} views</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-6 text-center text-sm text-slate-500">Published articles will show up here.</p>
        )}
      </section>
    </div>
  );
}
