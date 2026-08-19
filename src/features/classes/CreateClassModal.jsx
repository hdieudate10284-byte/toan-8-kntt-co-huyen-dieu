import React, { useState } from 'react';
import { Sparkles, KeyRound, RefreshCw } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { generateJoinCode } from '../../utils/joinCode';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const CreateClassModal = ({
  isOpen,
  onClose,
  onClassCreated
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState('8');
  const [code, setCode] = useState(() => generateJoinCode('T8A'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegenerateCode = (e) => {
    e.preventDefault();
    setCode(generateJoinCode('T8'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên lớp học!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newClassData = {
        name: name.trim(),
        description: description.trim() || 'Lớp Toán 8 Kết Nối Tri Thức - Cô Nguyễn Thị Huyền Diệu',
        grade: grade,
        subject: 'Toán học (KNTT)',
        code: code.toUpperCase().trim(),
        teacher_id: user?.id,
        academic_year: '2025–2026'
      };

      let createdClass = null;

      if (isSupabaseConfigured && user?.id && !user.id.startsWith('demo-')) {
        try {
          const { data, error: dbError } = await supabase
            .from('classes')
            .insert([newClassData])
            .select()
            .single();

          if (!dbError && data) {
            createdClass = data;
          }
        } catch (e) {
          console.warn('Lỗi Supabase insert, chuyển sang fallback:', e);
        }
      }

      if (!createdClass) {
        // Fallback for demo mode hoặc khi database chưa tạo bảng
        createdClass = {
          ...newClassData,
          id: `class-${Date.now()}`,
          created_at: new Date().toISOString(),
          student_count: 0
        };
      }

      onClassCreated(createdClass);
      onClose();
      setName('');
      setDescription('');
      setCode(generateJoinCode('T8'));
    } catch (err) {
      console.error('Lỗi tạo lớp học:', err);
      setError(err.message || 'Không thể tạo lớp học. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo Lớp Học Toán 8 Mới"
      subtitle="Thiết lập lớp học và chia sẻ Mã gia nhập (Join Code) cho học sinh"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Tên lớp học <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ví dụ: Lớp Toán 8A1 - THCS Nguyễn Huệ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Khối lớp
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-sky-500 text-sm"
            >
              <option value="8">Lớp 8 (KNTT)</option>
              <option value="9">Lớp 9 (KNTT)</option>
              <option value="7">Lớp 7 (KNTT)</option>
              <option value="6">Lớp 6 (KNTT)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mã mời vào lớp (Join Code)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold text-center tracking-wider text-sm"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleRegenerateCode}
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:text-sky-400 text-slate-400"
                title="Tạo mã mới"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Mô tả lớp học (tùy chọn)
          </label>
          <textarea
            rows="3"
            placeholder="Ví dụ: Nhóm học tập đại số Chương 1 & Chương 2 cùng Cô Huyền Diệu..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={loading} icon={Sparkles}>
            Tạo Lớp Học
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClassModal;
