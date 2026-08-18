import React from 'react';
import { Sparkles, Bot, GraduationCap, BookOpen, Lightbulb } from 'lucide-react';
import AiTutorChat from '../features/ai-tutor/AiTutorChat';

export const AiTutorPage = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Trợ Giảng Trí Tuệ Nhân Tạo (AI Math Tutor)
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
          Phòng Học 1-1 Cùng Cô Huyền Diệu AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Hỗ trợ giải đáp phương pháp, phân tích từng bước 7 Hằng đẳng thức và các phép toán Đa thức Toán 8 KNTT 24/7
        </p>
      </div>

      {/* Main Chat Lab */}
      <AiTutorChat />
    </div>
  );
};

export default AiTutorPage;
