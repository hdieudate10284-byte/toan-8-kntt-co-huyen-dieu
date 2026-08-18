import React, { useState } from 'react';
import { KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const JoinClassModal = ({
  isOpen,
  onClose,
  onClassJoined
}) => {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Vui lòng nhập Mã lớp học (Join Code)!');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const cleanCode = code.trim().toUpperCase();

      if (isSupabaseConfigured && user?.id && !user.id.startsWith('demo-')) {
        // Tìm lớp theo mã code
        const { data: targetClass, error: findError } = await supabase
          .from('classes')
          .select('*')
          .eq('code', cleanCode)
          .single();

        if (findError || !targetClass) {
          throw new Error('Không tìm thấy lớp học với mã này. Thầy/Cô hoặc bạn bè có cung cấp đúng mã không?');
        }

        // Thêm học sinh vào bảng class_members
        const { error: joinError } = await supabase
          .from('class_members')
          .insert([
            {
              class_id: targetClass.id,
              student_id: user.id,
              status: 'active'
            }
          ]);

        if (joinError) {
          if (joinError.code === '23505') { // Unique constraint
            throw new Error('Bạn đã tham gia lớp học này từ trước rồi!');
          }
          throw joinError;
        }

        setSuccessMsg(`Gia nhập thành công lớp "${targetClass.name}"!`);
        setTimeout(() => {
          onClassJoined(targetClass);
          onClose();
          setCode('');
          setSuccessMsg('');
        }, 1200);
      } else {
        // Mock demo join
        const mockClass = {
          id: `class-joined-${Date.now()}`,
          name: cleanCode.includes('8A1') ? 'Lớp Toán 8A1 (Nâng cao)' : `Lớp Toán 8 KNTT (${cleanCode})`,
          grade: '8',
          code: cleanCode,
          teacher_name: 'Cô Nguyễn Thị Huyền Diệu',
          created_at: new Date().toISOString()
        };
        setSuccessMsg(`Gia nhập thành công lớp "${mockClass.name}"!`);
        setTimeout(() => {
          onClassJoined(mockClass);
          onClose();
          setCode('');
          setSuccessMsg('');
        }, 1000);
      }
    } catch (err) {
      console.error('Lỗi tham gia lớp học:', err);
      setError(err.message || 'Không thể tham gia lớp học.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gia Nhập Lớp Học Toán 8"
      subtitle="Nhập mã 6 ký tự do Cô Huyền Diệu hoặc Thầy/Cô cung cấp"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            {successMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Mã lớp học (Join Code):
          </label>
          <div className="relative">
            <KeyRound className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="VÍ DỤ: T8A92K"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold text-center tracking-widest text-lg placeholder-slate-500 focus:outline-none focus:border-amber-400"
              maxLength={12}
              required
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 text-center">
            Mã mời thường gồm chữ và số được gửi qua nhóm lớp hoặc bảng tin
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="gold" size="sm" type="submit" isLoading={loading} icon={ArrowRight}>
            Tham Gia Lớp
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JoinClassModal;
