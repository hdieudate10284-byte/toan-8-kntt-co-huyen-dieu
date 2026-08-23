import React, { useState } from 'react';
import { Gamepad2, Play, Sparkles, Zap, Layers, Trophy, BookOpen } from 'lucide-react';
import { MATH_GAMES_CATALOG } from '../../data/math8Curriculum';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import IdentitySpeedGame from './IdentitySpeedGame';
import MonomialMatcherGame from './MonomialMatcherGame';
import MathWheelQuizGame from './MathWheelQuizGame';
import EmbedGameViewer from './EmbedGameViewer';

export const GameHub = () => {
  const [activeGameId, setActiveGameId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, chapter1, chapter2, embed

  const filteredGames = MATH_GAMES_CATALOG.filter((game) => {
    if (selectedFilter === 'chapter1') return game.category.includes('Chương 1');
    if (selectedFilter === 'chapter2') return game.category.includes('Chương 2');
    if (selectedFilter === 'embed') return game.type === 'game_iframe';
    return true;
  });

  const renderActiveGame = () => {
    switch (activeGameId) {
      case 'game_identity_speed':
        return <IdentitySpeedGame onFinish={() => {}} />;
      case 'game_monomial_match':
        return <MonomialMatcherGame onFinish={() => {}} />;
      case 'game_math_wheel_quiz':
        return <MathWheelQuizGame onFinish={() => {}} />;
      case 'game_wordwall_embed':
        return (
          <EmbedGameViewer
            title="🎯 Wordwall & Trò Chơi Tương Tác Toán 8"
            embedUrl="https://wordwall.net"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Gamepad2 className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Kho Trò Chơi Toán 8 Tương Tác
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Bộ công cụ trò chơi hóa (Gamification) bám sát Chương 1 & Chương 2 SGK Toán 8 Kết Nối Tri Thức
          </p>
        </div>

        {activeGameId && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveGameId(null)}
          >
            ← Quay lại danh sách game
          </Button>
        )}
      </div>

      {/* Active Game Display */}
      {activeGameId ? (
        <div className="animate-fadeIn">
          {renderActiveGame()}
        </div>
      ) : (
        <>
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {[
              { id: 'all', label: 'Tất cả trò chơi' },
              { id: 'chapter1', label: 'Chương 1: Đa thức' },
              { id: 'chapter2', label: 'Chương 2: 7 Hằng đẳng thức' },
              { id: 'embed', label: 'Trò chơi Nhúng (Wordwall / Quizizz)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-sky-500 text-white font-bold shadow-lg shadow-sky-500/25'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="glass-card-hover p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                      {game.category}
                    </span>
                    <Badge variant={game.difficulty === 'Dễ' ? 'emerald' : (game.difficulty === 'Trung bình' ? 'amber' : 'rose')}>
                      {game.difficulty}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {game.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Chấm điểm tự động
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Play}
                    onClick={() => setActiveGameId(game.id)}
                    className="btn-glow"
                  >
                    Vào chơi ngay
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GameHub;
