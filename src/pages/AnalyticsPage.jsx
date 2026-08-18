import React from 'react';
import { BarChart3, Trophy, Users, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TeacherAnalytics from '../features/analytics/TeacherAnalytics';
import StudentAnalytics from '../features/analytics/StudentAnalytics';
import Leaderboard from '../features/analytics/Leaderboard';

export const AnalyticsPage = () => {
  const { isTeacher, profile } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <BarChart3 className="w-6 h-6" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
            Báo Cáo Tiến Độ & Bảng Vàng Vinh Danh
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Tổng hợp kết quả học tập, rèn luyện môn Toán 8 KNTT trường THCS Nguyễn Huệ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Analytics */}
        <div className="lg:col-span-7 space-y-6">
          {isTeacher ? (
            <TeacherAnalytics />
          ) : (
            <StudentAnalytics studentName={profile?.full_name} />
          )}
        </div>

        {/* Right Column: Leaderboard */}
        <div className="lg:col-span-5">
          <Leaderboard />
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
