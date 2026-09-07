import { useCallback, useEffect, useState } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaGraduationCap,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaSpinner,
  FaBook,
  FaLayerGroup,
  FaCalendarAlt,
  FaVenusMars,
  FaUserTie,
  FaSyncAlt,
  FaCheckCircle,
  FaShieldAlt,
  FaInfoCircle,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const extractStudent = (response) =>
  response?.data?.data?.student ||
  response?.data?.student ||
  response?.data?.data ||
  null;

const toInputDate = (date) => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDate = (date) => {
  if (!date) return 'Not provided';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Not provided';
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || 'S';

const Profile = () => {
  const auth = useAuth() || {};
  const { user, setUser } = auth;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    education: '',
    photo: '',
  });

  const getPhoto = useCallback(
    (data) =>
      data?.photo || data?.userId?.profileImage || user?.profileImage || '',
    [user]
  );

  const populateForm = useCallback(
    (data) => {
      const photo = getPhoto(data);
      setForm({
        name: data?.name || data?.userId?.name || user?.name || '',
        phone: data?.phone || data?.userId?.phone || user?.phone || '',
        fatherName: data?.fatherName || '',
        motherName: data?.motherName || '',
        dateOfBirth: toInputDate(data?.dateOfBirth),
        gender: data?.gender || 'male',
        address: data?.address || '',
        education: data?.education || '',
        photo,
      });
      setPhotoPreview(photo);
    },
    [getPhoto, user]
  );

  const fetchProfile = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        setError('');

        const response = await api.get('/students/me');
        const data = extractStudent(response);

        if (!data || !data._id) {
          throw new Error('Student profile data was not found.');
        }

        setStudent(data);
        populateForm(data);
      } catch (err) {
        console.error('Profile loading error:', err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Unable to load your profile.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [populateForm]
  );

  useEffect(() => {
    if (user) fetchProfile();
  }, [user, fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid File',
        text: 'Please select a valid image file.',
        confirmButtonColor: '#0F4C81',
      });
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'File Too Large',
        text: 'Profile image must be less than 5MB.',
        confirmButtonColor: '#0F4C81',
      });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setPhotoPreview(result);
      setForm((prev) => ({ ...prev, photo: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Required',
        text: 'Full name is required.',
        confirmButtonColor: '#0F4C81',
      });
      return;
    }

    if (!form.phone.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Required',
        text: 'Phone number is required.',
        confirmButtonColor: '#0F4C81',
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        fatherName: form.fatherName.trim(),
        motherName: form.motherName.trim(),
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender,
        address: form.address.trim(),
        education: form.education.trim(),
        photo: form.photo || '',
      };

      let response;
      try {
        response = await api.patch('/students/me', payload);
      } catch (firstErr) {
        if (!student?._id) throw firstErr;
        response = await api.patch(`/students/${student._id}`, payload);
      }

      const updatedStudent = extractStudent(response);

      if (updatedStudent) {
        setStudent(updatedStudent);
        populateForm(updatedStudent);

        if (typeof setUser === 'function') {
          setUser((prev) => ({
            ...(prev || {}),
            name: updatedStudent.name || payload.name,
            phone: updatedStudent.phone || payload.phone,
            profileImage:
              updatedStudent.photo ||
              updatedStudent.userId?.profileImage ||
              payload.photo ||
              prev?.profileImage,
          }));
        }
      } else {
        await fetchProfile(true);
      }

      setEditing(false);

      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully.',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Profile update error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to update your profile.',
        confirmButtonColor: '#0F4C81',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!student) return;
    populateForm(student);
    setEditing(false);
  };

  const getCourseName = () => {
    if (!student?.course) return 'Not assigned';
    if (typeof student.course === 'object') {
      return student.course.title || student.course.name || 'Not assigned';
    }
    return String(student.course);
  };

  const getBatchName = () => {
    if (!student?.batch) return 'Not assigned';
    if (typeof student.batch === 'object') {
      return student.batch.name || 'Not assigned';
    }
    return String(student.batch);
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FaSpinner className="animate-spin text-2xl" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !student) {
    return (
      <div className="min-h-[500px] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-red-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <FaInfoCircle className="text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mt-5">
            Admission Required
          </h2>

          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            আপনার Student Profile এখনো তৈরি হয়নি। অনুগ্রহ করে Admission সম্পন্ন করুন।
            Admission সম্পন্ন করা থাকলে আপনার তথ্য যাচাইয়ের জন্য কর্তৃপক্ষের সঙ্গে যোগাযোগ করুন।
          </p>
          <button
            type="button"
            onClick={() => fetchProfile(true)}
            disabled={refreshing}
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
          >
            <FaSyncAlt className={refreshing ? 'animate-spin' : ''} />
            Check Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold">
              <FaCheckCircle />
              VERIFIED
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            View and manage your personal information
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchProfile(true)}
            disabled={refreshing || saving}
            className="w-11 h-11 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 flex items-center justify-center transition disabled:opacity-50"
            title="Refresh profile"
          >
            <FaSyncAlt className={refreshing ? 'animate-spin' : ''} />
          </button>

          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition"
            >
              <FaEdit />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061426] via-[#0b3153] to-primary shadow-xl"
      >
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -left-24 -bottom-28 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center text-3xl font-bold text-white shadow-2xl backdrop-blur-sm">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt={student?.name || 'Student'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(student?.name)
                )}
              </div>

              {editing && (
                <label
                  htmlFor="profile-photo"
                  className="absolute -bottom-2 -right-2 w-11 h-11 rounded-xl bg-white text-primary flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition"
                  title="Change profile photo"
                >
                  <FaCamera />
                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">
                  {student?.name || 'Student'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-400/15 border border-emerald-300/20 text-emerald-200 text-xs font-semibold capitalize">
                  <FaCheckCircle />
                  {student?.status || 'active'}
                </span>
              </div>

              <p className="text-white/60 text-sm mt-1 truncate">
                {student?.email ||
                  student?.userId?.email ||
                  user?.email ||
                  'Email not available'}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-white/80 text-xs">
                  <FaIdCard />
                  {student?.studentId || 'ID unavailable'}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-white/80 text-xs">
                  <FaGraduationCap />
                  <span className="max-w-[180px] truncate">{getCourseName()}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-primary/5 border border-primary/10 rounded-2xl p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FaEdit />
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">
                    Edit mode is active
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Update your personal information and profile photo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={FaIdCard} label="Student ID" value={student?.studentId} />
        <SummaryCard icon={FaBook} label="Course" value={getCourseName()} />
        <SummaryCard icon={FaLayerGroup} label="Batch" value={getBatchName()} />
        <SummaryCard
          icon={FaCalendarAlt}
          label="Date of Birth"
          value={formatDate(student?.dateOfBirth)}
        />
      </div>

      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader
          icon={FaUser}
          title="Personal Information"
          subtitle="Your basic personal details"
        />

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <ProfileField
            icon={FaUser}
            label="Full Name"
            name="name"
            value={form.name}
            editing={editing}
            onChange={handleChange}
          />
          <ProfileField
            icon={FaPhone}
            label="Phone Number"
            name="phone"
            value={form.phone}
            editing={editing}
            onChange={handleChange}
          />
          <ReadOnlyField
            icon={FaEnvelope}
            label="Email Address"
            value={student?.email || student?.userId?.email || user?.email}
          />
          <ProfileField
            icon={FaUserTie}
            label="Father Name"
            name="fatherName"
            value={form.fatherName}
            editing={editing}
            onChange={handleChange}
          />
          <ProfileField
            icon={FaUserTie}
            label="Mother Name"
            name="motherName"
            value={form.motherName}
            editing={editing}
            onChange={handleChange}
          />
          <ProfileField
            icon={FaCalendarAlt}
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            editing={editing}
            onChange={handleChange}
          />
          <ProfileSelect
            icon={FaVenusMars}
            label="Gender"
            name="gender"
            value={form.gender}
            editing={editing}
            onChange={handleChange}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <ProfileField
            icon={FaGraduationCap}
            label="Education"
            name="education"
            value={form.education}
            editing={editing}
            onChange={handleChange}
          />
          <ProfileField
            icon={FaMapMarkerAlt}
            label="Address"
            name="address"
            value={form.address}
            editing={editing}
            onChange={handleChange}
            full
          />
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader
          icon={FaGraduationCap}
          title="Academic Information"
          subtitle="Enrollment information managed by administration"
        />

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <ReadOnlyField icon={FaIdCard} label="Student ID" value={student?.studentId} />
          <ReadOnlyField icon={FaBook} label="Course" value={getCourseName()} />
          <ReadOnlyField icon={FaLayerGroup} label="Batch" value={getBatchName()} />
          <ReadOnlyField
            icon={FaCalendarAlt}
            label="Enrollment Date"
            value={formatDate(student?.admissionDate || student?.createdAt)}
          />
        </div>

        <div className="px-6 pb-6">
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <FaShieldAlt />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-700">
                Academic information is protected
              </p>
              <p className="text-xs text-amber-600 mt-1 leading-relaxed">
                Student ID, Course, Batch, Results, Attendance and Payment records
                cannot be changed by students. Contact the administration for
                corrections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {editing && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FaCamera />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-700">Profile Photo</p>
            <p className="text-xs text-blue-600 mt-1">
              JPG, PNG or WEBP image. Maximum file size 5MB.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ icon: Icon, label, value }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
  >
    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
      <Icon />
    </div>
    <p className="text-xs text-gray-400 mt-4">{label}</p>
    <p className="text-sm font-bold text-gray-900 mt-1 truncate">{value || '—'}</p>
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
      <Icon />
    </div>
    <div>
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const ProfileField = ({
  icon: Icon,
  label,
  name,
  value,
  editing,
  onChange,
  type = 'text',
  full = false,
}) => (
  <div className={full ? 'md:col-span-2' : ''}>
    <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
      <Icon className="text-primary" />
      {label}
    </label>
    {editing ? (
      full ? (
        <textarea
          name={name}
          value={value || ''}
          onChange={onChange}
          rows="3"
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        />
      )
    ) : (
      <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-900 min-h-[44px] flex items-center">
        {value || 'Not provided'}
      </div>
    )}
  </div>
);

const ProfileSelect = ({ icon: Icon, label, name, value, editing, onChange, options }) => (
  <div>
    <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
      <Icon className="text-primary" />
      {label}
    </label>
    {editing ? (
      <select
        name={name}
        value={value || ''}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-900 min-h-[44px] flex items-center capitalize">
        {value || 'Not provided'}
      </div>
    )}
  </div>
);

const ReadOnlyField = ({ icon: Icon, label, value }) => (
  <div>
    <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
      <Icon className="text-gray-400" />
      {label}
    </label>
    <div className="px-4 py-3 rounded-xl bg-gray-100/80 border border-gray-100 text-sm font-medium text-gray-500 min-h-[44px] flex items-center">
      {value || 'Not available'}
    </div>
  </div>
);

export default Profile;