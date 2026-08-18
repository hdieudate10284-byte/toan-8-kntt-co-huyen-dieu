import React from 'react';
import { FileText, Video, Gamepad2, Globe, ExternalLink, CalendarPlus, Trash2, Eye } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export const MaterialCard = ({
  material,
  isTeacher = false,
  onView,
  onAssign,
  onDelete
}) => {
  const getTypeInfo = (type) => {
    switch (type) {
      case 'video':
        return { icon: Video, label: 'Video bài giảng', color: 'rose' };
      case 'game_iframe':
      case 'game_html5':
        return { icon: Gamepad2, label: 'Trò chơi tương tác', color: 'amber' };
      case 'document':
      default:
        return { icon: FileText, label: 'Tài liệu / PDF', color: 'sky' };
    }
  };

  const typeInfo = getTypeInfo(material.type);
  const Icon = typeInfo.icon;

  return (
    <div className="glass-card-hover p-6 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={material.chapter === 1 ? 'sky' : 'emerald'}>
            Chương {material.chapter}: {material.chapter === 1 ? 'Đa thức' : '7 Hằng đẳng thức'}
          </Badge>
          <Badge variant={typeInfo.color}>
            <Icon className="w-3 h-3" />
            {typeInfo.label}
          </Badge>
        </div>

        {/* Title & Lesson */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors leading-snug">
          {material.title}
        </h3>
        <p className="text-xs text-sky-400 font-medium mt-1">
          {material.lesson_name || (material.lesson_number ? `Bài ${material.lesson_number}` : 'Ôn tập chương')}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {material.description || 'Học liệu chuẩn môn Toán 8 KNTT Cô Nguyễn Thị Huyền Diệu'}
        </p>

        {/* Tags */}
        {material.tags && material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {material.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {isTeacher && onDelete && (
            <button
              onClick={() => onDelete(material.id)}
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Xóa học liệu"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {isTeacher && onAssign && (
            <Button
              variant="gold"
              size="sm"
              icon={CalendarPlus}
              onClick={() => onAssign(material)}
            >
              Giao bài
            </Button>
          )}
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Eye}
          onClick={() => onView(material)}
        >
          Xem học liệu
        </Button>
      </div>
    </div>
  );
};

export default MaterialCard;
