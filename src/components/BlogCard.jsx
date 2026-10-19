import { Link } from 'react-router-dom';

export default function BlogCard({ blog }) {
  return (
    <Link
      to={`/blogs/${blog.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#082b55] to-cyan-600">
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        {blog.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">{blog.category}</span>
        <h2 className="mt-2 line-clamp-2 text-xl font-bold text-slate-900">{blog.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm text-slate-600">{blog.excerpt}</p>
        <div className="mt-5 flex justify-between text-xs text-slate-500">
          <span>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : ''}</span>
          <span>{blog.readTime || 1} min read</span>
        </div>
      </div>
    </Link>
  );
}
