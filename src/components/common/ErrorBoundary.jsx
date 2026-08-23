import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import Button from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-8 text-center space-y-4 border-amber-500/40">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Đang tải lại dữ liệu bài học...</h2>
            <p className="text-xs text-slate-400">
              Hệ thống đang kết nối đến kho học liệu Toán 8 KNTT của Cô Huyền Diệu.
            </p>
            <Button
              variant="gold"
              icon={RefreshCw}
              onClick={() => {
                try {
                  localStorage.removeItem('toan8_favorite_game_links');
                  localStorage.removeItem('toan8_dismissed_update_version');
                } catch (e) {}
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="w-full btn-gold-glow"
            >
              Khôi phục & Tải lại trang
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
