import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Trophy, 
  Award, 
  School, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Heart, 
  Printer, 
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { TEACHER_INFO } from '../data/math8Curriculum';
import MathRenderer from '../components/common/MathRenderer';
import Button from '../components/common/Button';

export const ParentReportViewPage = () => {
  const { id } = useParams();

  // Mock data for student report card
  const reportData = {
    studentName: "Nguyễn Văn An",
    className: "Lớp Toán 8A1",
    school: "Trường THCS Nguyễn Huệ",
    week: "Tuần 4 - Học kỳ I (Năm học 2024 - 2025)",
    subject: "Toán học 8 - Bộ sách Kết Nối Tri Thức",
    teacher: TEACHER_INFO.name,
    teacherAvatar: TEACHER_INFO.avatar,
    avgScore: 88.5,
    completedAssignments: "4/4 bài",
    gamePoints: 850,
    streak: "7 ngày liên tiếp",
    rank: 2,
    badges: [
      "⚡ Cao Thủ 7 Hằng Đẳng Thức",
      "🧩 Bậc Thầy Đơn Thức Đồng Dạng",
      "🔥 Chiến Binh Chăm Chỉ"
    ],
    coveredTopics: [
      "Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu",
      "Bài 7: Lập phương của một tổng. Lập phương của một hiệu",
      "Đấu trường phản xạ 7 Hằng đẳng thức đáng nhớ (Đạt 95 điểm)"
    ],
    teacherRemark: "Khen ngợi em Nguyễn Văn An tuần này học tập rất tích cực và chủ động. Em thuộc lòng và vận dụng thành thạo các hằng đẳng thức đáng nhớ vào bài toán tính nhanh giá trị biểu thức. Kính mong Quý Phụ huynh tiếp tục đồng hành và động viên em phát huy phong độ!"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Về Trang chủ
        </Link>
        <Button variant="gold" size="sm" icon={Printer} onClick={handlePrint} className="btn-gold-glow">
          In Phiếu Báo Cáo / Xuất PDF
        </Button>
      </div>

      {/* Certificate / Report Card Container */}
      <div className="glass-card bg-slate-900/95 border-2 border-amber-500/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative corner ribbons */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/20 rotate-45 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-teal-500/20 rotate-45 pointer-events-none" />

        {/* Header School info */}
        <div className="flex flex-col items-center text-center pb-6 border-b-2 border-slate-800">
          <img
            src="/images/logo-thcs-nguyen-hue.png"
            alt="Logo THCS Nguyễn Huệ"
            className="w-16 h-16 rounded-full object-contain bg-white p-1 border-2 border-amber-500/60 shadow-xl mb-3"
          />
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400 mb-1">
            <span>{reportData.school} - ĐÀ NẴNG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
            Phiếu Báo Cáo Học Tập Môn Toán 8 (KNTT)
          </h1>
          <p className="text-xs text-amber-300 font-semibold mt-1">
            {reportData.week}
          </p>
        </div>

        {/* Student & Teacher Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div>
            <p className="text-xs text-slate-400">Học sinh:</p>
            <p className="text-lg font-extrabold text-slate-100">{reportData.studentName}</p>
            <p className="text-xs text-sky-400 font-medium">{reportData.className}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-slate-400">Giáo viên phụ trách:</p>
            <p className="text-lg font-extrabold text-amber-300">{reportData.teacher}</p>
            <p className="text-xs text-slate-400">Bộ môn: {reportData.subject}</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-center">
          <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700">
            <p className="text-[11px] text-slate-400">Điểm trung bình</p>
            <p className="text-2xl font-black text-amber-400 font-mono mt-0.5">{reportData.avgScore}</p>
          </div>
          <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700">
            <p className="text-[11px] text-slate-400">Bài tập hoàn thành</p>
            <p className="text-xl font-bold text-teal-400 mt-1">{reportData.completedAssignments}</p>
          </div>
          <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700">
            <p className="text-[11px] text-slate-400">Đấu trường Game</p>
            <p className="text-xl font-bold text-sky-400 mt-1">{reportData.gamePoints}đ</p>
          </div>
          <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700">
            <p className="text-[11px] text-slate-400">Xếp hạng lớp</p>
            <p className="text-xl font-black text-rose-400 mt-1">Hạng #{reportData.rank}</p>
          </div>
        </div>

        {/* Covered Topics in Week */}
        <div className="my-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Nội dung rèn luyện trọng tâm trong tuần:
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {reportData.coveredTopics.map((t, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Badges */}
        <div className="my-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" /> Danh hiệu & Huy hiệu vinh danh:
          </h3>
          <div className="flex flex-wrap gap-2">
            {reportData.badges.map((b, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Teacher's Remarks Box */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 my-6">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Lời nhận xét của Cô Nguyễn Thị Huyền Diệu:
          </p>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
            "{reportData.teacherRemark}"
          </p>
        </div>

        {/* Footer Signatures */}
        <div className="pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            <p className="font-semibold text-slate-300">Ý kiến Phụ huynh:</p>
            <p className="text-[11px] text-slate-500 mt-8">(Ký và ghi rõ họ tên)</p>
          </div>

          <div className="text-center">
            <p className="font-semibold text-slate-300">Giáo viên Phụ trách</p>
            <img
              src={reportData.teacherAvatar}
              alt="Chữ ký"
              className="w-12 h-12 rounded-full object-cover mx-auto mt-2 border border-amber-500/40 opacity-90"
            />
            <p className="font-bold text-slate-200 mt-1">{reportData.teacher}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParentReportViewPage;
