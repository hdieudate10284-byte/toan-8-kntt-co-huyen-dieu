import React, { useState } from 'react';
import { Users, KeyRound, Copy, Check, ArrowRight, BookOpen, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

export const ClassCard = ({
  classData,
  isTeacher = false,
  onDelete
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(classData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card-hover p-6 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30">
            Khối {classData.grade || '8'} • {classData.academic_year || '2025–2026'}
          </span>

          {/* Join Code badge with quick copy */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700 hover:border-amber-400 text-xs font-mono font-bold text-amber-300 transition-colors"
            title="Nhấn để sao chép mã mời vào lớp"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>{classData.code}</span>
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
          </button>
        </div>

        {/* Class Name & Description */}
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
          {classData.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {classData.description || 'Lớp Toán 8 Kết Nối Tri Thức - Cô Nguyễn Thị Huyền Diệu'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-400" />
            <b>{classData.student_count ?? (classData.members_count ?? 0)}</b> học sinh
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <b>{classData.assignment_count ?? 0}</b> bài tập đã giao
          </span>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
        {isTeacher && onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(classData.id);
            }}
            className="p-2 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10"
            title="Xóa lớp học"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <Link to={`/class/${classData.id}`} className="ml-auto">
          <Button variant="primary" size="sm" icon={ArrowRight}>
            Vào lớp học
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ClassCard;
