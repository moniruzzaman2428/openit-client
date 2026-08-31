import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Loading spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-light">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Admin only
export const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Teacher only
export const TeacherRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'teacher') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Student only
export const StudentRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'student') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Any authenticated user
export const PrivateRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Redirect logged-in users away from login/register
export const PublicOnlyRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (isAuthenticated && user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};
