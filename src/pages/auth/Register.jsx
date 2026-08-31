import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaUserGraduate } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      });
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-light to-secondary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-4 shadow-lg">
            <FaUserGraduate className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-dark">OPEN IT INSTITUTE</h1>
          <p className="text-gray-500 mt-1">Create your student account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } })}
                  placeholder="Your full name"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.name ? 'border-danger' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition`}
                />
              </div>
              {errors.name && <p className="text-danger text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' }
                  })}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? 'border-danger' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition`}
                />
              </div>
              {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaPhone />
                </span>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    minLength: { value: 10, message: 'Invalid phone number' }
                  })}
                  placeholder="01XXXXXXXXX"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-danger' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition`}
                />
              </div>
              {errors.phone && <p className="text-danger text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${errors.password ? 'border-danger' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition shadow-lg shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
