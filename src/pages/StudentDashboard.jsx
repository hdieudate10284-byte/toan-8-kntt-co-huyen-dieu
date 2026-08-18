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
          loadedClasses = memberClasses.map((m) => m.classes).filter(Boolean);
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

      // Mock demo fallback khi chưa có dữ liệu DB
      if (loadedClasses.length === 0) {
        loadedClasses = [
          {
            id: 'demo-class-8a1',
            name: 'Lớp Toán 8A1 (Cô Huyền Diệu)',
            grade: '8',
            code: 'T8A1HD',
            description: 'Lớp học Toán 8 Kết Nối Tri Thức trường THCS Nguyễn Huệ',
            student_count: 32,
            created_at: new Date().toISOString()
          }
        ];
      }

      if (loadedAssignments.length === 0) {
        loadedAssignments = [
          {
            id: 'asg-demo-1',
            title: 'Nhiệm vụ 1: Đấu trường 7 Hằng đẳng thức (Chương 2)',
            class_name: 'Lớp Toán 8A1',
            due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
            description: 'Vào Đấu trường chơi ghép 7 Hằng đẳng thức đạt từ 80 điểm trở lên.'
          },
          {
            id: 'asg-demo-2',
            title: 'Nhiệm vụ 2: Thu gọn đa thức và Săn đơn thức đồng dạng (Chương 1)',
            class_name: 'Lớp Toán 8A1',
            due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
            description: 'Luyện tập ghép cặp các đơn thức có cùng phần biến để dọn sạch bàn chơi.'
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
