import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'Chưa có dữ liệu',
  description = 'Hiện tại chưa có mục nào trong danh sách này.',
  actionText,
  onAction,
  actionIcon
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center glass-card border-dashed border-slate-800 my-4">
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-sky-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-semibold text-slate-200">{title}</h4>
      <p className="text-sm text-slate-400 max-w-md mt-1 mb-5">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" icon={actionIcon} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
