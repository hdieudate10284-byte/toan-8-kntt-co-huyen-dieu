import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Zap, RefreshCw, Timer, Flame, CheckCircle2, XCircle } from 'lucide-react';
import MathRenderer from '../../components/common/MathRenderer';
import Button from '../../components/common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

// Bộ dữ liệu 7 Hằng đẳng thức đáng nhớ Toán 8 KNTT
const IDENTITY_QUESTIONS = [
  {
    id: 1,
    name: "Bình phương của một tổng",
    left: "(a + b)^2",
    correctRight: "a^2 + 2ab + b^2",
    wrongChoices: ["a^2 + ab + b^2", "a^2 - 2ab + b^2", "a^2 + b^2"]
  },
  {
    id: 2,
    name: "Bình phương của một hiệu",
    left: "(a - b)^2",
    correctRight: "a^2 - 2ab + b^2",
    wrongChoices: ["a^2 - ab + b^2", "a^2 + 2ab + b^2", "a^2 - b^2"]
  },
  {
    id: 3,
    name: "Hiệu hai bình phương",
    left: "a^2 - b^2",
    correctRight: "(a - b)(a + b)",
    wrongChoices: ["(a - b)^2", "(a + b)^2", "a^2 - 2ab + b^2"]
  },
  {
    id: 4,
    name: "Lập phương của một tổng",
    left: "(a + b)^3",
    correctRight: "a^3 + 3a^2b + 3ab^2 + b^3",
    wrongChoices: ["a^3 + b^3", "a^3 + a^2b + ab^2 + b^3", "a^3 + 3ab + b^3"]
  },
  {
    id: 5,
    name: "Lập phương của một hiệu",
    left: "(a - b)^3",
    correctRight: "a^3 - 3a^2b + 3ab^2 - b^3",
    wrongChoices: ["a^3 - b^3", "a^3 - 3a^2b - 3ab^2 - b^3", "a^3 - 3ab + b^3"]
  },
  {
    id: 6,
    name: "Tổng hai lập phương",
    left: "a^3 + b^3",
    correctRight: "(a + b)(a^2 - ab + b^2)",
    wrongChoices: ["(a + b)^3", "(a + b)(a^2 + ab + b^2)", "(a + b)(a^2 - 2ab + b^2)"]
  },
  {
    id: 7,
    name: "Hiệu hai lập phương",
    left: "a^3 - b^3",
    correctRight: "(a - b)(a^2 + ab + b^2)",
    wrongChoices: ["(a - b)^3", "(a - b)(a^2 - ab + b^2)", "(a - b)(a^2 + 2ab + b^2)"]
  },
  {
    id: 8,
    name: "Ứng dụng: (2x + 1)^2",
    left: "(2x + 1)^2",
    correctRight: "4x^2 + 4x + 1",
    wrongChoices: ["2x^2 + 4x + 1", "4x^2 + 1", "4x^2 + 2x + 1"]
  },
  {
    id: 9,
    name: "Ứng dụng: x^2 - 4y^2",
    left: "x^2 - 4y^2",
    correctRight: "(x - 2y)(x + 2y)",
    wrongChoices: ["(x - 4y)(x + 4y)", "(x - 2y)^2", "x^2 - 2xy + 4y^2"]
  }
];

export const IdentitySpeedGame = ({ onFinish, assignmentId = null }) => {
  const { user, profile } = useAuth();
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [submitting, setSubmitting] = useState(false);

  // Trộn câu hỏi và đáp án ngẫu nhiên
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const startGame = () => {
    setGameState('playing');
    setCurrentIdx(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(60);
    setFeedback(null);
    setupQuestion(0);
  };

  const setupQuestion = (idx) => {
    const q = IDENTITY_QUESTIONS[idx % IDENTITY_QUESTIONS.length];
    const options = shuffleArray([q.correctRight, ...q.wrongChoices]);
    setShuffledOptions(options);
  };

  // Đếm ngược thời gian
  useEffect(() => {
    let timer = null;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleSelectAnswer = (selectedOption) => {
    if (gameState !== 'playing' || feedback) return;

    const currentQ = IDENTITY_QUESTIONS[currentIdx % IDENTITY_QUESTIONS.length];
    const isCorrect = selectedOption === currentQ.correctRight;

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      const pointsEarned = 10 + newCombo * 2;
      setScore((prev) => prev + pointsEarned);
      setFeedback('correct');

      if (newCombo >= 3) {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    } else {
      setCombo(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      const nextIdx = currentIdx + 1;
      if (nextIdx >= IDENTITY_QUESTIONS.length) {
        endGame();
      } else {
        setCurrentIdx(nextIdx);
        setupQuestion(nextIdx);
      }
    }, 600);
  };

  const endGame = async () => {
    setGameState('finished');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Tự động ghi nhận điểm vào Supabase nếu đã đăng nhập
    if (user?.id) {
      setSubmitting(true);
      try {
        if (isSupabaseConfigured) {
          await supabase.from('student_progress').upsert({
            student_id: user.id,
            assignment_id: assignmentId,
            status: 'completed',
            score: Math.min(100, score),
            completion_time_seconds: 60 - timeLeft,
            completed_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Lỗi lưu điểm game:', err);
      } finally {
        setSubmitting(false);
      }
    }

    if (onFinish) {
      onFinish({ score, maxCombo, timeSpent: 60 - timeLeft });
    }
  };

  const currentQ = IDENTITY_QUESTIONS[currentIdx % IDENTITY_QUESTIONS.length];

  return (
    <div className="glass-card p-6 sm:p-8 max-w-2xl mx-auto border-sky-500/30">
      {/* Ready Screen */}
      {gameState === 'ready' && (
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-sky-500 to-teal-500 p-0.5 mb-6 shadow-xl shadow-sky-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Zap className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            ⚡ Đấu Trường 7 Hằng Đẳng Thức
          </h2>
          <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm">
            Toán 8 KNTT - Chương 2: Rèn luyện phản xạ ghép công thức hằng đẳng thức đáng nhớ trong 60 giây. Duy trì combo để đạt điểm tối đa!
          </p>

          <div className="grid grid-cols-3 gap-4 my-8 max-w-md mx-auto">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <Timer className="w-5 h-5 text-sky-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Thời gian</p>
              <p className="text-base font-bold text-slate-100">60 Giây</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Combo</p>
              <p className="text-base font-bold text-amber-300">Điểm x2 x3</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <Trophy className="w-5 h-5 text-teal-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Thang điểm</p>
              <p className="text-base font-bold text-teal-300">100 Điểm</p>
            </div>
          </div>

          <Button variant="gold" size="lg" icon={Zap} onClick={startGame} className="btn-gold-glow">
            Bắt đầu Đấu trường ngay!
          </Button>
        </div>
      )}

      {/* Playing Screen */}
      {gameState === 'playing' && (
        <div>
          {/* Top Bar: Time, Score, Combo */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <Timer className="w-5 h-5 animate-pulse" />
              <span className="text-lg font-mono">{timeLeft}s</span>
            </div>

            {combo > 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black animate-bounce">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                COMBO x{combo}!
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Điểm số:</span>
              <span className="text-xl font-black text-gradient-gold font-mono">{score}</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="my-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
              {currentQ.name}
            </span>
            <div className="mt-5 p-6 bg-slate-800/90 rounded-2xl border border-slate-700 shadow-inner">
              <p className="text-xs text-slate-400 mb-2">Vế trái của Hằng đẳng thức:</p>
              <div className="text-3xl font-extrabold text-sky-300">
                <MathRenderer formula={currentQ.left} displayMode={true} />
              </div>
              <p className="text-sm font-semibold text-slate-400 mt-3">= ... ?</p>
            </div>
          </div>

          {/* Answer Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {shuffledOptions.map((opt, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(opt)}
                disabled={feedback !== null}
                className={`p-4 rounded-xl text-center border font-medium text-slate-100 transition-all cursor-pointer ${
                  feedback === 'correct' && opt === currentQ.correctRight
                    ? 'bg-teal-600/40 border-teal-400 text-teal-200 ring-2 ring-teal-400'
                    : feedback === 'wrong' && opt !== currentQ.correctRight
                    ? 'bg-rose-950/40 border-rose-700 text-rose-300'
                    : 'bg-slate-800/80 border-slate-700 hover:border-sky-400 hover:bg-slate-700/80 hover:shadow-lg'
                }`}
              >
                <MathRenderer formula={opt} />
              </button>
            ))}
          </div>

          {/* Feedback Icon */}
          <div className="h-6 mt-4 text-center">
            {feedback === 'correct' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" /> Chính xác! (+10đ)
              </span>
            )}
            {feedback === 'wrong' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 animate-fadeIn">
                <XCircle className="w-4 h-4" /> Chưa đúng rồi! Thử lại nhé!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Finished Screen */}
      {gameState === 'finished' && (
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 mb-4 shadow-xl shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-100">Chiến Thắng Đấu Trường!</h3>
          <p className="text-xs text-slate-400 mt-1">Chúc mừng bạn đã hoàn thành bài luyện Hằng đẳng thức</p>

          <div className="grid grid-cols-2 gap-4 my-6 max-w-sm mx-auto">
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
              <p className="text-xs text-slate-400">Tổng điểm</p>
              <p className="text-3xl font-black text-gradient-gold">{score}</p>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
              <p className="text-xs text-slate-400">Combo cao nhất</p>
              <p className="text-3xl font-black text-teal-400">x{maxCombo}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" icon={RefreshCw} onClick={startGame}>
              Chơi lại lần nữa
            </Button>
            <Button variant="secondary" onClick={() => setGameState('ready')}>
              Quay lại danh mục
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentitySpeedGame;
