import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaYoutube,
  FaClock,
  FaPaperPlane,
  FaCheckCircle
} from 'react-icons/fa';
import { sendContactMessage } from '../../services/contentService';
import SEO from '../../components/seo/SEO';
import StructuredData, { contactPageSchema, organizationSchema, breadcrumbSchema } from '../../components/seo/StructuredData';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await sendContactMessage(data);
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'We will get back to you soon.',
        confirmButtonColor: '#0F4C81',
        background: '#fff',
        timer: 2500,
        timerProgressBar: true,
      });
      reset();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#0F4C81',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real info from the banner
  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'ঠিকানা',
      value: 'উপজেলা রোড, শান্তিবাগ (NRBC ব্যাংক সংলগ্ন), কেন্দুয়া, নেত্রকোনা।',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: FaPhone,
      title: 'ফোন নম্বর',
      value: '+880 1716-160869\n+880 1707-530810',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaEnvelope,
      title: 'ইমেইল',
      value: 'openitinstitute@gmail.com',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaClock,
      title: 'অফিস সময়',
      value: 'শনি - বৃহস্পতি: সকাল ৯টা - রাত ৮টা\nশুক্রবার: বন্ধ',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="overflow-hidden bg-gray-50">
      <SEO
        title="যোগাযোগ"
        description="ওপেন আইটি ইনস্টিটিউট, উপজেলা রোড, শান্তিবাগ, কেন্দুয়া, নেত্রকোনায় যোগাযোগ করুন।"
        path="/contact"
      />
      <StructuredData data={[organizationSchema(), contactPageSchema(), breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }])]} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0f3460] via-[#1a5276] to-[#0d1117] text-white py-20 overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-12 bg-cyan-400 rounded-full" />
              <span className="text-sm font-semibold text-cyan-400 tracking-widest">CONTACT US</span>
              <div className="h-1 w-12 bg-cyan-400 rounded-full" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              আমরা আপনার <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">সাথে আছি</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              ভর্তি, কোর্স বা যেকোনো তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা দ্রুত উত্তর দেওয়ার চেষ্টা করি।
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Contact Info Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon className="text-xl" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">

            {/* Left Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <FaPaperPlane className="text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">আপনার বার্তা পাঠান</h2>
              </div>
              <p className="text-gray-500 text-sm mb-6">যেকোনো প্রশ্ন বা ভর্তি সংক্রান্ত তথ্যের জন্য ফর্মটি পূরণ করুন।</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">আপনার নাম *</label>
                    <input
                      {...register('name', { required: 'নামটি অবশ্যই দিতে হবে' })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition bg-gray-50 focus:bg-white"
                      placeholder="আপনার নাম লিখুন"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ফোন নম্বর *</label>
                    <input
                      {...register('phone', { required: 'ফোন নম্বরটি অবশ্যই দিতে হবে' })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition bg-gray-50 focus:bg-white"
                      placeholder="01XXXXXXXXX"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ইমেইল *</label>
                  <input
                    type="email"
                    {...register('email', { required: 'ইমেইলটি অবশ্যই দিতে হবে' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition bg-gray-50 focus:bg-white"
                    placeholder="example@gmail.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">আপনার বার্তা *</label>
                  <textarea
                    {...register('message', { required: 'বার্তাটি অবশ্যই দিতে হবে' })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition bg-gray-50 focus:bg-white resize-none"
                    placeholder="আপনার প্রশ্ন বা বার্তা লিখুন..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition shadow-lg disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <FaCheckCircle className="animate-pulse" /> পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> বার্তা পাঠান
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Right Side - Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Map Section */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-64 relative">
                <iframe
                  title="Open IT Institute Location"
                  src="https://www.google.com/maps?q=Kendua,Netrokona,Bangladesh&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Open IT Institute</p>
                      <p className="text-xs text-gray-500">কেন্দুয়া, নেত্রকোনা</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media & CTA */}
              <div className="bg-gradient-to-br from-[#0f3460] to-[#1a5276] rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-4">সোশ্যাল মিডিয়ায় যুক্ত হোন</h3>
                <p className="text-sm text-blue-100 mb-6">নিয়মিত আপডেট এবং ফ্রি ওয়ার্কশপের খবর পেতে আমাদের ফলো করুন।</p>

                <div className="flex gap-4 mb-6">
                  <motion.a
                    whileHover={{ y: -5, scale: 1.1 }}
                    href="https://facebook.com/openitinstitute"
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <FaFacebook className="text-xl" />
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -5, scale: 1.1 }}
                    href="https://youtube.com/@openitinstitute"
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors shadow-lg"
                  >
                    <FaYoutube className="text-xl" />
                  </motion.a>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-sm font-semibold mb-2">অফিস সময়:</p>
                  <p className="text-xs text-blue-100">শনি - বৃহস্পতি: সকাল ৯টা - রাত ৮টা</p>
                  <p className="text-xs text-blue-100">শুক্রবার: বন্ধ</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;