import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { user, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-danger/10 text-danger mb-6">
          <FaLock className="text-3xl" />
        </div>
        <h1 className="text-3xl font-bold text-dark mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8">
          You do not have permission to access this page. This area is restricted to authorized users only.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={getDashboardLink()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition"
          >
            Go to Dashboard
          </Link>
          <button
            onClick={logout}
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
