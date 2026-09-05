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
  FaImage,
  FaImages,
  FaLayerGroup,
  FaArrowRight
} from 'react-icons/fa';

import { motion } from 'framer-motion';

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

      const galleryData =
        res?.data?.gallery ||
        res?.data?.data ||
        res?.gallery ||
        res?.data ||
        [];

      if (res?.success !== false && Array.isArray(galleryData)) {
        setItems(galleryData);
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


    // Validate File Size

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


    setSaving(true);


    try {

      const formData = new FormData();

      formData.append(
        'title',
        form.title.trim()
      );

      formData.append(
        'category',
        form.category
      );

      formData.append(
        'image',
        form.image,
        form.image.name
      );


      const response =
        await createGalleryItem(formData);


      console.log(
        'Upload Response:',
        response
      );


      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Gallery image uploaded successfully!'
      });


      closeModal();

      fetchGallery();


    } catch (err) {

      console.error(
        'Gallery Upload Error:',
        err
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

      const res =
        await deleteGalleryItem(id);


      if (res?.success) {

        setItems((prev) =>
          prev.filter(
            (item) =>
              item._id !== id
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
  // HERO COLLECTION
  // ==========================================

  const heroImages = items
    .filter((item) => item?.image)
    .slice(0, 8);


  // ==========================================
  // FLOATING HERO IMAGE
  // ==========================================

  const FloatingHeroImage = ({
    item,
    index,
    className
  }) => {

    const animations = [
      {
        y: [-8, 8, -8],
        rotate: [-2, 2, -2],
        scale: [1, 1.025, 1]
      },
      {
        y: [7, -7, 7],
        rotate: [2, -2, 2],
        scale: [1.02, 0.98, 1.02]
      },
      {
        y: [-6, 6, -6],
        rotate: [1, -1, 1],
        scale: [1, 1.03, 1]
      },
      {
        y: [8, -5, 8],
        rotate: [-2, 1, -2],
        scale: [1.01, 0.98, 1.01]
      }
    ];


    const animation =
      animations[index % animations.length];


    return (

      <motion.div
        className={`absolute overflow-hidden rounded-3xl border border-white/20 shadow-2xl group ${className}`}
        animate={{
          y: animation.y,
          rotate: animation.rotate,
          scale: animation.scale
        }}
        transition={{
          duration: 6 + index * 0.7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.35
        }}
        whileHover={{
          scale: 1.07,
          rotate: 0,
          zIndex: 30
        }}
      >

        {/* Blur Background */}

        <div
          className="absolute inset-0 scale-110 blur-xl opacity-70"
          style={{
            backgroundImage:
              `url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />


        {/* Image */}

        <img
          src={item.image}
          alt={
            item.title ||
            'Gallery image'
          }
          className="relative w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:blur-0 blur-[1px] transition-all duration-700"
        />


        {/* Dark Glass Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10" />


        {/* Shine */}

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          animate={{
            x: [
              '-100%',
              '200%'
            ]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'easeInOut'
          }}
        />


        {/* Small Label */}

        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

          <div className="px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md text-white text-[10px] truncate">

            {item.title || 'Gallery'}

          </div>

        </div>

      </motion.div>

    );

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="space-y-7">


      {/* ======================================
          PREMIUM GALLERY HERO
      ====================================== */}

      <section className="relative overflow-hidden rounded-[30px] min-h-[440px] bg-[#06111f] border border-slate-800/80 shadow-2xl">


        {/* Background Glow */}

        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="absolute -bottom-40 right-0 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-purple-500/5 blur-[100px]" />


        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '42px 42px'
          }}
        />


        {/* Content */}

        <div className="relative z-10 grid lg:grid-cols-[0.85fr_1.15fr] items-center min-h-[440px]">


          {/* ==================================
              LEFT CONTENT
          ================================== */}

          <div className="px-6 sm:px-10 lg:px-12 py-10 lg:py-12">

            {/* Badge */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.6
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs font-semibold"
            >

              <span className="relative flex h-2 w-2">

                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-70" />

                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />

              </span>

              Open IT Institute • Gallery

            </motion.div>


            {/* Heading */}

            <motion.h1
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.7,
                delay: 0.1
              }}
              className="mt-5 text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.02] tracking-tight text-white"
            >

              Moments That
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Tell Our Story.
              </span>

            </motion.h1>


            {/* Description */}

            <motion.p
              initial={{
                opacity: 0,
                y: 15
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.6,
                delay: 0.2
              }}
              className="mt-5 max-w-xl text-sm sm:text-base leading-7 text-slate-400"
            >

              আমাদের ক্লাস, শিক্ষার্থী, ওয়ার্কশপ,
              ইভেন্ট এবং সাফল্যের সুন্দর মুহূর্তগুলো
              এক জায়গায় সংরক্ষণ করুন।

            </motion.p>


            {/* Stats */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.6,
                delay: 0.3
              }}
              className="flex flex-wrap gap-3 mt-7"
            >

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">

                <FaImages className="text-cyan-400 text-sm" />

                <div>

                  <p className="text-white font-bold text-sm">
                    {items.length}
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Total Images
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">

                <FaLayerGroup className="text-blue-400 text-sm" />

                <div>

                  <p className="text-white font-bold text-sm">
                    6+
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Categories
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={openModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition shadow-lg shadow-cyan-500/20"
              >

                <FaPlus />

                Add New

              </button>

            </motion.div>

          </div>


          {/* ==================================
              RIGHT IMAGE COLLECTION
          ================================== */}

          <div className="relative h-[390px] sm:h-[430px] lg:h-[440px] overflow-hidden">


            {/* Large Glow */}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-400/10 blur-[80px]" />


            {/* Rotating Ring */}

            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] rounded-full border border-dashed border-cyan-300/10"
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear'
              }}
            />


            {/* ==================================
                IMAGE COLLECTION
            ================================== */}

            {heroImages.length > 0 ? (

              <>

                {/* Center */}

                {heroImages[0] && (

                  <FloatingHeroImage
                    item={heroImages[0]}
                    index={0}
                    className="z-20 w-[190px] h-[245px] sm:w-[220px] sm:h-[285px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  />

                )}


                {/* Top Left */}

                {heroImages[1] && (

                  <FloatingHeroImage
                    item={heroImages[1]}
                    index={1}
                    className="z-10 w-[120px] h-[145px] sm:w-[145px] sm:h-[175px] left-[7%] top-[7%]"
                  />

                )}


                {/* Top Right */}

                {heroImages[2] && (

                  <FloatingHeroImage
                    item={heroImages[2]}
                    index={2}
                    className="z-10 w-[115px] h-[140px] sm:w-[140px] sm:h-[170px] right-[8%] top-[5%]"
                  />

                )}


                {/* Bottom Left */}

                {heroImages[3] && (

                  <FloatingHeroImage
                    item={heroImages[3]}
                    index={3}
                    className="z-10 w-[125px] h-[145px] sm:w-[150px] sm:h-[175px] left-[5%] bottom-[7%]"
                  />

                )}


                {/* Bottom Right */}

                {heroImages[4] && (

                  <FloatingHeroImage
                    item={heroImages[4]}
                    index={4}
                    className="z-10 w-[125px] h-[150px] sm:w-[150px] sm:h-[180px] right-[5%] bottom-[6%]"
                  />

                )}


                {/* Far Left */}

                {heroImages[5] && (

                  <FloatingHeroImage
                    item={heroImages[5]}
                    index={5}
                    className="hidden sm:block z-[5] w-[100px] h-[120px] left-[0%] top-[38%]"
                  />

                )}


                {/* Far Right */}

                {heroImages[6] && (

                  <FloatingHeroImage
                    item={heroImages[6]}
                    index={6}
                    className="hidden sm:block z-[5] w-[105px] h-[125px] right-[0%] top-[40%]"
                  />

                )}


                {/* Extra Top Center */}

                {heroImages[7] && (

                  <FloatingHeroImage
                    item={heroImages[7]}
                    index={7}
                    className="hidden md:block z-[4] w-[90px] h-[105px] left-1/2 top-[1%] -translate-x-1/2"
                  />

                )}

              </>

            ) : (

              /* Empty */

              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">

                <FaImages className="text-5xl mb-4 opacity-30" />

                <p className="text-sm">
                  Upload images to create your collection
                </p>

              </div>

            )}


            {/* Bottom Gradient */}

            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#06111f] to-transparent pointer-events-none" />


            {/* Side Gradient */}

            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#06111f] to-transparent pointer-events-none" />

            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#06111f] to-transparent pointer-events-none" />

          </div>

        </div>


        {/* Bottom Line */}

        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          animate={{
            width: ['20%', '80%', '20%'],
            x: ['0%', '10%', '80%']
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

      </section>


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>

          <div className="flex items-center gap-2">

            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">

              <FaImages className="text-primary" />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-dark">
                Gallery
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Manage gallery images
              </p>

            </div>

          </div>

        </div>


        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition"
        >

          <FaPlus />

          Add Image

          <FaArrowRight className="text-xs" />

        </button>

      </div>


      {/* ======================================
          LOADING
      ====================================== */}

      {loading ? (

        <div className="flex flex-col items-center justify-center py-20">

          <FaSpinner className="text-3xl text-primary animate-spin" />

          <p className="text-gray-400 text-sm mt-3">
            Loading gallery...
          </p>

        </div>

      ) : (

        <>
          {/* ======================================
              GALLERY GRID
          ====================================== */}

          {items.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

              {items.map((item) => (

                <motion.div
                  key={item._id}
                  initial={{
                    opacity: 0,
                    y: 15
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                >

                  {/* IMAGE */}

                  <div className="h-48 bg-gray-100 relative overflow-hidden">

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={
                          item.title ||
                          'Gallery Image'
                        }
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            'none';
                        }}
                      />

                    ) : (

                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">

                        <FaImage className="text-3xl mb-2" />

                        <span className="text-xs">
                          No Image
                        </span>

                      </div>

                    )}


                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(item._id)
                      }
                      className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-xl bg-red-500 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-lg"
                      title="Delete Image"
                    >

                      <FaTrash className="text-sm" />

                    </button>

                  </div>


                  {/* CONTENT */}

                  <div className="p-4">

                    <h3 className="font-semibold text-dark text-sm truncate">

                      {item.title}

                    </h3>


                    <span className="inline-flex mt-2 px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary capitalize">

                      {item.category || 'classroom'}

                    </span>

                  </div>

                </motion.div>

              ))}

            </div>

          ) : (

            /* ======================================
                EMPTY STATE
            ====================================== */

            <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">

              <FaImage className="mx-auto text-5xl mb-4 text-gray-300" />

              <h3 className="font-semibold text-gray-600">
                No Gallery Images
              </h3>

              <p className="text-sm mt-1">
                Upload your first gallery image.
              </p>


              <button
                type="button"
                onClick={openModal}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium"
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

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-5 border-b border-gray-100">

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
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-500 transition disabled:opacity-50"
              >

                <FaTimes />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50"
                />

              </div>


              {/* IMAGE UPLOAD */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image *
                </label>


                {!preview ? (

                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition">

                    <FaUpload className="text-2xl text-primary mb-3" />

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

                  <div className="relative h-52 rounded-2xl overflow-hidden bg-gray-100 group">

                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />


                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={saving}
                      className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg transition"
                      title="Remove Image"
                    >

                      <FaTimes />

                    </button>


                    <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-black/50 text-white text-xs">

                      Image Preview

                    </div>

                  </div>

                )}

              </div>


              {/* CATEGORY */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50"
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


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 flex items-center gap-2 transition"
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

          </motion.div>

        </div>

      )}

    </div>

  );

};


export default Gallery;