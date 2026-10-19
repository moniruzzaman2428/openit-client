import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteBlog, getAdminBlogs, updateBlog } from '../services/blogApi';

export default function AdminBlogs() {
  const [data, setData] = useState({ blogs: [], totalPages: 1, stats: [] });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  const load = useCallback(async () => {
    const current = ++reqId.current; // পুরনো রিকোয়েস্টের উত্তর বাদ দিতে
    setLoading(true);
    try {
      const r = await getAdminBlogs({ page, search: search.trim(), status, limit: 12 });
      if (current !== reqId.current) return;
      setData(r.data);
      setError('');
    } catch (e) {
      if (current === reqId.current) setError(e.response?.data?.message || 'Unable to load blogs');
    } finally {
      if (current === reqId.current) setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const remove = async (id) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      await deleteBlog(id);
      // পেজের শেষ আইটেম মুছলে আগের পেজে যাও
      if (data.blogs.length === 1 && page > 1) setPage((p) => p - 1);
      else load();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  };

  const toggleStatus = async (b) => {
    try {
      await updateBlog(b._id, { status: b.status === 'published' ? 'draft' : 'published' });
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Could not change status');
    }
  };

  const count = (key) => data.stats?.find((x) => x._id === key)?.count || 0;
  const cards = [
    ['Total', count('published') + count('draft')],
    ['Published', count('published')],
    ['Draft', count('draft')],
  ];

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#082b55]">Blog Management</h1>
          <p className="text-sm text-slate-500">Create and manage Open IT Institute articles</p>
        </div>
        <Link to="/admin/blogs/create" className="rounded-xl bg-[#075b96] px-5 py-3 font-bold text-white">
          + New Article
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-[#082b55]">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search title..."
          className="min-w-0 flex-1 rounded-xl border p-3"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border p-3"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {error && <p role="alert" className="text-red-600">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                {['Article', 'Category', 'Status', 'Views', 'Actions'].map((x) => (
                  <th key={x} className="p-4">{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.blogs?.length ? (
                data.blogs.map((b) => (
                  <tr key={b._id} className="border-t">
                    <td className="p-4 font-semibold">{b.title}</td>
                    <td className="p-4">{b.category}</td>
                    <td className="p-4 capitalize">{b.status}</td>
                    <td className="p-4">{b.views}</td>
                    <td className="space-x-3 p-4">
                      {b.status === 'published' && (
                        <Link className="font-bold text-slate-600" to={`/blogs/${b.slug}`} target="_blank">
                          View
                        </Link>
                      )}
                      <Link className="font-bold text-cyan-700" to={`/admin/blogs/edit/${b._id}`}>Edit</Link>
                      <button className="font-bold text-amber-600" onClick={() => toggleStatus(b)}>
                        {b.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button className="font-bold text-red-600" onClick={() => remove(b._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No articles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-lg border px-4 py-2 disabled:opacity-40"
        >
          Previous
        </button>
        <span>{page} / {data.totalPages || 1}</span>
        <button
          disabled={page >= (data.totalPages || 1)}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg border px-4 py-2 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
