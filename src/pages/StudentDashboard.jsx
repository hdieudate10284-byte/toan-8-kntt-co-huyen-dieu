import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  KeyRound, 
  BookOpen, 
  Gamepad2, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  Flame, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Button from '../components/common/Button';
import JoinClassModal from '../features/classes/JoinClassModal';
import ClassCard from '../features/classes/ClassCard';
import AssignmentCard from '../features/assignments/AssignmentCard';
import StudentAnalytics from '../features/analytics/StudentAnalytics';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [myClasses, setMyClasses] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, [user]);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      let loadedClasses = [];
      let loadedAssignments = [];

      if (isSupabaseConfigured && user?.id && !user.id.startsWith('demo-')) {
        // Lấy danh sách lớp học sinh đã tham gia
        const { data: memberClasses } = await supabase
          .from('class_members')
          .select('classes(*)')
          .eq('student_id', user.id);

        if (memberClasses && memberClasses.length > 0) {
          loadedClasses = memberClasses.map((m) => m.classes).filter(Boolean).map(c => ({
            ...c,
            academic_year: (!c.academic_year || String(c.academic_year).includes('2025')) ? '2026–2027' : c.academic_year
          }));
        }

        // Lấy danh sách bài tập được giao
        const { data: asgs } = await supabase
          .from('assignments')
          .select('*, classes(name)')
          .order('due_date', { ascending: true });

        if (asgs && asgs.length > 0) {
          loadedAssignments = asgs.map((a) => ({
            ...a,
            class_name: a.classes?.name || 'Lớp Toán 8'
          }));
        }
      }

      // Đọc các lớp học & bài tập đã giao được lưu trên thiết bị
      try {
        const savedCustom = JSON.parse(localStorage.getItem('toan8_custom_classes') || '[]');
        if (Array.isArray(savedCustom) && savedCustom.length > 0) {
          let updatedLocalStorage = false;
          const normalizedCustom = savedCustom.map(cls => {
            if (!cls.academic_year || String(cls.academic_year).includes('2025')) {
              updatedLocalStorage = true;
              return { ...cls, academic_year: '2026–2027' };
            }
            return cls;
          });

          if (updatedLocalStorage) {
            localStorage.setItem('toan8_custom_classes', JSON.stringify(normalizedCustom));
          }

          const existingIds = new Set(loadedClasses.map(c => c.id));
          for (const customCls of normalizedCustom) {
            if (!existingIds.has(customCls.id)) {
              loadedClasses.push(customCls);
              existingIds.add(customCls.id);
            }
          }
        }

        const savedCustomAsgs = JSON.parse(localStorage.getItem('toan8_custom_assignments') || '[]');
        if (Array.isArray(savedCustomAsgs) && savedCustomAsgs.length > 0) {
          const existingIds = new Set(loadedAssignments.map(a => String(a.id)));
          for (const customAsg of savedCustomAsgs) {
            if (!existingIds.has(String(customAsg.id))) {
              loadedAssignments.unshift(customAsg);
              existingIds.add(String(customAsg.id));
            }
          }
        }
      } catch (e) {
        console.warn('Lỗi đọc dữ liệu từ localStorage:', e);
      }

      // Mock demo fallback khi chưa có dữ liệu DB
      if (loadedClasses.length === 0) {
        loadedClasses = [
          {
            id: 'c-8-6',
            name: 'Lớp 8/6',
            grade: '8',
            code: 'T806HD',
            academic_year: '2026–2027',
            description: 'Lớp Toán 8/6 - Trường THCS Nguyễn Huệ (Cô Nguyễn Thị Huyền Diệu)',
            student_count: 36,
            created_at: new Date().toISOString()
          },
          {
            id: 'c-8-4',
            name: 'Lớp 8/4',
            grade: '8',
            code: 'T804HD',
            academic_year: '2026–2027',
            description: 'Lớp Toán 8/4 - Trường THCS Nguyễn Huệ (Cô Nguyễn Thị Huyền Diệu)',
            student_count: 35,
            created_at: new Date().toISOString()
          },
          {
            id: 'c-8-8',
            name: 'Lớp 8/8',
            grade: '8',
            code: 'T808HD',
            academic_year: '2026–2027',
            description: 'Lớp Toán 8/8 - Trường THCS Nguyễn Huệ (Cô Nguyễn Thị Huyền Diệu)',
            student_count: 34,
            created_at: new Date().toISOString()
          }
        ];
      }

      if (loadedAssignments.length === 0) {
        loadedAssignments = [
          {
            id: 'asg-demo-1',
            title: 'Phiếu bài tập Bài 6: 7 Hằng đẳng thức đáng nhớ (Năm học 2026-2027)',
            class_name: 'Lớp 8/6',
            external_link: 'https://drive.google.com/file/d/1Toan8KNTT_PhieuBaiTap7HDT/view',
            due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
            description: 'Các em nhấp vào link Google Drive đính kèm để mở phiếu bài tập hoặc làm trên máy tính.'
          },
          {
            id: 'asg-demo-2',
            title: 'Bài tập ôn luyện Chương 1: Đa thức nhiều biến',
            class_name: 'Lớp 8/4',
            external_link: 'https://drive.google.com/file/d/1Toan8KNTT_PhieuDonThucDaThuc/view',
            due_date: new Date(Date.now() + 86400000 * 4).toISOString(),
            description: 'Luyện tập ghép cặp đơn thức đồng dạng và thu gọn đa thức nhiều biến.'
          },
          {
            id: 'asg-demo-3',
            title: 'Kiểm tra trắc nghiệm online Toán 8 - 15 phút (Google Forms)',
            class_name: 'Lớp 8/8',
            external_link: 'https://forms.gle/Toan8KNTT_KiemTra15Phut',
            due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
            description: 'Mở link Google Forms đính kèm để hoàn thành bài trắc nghiệm 15 phút.'
          }
        ];
      }

      setMyClasses(loadedClasses);
      setMyAssignments(loadedAssignments);
    } catch (err) {
      console.error('Lỗi tải dữ liệu học sinh:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassJoined = (newClass) => {
    setMyClasses((prev) => [newClass, ...prev]);
  };

  return (
    <div className="space-y-8">
      {/* Student Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border-sky-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-sky-500/30">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-100">
                  Chào {profile?.full_name || 'Học sinh'}! 👋
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
                  Khối 8 (KNTT)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-medium">
                <img src="/images/logo-thcs-nguyen-hue.png" alt="Logo" className="w-4 h-4 rounded-full bg-white object-contain inline" />
                Trường THCS Nguyễn Huệ (Đà Nẵng) • Giáo viên hướng dẫn: Cô Nguyễn Thị Huyền Diệu
              </p>
            </div>
          </div>

          <Button
            variant="gold"
            size="md"
            icon={KeyRound}
            onClick={() => setShowJoinModal(true)}
            className="btn-gold-glow"
          >
            Nhập Mã Gia Nhập Lớp Mới
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Đang tải góc học tập của bạn..." />
      ) : (
        <div className="space-y-10">
          
          {/* Section 1: Assigned Homework & Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Nhiệm Vụ & Bài Tập Cần Làm
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bài tập và trò chơi cô Huyền Diệu đã giao cho lớp của em
                </p>
              </div>
            </div>

            {myAssignments.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-400 text-sm">
                🎉 Tuyệt vời! Em đã hoàn thành tất cả nhiệm vụ học tập được giao.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myAssignments.map((asg) => (
                  <AssignmentCard
                    key={asg.id}
                    assignment={asg}
                    isTeacher={false}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Quick Jump to Math Games */}
          <div className="glass-card p-6 border-teal-500/30 bg-gradient-to-br from-teal-950/20 to-slate-900/90">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Đấu trường Game Tương tác
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-2">
                  Rèn Luyện Phản Xạ 7 Hằng Đẳng Thức & Đơn Thức Đồng Dạng
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Chơi game tích điểm combo, nâng cao phản xạ và nhận huy hiệu vinh danh của lớp
                </p>
              </div>
              <Link to="/games">
                <Button variant="primary" icon={Gamepad2} className="btn-glow">
                  Vào Đấu trường Game
                </Button>
              </Link>
            </div>
          </div>

          {/* Section 3: My Classes */}
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-sky-400" />
              Lớp Học Của Tôi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myClasses.map((cls) => (
                <ClassCard
                  key={cls.id}
                  classData={cls}
                  isTeacher={false}
                />
              ))}
            </div>
          </div>

          {/* Section 4: Personal Analytics & Badges */}
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              Bảng Thành Tích & Huy Hiệu Cá Nhân
            </h2>
            <StudentAnalytics studentName={profile?.full_name} />
          </div>

        </div>
      )}

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onClassJoined={handleClassJoined}
      />
    </div>
  );
};

export default StudentDashboard;
