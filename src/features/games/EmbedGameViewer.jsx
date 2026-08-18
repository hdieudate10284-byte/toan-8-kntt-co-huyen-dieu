import React, { useState } from 'react';
import { Maximize2, Minimize2, CheckSquare, Sparkles, ExternalLink } from 'lucide-react';
import Button from '../../components/common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const EmbedGameViewer = ({
  title = "Trò chơi Toán học",
  embedUrl,
  assignmentId = null,
  onComplete
}) => {
  const { user } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [scoreInput, setScoreInput] = useState(100);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (user?.id && isSupabaseConfigured) {
        await supabase.from('student_progress').upsert({
          student_id: user.id,
          assignment_id: assignmentId,
          status: 'completed',
          score: Number(scoreInput),
          completed_at: new Date().toISOString()
        });
      }
      setCompleted(true);
      setShowSubmitModal(false);
      if (onComplete) onComplete(scoreInput);
    } catch (err) {
      console.warn('Lỗi gửi kết quả:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`glass-card overflow-hidden transition-all ${isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-950 p-4' : 'p-4 sm:p-6'}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            {title}
          </h3>
          <p className="text-xs text-slate-400">Trò chơi nhúng trực tuyến (Wordwall / Quizizz / Kahoot)</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="gold"
            size="sm"
            icon={CheckSquare}
            onClick={() => setShowSubmitModal(true)}
          >
            {completed ? 'Đã ghi nhận điểm' : 'Báo cáo điểm số'}
          </Button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* iFrame Container */}
      <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 ${isFullscreen ? 'h-[calc(100vh-100px)]' : 'h-[520px]'}`}>
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>

      {/* Gửi điểm Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card bg-slate-900 border-slate-700 p-6 max-w-md w-full animate-scaleUp">
            <h4 className="text-lg font-bold text-slate-100 mb-2">Ghi Nhận Kết Quả Trò Chơi</h4>
            <p className="text-xs text-slate-400 mb-4">
              Nhập điểm số hoặc số câu đúng đạt được trong game để lưu vào học bạ điện tử của Cô Huyền Diệu.
            </p>

            <form onSubmit={handleSubmitScore} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Điểm số đạt được (0 - 100):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-sky-500 font-mono text-lg"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setShowSubmitModal(false)}>
                  Hủy
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={submitting}>
                  Lưu kết quả
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbedGameViewer;
