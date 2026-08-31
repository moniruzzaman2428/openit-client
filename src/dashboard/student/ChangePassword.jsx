import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { changePassword } from '../../services/authService';

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Passwords do not match', confirmButtonColor: '#0F4C81' });
      return;
    }
    setIsSubmitting(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      Swal.fire({ icon: 'success', title: 'Password Changed!', text: 'Your password has been updated successfully.', confirmButtonColor: '#0F4C81' });
      reset();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not change password.', confirmButtonColor: '#0F4C81' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Change Password</h1>
        <p className="text-gray-500 text-sm">Update your account password</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={showCurrent ? 'text' : 'password'}
                {...register('currentPassword', { required: 'Required' })}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-danger text-xs mt-1">{errors.currentPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={showNew ? 'text' : 'password'}
                {...register('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && <p className="text-danger text-xs mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="password"
                {...register('confirmPassword', { required: 'Required' })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            {errors.confirmPassword && <p className="text-danger text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition disabled:opacity-60"
          >
            {isSubmitting ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
