import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaUpload
} from 'react-icons/fa';

import Swal from 'sweetalert2';

import {
  getGallery,
  createGalleryItem,
  deleteGalleryItem
} from '../../services/contentService';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: '',
    image: null,
    category: 'classroom'
  });

  // Fetch Gallery
  const fetchGallery = async () => {
    setLoading(true);

    try {
      const res = await getGallery();
      setItems(res.data.gallery || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle Image Select
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate Image
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select a valid image.'
      });
      return;
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Maximum image size is 5MB.'
      });
      return;
    }

    // Remove old preview
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);

    setForm({
      ...form,
      image: file
    });
  };

  // Remove Selected Image
  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);

    setForm({
      ...form,
      image: null
    });
  };

  // Close Modal
  const closeModal = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setShowModal(false);
    setPreview(null);

    setForm({
      title: '',
      image: null,
      category: 'classroom'
    });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      Swal.fire({
        icon: 'warning',
        title: 'Image Required',
        text: 'Please select an image.'
      });
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append('title', form.title);
      formData.append('image', form.image);
      formData.append('category', form.category);

      await createGalleryItem(formData);

      Swal.fire({
        icon: 'success',
        title: 'Added',
        text: 'Gallery image uploaded successfully.',
        timer: 1500,
        showConfirmButton: false
      });

      closeModal();
      fetchGallery();

    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text:
          err.response?.data?.message ||
          'Error uploading image'
      });

    } finally {
      setSaving(false);
    }
  };

  // Delete Image
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete?',
      text: 'This image will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Delete'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteGalleryItem(id);

      fetchGallery();

      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        timer: 1200,
        showConfirmButton: false
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text:
          err.response?.data?.message ||
          'Error deleting image'
      });
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">
            Gallery
          </h1>

          <p className="text-gray-500 text-sm">
            Manage gallery images
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition"
        >
          <FaPlus />
          Add Image
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <FaSpinner className="text-2xl text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group"
            >
              <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">
                    {item.title}
                  </span>
                )}

                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition hover:bg-danger"
                >
                  <FaTrash className="text-xs" />
                </button>

              </div>

              <div className="p-3">
                <p className="font-medium text-dark text-sm">
                  {item.title}
                </p>

                <p className="text-xs text-gray-400 capitalize">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
          No gallery items yet. Upload your first image.
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">

          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">

              <h2 className="text-lg font-bold text-dark">
                Add Gallery Image
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <FaTimes />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-4"
            >

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>

                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image *
                </label>

                {!preview ? (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition">

                    <FaUpload className="text-xl text-gray-400 mb-2" />

                    <span className="text-sm text-gray-500">
                      Click to upload image
                    </span>

                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG, WEBP (Max 5MB)
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>
                ) : (
                  <div className="relative h-48 rounded-xl overflow-hidden">

                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>

                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="classroom">Classroom</option>
                  <option value="events">Events</option>
                  <option value="workshops">Workshops</option>
                  <option value="students">Students</option>
                  <option value="certificate">Certificate</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && (
                    <FaSpinner className="animate-spin" />
                  )}

                  {saving ? 'Uploading...' : 'Upload'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;