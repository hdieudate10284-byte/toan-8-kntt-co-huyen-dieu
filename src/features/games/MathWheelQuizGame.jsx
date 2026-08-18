import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, HelpCircle, ArrowRight, RotateCw, CheckCircle2, XCircle } from 'lucide-react';
import MathRenderer, { MathText } from '../../components/common/MathRenderer';
import Button from '../../components/common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const WHEEL_QUESTIONS = [
  {
    topic: "Đơn thức",
    question: "Đơn thức nào sau đây đồng dạng với đơn thức $-3x^2y$?",
    options: ["A. $5x^2y$", "B. $3xy^2$", "C. $-3x^3y$", "D. $2x^2y^2$"],
    correctAnswer: 0,
    solution: "Hai đơn thức đồng dạng có cùng phần biến $x^2y$."
  },
  {
    topic: "Nhân đa thức",
    question: "Tích của đơn thức $3x$ và đa thức $(2x - 5)$ là:",
    options: ["A. $6x^2 - 15x$", "B. $6x - 15$", "C. $6x^2 - 5$", "D. $5x^2 - 15x$"],
    correctAnswer: 0,
    solution: "$3x \\cdot 2x - 3x \\cdot 5 = 6x^2 - 15x$."
  },
  {
    topic: "Bình phương tổng",
    question: "Khai triển $(x + 4)^2$ bằng:",
    options: ["A. $x^2 + 8x + 16$", "B. $x^2 + 16$", "C. $x^2 + 4x + 16$", "D. $x^2 + 8x + 8$"],
    correctAnswer: 0,
    solution: "Áp dụng HĐT $(A+B)^2 = A^2 + 2AB + B^2$: $x^2 + 2 \\cdot x \\cdot 4 + 4^2 = x^2 + 8x + 16$."
  },
  {
    topic: "Hiệu 2 bình phương",
    question: "Biểu thức $4x^2 - 9y^2$ viết dưới dạng tích là:",
    options: ["A. $(2x - 3y)(2x + 3y)$", "B. $(4x - 9y)(4x + 9y)$", "C. $(2x - 3y)^2$", "D. $2x^2 - 3y^2$"],
    correctAnswer: 0,
    solution: "$(2x)^2 - (3y)^2 = (2x - 3y)(2x + 3y)$."
  },
  {
    topic: "Lập phương tổng",
    question: "Khai triển $(x + 1)^3$ bằng:",
    options: ["A. $x^3 + 3x^2 + 3x + 1$", "B. $x^3 + 1$", "C. $x^3 + x^2 + x + 1$", "D. $x^3 + 3x + 1$"],
    correctAnswer: 0,
    solution: "$(x+1)^3 = x^3 + 3 \\cdot x^2 \\cdot 1 + 3 \\cdot x \\cdot 1^2 + 1^3 = x^3 + 3x^2 + 3x + 1$."
  },
  {
    topic: "Phân tích nhân tử",
    question: "Phân tích $x^2 - 4x + 4$ thành nhân tử:",
    options: ["A. $(x - 2)^2$", "B. $(x + 2)^2$", "C. $(x - 4)^2$", "D. $(x - 2)(x + 2)$"],
    correctAnswer: 0,
    solution: "$x^2 - 2 \\cdot x \\cdot 2 + 2^2 = (x - 2)^2$."
  }
];

export const MathWheelQuizGame = ({ onFinish }) => {
  const { user } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [currentQ, setCurrentQ] = useState(null);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setCurrentQ(null);
    setSelectedOpt(null);
    setShowSolution(false);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * WHEEL_QUESTIONS.length);
      setCurrentQ(WHEEL_QUESTIONS[randomIndex]);
      setSpinning(false);
    }, 1200);
  };

  const handleAnswer = (index) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(index);
    setShowSolution(true);
    setQuestionsAnswered((prev) => prev + 1);

    if (index === currentQ.correctAnswer) {
      setScore((prev) => prev + 20);
      confetti({ particleCount: 40, spread: 60 });
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 max-w-2xl mx-auto border-amber-500/30">
      <div className="text-center pb-6 border-b border-slate-800">
        <h2 className="text-2xl font-black text-slate-100 flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          Vòng Quay Tri Thức Toán 8 (KNTT)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Quay ngẫu nhiên các chủ đề Chương 1 & 2 để trả lời câu hỏi trắc nghiệm tích điểm
        </p>
      </div>

      <div className="my-6 text-center">
        {!currentQ && (
          <div className="py-8">
            <div className={`w-36 h-36 mx-auto rounded-full border-4 border-dashed border-amber-500/60 flex items-center justify-center bg-amber-500/10 mb-6 shadow-xl ${spinning ? 'animate-spin' : ''}`}>
              <RotateCw className={`w-14 h-14 text-amber-400 ${spinning ? 'animate-pulse' : ''}`} />
            </div>
            <Button
              variant="gold"
              size="lg"
              onClick={handleSpin}
              isLoading={spinning}
              className="btn-gold-glow"
            >
              {spinning ? 'Đang quay vòng quay...' : 'Quay chọn câu hỏi ngay!'}
            </Button>
          </div>
        )}

        {currentQ && (
          <div className="text-left animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Chủ đề: {currentQ.topic}
              </span>
              <span className="text-xs text-slate-400">
                Điểm tích lũy: <b className="text-amber-400 font-mono text-sm">{score}đ</b>
              </span>
            </div>

            <div className="p-5 bg-slate-800/90 rounded-2xl border border-slate-700 mb-5 shadow-inner">
              <h3 className="text-base font-bold text-slate-100 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span><MathText text={currentQ.question} /></span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === currentQ.correctAnswer;
                let btnStyle = 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200';

                if (showSolution) {
                  if (isCorrect) btnStyle = 'bg-teal-900/40 border-teal-500 text-teal-200 ring-1 ring-teal-500';
                  else if (isSelected) btnStyle = 'bg-rose-900/40 border-rose-500 text-rose-200';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showSolution}
                    className={`w-full p-4 rounded-xl text-left border font-medium transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span><MathText text={opt} /></span>
                    {showSolution && isCorrect && <CheckCircle2 className="w-5 h-5 text-teal-400" />}
                    {showSolution && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                  </button>
                );
              })}
            </div>

            {showSolution && (
              <div className="mt-5 p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 animate-fadeIn">
                <p className="font-bold text-teal-400 mb-1">💡 Lời giải chi tiết của Cô Huyền Diệu:</p>
                <div className="leading-relaxed"><MathText text={currentQ.solution} /></div>
                <div className="mt-4 text-right">
                  <Button variant="primary" size="sm" icon={ArrowRight} onClick={handleSpin}>
                    Quay câu tiếp theo
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MathWheelQuizGame;
