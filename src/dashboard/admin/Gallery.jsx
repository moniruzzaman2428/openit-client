import {
  useState,
  useEffect,
  useRef
} from 'react';

import {
  FaPlus,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaUpload,
  FaImage
} from 'react-icons/fa';

import Swal from 'sweetalert2';

import {
  getGallery,
  createGalleryItem,
  deleteGalleryItem
} from '../../services/contentService';


const Gallery = () => {

  // ==========================================
  // STATES
  // ==========================================

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);


  // ==========================================
  // FORM STATE
  // ==========================================

  const [form, setForm] = useState({
    title: '',
    image: null,
    category: 'classroom'
  });


  // ==========================================
  // FETCH GALLERY
  // ==========================================

  const fetchGallery = async () => {

    setLoading(true);

    try {

      const res = await getGallery();

      console.log('Gallery Response:', res);

      if (res?.success) {
        setItems(res?.data?.gallery || []);
      } else {
        setItems([]);
      }

    } catch (err) {

      console.error('Gallery Fetch Error:', err);

      setItems([]);

      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Gallery',
        text:
          err.response?.data?.message ||
          'Could not load gallery images.'
      });

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD GALLERY
  // ==========================================

  useEffect(() => {

    fetchGallery();

  }, []);


  // ==========================================
  // CLEANUP PREVIEW
  // ==========================================

  useEffect(() => {

    return () => {

      if (preview) {
        URL.revokeObjectURL(preview);
      }

    };

  }, [preview]);


  // ==========================================
  // HANDLE IMAGE SELECT
  // ==========================================

  const handleImageChange = (e) => {

    const file = e.target.files?.[0];

    if (!file) return;


    // Validate Image Type
    if (!file.type.startsWith('image/')) {

      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select a valid image file.'
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }


    // Validate File Size (5MB)
    if (file.size > 5 * 1024 * 1024) {

      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Maximum image size is 5MB.'
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }


    // Remove Previous Preview
    if (preview) {
      URL.revokeObjectURL(preview);
    }


    // Create New Preview
    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);


    // Save Image
    setForm((prev) => ({
      ...prev,
      image: file
    }));

  };


  // ==========================================
  // REMOVE SELECTED IMAGE
  // ==========================================

  const removeImage = () => {

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);


    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }


    setForm((prev) => ({
      ...prev,
      image: null
    }));

  };


  // ==========================================
  // OPEN MODAL
  // ==========================================

  const openModal = () => {

    setShowModal(true);

  };


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setShowModal(false);

    setPreview(null);


    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }


    setForm({
      title: '',
      image: null,
      category: 'classroom'
    });

  };


  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Title Required',
        text: 'Please enter an image title.'
      });

      return;
    }

    if (!form.image) {
      Swal.fire({
        icon: 'warning',
        title: 'Image Required',
        text: 'Please select an image.'
      });

      return;
    }

    console.log('Selected File:', form.image);
    console.log('File Name:', form.image.name);
    console.log('File Type:', form.image.type);
    console.log('File Size:', form.image.size);

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append('title', form.title.trim());
      formData.append('category', form.category);

      // VERY IMPORTANT
      formData.append(
        'image',
        form.image,
        form.image.name
      );

      const response = await createGalleryItem(formData);

      console.log('Upload Response:', response);

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Gallery image uploaded successfully!'
      });

      closeModal();
      fetchGallery();

    } catch (err) {

      console.error('Gallery Upload Error:', err);

      console.log(
        'Server Error Response:',
        err.response?.data
      );

      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text:
          err.response?.data?.message ||
          'Error uploading image'
      });

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE IMAGE
  // ==========================================

  const handleDelete = async (id) => {

    const result = await Swal.fire({

      title: 'Delete Image?',

      text:
        'This image will be permanently deleted from the gallery.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#EF4444',

      cancelButtonColor: '#6B7280',

      confirmButtonText: 'Yes, Delete',

      cancelButtonText: 'Cancel'

    });


    if (!result.isConfirmed) return;


    try {

      const res = await deleteGalleryItem(id);


      if (res?.success) {

        // Remove immediately from UI
        setItems((prev) =>
          prev.filter(
            (item) => item._id !== id
          )
        );


        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text:
            'Gallery image deleted successfully.',
          timer: 1500,
          showConfirmButton: false
        });

      } else {

        throw new Error(
          res?.message ||
          'Failed to delete image'
        );

      }


    } catch (err) {

      console.error(
        'Gallery Delete Error:',
        err
      );


      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text:
          err.response?.data?.message ||
          err.message ||
          'Error deleting image.'
      });

    }

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="space-y-6">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>

          <h1 className="text-2xl font-bold text-dark">
            Gallery
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage gallery images
          </p>

        </div>


        <button
          type="button"
          onClick={openModal}
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2.5
            bg-primary
            text-white
            rounded-xl
            text-sm
            font-semibold
            hover:bg-primary/90
            shadow-lg
            shadow-primary/25
            transition
          "
        >

          <FaPlus />

          Add Image

        </button>

      </div>



      {/* ======================================
          LOADING
      ====================================== */}

      {loading ? (

        <div className="flex flex-col items-center justify-center py-20">

          <FaSpinner
            className="
              text-3xl
              text-primary
              animate-spin
            "
          />

          <p className="text-gray-400 text-sm mt-3">
            Loading gallery...
          </p>

        </div>

      ) : (


        /* ======================================
            GALLERY GRID
        ====================================== */

        <>

          {items.length > 0 ? (

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-5
              "
            >

              {items.map((item) => (

                <div
                  key={item._id}
                  className="
                    bg-white
                    rounded-2xl
                    border
                    border-gray-100
                    overflow-hidden
                    shadow-sm
                    hover:shadow-lg
                    transition-all
                    duration-300
                    group
                  "
                >


                  {/* IMAGE */}

                  <div
                    className="
                      h-48
                      bg-gray-100
                      relative
                      overflow-hidden
                    "
                  >

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={
                          item.title ||
                          'Gallery Image'
                        }
                        loading="lazy"
                        className="
                          w-full
                          h-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-110
                        "
                        onError={(e) => {

                          e.currentTarget.style.display =
                            'none';

                        }}
                      />

                    ) : (

                      <div
                        className="
                          w-full
                          h-full
                          flex
                          flex-col
                          items-center
                          justify-center
                          text-gray-400
                        "
                      >

                        <FaImage className="text-3xl mb-2" />

                        <span className="text-xs">
                          No Image
                        </span>

                      </div>

                    )}


                    {/* DELETE BUTTON */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(item._id)
                      }
                      className="
                        absolute
                        top-3
                        right-3
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-500
                        text-white
                        opacity-0
                        group-hover:opacity-100
                        transition
                        hover:bg-red-600
                        shadow-lg
                      "
                      title="Delete Image"
                    >

                      <FaTrash className="text-sm" />

                    </button>

                  </div>



                  {/* CONTENT */}

                  <div className="p-4">

                    <h3
                      className="
                        font-semibold
                        text-dark
                        text-sm
                        truncate
                      "
                    >

                      {item.title}

                    </h3>


                    <span
                      className="
                        inline-flex
                        mt-2
                        px-2.5
                        py-1
                        text-xs
                        rounded-full
                        bg-primary/10
                        text-primary
                        capitalize
                      "
                    >

                      {item.category || 'classroom'}

                    </span>

                  </div>

                </div>

              ))}

            </div>

          ) : (


            /* ======================================
                EMPTY STATE
            ====================================== */

            <div
              className="
                text-center
                py-20
                text-gray-400
                bg-white
                rounded-2xl
                border
                border-gray-100
              "
            >

              <FaImage
                className="
                  mx-auto
                  text-5xl
                  mb-4
                  text-gray-300
                "
              />

              <h3 className="font-semibold text-gray-600">
                No Gallery Images
              </h3>

              <p className="text-sm mt-1">
                Upload your first gallery image.
              </p>


              <button
                type="button"
                onClick={openModal}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  bg-primary
                  text-white
                  rounded-xl
                  text-sm
                  font-medium
                "
              >

                <FaPlus />

                Add First Image

              </button>

            </div>

          )}

        </>

      )}



      {/* ======================================
          UPLOAD MODAL
      ====================================== */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-black/60
            backdrop-blur-sm
          "
        >

          <div
            className="
              bg-white
              rounded-2xl
              w-full
              max-w-md
              shadow-2xl
              overflow-hidden
            "
          >


            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                p-5
                border-b
                border-gray-100
              "
            >

              <div>

                <h2 className="text-lg font-bold text-dark">
                  Add Gallery Image
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Upload a new image to your gallery
                </p>

              </div>


              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="
                  p-2
                  rounded-lg
                  text-gray-400
                  hover:bg-gray-100
                  hover:text-red-500
                  transition
                  disabled:opacity-50
                "
              >

                <FaTimes />

              </button>

            </div>



            {/* ==================================
                FORM
            ================================== */}

            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-5"
            >


              {/* TITLE */}

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    mb-1.5
                  "
                >

                  Image Title *

                </label>


                <input
                  type="text"
                  required
                  disabled={saving}
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      title: e.target.value
                    }))
                  }
                  placeholder="Enter image title"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-gray-200
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/30
                    focus:border-primary
                    disabled:bg-gray-50
                  "
                />

              </div>



              {/* ==================================
                  IMAGE UPLOAD
              ================================== */}

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    mb-2
                  "
                >

                  Upload Image *

                </label>


                {!preview ? (

                  <label
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center
                      w-full
                      h-44
                      border-2
                      border-dashed
                      border-gray-300
                      rounded-2xl
                      cursor-pointer
                      hover:border-primary
                      hover:bg-primary/5
                      transition
                    "
                  >

                    <FaUpload
                      className="
                        text-2xl
                        text-primary
                        mb-3
                      "
                    />


                    <span className="text-sm font-medium text-gray-600">

                      Click to upload image

                    </span>


                    <span className="text-xs text-gray-400 mt-2">

                      JPG, PNG, WEBP • Maximum 5MB

                    </span>


                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      disabled={saving}
                      className="hidden"
                    />

                  </label>

                ) : (

                  <div
                    className="
                      relative
                      h-52
                      rounded-2xl
                      overflow-hidden
                      bg-gray-100
                      group
                    "
                  >

                    <img
                      src={preview}
                      alt="Preview"
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />


                    {/* REMOVE IMAGE */}

                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={saving}
                      className="
                        absolute
                        top-3
                        right-3
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        bg-red-500
                        text-white
                        rounded-xl
                        hover:bg-red-600
                        shadow-lg
                        transition
                      "
                      title="Remove Image"
                    >

                      <FaTimes />

                    </button>


                    {/* PREVIEW LABEL */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        px-4
                        py-2
                        bg-black/50
                        text-white
                        text-xs
                      "
                    >

                      Image Preview

                    </div>

                  </div>

                )}

              </div>



              {/* ==================================
                  CATEGORY
              ================================== */}

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    mb-1.5
                  "
                >

                  Category

                </label>


                <select
                  value={form.category}
                  disabled={saving}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value
                    }))
                  }
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/30
                    focus:border-primary
                    disabled:bg-gray-50
                  "
                >

                  <option value="classroom">
                    Classroom
                  </option>

                  <option value="events">
                    Events
                  </option>

                  <option value="workshops">
                    Workshops
                  </option>

                  <option value="students">
                    Students
                  </option>

                  <option value="certificate">
                    Certificate
                  </option>

                </select>

              </div>



              {/* ==================================
                  BUTTONS
              ================================== */}

              <div
                className="
                  flex
                  justify-end
                  gap-3
                  pt-3
                "
              >

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-gray-200
                    text-sm
                    font-medium
                    text-gray-600
                    hover:bg-gray-50
                    disabled:opacity-50
                    transition
                  "
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    bg-primary
                    text-white
                    text-sm
                    font-semibold
                    hover:bg-primary/90
                    disabled:opacity-60
                    flex
                    items-center
                    gap-2
                    transition
                  "
                >

                  {saving && (
                    <FaSpinner className="animate-spin" />
                  )}


                  {saving
                    ? 'Uploading...'
                    : 'Upload Image'
                  }

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
