import React from 'react';
import { BarChart3, Users, BookOpen, Trophy, TrendingUp, CheckCircle } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { formatScore } from '../../utils/formatters';

export const TeacherAnalytics = ({
  stats = {
    totalClasses: 3,
    totalStudents: 85,
    totalMaterials: 14,
    totalAssignments: 8,
    completionRate: 88,
    averageScore: 84.5
  }
}) => {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng số Học sinh"
          value={stats.totalStudents}
          subtitle="trên 3 lớp Toán 8"
          icon={Users}
          color="sky"
          trend="+12%"
        />
        <StatCard
          title="Kho Học liệu & Game"
          value={stats.totalMaterials}
          subtitle="Chương 1 & Chương 2"
          icon={BookOpen}
          color="teal"
        />
        <StatCard
          title="Tỉ lệ Hoàn thành"
          value={`${stats.completionRate}%`}
          subtitle="Bài tập & Minigame"
          icon={CheckCircle}
          color="amber"
          trend="Rất tốt"
        />
        <StatCard
          title="Điểm Trung Bình"
          value={formatScore(stats.averageScore)}
          subtitle="Thang điểm 100"
          icon={Trophy}
          color="rose"
        />
      </div>

      {/* Visual Chart Bars (Tailwind Pure CSS Sleek Graph) */}
      <div className="glass-card p-6 border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              Tỉ lệ hoàn thành các bài học Toán 8 KNTT
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Thống kê mức độ hiểu bài và làm bài tập theo từng bài</p>
          </div>
          <span className="text-xs text-teal-400 font-bold px-2.5 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
            Dữ liệu thời gian thực
          </span>
        </div>

        <div className="space-y-4">
          {[
            { lesson: 'Bài 1: Đơn thức', rate: 96, chapter: 1 },
            { lesson: 'Bài 2: Đa thức', rate: 92, chapter: 1 },
            { lesson: 'Bài 3: Cộng trừ đa thức', rate: 89, chapter: 1 },
            { lesson: 'Bài 4: Nhân đa thức', rate: 85, chapter: 1 },
            { lesson: 'Bài 5: Chia đa thức cho đơn thức', rate: 82, chapter: 1 },
            { lesson: 'Bài 6: Hiệu 2 bình phương. Bình phương tổng hiệu', rate: 94, chapter: 2 },
            { lesson: 'Bài 7: Lập phương của tổng và hiệu', rate: 88, chapter: 2 },
            { lesson: 'Bài 8: Tổng và hiệu hai lập phương', rate: 86, chapter: 2 },
            { lesson: 'Bài 9: Phân tích đa thức thành nhân tử', rate: 80, chapter: 2 }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{item.lesson}</span>
                <span className="font-mono font-bold text-sky-400">{item.rate}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.chapter === 1
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                  }`}
                  style={{ width: `${item.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
