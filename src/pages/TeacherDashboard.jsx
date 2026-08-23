import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  BookOpen, 
  Gamepad2, 
  CalendarPlus, 
  Sparkles, 
  FileSpreadsheet, 
  GraduationCap, 
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TEACHER_INFO } from '../data/math8Curriculum';
import Button from '../components/common/Button';
import ClassCard from '../features/classes/ClassCard';
import CreateClassModal from '../features/classes/CreateClassModal';
import UploadMaterialModal from '../features/materials/UploadMaterialModal';
import CreateAssignmentModal from '../features/assignments/CreateAssignmentModal';
import MaterialCard from '../features/materials/MaterialCard';
import MaterialViewerModal from '../features/materials/MaterialViewerModal';
import AssignmentCard from '../features/assignments/AssignmentCard';
import TeacherAnalytics from '../features/analytics/TeacherAnalytics';
import ParentReportManager from '../features/parent-reports/ParentReportManager';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const TeacherDashboard = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('classes'); // 'classes' | 'materials' | 'assignments' | 'parent-reports' | 'analytics'
  const [loading, setLoading] = useState(true);

  // Data states
  const [classes, setClasses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Modals
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showUploadMaterial, setShowUploadMaterial] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [viewingMaterial, setViewingMaterial] = useState(null);

  // Filter
  const [chapterFilter, setChapterFilter] = useState('all');

  useEffect(() => {
    loadTeacherData();
  }, [user]);

  const loadTeacherData = async () => {
    setLoading(true);
    try {
      let loadedClasses = [];
      let loadedMaterials = [];
      let loadedAssignments = [];

      const effectiveTeacherId = (user?.id && !user.id.startsWith('demo-')) 
        ? user.id 
        : '77b6cdfe-1747-4235-82ef-138e9177d749';

      if (isSupabaseConfigured) {
        try {
          const { data: classList, error } = await supabase
            .from('classes')
            .select('*, class_members(count)')
            .eq('teacher_id', effectiveTeacherId)
            .order('created_at', { ascending: false });

          if (classList && classList.length > 0) {
            loadedClasses = classList.map(c => ({
              ...c,
              student_count: c.class_members?.[0]?.count || 0,
              academic_year: (!c.academic_year || String(c.academic_year).includes('2025')) ? '2026–2027' : c.academic_year
            }));
          }
        } catch (e) {
          console.warn('Lỗi Supabase khi tải danh sách lớp:', e);
        }

        const { data: matList } = await supabase
          .from('materials')
          .select('*')
          .order('chapter', { ascending: true })
          .order('lesson_number', { ascending: true });

        if (matList && matList.length > 0) loadedMaterials = matList;

        const { data: asgList } = await supabase
          .from('assignments')
          .select('*, classes(name)')
          .order('created_at', { ascending: false });

        if (asgList && asgList.length > 0) {
          loadedAssignments = asgList.map(a => ({
            ...a,
            class_name: a.classes?.name || 'Lớp Toán 8'
          }));
        }
      }

      // Kết hợp với danh sách lớp học & bài tập lưu trên thiết bị
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

        const savedAsgs = JSON.parse(localStorage.getItem('toan8_custom_assignments') || '[]');
        if (Array.isArray(savedAsgs) && savedAsgs.length > 0) {
          const existingAsgIds = new Set(loadedAssignments.map(a => String(a.id)));
          for (const customAsg of savedAsgs) {
            if (!existingAsgIds.has(String(customAsg.id))) {
              loadedAssignments.unshift(customAsg);
              existingAsgIds.add(String(customAsg.id));
            }
          }
        }
      } catch (e) {
        console.warn('Lỗi đọc dữ liệu từ localStorage:', e);
      }

      // Nếu chưa có dữ liệu từ DB hoặc đang ở Demo mode, nạp dữ liệu mẫu phong phú để test mượt mà
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
            assignment_count: 4,
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
            assignment_count: 3,
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
            assignment_count: 3,
            created_at: new Date().toISOString()
          },
          {
            id: '16e02a4b-d952-42a5-90f1-f2f1976b3077',
            name: 'Lớp Toán 8A1 (Nâng cao)',
            grade: '8',
            code: 'T8A1HD',
            academic_year: '2026–2027',
            description: 'Lớp chuyên Toán 8 - THCS Nguyễn Huệ',
            student_count: 32,
            assignment_count: 4,
            created_at: new Date().toISOString()
          },
          {
            id: '1967afc6-ce3b-4c84-a640-b0d8a64ab28c',
            name: 'Lớp Toán 8A2 (Cơ bản)',
            grade: '8',
            code: 'T8A2HD',
            academic_year: '2026–2027',
            description: 'Lớp Đại số 8 Kết Nối Tri Thức',
            student_count: 28,
            assignment_count: 3,
            created_at: new Date().toISOString()
          }
        ];
      }

      if (loadedMaterials.length === 0) {
        loadedMaterials = [
          {
            id: 'mat-1',
            title: 'Phiếu học tập Bài 1: Đơn thức & Đơn thức đồng dạng',
            chapter: 1,
            lesson_number: 1,
            lesson_name: 'Bài 1: Đơn thức',
            type: 'document',
            description: 'Tài liệu tóm tắt lý thuyết và hệ thống bài tập tự luyện Bài 1.'
          },
          {
            id: 'mat-2',
            title: 'Minigame: Đấu trường 7 Hằng đẳng thức',
            chapter: 2,
            lesson_number: 6,
            lesson_name: 'Bài 6: Hiệu hai bình phương. Bình phương tổng hiệu',
            type: 'game_iframe',
            embed_url: 'https://wordwall.net/embed/math-monomial-match',
            description: 'Trò chơi rèn phản xạ 7 hằng đẳng thức đáng nhớ Toán 8 KNTT.'
          }
        ];
      }

      if (loadedAssignments.length === 0) {
        loadedAssignments = [
          {
            id: 'asg-86-1',
            title: 'Phiếu bài tập Bài 6: 7 Hằng đẳng thức đáng nhớ (Năm học 2026-2027)',
            class_name: 'Lớp 8/6',
            external_link: 'https://drive.google.com/file/d/1Toan8KNTT_PhieuBaiTap7HDT/view',
            due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
            description: 'Các em nhấp vào link Google Drive đính kèm để mở phiếu bài tập hoặc tham gia Đấu trường Game rèn luyện phản xạ.'
          },
          {
            id: 'asg-84-1',
            title: 'Bài tập ôn luyện Chương 1: Đa thức nhiều biến',
            class_name: 'Lớp 8/4',
            external_link: 'https://drive.google.com/file/d/1Toan8KNTT_PhieuDonThucDaThuc/view',
            due_date: new Date(Date.now() + 86400000 * 4).toISOString(),
            description: 'Hoàn thành phiếu bài tập tự luyện và đối chiếu lời giải chi tiết của Cô Huyền Diệu.'
          },
          {
            id: 'asg-88-1',
            title: 'Kiểm tra trắc nghiệm online Toán 8 - 15 phút (Google Forms)',
            class_name: 'Lớp 8/8',
            external_link: 'https://forms.gle/Toan8KNTT_KiemTra15Phut',
            due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
            description: 'Các em mở link Google Forms đính kèm để hoàn thành bài kiểm tra 15 phút trực tuyến.'
          }
        ];
      }

      setClasses(loadedClasses);
      setMaterials(loadedMaterials);
      setAssignments(loadedAssignments);
    } catch (err) {
      console.error('Lỗi tải dữ liệu giáo viên:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Thầy/Cô có chắc chắn muốn xóa lớp học này không?')) return;
    
    // 1. Xóa trên Supabase nếu có
    if (isSupabaseConfigured && !String(classId).startsWith('demo-')) {
      try {
        await supabase.from('classes').delete().eq('id', classId);
      } catch (e) {
        console.warn('Lỗi Supabase khi xóa lớp:', e);
      }
    }

    // 2. Xóa khỏi localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('toan8_custom_classes') || '[]');
      const updated = saved.filter(c => String(c.id) !== String(classId));
      localStorage.setItem('toan8_custom_classes', JSON.stringify(updated));
    } catch (e) {}

    // 3. Cập nhật state
    setClasses(prev => prev.filter(c => String(c.id) !== String(classId)));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-sky-500/10 border-amber-500/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile?.avatar_url || TEACHER_INFO.avatar}
                alt="Cô Nguyễn Thị Huyền Diệu"
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-lg shadow-amber-500/30"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-400 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-100">
                  {profile?.full_name || TEACHER_INFO.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  Giáo viên Toán
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-medium">
                <img src="/images/logo-thcs-nguyen-hue.png" alt="Logo" className="w-4 h-4 rounded-full bg-white object-contain inline" />
                Trường THCS Nguyễn Huệ (Đà Nẵng) • Phụ trách Toán 8 (Chương 1 & Chương 2 KNTT)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="gold"
              size="sm"
              icon={Plus}
              onClick={() => setShowCreateClass(true)}
              className="btn-gold-glow"
            >
              Tạo Lớp Mới
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={CalendarPlus}
              onClick={() => setShowCreateAssignment(true)}
            >
              Giao Bài Tập / Game
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={MessageSquare}
              onClick={() => setActiveTab('parent-reports')}
            >
              Báo Cáo Phụ Huynh
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 sm:gap-6 overflow-x-auto pb-1">
        {[
          { id: 'classes', label: 'Quản Lý Lớp Học', count: classes.length, icon: Users },
          { id: 'materials', label: 'Kho Học Liệu & Game', count: materials.length, icon: BookOpen },
          { id: 'assignments', label: 'Bài Tập Đã Giao', count: assignments.length, icon: CalendarPlus },
          { id: 'parent-reports', label: 'Báo Cáo Phụ Huynh (Zalo/Email)', icon: MessageSquare },
          { id: 'analytics', label: 'Báo Cáo Tiến Độ Lớp', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-amber-500 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300 font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {loading ? (
        <LoadingSpinner text="Đang tải dữ liệu giảng dạy của Cô Huyền Diệu..." />
      ) : (
        <div>
          {/* Tab 1: Classes */}
          {activeTab === 'classes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <ClassCard
                  key={cls.id}
                  classData={cls}
                  isTeacher={true}
                  onDelete={() => handleDeleteClass(cls.id)}
                />
              ))}
            </div>
          )}

          {/* Tab 2: Materials */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {['all', '1', '2'].map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setChapterFilter(ch)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        chapterFilter === ch
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {ch === 'all' ? 'Tất cả 2 Chương' : `Chương ${ch}`}
                    </button>
                  ))}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => setShowUploadMaterial(true)}
                >
                  Tải lên học liệu mới
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials
                  .filter((m) => chapterFilter === 'all' || String(m.chapter) === chapterFilter)
                  .map((mat) => (
                    <MaterialCard
                      key={mat.id}
                      material={mat}
                      isTeacher={true}
                      onView={(m) => setViewingMaterial(m)}
                      onAssign={() => setShowCreateAssignment(true)}
                      onDelete={(id) => setMaterials(materials.filter(m => m.id !== id))}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Tab 3: Assignments */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Danh sách Bài tập & Nhiệm vụ đã giao</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Quản lý bài tập online, phiếu đính kèm link Drive/Forms và tiến độ học sinh</p>
                </div>
                <Button
                  variant="gold"
                  size="sm"
                  icon={CalendarPlus}
                  onClick={() => setShowCreateAssignment(true)}
                  className="btn-gold-glow flex-shrink-0"
                >
                  Giao bài & Úp link bài tập mới
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((asg) => (
                  <AssignmentCard
                    key={asg.id}
                    assignment={asg}
                    isTeacher={true}
                    onViewDetails={() => setActiveTab('analytics')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Parent Reports */}
          {activeTab === 'parent-reports' && (
            <ParentReportManager
              className={classes[0]?.name || "Lớp Toán 8A1"}
              classId={classes[0]?.id}
              teacherId={user?.id}
            />
          )}

          {/* Tab 5: Analytics */}
          {activeTab === 'analytics' && (
            <TeacherAnalytics
              stats={{
                totalClasses: classes.length,
                totalStudents: classes.reduce((acc, curr) => acc + (curr.student_count || 0), 0) || 60,
                totalMaterials: materials.length,
                totalAssignments: assignments.length,
                completionRate: 91,
                averageScore: 86.8
              }}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <CreateClassModal
        isOpen={showCreateClass}
        onClose={() => setShowCreateClass(false)}
        onClassCreated={(newClass) => {
          setClasses(prev => [newClass, ...prev.filter(c => c.id !== newClass.id)]);
        }}
      />

      <UploadMaterialModal
        isOpen={showUploadMaterial}
        onClose={() => setShowUploadMaterial(false)}
        onMaterialCreated={(newMat) => setMaterials([newMat, ...materials])}
      />

      <CreateAssignmentModal
        isOpen={showCreateAssignment}
        onClose={() => setShowCreateAssignment(false)}
        classes={classes}
        materials={materials}
        onAssignmentCreated={(newAsg) => setAssignments([newAsg, ...assignments])}
      />

      <MaterialViewerModal
        material={viewingMaterial}
        isOpen={Boolean(viewingMaterial)}
        onClose={() => setViewingMaterial(null)}
      />
    </div>
  );
};

export default TeacherDashboard;
