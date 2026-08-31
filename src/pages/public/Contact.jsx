import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaYoutube } from 'react-icons/fa';
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
        confirmButtonColor: '#0F4C81'
      });
      reset();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#0F4C81'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SEO title="Contact Us" description="Contact OPEN IT INSTITUTE — Phone, email and address. Get in touch for course inquiries and admission information." path="/contact" />
      <StructuredData data={[organizationSchema(), contactPageSchema(), breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }])]} />
      <section className="bg-gradient-to-r from-primary to-[#0a3a63] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-white/80">We'd love to hear from you</p>
        </div>
      </section>

      <section className="py-12 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              {[
                { icon: FaMapMarkerAlt, title: 'Address', value: 'Dhaka, Bangladesh' },
                { icon: FaPhone, title: 'Phone', value: '+880 1700-000000' },
                { icon: FaEnvelope, title: 'Email', value: 'info@openitinstitute.com' }
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <item.icon />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition"><FaFacebook /></a>
                <a href="#" className="w-10 h-10 rounded-xl bg-danger text-white flex items-center justify-center hover:opacity-90 transition"><FaYoutube /></a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <h2 className="text-xl font-bold text-dark mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                      <input {...register('name', { required: 'Required' })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                      {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                      <input {...register('phone', { required: 'Required' })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                      {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input type="email" {...register('email', { required: 'Required' })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea {...register('message', { required: 'Required' })} rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                    {errors.message && <p className="text-danger text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition disabled:opacity-60">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
