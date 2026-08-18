import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, Play, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';

export const AssignmentCard = ({
  assignment,
  progress = null,
  isTeacher = false,
  onViewDetails
}) => {
  const isCompleted = progress?.status === 'completed';
  const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();

  return (
    <div className="glass-card-hover p-6 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={isCompleted ? 'emerald' : (isOverdue ? 'rose' : 'amber')}>
            {isCompleted ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Đã nộp bài ({progress?.score || 100}đ)
              </span>
            ) : isOverdue ? (
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Quá hạn
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Cần làm
              </span>
            )}
          </Badge>

          <span className="text-xs text-slate-400 font-mono">
            {assignment.class_name || 'Lớp Toán 8'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors leading-snug">
          {assignment.title}
        </h3>

        {/* Instructions */}
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {assignment.description || 'Hoàn thành bài tập và trò chơi để đạt điểm rèn luyện.'}
        </p>

        {/* Due date info */}
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
          <Calendar className="w-4 h-4 text-sky-400" />
          <span>Hạn nộp: <b>{formatDate(assignment.due_date)}</b></span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
        {isTeacher ? (
          <Button
            variant="secondary"
            size="sm"
            icon={Eye}
            onClick={() => onViewDetails && onViewDetails(assignment)}
          >
            Xem kết quả lớp
          </Button>
        ) : (
          <Link to={`/games?assignmentId=${assignment.id}`}>
            <Button
              variant={isCompleted ? 'secondary' : 'gold'}
              size="sm"
              icon={Play}
            >
              {isCompleted ? 'Làm lại bài' : 'Làm bài tập ngay'}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
