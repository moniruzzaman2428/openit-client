import { useEffect, useState } from 'react';
import {
  FaEdit,
  FaPlus,
  FaSpinner,
  FaStar,
  FaTimes,
  FaTrash,
  FaUserGraduate,
  FaImage,
} from 'react-icons/fa';
import Swal from 'sweetalert2';

import {
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
} from '../../services/contentService';

const fallbackImage =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&crop=face';

const emptyForm = {
  studentName: '',
  course: '',
  review: '',
  rating: 5,
  photo: '',
};

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // ============================================================
  // FETCH TESTIMONIALS
  // ============================================================

  const fetchItems = async () => {
    setLoading(true);

    try {
      const res = await getTestimonials();
      setItems(res.data?.testimonials || []);
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text:
          err.response?.data?.message ||
          'Could not load testimonials.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ============================================================
  // CREATE
  // ============================================================

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // ============================================================
  // EDIT
  // ============================================================

  const openEdit = (item) => {
    setEditing(item);

    setForm({
      studentName: item.studentName || '',
      course: item.course || '',
      review: item.review || '',
      rating: item.rating || 5,
      photo: item.photo || '',
    });

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
  };

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
    }));
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Student name required',
      });
      return;
    }

    if (!form.course.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Course required',
      });
      return;
    }

    if (!form.review.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Review required',
      });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        studentName: form.studentName.trim(),
        course: form.course.trim(),
        review: form.review.trim(),
        rating: Number(form.rating),
        photo: form.photo.trim(),
      };

      if (editing) {
        await updateTestimonial(editing._id, payload);

        Swal.fire({
          icon: 'success',
          title: 'Updated',
          timer: 1300,
          showConfirmButton: false,
        });
      } else {
        await createTestimonial(payload);

        Swal.fire({
          icon: 'success',
          title: 'Added',
          timer: 1300,
          showConfirmButton: false,
        });
      }

      setShowModal(false);
      setEditing(null);
      setForm(emptyForm);

      await fetchItems();
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text:
          err.response?.data?.message ||
          'Could not save testimonial.',
      });
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete testimonial?',
      text: 'This testimonial will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTestimonial(id);

      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        timer: 1200,
        showConfirmButton: false,
      });

      await fetchItems();
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text:
          err.response?.data?.message ||
          'Could not delete testimonial.',
      });
    }
  };

  // ============================================================
  // IMAGE ERROR
  // ============================================================

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallbackImage;
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark">
            Testimonials
          </h1>

          <p className="text-sm text-gray-500">
            Manage database-backed student reviews
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90"
        >
          <FaPlus />
          Add Testimonial
        </button>
      </div>

      {/* ========================================================
          LOADING
      ======================================================== */}

      {loading ? (
        <div className="flex justify-center py-16">
          <FaSpinner className="animate-spin text-2xl text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div
              key={t._id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* ==================================================
                  STUDENT IMAGE
              ================================================== */}

              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={t.studentName || 'Student'}
                    onError={handleImageError}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FaUserGraduate className="text-3xl" />
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1.5 backdrop-blur-md">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-[10px] ${
                        i < Number(t.rating || 5)
                          ? 'text-yellow-400'
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* ==================================================
                  CONTENT
              ================================================== */}

              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-bold text-dark">
                    {t.studentName}
                  </h3>

                  <p className="mt-0.5 text-xs font-medium text-primary">
                    {t.course}
                  </p>
                </div>

                <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-500">
                  {t.review}
                </p>

                <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => openEdit(t)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 transition hover:text-amber-700 hover:underline"
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t._id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger transition hover:text-red-700 hover:underline"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          EMPTY STATE
      ======================================================== */}

      {!loading && items.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center text-gray-400">
          <FaUserGraduate className="mx-auto mb-3 text-3xl text-gray-300" />

          <p>No testimonials yet.</p>

          <button
            onClick={openCreate}
            className="mt-4 text-sm font-semibold text-primary hover:underline"
          >
            Add your first testimonial
          </button>
        </div>
      )}

      {/* ========================================================
          ADD / EDIT MODAL
      ======================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-dark">
                  {editing
                    ? 'Update Testimonial'
                    : 'Add Testimonial'}
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Add student information and review
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                <FaTimes />
              </button>
            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="max-h-[75vh] space-y-4 overflow-y-auto p-5"
            >
              {/* ==================================================
                  PHOTO
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Student Photo
                </label>

                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                    {form.photo ? (
                      <img
                        src={form.photo}
                        alt="Student preview"
                        onError={handleImageError}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <FaUserGraduate className="text-2xl" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <FaImage className="text-primary" />

                      <span className="text-xs font-medium text-gray-600">
                        Image URL
                      </span>
                    </div>

                    <input
                      type="url"
                      name="photo"
                      value={form.photo}
                      onChange={handleChange}
                      placeholder="https://example.com/student-photo.jpg"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />

                    <p className="mt-1 text-[11px] text-gray-400">
                      Paste a public image URL
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  STUDENT NAME
              ================================================== */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Student Name *
                </label>

                <input
                  required
                  type="text"
                  name="studentName"
                  value={form.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* ==================================================
                  COURSE
              ================================================== */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Course *
                </label>

                <input
                  required
                  type="text"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="e.g. Web Development"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* ==================================================
                  REVIEW
              ================================================== */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Review *
                </label>

                <textarea
                  required
                  rows={4}
                  name="review"
                  value={form.review}
                  onChange={handleChange}
                  placeholder="Write student's testimonial..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm leading-6 transition focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* ==================================================
                  RATING
              ================================================== */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Rating
                </label>

                <div className="flex items-center gap-3">
                  <select
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>

                  <div className="flex shrink-0 items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < Number(form.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* ==================================================
                  BUTTONS
              ================================================== */}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : editing ? (
                    <>
                      <FaEdit />
                      Update
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Add
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;