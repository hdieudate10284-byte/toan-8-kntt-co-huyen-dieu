import React from 'react';
import { Trophy, Award, Flame, CheckCircle, Clock, Zap, Star } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';

export const StudentAnalytics = ({
  studentName = "Nguyễn Văn An",
  stats = {
    completedLessons: 9,
    totalPoints: 850,
    currentStreak: 7,
    badgesCount: 4,
    rank: 3
  }
}) => {
  const BADGES = [
    { title: "Cao Thủ 7 Hằng Đẳng Thức", desc: "Hoàn thành Đấu trường HĐT với điểm số > 90", icon: Zap, color: "text-amber-400 bg-amber-500/20 border-amber-500/30" },
    { title: "Bậc Thầy Đơn Thức", desc: "Ghép đúng 100% đơn thức đồng dạng", icon: Award, color: "text-sky-400 bg-sky-500/20 border-sky-500/30" },
    { title: "Chiến Binh Chăm Chỉ", desc: "Duy trì chuỗi học tập 7 ngày liên tiếp", icon: Flame, color: "text-rose-400 bg-rose-500/20 border-rose-500/30" },
    { title: "Ngôi Sao Toán 8 (KNTT)", desc: "Lọt top 5 học sinh xuất sắc của lớp", icon: Star, color: "text-teal-400 bg-teal-500/20 border-teal-500/30" }
  ];

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Bài học đã hoàn thành"
          value={`${stats.completedLessons}/11`}
          subtitle="Chương 1 & Chương 2"
          icon={CheckCircle}
          color="teal"
        />
        <StatCard
          title="Tổng Điểm Tích Lũy"
          value={stats.totalPoints}
          subtitle="Điểm rèn luyện toán"
          icon={Trophy}
          color="amber"
        />
        <StatCard
          title="Chuỗi Học Tập"
          value={`${stats.currentStreak} ngày`}
          subtitle="Chăm chỉ mỗi ngày"
          icon={Flame}
          color="rose"
        />
        <StatCard
          title="Xếp Hạng Trong Lớp"
          value={`Hạng #${stats.rank}`}
          subtitle="Top 5 xuất sắc"
          icon={Award}
          color="sky"
        />
      </div>

      {/* Badges Collection */}
      <div className="glass-card p-6">
        <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Huy Hiệu Vinh Danh Toán 8 Đã Đạt Được
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BADGES.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3.5 hover:border-slate-600 transition-all"
              >
                <div className={`p-3 rounded-xl border ${b.color} flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{b.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
