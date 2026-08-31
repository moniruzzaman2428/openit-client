import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaGraduationCap } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();

  const fields = [
    { icon: FaUser, label: 'Full Name', value: user?.name || 'Rahim Ahmed' },
    { icon: FaIdCard, label: 'Student ID', value: 'OIT26001' },
    { icon: FaEnvelope, label: 'Email', value: user?.email || 'rahim@example.com' },
    { icon: FaPhone, label: 'Phone', value: user?.phone || '01711111111' },
    { icon: FaMapMarkerAlt, label: 'Address', value: 'Dhaka, Bangladesh' },
    { icon: FaGraduationCap, label: 'Education', value: 'HSC' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Profile</h1>
        <p className="text-gray-500 text-sm">View and update your personal information</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-[#0a3a63] p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name || 'Student'}</h2>
              <p className="text-white/70 text-sm">OIT26001 · Active Student</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 grid sm:grid-cols-2 gap-5">
          {fields.map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <f.icon className="text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{f.label}</p>
                <p className="font-medium text-dark">{f.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6">
          <p className="text-xs text-gray-400 bg-light rounded-xl p-3">
            Note: Student ID, Course, Batch, Results, Attendance and Payment records cannot be changed by students. Contact admin for corrections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
