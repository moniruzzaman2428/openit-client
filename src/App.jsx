import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminRoute, TeacherRoute, StudentRoute, PublicOnlyRoute } from './routes/ProtectedRoute';

// Layouts (keep eager — small and always needed for structure)
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';

// Auth pages (small, keep eager for fast login)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/Unauthorized';
import Loading from './components/Loading/Loading';

// ========== LAZY LOADED PAGES (code splitting) ==========
// Public
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Courses = lazy(() => import('./pages/public/Courses'));
const CourseDetails = lazy(() => import('./pages/public/CourseDetails'));
const Admission = lazy(() => import('./pages/public/Admission'));
const Notices = lazy(() => import('./pages/public/Notices'));
const Gallery = lazy(() => import('./pages/public/Gallery'));
const Results = lazy(() => import('./pages/public/Results'));
const Contact = lazy(() => import('./pages/public/Contact'));
const TypingTest = lazy(() => import('./pages/public/TypingTest'));
const MouseAccuracyGame = lazy(() => import('./pages/public/MouseAccuracyGame'));
const VerifyCertificate = lazy(() => import('./pages/public/VerifyCertificate'));

// Admin
const AdminDashboard = lazy(() => import('./dashboard/admin/Dashboard'));
const AdminStudents = lazy(() => import('./dashboard/admin/Students'));
const AdminTeachers = lazy(() => import('./dashboard/admin/Teachers'));
const AdminCourses = lazy(() => import('./dashboard/admin/Courses'));
const AdminBatches = lazy(() => import('./dashboard/admin/Batches'));
const AdminAdmissions = lazy(() => import('./dashboard/admin/Admissions'));
const AdminPayments = lazy(() => import('./dashboard/admin/Payments'));
const AdminCertificates = lazy(() => import('./dashboard/admin/Certificates'));
const AdminNotices = lazy(() => import('./dashboard/admin/Notices'));
const AdminGallery = lazy(() => import('./dashboard/admin/Gallery'));
const AdminTestimonials = lazy(() => import('./dashboard/admin/Testimonials'));
const AdminPlaceholder = lazy(() => import('./dashboard/admin/Placeholder'));

// Teacher
const TeacherDashboard = lazy(() => import('./dashboard/teacher/Dashboard'));
const TeacherCourses = lazy(() => import('./dashboard/teacher/Courses'));
const TeacherBatches = lazy(() => import('./dashboard/teacher/Batches'));
const TeacherStudents = lazy(() => import('./dashboard/teacher/Students'));
const TeacherAttendance = lazy(() => import('./dashboard/teacher/Attendance'));
const TeacherRoutine = lazy(() => import('./dashboard/teacher/Routine'));
const TeacherExams = lazy(() => import('./dashboard/teacher/Exams'));
const TeacherResults = lazy(() => import('./dashboard/teacher/Results'));
const TeacherPlaceholder = lazy(() => import('./dashboard/teacher/Placeholder'));

// Student
const StudentDashboard = lazy(() => import('./dashboard/student/Dashboard'));
const StudentProfile = lazy(() => import('./dashboard/student/Profile'));
const StudentCourse = lazy(() => import('./dashboard/student/Course'));
const StudentBatch = lazy(() => import('./dashboard/student/Batch'));
const StudentRoutine = lazy(() => import('./dashboard/student/Routine'));
const StudentAttendance = lazy(() => import('./dashboard/student/Attendance'));
const StudentExams = lazy(() => import('./dashboard/student/Exams'));
const StudentResults = lazy(() => import('./dashboard/student/Results'));
const StudentPayments = lazy(() => import('./dashboard/student/Payments'));
const StudentNotices = lazy(() => import('./dashboard/student/Notices'));
const StudentCertificate = lazy(() => import('./dashboard/student/Certificate'));
const StudentChangePassword = lazy(() => import('./dashboard/student/ChangePassword'));

// Loading fallback
const PageLoader = () => (
<Loading></Loading>
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetails />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/results" element={<Results />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/TypingTest" element={<TypingTest />} />
            <Route path="/MouseAccuracyGame" element={<MouseAccuracyGame />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="batches" element={<AdminBatches />} />
            <Route path="admissions" element={<AdminAdmissions />} />
            <Route path="attendance" element={<AdminPlaceholder title="Attendance Management" />} />
            <Route path="exams" element={<AdminPlaceholder title="Exam Management" />} />
            <Route path="results" element={<AdminPlaceholder title="Result Management" />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="receipts" element={<AdminPayments />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="settings" element={<AdminPlaceholder title="Website Settings" />} />
            <Route path="profile" element={<AdminPlaceholder title="Admin Profile" />} />
          </Route>

          {/* Teacher */}
          <Route path="/teacher" element={<TeacherRoute><TeacherLayout /></TeacherRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route path="batches" element={<TeacherBatches />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="routine" element={<TeacherRoutine />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="exams" element={<TeacherExams />} />
            <Route path="results" element={<TeacherResults />} />
            <Route path="notices" element={<TeacherPlaceholder title="Notices" />} />
            <Route path="profile" element={<TeacherPlaceholder title="Teacher Profile" />} />
            <Route path="change-password" element={<TeacherPlaceholder title="Change Password" />} />
          </Route>

          {/* Student */}
          <Route path="/student" element={<StudentRoute><StudentLayout /></StudentRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="course" element={<StudentCourse />} />
            <Route path="batch" element={<StudentBatch />} />
            <Route path="routine" element={<StudentRoutine />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="payments" element={<StudentPayments />} />
            <Route path="notices" element={<StudentNotices />} />
            <Route path="certificate" element={<StudentCertificate />} />
            <Route path="change-password" element={<StudentChangePassword />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
