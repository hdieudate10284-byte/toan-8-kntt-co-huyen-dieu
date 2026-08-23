import React, { useState, useEffect } from 'react';
import { Sparkles, X, RefreshCw, Zap } from 'lucide-react';

const CURRENT_APP_VERSION = 'v1.2.0-online';

export const UpdateNotificationToast = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đóng thông báo phiên bản này chưa
    const dismissedVer = localStorage.getItem('toan8_dismissed_update_version');
    if (dismissedVer !== CURRENT_APP_VERSION) {
      // Mở thông báo sau 1.5 giây
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem('toan8_dismissed_update_version', CURRENT_APP_VERSION);
    } catch (e) {
      console.warn('Lỗi lưu trạng thái thông báo:', e);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full animate-slideUp">
      <div className="glass-card bg-slate-900/95 border-2 border-sky-500/50 p-4 rounded-2xl shadow-2xl shadow-sky-500/20 backdrop-blur-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-sky-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex-shrink-0 animate-pulse">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">
                  Cập Nhật Mới Online!
                </h4>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                  v1.2
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Đã thêm <strong>Giao diện Nhúng Link Trò Chơi Wordwall/Quizizz</strong> và sửa lỗi phân quyền lớp học!
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-slate-800/80">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            Đã hiểu
          </button>
          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-[11px] font-extrabold flex items-center gap-1 transition-all shadow-md"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Tải lại trang</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotificationToast;
