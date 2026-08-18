import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  KeyRound, 
  Copy, 
  Check, 
  ArrowLeft, 
  CalendarPlus, 
  UserPlus, 
  BookOpen, 
  BarChart3,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import StudentList from '../features/classes/StudentList';
import ClassScoreboard from '../features/classes/ClassScoreboard';
import ImportStudentModal from '../features/classes/ImportStudentModal';
import CreateAssignmentModal from '../features/assignments/CreateAssignmentModal';
import AssignmentCard from '../features/assignments/AssignmentCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const ClassDetailPage = () => {
  const { id } = useParams();
  const { isTeacher, user } = useAuth();
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'assignments' | 'scoreboard'
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Modals
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);

  useEffect(() => {
    loadClassDetails();
  }, [id]);

  const loadClassDetails = async () => {
    setLoading(true);
    try {
      let loadedClass = null;
      let loadedStudents = [];
      let loadedAssignments = [];
      let loadedProgress = [];

      if (isSupabaseConfigured && id && !id.startsWith('c-') && !id.startsWith('demo-')) {
        // Lấy thông tin lớp
        const { data: cls } = await supabase.from('classes').select('*').eq('id', id).single();
        if (cls) loadedClass = cls;

        // Lấy học sinh
        const { data: members } = await supabase
          .from('class_members')
          .select('*, profiles(id, full_name, email, avatar_url)')
          .eq('class_id', id);

        if (members && members.length > 0) {
          loadedStudents = members.map(m => ({
            ...m.profiles,
            status: m.status,
            joined_at: m.joined_at
          }));
        }

        // Lấy bài tập
        const { data: asgs } = await supabase
          .from('assignments')
          .select('*')
          .eq('class_id', id)
          .order('due_date', { ascending: true });

        if (asgs && asgs.length > 0) loadedAssignments = asgs;
      }

      // Mock fallback nếu không tìm thấy từ Supabase hoặc đang xem lớp demo
      if (!loadedClass) {
        loadedClass = {
          id: id || 'c-8a1',
          name: id === 'c-8a2' ? 'Lớp Toán 8A2 (Cơ bản)' : 'Lớp Toán 8A1 (Nâng cao)',
          grade: '8',
          code: id === 'c-8a2' ? 'T8A2HD' : 'T8A1HD',
          description: 'Lớp học Toán 8 Kết Nối Tri Thức trường THCS Nguyễn Huệ',
          academic_year: '2024 - 2025'
        };
      }

      if (loadedStudents.length === 0) {
        loadedStudents = [
          { id: '1', full_name: 'Nguyễn Văn An', email: 'an.nguyen@nguyenhue.edu.vn', status: 'active' },
          { id: '2', full_name: 'Trần Mai Anh', email: 'mai.anh@nguyenhue.edu.vn', status: 'active' },
          { id: '3', full_name: 'Lê Hoàng Nam', email: 'nam.le@nguyenhue.edu.vn', status: 'active' },
          { id: '4', full_name: 'Phạm Quỳnh Như', email: 'nhu.pham@nguyenhue.edu.vn', status: 'active' }
        ];
      }

      if (loadedAssignments.length === 0) {
        loadedAssignments = [
          {
            id: 'asg-1',
            title: 'Rèn luyện 7 Hằng đẳng thức đáng nhớ (Chương 2)',
            due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
            description: 'Các em hoàn thành Đấu trường HĐT đạt trên 80 điểm.'
          }
        ];
      }

      if (loadedProgress.length === 0) {
        loadedProgress = [
          { student_name: 'Trần Mai Anh', status: 'completed', score: 100, completion_time_seconds: 48, completed_at: new Date().toISOString() },
          { student_name: 'Nguyễn Văn An', status: 'completed', score: 90, completion_time_seconds: 55, completed_at: new Date().toISOString() },
          { student_name: 'Lê Hoàng Nam', status: 'completed', score: 85, completion_time_seconds: 62, completed_at: new Date().toISOString() },
          { student_name: 'Phạm Quỳnh Như', status: 'in_progress', score: 0, completion_time_seconds: 0 }
        ];
      }

      setClassInfo(loadedClass);
      setStudents(loadedStudents);
      setAssignments(loadedAssignments);
      setProgressData(loadedProgress);
    } catch (err) {
      console.error('Lỗi tải chi tiết lớp:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (classInfo?.code) {
      navigator.clipboard.writeText(classInfo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link to={isTeacher ? '/teacher' : '/student'} className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Quay lại Bảng điều khiển
      </Link>

      {/* Class Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border-sky-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Khối {classInfo?.grade || '8'} • {classInfo?.academic_year || '2024-2025'}
              </span>
              <span className="text-xs text-slate-400">THCS Nguyễn Huệ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
              {classInfo?.name || 'Chi tiết Lớp học'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {classInfo?.description || 'Lớp Toán 8 Kết Nối Tri Thức - Cô Nguyễn Thị Huyền Diệu'}
            </p>
          </div>

          {/* Join Code Box */}
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-center sm:text-right">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Mã mời vào lớp (Join Code)
            </p>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 font-mono font-black text-lg hover:border-amber-400 transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>{classInfo?.code}</span>
              {copied ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4 opacity-70" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 sm:gap-8">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'students' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Danh sách Học sinh ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'assignments' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Nhiệm vụ & Bài tập ({assignments.length})
        </button>
        <button
          onClick={() => setActiveTab('scoreboard')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'scoreboard' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Bảng Điểm & Báo Cáo
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Đang tải dữ liệu lớp học..." />
      ) : (
        <div>
          {/* Tab 1: Students */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              {isTeacher && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={UserPlus}
                    onClick={() => setShowImportModal(true)}
                  >
                    Thêm / Import Học Sinh
                  </Button>
                </div>
              )}
              <StudentList
                students={students}
                isTeacher={isTeacher}
                onRemoveStudent={(id) => setStudents(students.filter(s => s.id !== id))}
              />
            </div>
          )}

          {/* Tab 2: Assignments */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {isTeacher && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="gold"
                    size="sm"
                    icon={CalendarPlus}
                    onClick={() => setShowCreateAssignment(true)}
                  >
                    Giao bài tập mới cho lớp
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignments.map((asg) => (
                  <AssignmentCard
                    key={asg.id}
                    assignment={asg}
                    isTeacher={isTeacher}
                    onViewDetails={() => setActiveTab('scoreboard')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Scoreboard */}
          {activeTab === 'scoreboard' && (
            <ClassScoreboard
              className={classInfo?.name}
              studentsWithProgress={progressData}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <ImportStudentModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        classId={id}
        onStudentsImported={(imported) => {
          setStudents((prev) => [...prev, ...imported]);
        }}
      />

      <CreateAssignmentModal
        isOpen={showCreateAssignment}
        onClose={() => setShowCreateAssignment(false)}
        classes={[classInfo || {}]}
        preselectedClassId={id}
        onAssignmentCreated={(newAsg) => {
          setAssignments((prev) => [newAsg, ...prev]);
        }}
      />
    </div>
  );
};

export default ClassDetailPage;
