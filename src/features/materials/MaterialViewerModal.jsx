import React from 'react';
import { FileText, Video, Gamepad2, Download, ExternalLink } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmbedGameViewer from '../games/EmbedGameViewer';

export const MaterialViewerModal = ({
  material,
  isOpen,
  onClose
}) => {
  if (!material) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={material.title}
      subtitle={`${material.lesson_name || 'Toán 8 KNTT'} • Chương ${material.chapter}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Content Viewer based on type */}
        {material.type === 'video' ? (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            {material.embed_url ? (
              <iframe
                src={material.embed_url}
                title={material.title}
                className="w-full h-full border-0"
                allowFullScreen
              />
            ) : (
              <video
                controls
                className="w-full h-full"
                src={material.file_url}
              >
                Trình duyệt của bạn không hỗ trợ phát video.
              </video>
            )}
          </div>
        ) : material.type === 'game_iframe' || material.type === 'game_html5' ? (
          <EmbedGameViewer
            title={material.title}
            embedUrl={material.embed_url || material.file_url || 'https://wordwall.net'}
          />
        ) : (
          <div className="h-[520px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-8 text-center">
            <div className="p-4 rounded-3xl bg-sky-500/15 text-sky-400 mb-4 border border-sky-500/30">
              <FileText className="w-12 h-12" />
            </div>
            <h4 className="text-lg font-bold text-slate-100 mb-2">{material.title}</h4>
            <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
              {material.description || 'Tài liệu lý thuyết và bài tập Toán 8 Kết Nối Tri Thức do Cô Huyền Diệu biên soạn.'}
            </p>
            {material.file_url && (
              <a
                href={material.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-block"
              >
                <Button variant="primary" icon={Download}>
                  Tải xuống / Mở tài liệu toàn màn hình
                </Button>
              </a>
            )}
          </div>
        )}

        {/* Details footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Badge variant={material.chapter === 1 ? 'sky' : 'emerald'}>
              Chương {material.chapter}
            </Badge>
            <span>Tác giả: Cô Nguyễn Thị Huyền Diệu (THCS Nguyễn Huệ)</span>
          </div>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Đóng cửa sổ
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MaterialViewerModal;
