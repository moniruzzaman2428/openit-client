import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/student/Sidebar';
import { FaBars, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Profile image
  const profileImage = user?.profileImage || user?.photo || '';

  // Name fallback
  const userName = user?.name || 'Student';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-light">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6">

          {/* Left Side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <FaBars />
            </button>

            <h1 className="text-lg font-semibold text-dark hidden sm:block">
              Student Portal
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Notification */}
            <button
              className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Notifications"
            >
              <FaBell />

              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
            </button>

            {/* Student Profile */}
            <div className="flex items-center gap-2.5">

              {/* Profile Image / Initial */}
              <div className="w-8 h-8 rounded-full overflow-hidden bg-accent text-dark flex items-center justify-center text-sm font-bold shrink-0">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={userName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  initial
                )}

              </div>

              {/* Student Name */}
              <span className="text-sm font-medium text-dark hidden sm:block">
                {userName}
              </span>

            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;

