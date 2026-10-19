import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify'; // npm i dompurify
import { createBlog, getAdminBlog, updateBlog } from '../services/blogApi';
import { BLOG_CATEGORIES } from '../constants/blogCategories';
import '../styles/article-content.css';
const blank = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: BLOG_CATEGORIES[0],
  tags: [],
  featured: false,
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
};

const TEXT_FIELDS = [
  ['title', 'Article title'],
  ['slug', 'Slug (URL, English recommended — leave empty to auto-generate)'],
  ['excerpt', 'Short excerpt'],
  ['coverImage', 'Cover image URL'],
  ['seoTitle', 'SEO title'],
  ['seoDescription', 'SEO description'],
];

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(blank);
  const [tagsText, setTagsText] = useState('');
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getAdminBlog(id)
      .then((r) => {
        const blog = r.data.blog;
        setForm({ ...blank, ...blog });
        setTagsText((blog.tags || []).join(', '));
      })
      .catch(() => setError('Could not load article'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // প্রিভিউও sanitize করা হলো
  const previewHtml = useMemo(
    () =>
      DOMPurify.sanitize(form.content || '', {
        ADD_ATTR: ['style', 'class'],
        FORBID_TAGS: [
          'script',
          'iframe',
          'object',
          'embed',
          'form',
        ],
        FORBID_ATTR: [
          'onerror',
          'onload',
          'onclick',
          'onmouseover',
        ],
      }),
    [form.content]
  );

  const save = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) {
      setError('Article content is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: tagsText.split(',').map((x) => x.trim()).filter(Boolean),
      };
      if (id) await updateBlog(id, payload);
      else await createBlog(payload);
      navigate('/admin/blogs/articles');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8">Loading editor...</p>;

  return (
    <form onSubmit={save} className="mx-auto max-w-5xl space-y-5 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-black text-[#082b55]">{id ? 'Edit Article' : 'Create Article'}</h1>
        <p className="text-slate-500">Write, preview and publish your content</p>
      </div>

      {error && <p role="alert" className="text-red-600">{error}</p>}

      <div className="grid gap-5 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {TEXT_FIELDS.map(([key, label]) => (
            <label key={key} className="block rounded-xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm">
              {label}
              {key === 'excerpt' || key === 'seoDescription' ? (
                <textarea
                  required={key === 'excerpt'}
                  value={form[key] || ''}
                  onChange={(e) => set(key, e.target.value)}
                  rows={2}
                  maxLength={key === 'excerpt' ? 350 : 300}
                  className="mt-2 w-full rounded-lg border p-3 font-normal"
                />
              ) : (
                <input
                  required={key === 'title'}
                  maxLength={key === 'title' ? 180 : undefined}
                  value={form[key] || ''}
                  onChange={(e) => set(key, e.target.value)}
                  className="mt-2 w-full rounded-lg border p-3 font-normal"
                />
              )}
            </label>
          ))}

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <label htmlFor="content" className="block text-sm font-bold">Article content (HTML)</label>
            <p className="my-2 text-xs text-slate-500">
              Supports headings, paragraphs, lists, links and images. HTML is sanitized by the server.
            </p>
            <textarea
              id="content"
              required
              rows={16}
              value={form.content || ''}
              onChange={(e) => set('content', e.target.value)}
              className="w-full rounded-lg border p-3 font-mono text-sm"
            />
            <h3 className="mt-4 font-bold">Preview</h3>
            <div
              className="article-content prose mt-2 max-w-none rounded-xl border border-slate-200 bg-white p-5 md:p-8"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
            <label className="block text-sm font-bold">
              Category
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="mt-2 w-full rounded-lg border p-3"
              >
                {BLOG_CATEGORIES.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-bold">
              Status
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="mt-2 w-full rounded-lg border p-3"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>

            <label className="block text-sm font-bold">
              Tags (comma separated)
              <input
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                className="mt-2 w-full rounded-lg border p-3 font-normal"
              />
            </label>

            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(e) => set('featured', e.target.checked)}
              />
              Featured article
            </label>

            <button
              disabled={saving}
              className="w-full rounded-xl bg-[#075b96] p-3 font-bold text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : id ? 'Save Changes' : 'Create Article'}
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}
