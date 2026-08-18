import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Sparkles, Bot } from 'lucide-react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { TEACHER_INFO } from '../data/math8Curriculum';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';
import TeacherDashboard from '../pages/TeacherDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ClassDetailPage from '../pages/ClassDetailPage';
import CurriculumPage from '../pages/CurriculumPage';
import PlayGamePage from '../pages/PlayGamePage';
import AnalyticsPage from '../pages/AnalyticsPage';
import AiTutorPage from '../pages/AiTutorPage';
import ParentReportViewPage from '../pages/ParentReportViewPage';

// Protected Route Guards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Đang kiểm tra quyền truy cập...</div>;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'teacher') return <Navigate to="/teacher" replace />;
    if (role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/student" replace />;
  }

  return children;
};

export const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/class/:id" element={<ClassDetailPage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/games" element={<PlayGamePage />} />
          <Route path="/ai-tutor" element={<AiTutorPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          
          {/* Public Parent Report Card View */}
          <Route path="/parent-report/:id" element={<ParentReportViewPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Floating AI Assistant Widget Button */}
      <div className="fixed bottom-6 right-6 z-40 animate-bounce">
        <Link
          to="/ai-tutor"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-extrabold shadow-2xl shadow-amber-500/40 hover:scale-105 transition-transform border border-amber-300"
          title="Nhấn để hỏi bài Cô Huyền Diệu AI 24/7"
        >
          <img
            src={TEACHER_INFO.avatar}
            alt="Cô Diệu AI"
            className="w-7 h-7 rounded-full object-cover object-top border border-slate-950"
          />
          <span className="text-xs tracking-tight hidden sm:inline">Hỏi Cô Diệu AI</span>
          <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
