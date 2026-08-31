import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaUserGraduate } from 'react-icons/fa';
import { submitAdmission } from '../../services/admissionService';
import SEO from '../../components/seo/SEO';
import StructuredData, { breadcrumbSchema, organizationSchema } from '../../components/seo/StructuredData';

const Admission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await submitAdmission(data);

      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        html: `
          <p>Your admission application has been received.</p>
          <p class="mt-3"><strong>Application ID:</strong></p>
          <p class="text-lg font-bold text-blue-600 tracking-wider">${res.data.applicationId}</p>
          <p class="mt-2 text-sm text-gray-500">Please save this ID for future reference. We will contact you soon.</p>
        `,
        confirmButtonColor: '#0F4C81'
      });
      reset();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.response?.data?.message || 'Please try again later.',
        confirmButtonColor: '#0F4C81'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SEO title="Online Admission" description="Apply online for admission at OPEN IT INSTITUTE. Easy application process for computer training courses in Bangladesh." path="/admission" />
      <StructuredData data={[organizationSchema(), breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Admission", url: "/admission" }])]} />
      <section className="bg-gradient-to-r from-primary to-[#0a3a63] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Online Admission</h1>
          <p className="text-white/80">অনলাইনে ভর্তি আবেদন করুন — সহজ ও দ্রুত</p>
        </div>
      </section>

      <section className="py-12 bg-light">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <FaUserGraduate className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-dark">Admission Form</h2>
                <p className="text-sm text-gray-500">Fill in your details carefully</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Student Name *</label>
                  <input
                    {...register('studentName', { required: 'Required' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="Full name"
                  />
                  {errors.studentName && <p className="text-danger text-xs mt-1">{errors.studentName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Father's Name *</label>
                  <input
                    {...register('fatherName', { required: 'Required' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  {errors.fatherName && <p className="text-danger text-xs mt-1">{errors.fatherName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mother's Name *</label>
                  <input
                    {...register('motherName', { required: 'Required' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  {errors.motherName && <p className="text-danger text-xs mt-1">{errors.motherName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth *</label>
                  <input
                    type="date"
                    {...register('dateOfBirth', { required: 'Required' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  {errors.dateOfBirth && <p className="text-danger text-xs mt-1">{errors.dateOfBirth.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender *</label>
                  <select
                    {...register('gender', { required: 'Required' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-danger text-xs mt-1">{errors.gender.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile *</label>
                  <input
                    {...register('phone', { required: 'Required', minLength: { value: 10, message: 'Invalid' } })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    {...register('email', { required: 'Required' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Educational Qualification *</label>
                  <input
                    {...register('education', { required: 'Required' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="e.g. HSC, SSC, Graduate"
                  />
                  {errors.education && <p className="text-danger text-xs mt-1">{errors.education.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
                <textarea
                  {...register('address', { required: 'Required' })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                {errors.address && <p className="text-danger text-xs mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Course *</label>
                <select
                  {...register('course', { required: 'Required' })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="">Choose a course</option>
                  <option value="basic-computer">Basic Computer & Office Application</option>
                  <option value="graphic-design">Graphic Design</option>
                  <option value="web-design">Web Design</option>
                  <option value="web-development">Web Development</option>
                  <option value="hardware-networking">Hardware & Networking</option>
                  <option value="freelancing">Freelancing</option>
                  <option value="digital-marketing">Digital Marketing</option>
                  <option value="programming">Programming</option>
                  <option value="ai-digital-skills">AI & Digital Skills</option>
                </select>
                {errors.course && <p className="text-danger text-xs mt-1">{errors.course.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition shadow-lg shadow-primary/25 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Admission;
