import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, Play, Eye, ExternalLink, Link as LinkIcon } from 'lucide-react';
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

        {/* Attached Link Box */}
        {assignment.external_link && (
          <div className="mt-3.5 p-3 rounded-xl bg-sky-950/60 border border-sky-800/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-sky-300 min-w-0">
              <LinkIcon className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span className="truncate font-medium">Link bài tập đính kèm:</span>
            </div>
            <a
              href={assignment.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 flex items-center gap-1.5 font-semibold transition-all hover:scale-105 flex-shrink-0 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Mở Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Due date info */}
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
          <Calendar className="w-4 h-4 text-sky-400" />
          <span>Hạn nộp: <b>{formatDate(assignment.due_date)}</b></span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
        {isTeacher ? (
          <div className="flex items-center justify-between w-full gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Eye}
              onClick={() => onViewDetails && onViewDetails(assignment)}
            >
              Xem kết quả lớp
            </Button>
            {assignment.external_link && (
              <a
                href={assignment.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                <span>Mở bài tập</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full justify-between">
            {assignment.external_link ? (
              <a
                href={assignment.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant={isCompleted ? 'secondary' : 'gold'}
                  size="sm"
                  icon={ExternalLink}
                  className="w-full justify-center"
                >
                  {isCompleted ? 'Xem lại bài tập' : 'Mở link làm bài tập ngay'}
                </Button>
              </a>
            ) : (
              <Link to={`/games?assignmentId=${assignment.id}`} className="w-full">
                <Button
                  variant={isCompleted ? 'secondary' : 'gold'}
                  size="sm"
                  icon={Play}
                  className="w-full justify-center"
                >
                  {isCompleted ? 'Làm lại bài' : 'Làm bài tập ngay'}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
