import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { getBlog } from '../services/blogApi';
import BlogCard from '../components/BlogCard';
import '../styles/article-content.css';

const SITE = 'Open IT Institute';
const SITE_URL = 'https://openitinstitute.com';

const setMeta = (attr, key, value) => {
  const selector = `meta[${attr}="${key}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', value || '');
};

const formatDate = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

function MetaItem({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
      <span aria-hidden="true" className="text-cyan-700">
        {icon}
      </span>
      {children}
    </span>
  );
}

function ArticleLoader() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl animate-pulse space-y-5">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="h-10 w-4/5 rounded-lg bg-slate-200" />
        <div className="h-4 w-2/5 rounded bg-slate-100" />
        <div className="aspect-[16/8] rounded-2xl bg-slate-200" />
        <div className="space-y-3 pt-4">
          <div className="h-4 rounded bg-slate-100" />
          <div className="h-4 w-11/12 rounded bg-slate-100" />
          <div className="h-4 w-4/5 rounded bg-slate-100" />
        </div>
      </div>
    </main>
  );
}

export default function BlogDetails() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let live = true;

    setBlog(null);
    setRelated([]);
    setError('');
    setImageError(false);

    window.scrollTo({ top: 0, behavior: 'auto' });

    getBlog(slug)
      .then((response) => {
        if (!live) return;

        const article = response.data?.blog;

        if (!article) {
          setError('Article not found');
          return;
        }

        setBlog(article);
        setRelated(response.data?.related || []);
      })
      .catch(() => {
        if (live) setError('Could not load this article.');
      });

    return () => {
      live = false;
    };
  }, [slug]);

  // Sanitize article HTML before rendering.
  const safeContent = useMemo(() => {
    return DOMPurify.sanitize(blog?.content || '', {
      USE_PROFILES: { html: true },
      FORBID_TAGS: [
        'script',
        'iframe',
        'object',
        'embed',
        'form',
        'style',
      ],
      FORBID_ATTR: ['style'],
    });
  }, [blog?.content]);

  // SEO and social-sharing metadata.
  useEffect(() => {
    if (!blog) return undefined;

    const previousTitle = document.title;
    const previousMeta = [];

    const title = `${blog.seoTitle || blog.title} | ${SITE}`;
    const description =
      blog.seoDescription ||
      blog.excerpt ||
      `Read ${blog.title} on ${SITE}.`;

    const canonicalUrl = `${SITE_URL}/blogs/${blog.slug || slug}`;

    const metadata = [
      ['name', 'description', description],
      ['property', 'og:type', 'article'],
      ['property', 'og:site_name', SITE],
      ['property', 'og:title', title],
      ['property', 'og:description', description],
      ['property', 'og:url', canonicalUrl],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', title],
      ['name', 'twitter:description', description],
    ];

    if (blog.coverImage) {
      metadata.push(['property', 'og:image', blog.coverImage]);
      metadata.push(['name', 'twitter:image', blog.coverImage]);
    }

    metadata.forEach(([attr, key, value]) => {
      const selector = `meta[${attr}="${key}"]`;
      const existing = document.head.querySelector(selector);

      previousMeta.push({
        attr,
        key,
        existed: Boolean(existing),
        content: existing?.getAttribute('content'),
      });

      setMeta(attr, key, value);
    });

    document.title = title;

    return () => {
      document.title = previousTitle;

      previousMeta.forEach(({ attr, key, existed, content }) => {
        const selector = `meta[${attr}="${key}"]`;
        const element = document.head.querySelector(selector);

        if (!element) return;

        if (existed) {
          element.setAttribute('content', content ?? '');
        } else {
          element.remove();
        }
      });
    };
  }, [blog, slug]);

  if (error) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-3xl">
            📄
          </div>

          <h1 className="mt-5 text-2xl font-black text-[#082b55]">
            Article not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            The article may have been removed or the link may be incorrect.
          </p>

          <Link
            to="/blogs"
            className="mt-6 inline-flex rounded-xl bg-[#075b96] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#082b55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            ← Explore all articles
          </Link>
        </div>
      </main>
    );
  }

  if (!blog) return <ArticleLoader />;

  const publishedDate = formatDate(blog.publishedAt);
  const readTime = Math.max(1, Number(blog.readTime) || 1);
  const views = Math.max(0, Number(blog.views) || 0);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Article hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061a35] via-[#082b55] to-[#087da0] px-4 py-9 text-white sm:px-6 sm:py-12 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.20),transparent_55%)]"
        />

        <div className="relative mx-auto max-w-5xl">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-cyan-100 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <span aria-hidden="true">←</span>
            All articles
          </Link>

          {blog.category && (
            <div className="mt-7">
              <Link
                to={`/blogs?category=${encodeURIComponent(blog.category)}`}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-white/10 px-4 py-2 text-xs font-bold text-cyan-100 backdrop-blur-sm transition hover:bg-white/20 sm:text-sm"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                {blog.category}
              </Link>
            </div>
          )}

          <h1 className="mt-5 max-w-4xl break-words text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
              {blog.excerpt}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/15 pt-5">
            {publishedDate && (
              <MetaItem icon="◷">
                {publishedDate}
              </MetaItem>
            )}

            <MetaItem icon="◉">
              {readTime} min read
            </MetaItem>

            <MetaItem icon="↗">
              {views.toLocaleString()} views
            </MetaItem>
          </div>
        </div>
      </section>

      {/* Article and related content */}
      <div className="mx-auto max-w-7xl px-3 py-7 sm:px-6 sm:py-10 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_35px_rgba(15,23,42,0.05)] sm:rounded-3xl">
          {/* Cover image */}
          {blog.coverImage && !imageError && (
            <figure className="m-0 overflow-hidden bg-slate-100">
              <img
                src={blog.coverImage}
                alt={blog.title || 'Article cover'}
                className="max-h-[520px] w-full object-cover"
                loading="eager"
                fetchPriority="high"
                onError={() => setImageError(true)}
              />
            </figure>
          )}

          {/* Rich article content */}
          <div className="px-5 py-7 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
            <div
              className="article-content blog-article-content prose prose-slate max-w-none break-words
                prose-headings:scroll-mt-24
                prose-headings:font-extrabold prose-headings:tracking-tight
                prose-h1:text-3xl prose-h1:text-[#082b55]
                prose-h2:mt-10 prose-h2:text-2xl prose-h2:text-[#082b55]
                prose-h3:mt-8 prose-h3:text-xl prose-h3:text-[#075b96]
                prose-p:text-[15px] prose-p:leading-8 prose-p:text-slate-700
                sm:prose-p:text-base
                prose-a:font-semibold prose-a:text-cyan-700
                prose-a:underline prose-a:decoration-cyan-300 prose-a:underline-offset-4
                prose-strong:text-slate-900
                prose-li:leading-7 prose-li:marker:text-cyan-600
                prose-blockquote:border-l-4 prose-blockquote:border-cyan-500
                prose-blockquote:rounded-r-xl prose-blockquote:bg-cyan-50
                prose-blockquote:px-5 prose-blockquote:py-3
                prose-blockquote:not-italic prose-blockquote:text-slate-700
                prose-img:mx-auto prose-img:rounded-2xl prose-img:shadow-md
                prose-pre:overflow-x-auto prose-pre:rounded-2xl
                prose-pre:border prose-pre:border-slate-700
                prose-pre:bg-[#0b1220] prose-pre:p-5
                prose-pre:text-sm prose-pre:leading-7
                prose-hr:border-slate-200
                prose-th:bg-slate-100 prose-th:px-4 prose-th:py-3
                prose-td:px-4 prose-td:py-3
                [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto
                [&_figure]:my-8
                [&_figcaption]:mt-2 [&_figcaption]:text-center
                [&_figcaption]:text-sm [&_figcaption]:text-slate-500
                [&_img]:h-auto [&_img]:max-w-full
                [&_pre_code]:whitespace-pre
                [&_iframe]:max-w-full
                [&_video]:w-full [&_video]:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <footer className="border-t border-slate-100 bg-slate-50/80 px-5 py-6 sm:px-9 sm:py-8 lg:px-12">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                Explore related topics
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blogs?search=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </footer>
          )}
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mx-auto mt-12 max-w-7xl sm:mt-16">
            <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
                  Keep learning
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#082b55] sm:text-3xl">
                  Related articles
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Discover more practical guides and insights.
                </p>
              </div>

              <Link
                to="/blogs"
                className="inline-flex w-fit items-center gap-2 text-sm font-bold text-cyan-700 transition hover:text-[#082b55]"
              >
                View all articles <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item._id} blog={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
