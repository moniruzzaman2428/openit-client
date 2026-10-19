import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBlogs } from '../services/blogApi';
import BlogCard from '../components/BlogCard';

const DEFAULT_BANNER =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2000&q=85';

const CATEGORY_BANNERS = [
  {
    keywords: ['web development', 'web design', 'javascript', 'react', 'programming', 'coding', 'development'],
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=85',
    title: 'Build Your Digital Future',
    description: 'Explore web development, programming and practical coding tutorials.',
  },
  {
    keywords: ['graphic design', 'design', 'photoshop', 'illustrator', 'creative'],
    image:
      'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=2000&q=85',
    title: 'Creativity Meets Technology',
    description: 'Discover graphic design techniques, creative ideas and digital art.',
  },
  {
    keywords: ['artificial intelligence', 'ai', 'technology', 'tech', 'machine learning'],
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=2000&q=85',
    title: 'Explore the World of AI',
    description: 'Discover artificial intelligence, innovation and emerging technologies.',
  },
  {
    keywords: ['career', 'freelancing', 'freelance', 'job', 'jobs', 'remote work'],
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=85',
    title: 'Grow Your Career',
    description: 'Build professional skills and explore career and freelancing opportunities.',
  },
  {
    keywords: ['computer', 'hardware', 'networking', 'office', 'basic computer'],
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2000&q=85',
    title: 'Learn Practical IT Skills',
    description: 'Explore computer fundamentals, office applications and networking.',
  },
  {
    keywords: ['education', 'learning', 'tutorial', 'student', 'study'],
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=85',
    title: 'Learn Something New',
    description: 'Discover learning resources, practical guides and educational insights.',
  },
];

function getBanner(category) {
  if (!category) {
    return {
      image: DEFAULT_BANNER,
      title: 'Institute News',
      description:
        'Explore practical technology, career and learning articles.',
    };
  }

  const normalizedCategory = category.toLowerCase().trim();

  const match = CATEGORY_BANNERS.find(({ keywords }) =>
    keywords.some((keyword) => normalizedCategory.includes(keyword))
  );

  if (match) {
    return {
      ...match,
      title: category,
    };
  }

  // Unknown categories receive the default banner image,
  // while the actual category name remains visible.
  return {
    image: DEFAULT_BANNER,
    title: category,
    description: `Explore our latest ${category} articles, tips and insights.`,
  };
}

export default function BlogPage() {
  const [params, setParams] = useSearchParams();

  const category = params.get('category') || '';
  const query = params.get('search') || '';
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1);

  const [search, setSearch] = useState(query);
  const [data, setData] = useState({ blogs: [], totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const banner = useMemo(() => getBanner(category), [category]);

  const update = (patch) => {
    const next = new URLSearchParams(params);

    Object.entries(patch).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        next.set(key, String(value));
      } else {
        next.delete(key);
      }
    });

    setParams(next);
  };

  // Keep the search input synchronized with URL changes.
  useEffect(() => {
    setSearch(query);
  }, [query]);

  // Debounced search.
  useEffect(() => {
    const normalizedSearch = search.trim();

    if (normalizedSearch === query) return undefined;

    const timer = setTimeout(() => {
      const next = new URLSearchParams(params);

      if (normalizedSearch) {
        next.set('search', normalizedSearch);
      } else {
        next.delete('search');
      }

      next.delete('page');
      setParams(next);
    }, 350);

    return () => clearTimeout(timer);
  }, [search, query, params, setParams]);

  // Fetch articles.
  useEffect(() => {
    let live = true;

    setLoading(true);
    setError('');

    getBlogs({ search: query, category, page, limit: 9 })
      .then((response) => {
        if (!live) return;

        setData(response.data || { blogs: [], totalPages: 1 });
      })
      .catch(() => {
        if (!live) return;

        setError('Could not load articles. Please try again.');
      })
      .finally(() => {
        if (live) setLoading(false);
      });

    return () => {
      live = false;
    };
  }, [query, category, page]);

  const changePage = (nextPage) => {
    const next = new URLSearchParams(params);

    if (nextPage > 1) {
      next.set('page', String(nextPage));
    } else {
      next.delete('page');
    }

    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.max(1, Number(data.totalPages) || 1);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Dynamic category hero */}
      <section
        className="relative isolate flex min-h-[300px] items-center justify-center overflow-hidden bg-[#082b55] bg-cover bg-center px-4 py-14 text-center text-white sm:min-h-[350px] sm:px-6 sm:py-16 lg:min-h-[390px]"
        style={{
          backgroundImage: `url("${banner.image}")`,
        }}
      >
        {/* Image readability overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-[#04152f]/95 via-[#082b55]/80 to-[#087da0]/65"
        />

        {/* Subtle decorative glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.20),transparent_55%)]"
        />

        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100 shadow-sm backdrop-blur-md sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Open IT Institute
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
            {banner.title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-100 sm:text-base md:text-lg">
            {banner.description}
          </p>

          {/* Search */}
          <div className="mx-auto mt-7 w-full max-w-2xl sm:mt-9">
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white p-2 shadow-[0_18px_55px_rgba(0,0,0,0.25)] transition focus-within:ring-4 focus-within:ring-cyan-300/40">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#075b96]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>
              </span>

              <input
                id="blog-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search articles, tutorials, topics..."
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="m18 6-12 12M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <p className="mt-3 text-xs font-medium text-slate-200 sm:text-sm">
              Practical knowledge. Real skills. Better opportunities.
            </p>
          </div>
        </div>

        {/* Bottom transition */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-50/15 to-transparent"
        />
      </section>

      {/* Article list */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
              Open IT Institute Blog
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {query ? 'Search Results' : category ? `${category} Articles` : 'Latest Articles'}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Learn new skills with practical guides and insights.
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p className="font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => {
                setParams(new URLSearchParams(params));
              }}
              className="mt-2 font-bold underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div
            role="status"
            aria-live="polite"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-[16/9] animate-pulse bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : data.blogs?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center sm:py-20">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-7 w-7"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No articles found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try a different search term or explore another category.
            </p>

            {(query || category) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setParams({});
                }}
                className="mt-5 rounded-xl bg-[#075b96] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#082b55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
              >
                View all articles
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && data.blogs?.length > 0 && (
          <nav
            aria-label="Article pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => changePage(page - 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <span className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => changePage(page + 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}