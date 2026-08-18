import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Sparkles, CheckCircle, Timer } from 'lucide-react';
import MathRenderer from '../../components/common/MathRenderer';
import Button from '../../components/common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

// Các cặp đơn thức đồng dạng (cùng phần biến)
const MONOMIAL_PAIRS = [
  { id: 'p1', group: 1, formula: '3x^2y', variablePart: 'x^2y' },
  { id: 'p2', group: 1, formula: '-7x^2y', variablePart: 'x^2y' },
  { id: 'p3', group: 2, formula: '5xy^2', variablePart: 'xy^2' },
  { id: 'p4', group: 2, formula: '\\frac{1}{2}xy^2', variablePart: 'xy^2' },
  { id: 'p5', group: 3, formula: '-4x^3', variablePart: 'x^3' },
  { id: 'p6', group: 3, formula: '9x^3', variablePart: 'x^3' },
  { id: 'p7', group: 4, formula: '2xyz', variablePart: 'xyz' },
  { id: 'p8', group: 4, formula: '-xyz', variablePart: 'xyz' },
  { id: 'p9', group: 5, formula: '6x^2y^3', variablePart: 'x^2y^3' },
  { id: 'p10', group: 5, formula: '-2x^2y^3', variablePart: 'x^2y^3' },
  { id: 'p11', group: 6, formula: '-8', variablePart: 'const' },
  { id: 'p12', group: 6, formula: '15', variablePart: 'const' }
];

export const MonomialMatcherGame = ({ onFinish, assignmentId = null }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedGroups, setMatchedGroups] = useState([]);
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);

  const initGame = () => {
    // Trộn ngẫu nhiên 12 thẻ
    const shuffled = [...MONOMIAL_PAIRS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setMatchedGroups([]);
    setMoves(0);
    setTime(0);
    setGameState('playing');
  };

  // Timer
  useEffect(() => {
    let interval = null;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const handleCardClick = (card) => {
    if (selectedCards.length === 2) return;
    if (selectedCards.some((c) => c.id === card.id)) return;
    if (matchedGroups.includes(card.group)) return;

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);
      const [c1, c2] = newSelected;
      if (c1.group === c2.group) {
        // Khớp đơn thức đồng dạng!
        setMatchedGroups((prev) => {
          const updated = [...prev, c1.group];
          if (updated.length === MONOMIAL_PAIRS.length / 2) {
            handleVictory();
          }
          return updated;
        });
        setSelectedCards([]);
      } else {
        // Không khớp -> Đợi 800ms rồi lật lại
        setTimeout(() => {
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  const handleVictory = async () => {
    setGameState('finished');
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    const score = Math.max(10, 100 - (moves * 3) - Math.floor(time / 2));
    if (user?.id && isSupabaseConfigured) {
      try {
        await supabase.from('student_progress').upsert({
          student_id: user.id,
          assignment_id: assignmentId,
          status: 'completed',
          score: score,
          completion_time_seconds: time,
          completed_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Lỗi lưu điểm game ghép đơn thức:', err);
      }
    }

    if (onFinish) onFinish({ score, time, moves });
  };

  return (
    <div className="glass-card p-6 sm:p-8 max-w-3xl mx-auto border-teal-500/30">
      {gameState === 'ready' && (
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-500 p-0.5 mb-6 shadow-xl shadow-teal-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-teal-400 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            🧩 Săn Tìm Đơn Thức Đồng Dạng
          </h2>
          <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm">
            Toán 8 KNTT - Chương 1: Tìm các cặp thẻ có phần biến giống hệt nhau (đơn thức đồng dạng) để làm sạch bảng tính và thu gọn đa thức!
          </p>
          <div className="mt-8">
            <Button variant="primary" size="lg" icon={Sparkles} onClick={initGame}>
              Bắt đầu ghép thẻ ngay
            </Button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div>
          {/* Status Bar */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2 text-teal-400 font-bold">
              <Timer className="w-5 h-5" />
              <span className="font-mono">{time}s</span>
            </div>
            <div className="text-sm text-slate-300">
              Số lượt chọn: <span className="font-bold text-sky-400 font-mono">{moves}</span>
            </div>
            <div className="text-sm text-teal-400 font-medium">
              Đã ghép: {matchedGroups.length}/6 cặp
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {cards.map((card) => {
              const isSelected = selectedCards.some((c) => c.id === card.id);
              const isMatched = matchedGroups.includes(card.group);

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  disabled={isMatched || isSelected}
                  className={`h-24 sm:h-28 rounded-2xl border font-bold text-base sm:text-lg flex items-center justify-center transition-all cursor-pointer ${
                    isMatched
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 scale-95 opacity-80'
                      : isSelected
                      ? 'bg-sky-500/30 border-sky-400 text-sky-200 ring-2 ring-sky-400 scale-105 shadow-xl'
                      : 'bg-slate-800/90 border-slate-700 hover:border-slate-500 hover:bg-slate-700/80 text-slate-100 shadow-md'
                  }`}
                >
                  {isMatched ? (
                    <div className="text-center">
                      <MathRenderer formula={card.formula} />
                      <CheckCircle className="w-4 h-4 text-teal-400 mx-auto mt-1" />
                    </div>
                  ) : (
                    <MathRenderer formula={card.formula} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="text-center py-6">
          <Trophy className="w-16 h-16 text-teal-400 mx-auto mb-3 animate-bounce" />
          <h3 className="text-2xl font-black text-slate-100">Xuất Sắc! Thu Gọn Thành Công</h3>
          <p className="text-xs text-slate-400 mt-1">Bạn đã ghép chính xác tất cả các đơn thức đồng dạng</p>
          <div className="grid grid-cols-2 gap-4 my-6 max-w-xs mx-auto">
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-400">Thời gian</p>
              <p className="text-xl font-bold text-teal-400">{time}s</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-400">Số lượt</p>
              <p className="text-xl font-bold text-sky-400">{moves}</p>
            </div>
          </div>
          <Button variant="primary" icon={RefreshCw} onClick={initGame}>
            Chơi lại bàn mới
          </Button>
        </div>
      )}
    </div>
  );
};

export default MonomialMatcherGame;
