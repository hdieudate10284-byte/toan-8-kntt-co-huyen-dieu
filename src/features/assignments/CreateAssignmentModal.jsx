import React, { useState } from 'react';
import { CalendarPlus, BookOpen, Clock, Users, Sparkles } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const CreateAssignmentModal = ({
  isOpen,
  onClose,
  classes = [],
  materials = [],
  preselectedMaterial = null,
  preselectedClassId = null,
  onAssignmentCreated
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(preselectedClassId || (classes[0]?.id || ''));
  const [selectedMaterialId, setSelectedMaterialId] = useState(preselectedMaterial?.id || (materials[0]?.id || ''));
  const [dueDate, setDueDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().slice(0, 16);
  });
  const [maxScore, setMaxScore] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Vui lòng nhập tên bài tập!');
      return;
    }
    if (!selectedClassId) {
      setError('Vui lòng chọn lớp học để giao bài!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newAssignmentData = {
        title: title.trim(),
        description: description.trim(),
        class_id: selectedClassId,
        material_id: selectedMaterialId || null,
        due_date: new Date(dueDate).toISOString(),
        max_score: Number(maxScore),
        created_by: user?.id
      };

      let createdAssignment = null;

      if (isSupabaseConfigured && user?.id && !user.id.startsWith('demo-')) {
        try {
          const { data, error: dbError } = await supabase
            .from('assignments')
            .insert([newAssignmentData])
            .select()
            .single();

          if (!dbError && data) {
            createdAssignment = data;
          }
        } catch (e) {
          console.warn('Lỗi Supabase assignments insert, dùng fallback:', e);
        }
      }

      if (!createdAssignment) {
        createdAssignment = {
          ...newAssignmentData,
          id: `asg-${Date.now()}`,
          created_at: new Date().toISOString()
        };
      }

      onAssignmentCreated(createdAssignment);
      onClose();
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Lỗi giao bài tập:', err);
      setError(err.message || 'Không thể giao bài tập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Giao Bài Tập / Trò Chơi Cho Lớp"
      subtitle="Thiết lập nhiệm vụ học tập, trò chơi rèn luyện và thời hạn nộp bài"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Tên nhiệm vụ / Bài tập <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ví dụ: Rèn luyện 7 Hằng đẳng thức & làm bài tập Bài 6"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Giao cho lớp học <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
              required
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Mã: {c.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Học liệu / Trò chơi đính kèm
            </label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
            >
              <option value="">-- Không đính kèm học liệu --</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.chapter === 1 ? 'C1' : 'C2'}] {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hạn chót nộp bài (Deadline)
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Thang điểm tối đa
            </label>
            <input
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
              min="10"
              max="100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Lời dặn của Cô Huyền Diệu cho học sinh
          </label>
          <textarea
            rows="3"
            placeholder="Ví dụ: Các em xem kỹ lý thuyết trước khi chơi game và làm bài tập nhé..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="gold" size="sm" type="submit" isLoading={loading} icon={CalendarPlus}>
            Xác Nhận Giao Bài
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAssignmentModal;
