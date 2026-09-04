import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  FaUserGraduate,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaBookOpen,
  FaCheckCircle,
  FaArrowRight,
  FaSpinner,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaCertificate,
  FaShieldAlt,
  FaClock,
  FaLaptopCode,
  FaAward,
  FaRocket,
} from 'react-icons/fa';

import { submitAdmission } from '../../services/admissionService';
import { getCourses } from '../../services/courseService';

import SEO from '../../components/seo/SEO';
import StructuredData, {
  breadcrumbSchema,
  organizationSchema,
} from '../../components/seo/StructuredData';

const Admission = () => {
  const [searchParams] = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      course: searchParams.get('course') || '',
    },
  });

  // ==================================================
  // LOAD COURSES
  // ==================================================

  useEffect(() => {
    let mounted = true;

    const loadCourses = async () => {
      try {
        setCoursesLoading(true);

        const res = await getCourses({ limit: 50 });

        const courseData = res?.data?.courses || res?.data || [];

        if (mounted && Array.isArray(courseData)) {
          setCourses(courseData);
        }
      } catch (error) {
        console.error('Failed to load courses:', error);

        if (mounted) {
          setCourses([]);
        }
      } finally {
        if (mounted) {
          setCoursesLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      mounted = false;
    };
  }, []);

  // ==================================================
  // COURSE FROM URL
  // ==================================================

  useEffect(() => {
    const courseFromUrl = searchParams.get('course');

    if (courseFromUrl) {
      setValue('course', courseFromUrl);
    }
  }, [searchParams, setValue]);

  // ==================================================
  // WATCH SELECTED COURSE
  // ==================================================

  const selectedCourseSlug = watch('course');

  const selectedCourse = useMemo(() => {
    if (!selectedCourseSlug) return null;

    return (
      courses.find(
        (course) =>
          course.slug === selectedCourseSlug ||
          course._id === selectedCourseSlug
      ) || null
    );
  }, [courses, selectedCourseSlug]);

  // ==================================================
  // SELECTED COURSE PRICE
  // ==================================================

  const selectedCoursePricing = useMemo(() => {
    if (!selectedCourse) {
      return {
        fee: 0,
        discount: 0,
        discounted: 0,
        saving: 0,
      };
    }

    const fee = Number(selectedCourse.fee) || 0;
    const discount = Number(selectedCourse.discount) || 0;

    const discounted =
      discount > 0
        ? Math.round(fee - (fee * discount) / 100)
        : fee;

    return {
      fee,
      discount,
      discounted,
      saving: Math.max(fee - discounted, 0),
    };
  }, [selectedCourse]);

  // ==================================================
  // SUBMIT
  // ==================================================

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const res = await submitAdmission(data);

      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        html: `
          <div style="text-align:center;">
            <p style="font-size:15px;color:#64748b;">
              Your admission application has been received successfully.
            </p>

            <div style="
              margin-top:18px;
              padding:16px;
              background:#f8fafc;
              border-radius:14px;
              border:1px solid #e2e8f0;
            ">
              <p style="
                margin:0;
                font-size:12px;
                color:#64748b;
                text-transform:uppercase;
                letter-spacing:1px;
              ">
                Application ID
              </p>

              <p style="
                margin:7px 0 0;
                font-size:22px;
                font-weight:800;
                color:#0F4C81;
                letter-spacing:2px;
              ">
                ${res.data.applicationId}
              </p>
            </div>

            <p style="
              margin-top:15px;
              font-size:13px;
              color:#64748b;
            ">
              Please save this ID for future reference.
              We will contact you soon.
            </p>
          </div>
        `,
        confirmButtonText: 'Done',
        confirmButtonColor: '#0F4C81',
        customClass: {
          popup: 'rounded-3xl',
          confirmButton: 'rounded-xl px-7 py-3',
        },
      });

      reset({
        studentName: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        email: '',
        education: '',
        address: '',
        course: '',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text:
          err?.response?.data?.message ||
          'Something went wrong. Please try again later.',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#0F4C81',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================================================
  // FORM INPUT STYLE
  // ==================================================

  const inputClass = (fieldError) =>
    `w-full rounded-xl border ${
      fieldError ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-white'
    } px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10`;

  return (
    <div className="overflow-hidden bg-slate-50">
      {/* ==================================================
          SEO
      ================================================== */}

      <SEO
        title="Online Admission"
        description="Apply online for admission at OPEN IT INSTITUTE. Easy application process for computer training courses in Bangladesh."
        path="/admission"
      />

      <StructuredData
        data={[
          organizationSchema(),
          breadcrumbSchema([
            {
              name: 'Home',
              url: '/',
            },
            {
              name: 'Admission',
              url: '/admission',
            },
          ]),
        ]}
      />

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-[#061426] py-14 text-white sm:py-20">
        {/* Glow */}

        <div className="absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-primary/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-secondary/20 blur-3xl" />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            {/* Badge */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              <FaGraduationCap className="text-primary" />
              OPEN IT INSTITUTE
            </div>

            {/* Title */}

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Online Admission
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              আপনার ক্যারিয়ার গড়ার যাত্রা শুরু করুন। অনলাইনে ভর্তি আবেদন
              করুন — সহজ, দ্রুত ও নিরাপদ।
            </p>

            {/* Small Features */}

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <HeroBadge
                icon={<FaCheckCircle />}
                text="Easy Application"
              />

              <HeroBadge
                icon={<FaShieldAlt />}
                text="Secure Process"
              />

              <HeroBadge
                icon={<FaClock />}
                text="Quick Response"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================
          MAIN SECTION
      ================================================== */}

      <section className="relative py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
            {/* ==================================================
                FORM
            ================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
            >
              {/* Form Header */}

              <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FaUserGraduate className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                      Admission Form
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Fill in your information carefully
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-7 p-6 sm:p-8"
              >
                {/* ==================================================
                    PERSONAL INFORMATION
                ================================================== */}

                <FormSection
                  number="01"
                  icon={<FaUser />}
                  title="Personal Information"
                  description="Enter your basic personal information"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Student Name */}

                  <InputField
                    label="Student Name"
                    required
                    icon={<FaUser />}
                    error={errors.studentName}
                  >
                    <input
                      {...register('studentName', {
                        required: 'Student name is required',
                        minLength: {
                          value: 3,
                          message: 'Name must be at least 3 characters',
                        },
                      })}
                      className={inputClass(errors.studentName)}
                      placeholder="Enter your full name"
                    />
                  </InputField>

                  {/* Father's Name */}

                  <InputField
                    label="Father's Name"
                    required
                    icon={<FaUser />}
                    error={errors.fatherName}
                  >
                    <input
                      {...register('fatherName', {
                        required: "Father's name is required",
                      })}
                      className={inputClass(errors.fatherName)}
                      placeholder="Enter father's name"
                    />
                  </InputField>

                  {/* Mother's Name */}

                  <InputField
                    label="Mother's Name"
                    required
                    icon={<FaUser />}
                    error={errors.motherName}
                  >
                    <input
                      {...register('motherName', {
                        required: "Mother's name is required",
                      })}
                      className={inputClass(errors.motherName)}
                      placeholder="Enter mother's name"
                    />
                  </InputField>

                  {/* Date of Birth */}

                  <InputField
                    label="Date of Birth"
                    required
                    icon={<FaCalendarAlt />}
                    error={errors.dateOfBirth}
                  >
                    <input
                      type="date"
                      {...register('dateOfBirth', {
                        required: 'Date of birth is required',
                      })}
                      className={inputClass(errors.dateOfBirth)}
                    />
                  </InputField>

                  {/* Gender */}

                  <InputField
                    label="Gender"
                    required
                    icon={<FaUsers />}
                    error={errors.gender}
                  >
                    <select
                      {...register('gender', {
                        required: 'Please select your gender',
                      })}
                      className={inputClass(errors.gender)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </InputField>

                  {/* Education */}

                  <InputField
                    label="Educational Qualification"
                    required
                    icon={<FaGraduationCap />}
                    error={errors.education}
                  >
                    <input
                      {...register('education', {
                        required:
                          'Educational qualification is required',
                      })}
                      className={inputClass(errors.education)}
                      placeholder="e.g. SSC, HSC, Graduate"
                    />
                  </InputField>
                </div>

                {/* ==================================================
                    CONTACT INFORMATION
                ================================================== */}

                <FormSection
                  number="02"
                  icon={<FaPhone />}
                  title="Contact Information"
                  description="How can we contact you?"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Phone */}

                  <InputField
                    label="Mobile Number"
                    required
                    icon={<FaPhone />}
                    error={errors.phone}
                  >
                    <input
                      type="tel"
                      {...register('phone', {
                        required: 'Mobile number is required',
                        pattern: {
                          value: /^(?:\+?88)?01[3-9]\d{8}$/,
                          message: 'Enter a valid Bangladesh mobile number',
                        },
                      })}
                      className={inputClass(errors.phone)}
                      placeholder="01XXXXXXXXX"
                    />
                  </InputField>

                  {/* Email */}

                  <InputField
                    label="Email Address"
                    required
                    icon={<FaEnvelope />}
                    error={errors.email}
                  >
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email address is required',
                        pattern: {
                          value: /^\S+@\S+\.\S+$/,
                          message: 'Enter a valid email address',
                        },
                      })}
                      className={inputClass(errors.email)}
                      placeholder="example@email.com"
                    />
                  </InputField>
                </div>

                {/* Address */}

                <InputField
                  label="Present Address"
                  required
                  icon={<FaMapMarkerAlt />}
                  error={errors.address}
                >
                  <textarea
                    {...register('address', {
                      required: 'Address is required',
                    })}
                    rows={3}
                    className={`${inputClass(
                      errors.address
                    )} resize-none`}
                    placeholder="Enter your present address"
                  />
                </InputField>

                {/* ==================================================
                    COURSE INFORMATION
                ================================================== */}

                <FormSection
                  number="03"
                  icon={<FaBookOpen />}
                  title="Course Selection"
                  description="Choose the course you want to enroll in"
                />

                <div>
                  <InputField
                    label="Select Course"
                    required
                    icon={<FaBookOpen />}
                    error={errors.course}
                  >
                    <select
                      {...register('course', {
                        required: 'Please select a course',
                      })}
                      disabled={coursesLoading}
                      className={inputClass(errors.course)}
                    >
                      <option value="">
                        {coursesLoading
                          ? 'Loading courses...'
                          : 'Choose a course'}
                      </option>

                      {courses.map((course) => (
                        <option
                          key={course._id || course.slug}
                          value={course.slug || course._id}
                        >
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </InputField>
                </div>

                {/* ==================================================
                    SELECTED COURSE PREVIEW
                ================================================== */}

                {selectedCourse && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: 'auto',
                    }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/[0.05] to-secondary/[0.05] p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <FaLaptopCode />
                          </div>

                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              SELECTED COURSE
                            </p>

                            <h3 className="mt-1 text-base font-bold text-slate-800">
                              {selectedCourse.title}
                            </h3>

                            {selectedCourse.duration && (
                              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                <FaClock className="text-primary" />
                                {selectedCourse.duration}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-xs text-slate-400">
                            COURSE FEE
                          </p>

                          <div className="mt-1 flex items-center gap-2 sm:justify-end">
                            <span className="text-xl font-extrabold text-primary">
                              ৳
                              {selectedCoursePricing.discounted.toLocaleString()}
                            </span>

                            {selectedCoursePricing.discount > 0 && (
                              <span className="text-xs text-slate-400 line-through">
                                ৳
                                {selectedCoursePricing.fee.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {selectedCoursePricing.saving > 0 && (
                            <p className="mt-1 text-xs font-semibold text-emerald-500">
                              Save ৳
                              {selectedCoursePricing.saving.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <div className="border-t border-slate-100 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin text-lg" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="text-lg" />
                        Submit Admission Application
                        <FaArrowRight className="text-xs transition group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
                    <FaShieldAlt className="text-emerald-500" />
                    Your information is safe and secure
                  </div>
                </div>
              </form>
            </motion.div>

            {/* ==================================================
                RIGHT SIDEBAR
            ================================================== */}

            <aside className="space-y-6 lg:sticky lg:top-24">
              {/* Why Join */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.15,
                }}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
              >
                <div className="bg-gradient-to-r from-primary to-secondary p-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <FaAward />
                    </div>

                    <div>
                      <p className="text-xs text-white/60">
                        WHY CHOOSE US
                      </p>

                      <h3 className="text-lg font-bold">
                        Open IT Institute
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <Benefit
                    icon={<FaLaptopCode />}
                    title="Practical Training"
                    text="Learn real-world IT skills"
                  />

                  <Benefit
                    icon={<FaGraduationCap />}
                    title="Professional Instructors"
                    text="Learn from experienced trainers"
                  />

                  <Benefit
                    icon={<FaCertificate />}
                    title="Course Certificate"
                    text="Get certificate after completion"
                  />

                  <Benefit
                    icon={<FaRocket />}
                    title="Career Support"
                    text="Build skills for your future"
                  />
                </div>
              </motion.div>

              {/* Selected Course Card */}

              {selectedCourse && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="rounded-3xl border border-primary/10 bg-primary/[0.04] p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Your Selection
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-slate-800">
                    {selectedCourse.title}
                  </h3>

                  <div className="mt-4 space-y-3">
                    {selectedCourse.duration && (
                      <SidebarInfo
                        icon={<FaClock />}
                        label="Duration"
                        value={selectedCourse.duration}
                      />
                    )}

                    {selectedCourse.classHours && (
                      <SidebarInfo
                        icon={<FaLaptopCode />}
                        label="Class Hours"
                        value={selectedCourse.classHours}
                      />
                    )}

                    {selectedCourse.instructor && (
                      <SidebarInfo
                        icon={<FaUser />}
                        label="Instructor"
                        value={selectedCourse.instructor}
                      />
                    )}
                  </div>
                </motion.div>
              )}

              {/* Need Help */}

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                    <FaPhone />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      NEED HELP?
                    </p>

                    <h3 className="text-sm font-bold text-slate-800">
                      Contact Our Team
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-6 text-slate-500">
                  ভর্তি সংক্রান্ত যেকোনো তথ্য জানতে আমাদের সাথে যোগাযোগ
                  করুন। আমাদের টিম আপনাকে সহযোগিতা করবে।
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ==================================================
          BOTTOM CTA
      ================================================== */}

      <section className="relative overflow-hidden bg-[#061426] py-12 text-white sm:py-14">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary">
            <FaGraduationCap className="text-2xl" />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">
            আপনার ক্যারিয়ার গড়ার সময় এখনই
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
            OPEN IT INSTITUTE-এর সাথে আপনার IT শেখার যাত্রা শুরু করুন
            এবং ভবিষ্যতের জন্য নিজেকে দক্ষ করে তুলুন।
          </p>
        </div>
      </section>
    </div>
  );
};

// ======================================================
// FORM SECTION
// ======================================================

const FormSection = ({ number, icon, title, description }) => (
  <div className="flex items-center gap-4">
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <span className="text-lg">{icon}</span>

      <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
        {number}
      </span>
    </div>

    <div>
      <h3 className="text-base font-bold text-slate-900 sm:text-lg">
        {title}
      </h3>

      <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
        {description}
      </p>
    </div>
  </div>
);

// ======================================================
// INPUT FIELD
// ======================================================

const InputField = ({
  label,
  required,
  icon,
  error,
  children,
}) => (
  <div>
    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
      <span className="text-primary/70">{icon}</span>
      {label}

      {required && (
        <span className="text-red-400">*</span>
      )}
    </label>

    {children}

    {error && (
      <motion.p
        initial={{
          opacity: 0,
          y: -3,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mt-1.5 text-xs font-medium text-red-500"
      >
        {error.message}
      </motion.p>
    )}
  </div>
);

// ======================================================
// HERO BADGE
// ======================================================

const HeroBadge = ({ icon, text }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md">
    <span className="text-emerald-400">{icon}</span>
    {text}
  </span>
);

// ======================================================
// BENEFIT
// ======================================================

const Benefit = ({ icon, title, text }) => (
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      {icon}
    </div>

    <div>
      <h4 className="text-sm font-bold text-slate-800">
        {title}
      </h4>

      <p className="mt-0.5 text-xs leading-5 text-slate-400">
        {text}
      </p>
    </div>
  </div>
);

// ======================================================
// SIDEBAR INFO
// ======================================================

const SidebarInfo = ({ icon, label, value }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <span className="text-primary">{icon}</span>
      {label}
    </div>

    <span className="max-w-[55%] text-right text-xs font-semibold text-slate-700">
      {value}
    </span>
  </div>
);

export default Admission;