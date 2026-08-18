import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Mail, 
  Copy, 
  Check, 
  Sparkles, 
  Trophy, 
  Award, 
  ExternalLink,
  Printer
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { TEACHER_INFO } from '../../data/math8Curriculum';
import { formatZaloMessage, sendParentReport, generateTeacherComment } from './parentReportService';
import { formatScore } from '../../utils/formatters';

export const ParentReportModal = ({
  isOpen,
  onClose,
  student,
  className = "Lớp Toán 8A1",
  classId,
  teacherId
}) => {
  if (!student) return null;

  const studentName = student.full_name || student.student_name || 'Học sinh';
  const avgScore = Number(student.score ?? 88);
  const completedCount = student.completed_count ?? 3;
  const totalCount = student.total_count ?? 4;
  const points = student.points ?? 850;
  const badges = student.badges ?? ['Chiến binh 7 Hằng đẳng thức', 'Bậc thầy đơn thức'];

  const [week, setWeek] = useState('Tuần 4 - Học kỳ I');
  const [parentPhone, setParentPhone] = useState(student.parent_phone || '0987654321');
  const [parentEmail, setParentEmail] = useState(student.email || 'phuhuynh@nguyenhue.edu.vn');
  const [comment, setComment] = useState(() => generateTeacherComment(studentName, avgScore, (completedCount / totalCount) * 100));
  const [channel, setChannel] = useState('zalo'); // 'zalo' | 'email'
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const reportData = {
    studentName,
    className,
    studentId: student.id || student.student_id,
    classId,
    teacherId,
    week,
    avgScore,
    completedCount,
    totalCount,
    points,
    badges,
    comment,
    parentPhone,
    parentEmail,
    channel
  };

  const formattedZaloText = formatZaloMessage(reportData);

  const handleCopyZalo = () => {
    navigator.clipboard.writeText(formattedZaloText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenZaloWeb = () => {
    handleCopyZalo();
    window.open(`https://zalo.me/${parentPhone.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const handleSendReport = async () => {
    setSending(true);
    try {
      await sendParentReport(reportData);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Lỗi gửi báo cáo:', err);
    } finally {
      setSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Báo Cáo Học Tập Tuần Gửi Phụ Huynh: ${studentName}`}
      subtitle={`${className} • Cô Nguyễn Thị Huyền Diệu (THCS Nguyễn Huệ)`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Channel Switcher */}
        <div className="flex border-b border-slate-800 gap-4">
          <button
            type="button"
            onClick={() => setChannel('zalo')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              channel === 'zalo'
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-teal-400" /> Gửi tin nhắn Zalo / SMS
          </button>
          <button
            type="button"
            onClick={() => setChannel('email')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              channel === 'email'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4 text-sky-400" /> Gửi Email Báo cáo
          </button>
        </div>

        {/* Stats Preview Card */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-center">
          <div>
            <p className="text-[11px] text-slate-400">Điểm trung bình</p>
            <p className="text-xl font-black text-amber-300 font-mono">{formatScore(avgScore)}/100</p>
          </div>
          <div className="border-x border-slate-700">
            <p className="text-[11px] text-slate-400">Bài tập tuần</p>
            <p className="text-xl font-bold text-teal-400">{completedCount}/{totalCount}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Điểm Game</p>
            <p className="text-xl font-bold text-sky-400">{points}đ</p>
          </div>
        </div>

        {/* Teacher Comment Editor */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Lời nhận xét sư phạm của Cô Huyền Diệu (có thể chỉnh sửa):
            </label>
            <button
              type="button"
              onClick={() => setComment(generateTeacherComment(studentName, avgScore, (completedCount / totalCount) * 100))}
              className="text-[11px] text-sky-400 hover:underline"
            >
              Tạo lại nhận xét
            </button>
          </div>
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-sky-500 leading-relaxed"
          />
        </div>

        {/* Contact details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Số điện thoại Phụ huynh (Zalo):
            </label>
            <input
              type="tel"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Phụ huynh:
            </label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Formatted Message Preview for Zalo */}
        {channel === 'zalo' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nội dung tin nhắn chuẩn bị gửi qua Zalo:
            </label>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-line max-h-36 overflow-y-auto leading-relaxed">
              {formattedZaloText}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Printer}
              onClick={handlePrint}
              type="button"
            >
              In phiếu
            </Button>
            {channel === 'zalo' && (
              <Button
                variant="outline"
                size="sm"
                icon={copied ? Check : Copy}
                onClick={handleCopyZalo}
                type="button"
                className="text-teal-400 border-teal-500/40"
              >
                {copied ? 'Đã sao chép tin nhắn' : 'Sao chép tin nhắn Zalo'}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>
              Đóng
            </Button>
            {channel === 'zalo' ? (
              <Button
                variant="gold"
                size="sm"
                icon={Send}
                onClick={handleOpenZaloWeb}
                className="btn-gold-glow"
              >
                Mở Zalo Gửi Phụ Huynh
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={Send}
                onClick={handleSendReport}
                isLoading={sending}
              >
                {sentSuccess ? 'Đã gửi Email thành công!' : 'Gửi Email Ngay'}
              </Button>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};

export default ParentReportModal;
