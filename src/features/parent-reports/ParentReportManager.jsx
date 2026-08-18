import React, { useState } from 'react';
import { Send, Users, MessageSquare, Mail, Sparkles, CheckCircle2, Copy, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ParentReportModal from './ParentReportModal';
import { formatScore } from '../../utils/formatters';
import { TEACHER_INFO } from '../../data/math8Curriculum';

export const ParentReportManager = ({
  className = "Lớp Toán 8A1",
  classId,
  teacherId,
  students = [
    { id: '1', full_name: 'Trần Mai Anh', email: 'mai.anh@nguyenhue.edu.vn', parent_phone: '0912345678', score: 98, completed_count: 4, total_count: 4, points: 980 },
    { id: '2', full_name: 'Nguyễn Văn An', email: 'an.nguyen@nguyenhue.edu.vn', parent_phone: '0987654321', score: 88, completed_count: 4, total_count: 4, points: 850 },
    { id: '3', full_name: 'Lê Hoàng Nam', email: 'nam.le@nguyenhue.edu.vn', parent_phone: '0901234567', score: 84, completed_count: 3, total_count: 4, points: 790 },
    { id: '4', full_name: 'Phạm Quỳnh Như', email: 'nhu.pham@nguyenhue.edu.vn', parent_phone: '0934567890', score: 55, completed_count: 2, total_count: 4, points: 420 }
  ]
}) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [copiedGroupMessage, setCopiedGroupMessage] = useState(false);

  // Tạo thông báo tổng kết tuần cho cả nhóm Zalo Lớp
  const handleCopyClassGroupZalo = () => {
    const avgClassScore = (students.reduce((acc, curr) => acc + (curr.score || 0), 0) / students.length).toFixed(1);
    const totalCompleted = students.reduce((acc, curr) => acc + (curr.completed_count || 0), 0);
    const totalExpected = students.length * 4;

    const groupText = `📢 [THÔNG BÁO TỔNG KẾT TUẦN - LỚP ${className.toUpperCase()}]
🏫 Trường THCS Nguyễn Huệ • Môn Toán 8 (KNTT)
👩‍🏫 Giáo viên phụ trách: ${TEACHER_INFO.name}

Kính gửi Quý Phụ huynh Lớp ${className},
Cô Huyền Diệu xin gửi báo cáo tổng kết tình hình học tập tuần này của các em:

📊 THỐNG KÊ TOÀN LỚP:
- Tỉ lệ nộp bài tập & tham gia Game: ${Math.round((totalCompleted / totalExpected) * 100)}%
- Điểm rèn luyện trung bình lớp: ${avgClassScore}/100

🌟 TOP 3 HỌC SINH XUẤT SẮC TUẦN:
🥇 1. Trần Mai Anh - 98đ
🥈 2. Nguyễn Văn An - 88đ
🥉 3. Lê Hoàng Nam - 84đ

Cô đã gửi chi tiết phiếu báo cáo và nhận xét của từng em. Quý Phụ huynh vui lòng kiểm tra và tiếp tục đồng hành cùng các con nhé!
Trân trọng cảm ơn Quý Phụ huynh! ❤️`;

    navigator.clipboard.writeText(groupText);
    setCopiedGroupMessage(true);
    setTimeout(() => setCopiedGroupMessage(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="glass-card p-6 border-teal-500/30 bg-gradient-to-r from-slate-900 via-slate-900/70 to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-400" />
            Hệ Thống Gửi Báo Cáo Học Tập Tuần Cho Phụ Huynh
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Tự động tạo nhận xét sư phạm, mẫu tin nhắn Zalo và Email gửi đến từng phụ huynh học sinh
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          icon={copiedGroupMessage ? Check : Copy}
          onClick={handleCopyClassGroupZalo}
          className="btn-gold-glow flex-shrink-0"
        >
          {copiedGroupMessage ? 'Đã sao chép tin nhóm' : 'Sao chép tin tổng kết Nhóm Zalo Lớp'}
        </Button>
      </div>

      {/* Student List for Report Dispatch */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Học sinh</th>
                <th className="py-3.5 px-4">SĐT Phụ huynh (Zalo)</th>
                <th className="py-3.5 px-4">Bài tập tuần</th>
                <th className="py-3.5 px-4">Điểm TB</th>
                <th className="py-3.5 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {students.map((st, index) => {
                const name = st.full_name || st.student_name || `Học sinh ${index + 1}`;
                const score = st.score ?? 80;
                return (
                  <tr key={st.id || index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-sky-400 font-bold">
                        {name.charAt(0)}
                      </div>
                      <span>{name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                      {st.parent_phone || '0987654321'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={st.completed_count >= 3 ? 'emerald' : 'amber'}>
                        {st.completed_count ?? 3}/{st.total_count ?? 4} bài
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                      {formatScore(score)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Send}
                        onClick={() => setSelectedStudent(st)}
                      >
                        Soạn & Gửi Báo Cáo
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedStudent && (
        <ParentReportModal
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          student={selectedStudent}
          className={className}
          classId={classId}
          teacherId={teacherId}
        />
      )}
    </div>
  );
};

export default ParentReportManager;
