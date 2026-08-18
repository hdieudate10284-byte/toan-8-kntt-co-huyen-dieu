import React from 'react';
import { Download, Trophy, Timer, CheckCircle, Clock, XCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatSecondsToTime, formatDate, formatScore } from '../../utils/formatters';
import { exportGradebookToExcel } from '../../utils/excelParser';

export const ClassScoreboard = ({
  className = "Lớp Toán 8A1",
  studentsWithProgress = []
}) => {
  const handleExport = () => {
    exportGradebookToExcel(className, studentsWithProgress);
  };

  const completedCount = studentsWithProgress.filter((s) => s.status === 'completed').length;
  const avgScore = studentsWithProgress.length > 0
    ? (studentsWithProgress.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) / studentsWithProgress.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Top summary & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 sm:p-5">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-slate-400">Đã hoàn thành bài</p>
            <p className="text-xl font-bold text-teal-400">
              {completedCount}/{studentsWithProgress.length}
            </p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-xs text-slate-400">Điểm trung bình lớp</p>
            <p className="text-xl font-bold text-amber-300 font-mono">
              {avgScore} / 100
            </p>
          </div>
        </div>

        <Button
          variant="gold"
          size="sm"
          icon={Download}
          onClick={handleExport}
        >
          Xuất file Excel bảng điểm
        </Button>
      </div>

      {/* Table of students */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">STT</th>
                <th className="py-3.5 px-4 font-semibold">Học sinh</th>
                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                <th className="py-3.5 px-4 font-semibold">Điểm số</th>
                <th className="py-3.5 px-4 font-semibold">Thời gian làm bài</th>
                <th className="py-3.5 px-4 font-semibold">Thời điểm nộp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {studentsWithProgress.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Chưa có dữ liệu tiến độ nộp bài của học sinh.
                  </td>
                </tr>
              ) : (
                studentsWithProgress.map((item, index) => {
                  const studentName = item.student_name || item.student?.full_name || `Học sinh ${index + 1}`;
                  const score = item.score ?? 0;
                  const isCompleted = item.status === 'completed';

                  return (
                    <tr key={item.id || index} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                        {(index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="py-3.5 px-4 font-semibold flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400">
                          {studentName.charAt(0)}
                        </div>
                        <span>{studentName}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isCompleted ? (
                          <Badge variant="emerald">
                            <CheckCircle className="w-3 h-3" /> Đã hoàn thành
                          </Badge>
                        ) : item.status === 'in_progress' ? (
                          <Badge variant="amber">
                            <Clock className="w-3 h-3" /> Đang làm bài
                          </Badge>
                        ) : (
                          <Badge variant="slate">
                            <XCircle className="w-3 h-3" /> Chưa làm
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-mono font-bold text-base ${score >= 80 ? 'text-teal-400' : (score >= 50 ? 'text-amber-300' : 'text-slate-400')}`}>
                          {formatScore(score)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5 text-slate-500" />
                          {formatSecondsToTime(item.completion_time_seconds)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {item.completed_at ? formatDate(item.completed_at) : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassScoreboard;
