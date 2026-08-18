import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  Gamepad2, 
  Trophy, 
  Users, 
  ArrowRight, 
  GraduationCap, 
  School, 
  CheckCircle2, 
  Zap, 
  ShieldCheck,
  Award
} from 'lucide-react';
import MathRenderer from '../components/common/MathRenderer';
import Button from '../components/common/Button';
import { TEACHER_INFO, MATH_8_CURRICULUM } from '../data/math8Curriculum';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { role, profile } = useAuth();

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glowing Orbs in Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          
          {/* Badge School */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-sky-500/40 text-xs font-semibold text-sky-300 mb-6 shadow-xl animate-fadeIn">
            <img
              src="/images/logo-thcs-nguyen-hue.png"
              alt="Logo THCS Nguyễn Huệ"
              className="w-6 h-6 rounded-full object-contain bg-white/95 p-0.5 border border-sky-400"
            />
            <span>Trường THCS Nguyễn Huệ (Đà Nẵng) • Môn Toán Học Khối 8</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-tight">
            Học & Rèn Luyện <span className="text-gradient">Toán 8 KNTT</span> Cùng <br className="hidden sm:inline" />
            <span className="text-gradient-gold">{TEACHER_INFO.name}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Hệ thống Quản lý Giáo dục, Kho Học liệu Số & Đấu trường Game Tương tác chuẩn Bộ sách <b>Kết Nối Tri Thức Với Cuộc Sống</b>. Chinh phục trọn vẹn <b>Chương 1 (Đa thức)</b> và <b>Chương 2 (7 Hằng đẳng thức đáng nhớ)</b>.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={role === 'teacher' ? '/teacher' : (role === 'student' ? '/student' : '/curriculum')}>
              <Button variant="gold" size="lg" icon={GraduationCap} className="btn-gold-glow w-full sm:w-auto">
                {profile ? 'Truy cập Bảng điều khiển' : 'Vào Lớp Học Toán 8 Ngay'}
              </Button>
            </Link>
            <Link to="/games">
              <Button variant="primary" size="lg" icon={Gamepad2} className="btn-glow w-full sm:w-auto">
                Trải nghiệm Đấu trường Game
              </Button>
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 glass-card p-6">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-sky-400">2 Chương</p>
              <p className="text-xs text-slate-400 mt-0.5">Trọng tâm SGK KNTT</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-teal-400">7 HĐT</p>
              <p className="text-xs text-slate-400 mt-0.5">Hằng đẳng thức đáng nhớ</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">Game tương tác chấm điểm</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-rose-400">THCS</p>
              <p className="text-xs text-slate-400 mt-0.5">Nguyễn Huệ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Profile Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="glass-card p-8 sm:p-10 border-amber-500/30 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950/95 shadow-2xl shadow-amber-500/10">
          <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <img
                src={TEACHER_INFO.avatar}
                alt={TEACHER_INFO.name}
                className="relative w-48 h-56 sm:w-56 sm:h-64 rounded-3xl object-cover object-top border-4 border-amber-400 shadow-2xl shadow-amber-500/30"
              />
              <div className="absolute -bottom-3 -right-3 p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-bold shadow-xl border-2 border-amber-200 animate-bounce">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" /> Giáo viên Phụ trách môn Toán 8
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
                {TEACHER_INFO.name}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2.5 mt-2">
                <img
                  src="/images/logo-thcs-nguyen-hue.png"
                  alt="Logo Trường THCS Nguyễn Huệ Đà Nẵng"
                  className="w-7 h-7 rounded-full object-contain bg-white p-0.5 border border-sky-400 inline-block shadow-md"
                />
                <p className="text-sm sm:text-base font-bold text-sky-300">{TEACHER_INFO.school}</p>
              </div>
              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed font-normal">
                "{TEACHER_INFO.bio}"
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-5 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" /> Giảng dạy theo chương trình mới 2018
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" /> Ứng dụng mô hình Lớp học Đảo ngược
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum 2 Chapters Highlight */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-100">
            Nội Dung Chương Trình Học Liệu Toán 8 (KNTT)
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Hệ thống hóa toàn diện lý thuyết, công thức vàng và bài tập thực hành theo từng bài học
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MATH_8_CURRICULUM.map((chap) => (
            <div
              key={chap.chapter}
              className="glass-card p-6 sm:p-8 border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${chap.badgeColor}`}>
                  {chap.chapterTitle}
                </span>
                <p className="text-xs text-slate-400 mt-2">{chap.description}</p>

                <div className="mt-6 space-y-3">
                  {chap.lessons.map((les) => (
                    <div
                      key={les.id}
                      className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">{les.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{les.summary}</p>
                      </div>
                      <Link to={`/curriculum?chapter=${chap.chapter}&lesson=${les.number}`}>
                        <Button variant="ghost" size="sm" className="text-sky-400">
                          Học bài
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-right">
                <Link to={`/curriculum?chapter=${chap.chapter}`}>
                  <Button variant="primary" size="sm" icon={ArrowRight}>
                    Xem cẩm nang Chương {chap.chapter}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-100">
            Hệ Sinh Thái Học Tập Thông Minh
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Môi trường học tập tương tác số đa chiều dành cho Giáo viên và Học sinh THCS Nguyễn Huệ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="p-3.5 rounded-2xl bg-sky-500/15 text-sky-400 w-fit mb-4 border border-sky-500/30">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Quản Lý Lớp Học & Mã Mời</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Tạo lớp học theo từng phân ban, sinh mã gia nhập (Join Code) 6 ký tự ngẫu nhiên hoặc import danh sách học sinh từ file Excel tiện lợi.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="p-3.5 rounded-2xl bg-amber-500/15 text-amber-400 w-fit mb-4 border border-amber-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Đấu Trường Game & Nhúng iFrame</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Tích hợp sẵn trò chơi luyện 7 Hằng đẳng thức, ghép đơn thức đồng dạng, đồng thời hỗ trợ nhúng iFrame Wordwall, Quizizz, Kahoot mượt mà.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="p-3.5 rounded-2xl bg-teal-500/15 text-teal-400 w-fit mb-4 border border-teal-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Chấm Điểm & Bảng Vàng Tự Động</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Tự động lưu trữ điểm số, thời gian làm bài vào Database Supabase PostgreSQL, hiển thị bảng vàng vinh danh và xuất file Excel bảng điểm.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
