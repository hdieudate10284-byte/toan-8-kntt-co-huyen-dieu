import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, CheckSquare, Sparkles, ExternalLink, Gamepad2, Link2, AlertTriangle, Plus, Bookmark, Trash2, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import IdentitySpeedGame from './IdentitySpeedGame';

// Danh sách game mẫu gợi ý sẵn của Cô Huyền Diệu
const DEFAULT_PRESET_GAMES = [
  {
    id: 'preset-1',
    title: '🎯 Wordwall: Trắc nghiệm 7 Hằng đẳng thức',
    url: 'https://wordwall.net/resource/78726359',
    platform: 'Wordwall'
  },
  {
    id: 'preset-2',
    title: '🧩 Wordwall: Ghép đôi Đơn thức đồng dạng',
    url: 'https://wordwall.net/resource/monomials-match',
    platform: 'Wordwall'
  },
  {
    id: 'preset-3',
    title: '⚡ Quizizz: Ôn tập Đa thức nhiều biến (Toán 8 KNTT)',
    url: 'https://quizizz.com/join',
    platform: 'Quizizz'
  },
  {
    id: 'preset-4',
    title: '🏆 Kahoot: Đấu trường Đại số 8',
    url: 'https://kahoot.it',
    platform: 'Kahoot'
  }
];

export const EmbedGameViewer = ({
  title = "Trò chơi Toán 8: Đa thức & 7 Hằng đẳng thức",
  embedUrl: defaultEmbedUrl = "",
  assignmentId = null,
  onComplete
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('iframe'); // Default to 'iframe' so Custom Link Input is immediately visible!
  const [currentUrl, setCurrentUrl] = useState(defaultEmbedUrl || DEFAULT_PRESET_GAMES[0].url);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [scoreInput, setScoreInput] = useState(100);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Quản lý danh sách Link yêu thích được lưu
  const [savedLinks, setSavedLinks] = useState(() => {
    try {
      const stored = localStorage.getItem('toan8_favorite_game_links');
      const parsed = stored ? JSON.parse(stored) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : DEFAULT_PRESET_GAMES;
    } catch {
      return DEFAULT_PRESET_GAMES;
    }
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [addSuccessMsg, setAddSuccessMsg] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('toan8_favorite_game_links', JSON.stringify(savedLinks));
    } catch (e) {
      console.warn('Không thể lưu danh sách link vào localStorage:', e);
    }
  }, [savedLinks]);

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      url: newUrl.trim(),
      platform: newUrl.includes('quizizz') ? 'Quizizz' : (newUrl.includes('kahoot') ? 'Kahoot' : 'Wordwall')
    };

    setSavedLinks((prev) => [newItem, ...prev]);
    setCurrentUrl(newItem.url);
    setNewTitle('');
    setNewUrl('');
    setShowAddForm(false);
    setAddSuccessMsg('Đã lưu link game yêu thích mới thành công!');
    setTimeout(() => setAddSuccessMsg(''), 3000);
  };

  const handleDeleteLink = (id, e) => {
    e.stopPropagation();
    setSavedLinks((prev) => prev.filter((item) => item.id !== id));
  };

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
    <div className={`glass-card overflow-hidden transition-all ${isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-950 p-4 overflow-y-auto' : 'p-4 sm:p-6'}`}>
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            {title}
          </h3>
          <p className="text-xs text-slate-400">Trò chơi rèn luyện kiến thức Toán 8 Kết Nối Tri Thức</p>
        </div>

        {/* Tab switcher: iFrame / Custom Link vs Builtin Game */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('iframe')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'iframe'
                  ? 'bg-sky-500 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Nhúng Link Wordwall / Quizizz</span>
            </button>
            <button
              onClick={() => setActiveTab('builtin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'builtin'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Game Tích Hợp (Mượt)</span>
            </button>
          </div>

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

      {/* 🚀 BỘ Ô NHẬP LINK TRÒ CHƠI NỔI BẬT DÀNH CHO CÔ DIỆU & HỌC SINH */}
      <div className="mb-4 p-4 rounded-2xl bg-slate-900 border-2 border-sky-500/40 shadow-lg shadow-sky-500/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-extrabold text-sky-400 uppercase tracking-wide flex items-center gap-2">
            <Link2 className="w-4 h-4 text-sky-400" />
            <span>Nơi Nhúng Link Trò Chơi (Wordwall / Quizizz / Kahoot):</span>
          </label>
          <span className="text-[11px] text-slate-400">Cô dán đường dẫn game bất kỳ vào ô bên dưới:</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              placeholder="Ví dụ: https://wordwall.net/resource/78726359 hoặc https://quizizz.com/join"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-amber-300 font-mono font-semibold placeholder-slate-500 focus:outline-none focus:border-sky-400 shadow-inner"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Mở Tab Mới ↗</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mode Content */}
      {activeTab === 'builtin' ? (
        <div className="animate-fadeIn">
          <IdentitySpeedGame onFinish={(score) => {
            setScoreInput(score);
            setCompleted(true);
            if (onComplete) onComplete(score);
          }} />
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Kho Link Game Yêu Thích */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200">Kho Link Trò Chơi Yêu Thích Của Cô Huyền Diệu</span>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold hover:bg-sky-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Đóng ô thêm' : '+ Thêm Link Game Mới'}</span>
            </button>
          </div>

          {addSuccessMsg && (
            <div className="p-3 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-400" />
              <span>{addSuccessMsg}</span>
            </div>
          )}

          {/* Form thêm Link game mới */}
          {showAddForm && (
            <form onSubmit={handleAddLink} className="p-4 rounded-2xl bg-slate-900 border border-sky-500/30 space-y-3 animate-fadeIn">
              <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider">Lưu Link Trò Chơi Mới Vào Hệ Thống</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tên trò chơi:</label>
                  <input
                    type="text"
                    placeholder="VD: Wordwall Bài 6 - Hiệu hai bình phương"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Đường dẫn Link (Wordwall / Quizizz / Kahoot):</label>
                  <input
                    type="url"
                    placeholder="https://wordwall.net/resource/..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-sky-300 font-mono placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" size="sm" type="button" onClick={() => setShowAddForm(false)}>
                  Hủy
                </Button>
                <Button variant="primary" size="sm" type="submit" icon={Plus}>
                  Lưu Vĩnh Viễn
                </Button>
              </div>
            </form>
          )}

          {/* Danh sách các nút chọn Game đã lưu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Array.isArray(savedLinks) ? savedLinks : DEFAULT_PRESET_GAMES).map((game) => {
              const isSelected = currentUrl === game.url;
              return (
                <div
                  key={game.id}
                  onClick={() => setCurrentUrl(game.url)}
                  className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-500/60 text-sky-200 shadow-md shadow-sky-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      game.platform === 'Quizizz' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      (game.platform === 'Kahoot' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30')
                    }`}>
                      {game.platform || 'Wordwall'}
                    </span>
                    <span className="truncate">{game.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <a
                      href={game.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-lg text-sky-400 hover:bg-sky-500/20"
                      title="Mở tab mới ↗"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {game.id.startsWith('custom-') && (
                      <button
                        onClick={(e) => handleDeleteLink(game.id, e)}
                        className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20"
                        title="Xóa link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thanh nhập nhanh link tùy chỉnh */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Link2 className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                placeholder="Dán hoặc chỉnh sửa link Wordwall tại đây..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-sky-300 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
            {currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mở trong Tab mới ↗</span>
              </a>
            )}
          </div>

          {/* Warning Banner */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Mẹo hỗ trợ:</strong> Nếu màn hình bên dưới bị mặt buồn 🙁 <i>(do trình duyệt Chrome chặn nhúng iFrame)</i>, Cô/bạn hãy bấm nút <strong>"Mở trong Tab mới ↗"</strong> bên trên hoặc chuyển sang tab <strong>"Game Tương Tác Tích Hợp"</strong>!
            </span>
          </div>

          {/* iFrame Container */}
          <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 ${isFullscreen ? 'h-[calc(100vh-250px)]' : 'h-[480px]'}`}>
            {currentUrl ? (
              <iframe
                src={currentUrl}
                title={title}
                className="w-full h-full border-0 bg-slate-900"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <Gamepad2 className="w-12 h-12 text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-300">Chưa có liên kết nhúng Wordwall</p>
                <p className="text-xs text-slate-500">Bấm chọn từ danh sách lưu sẵn phía trên</p>
              </div>
            )}
          </div>
        </div>
      )}

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
