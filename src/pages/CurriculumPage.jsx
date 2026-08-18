import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';
import { MATH_8_CURRICULUM } from '../data/math8Curriculum';
import MathRenderer, { MathText } from '../components/common/MathRenderer';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export const CurriculumPage = () => {
  const [activeChapter, setActiveChapter] = useState(1);
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const currentChapter = MATH_8_CURRICULUM.find((c) => c.chapter === activeChapter);
  const currentLesson = currentChapter?.lessons.find((l) => l.id === activeLessonId) || currentChapter?.lessons[0];

  const handleSelectQuiz = (questionId, optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <BookOpen className="w-6 h-6" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
            Cẩm Nang Lý Thuyết & Công Thức Toán 8 (KNTT)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Hệ thống hóa toàn bộ kiến thức Chương 1 (Đa thức) & Chương 2 (7 Hằng đẳng thức) cùng Cô Nguyễn Thị Huyền Diệu
        </p>
      </div>

      {/* Chapter Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MATH_8_CURRICULUM.map((chap) => (
          <button
            key={chap.chapter}
            onClick={() => {
              setActiveChapter(chap.chapter);
              setActiveLessonId(chap.lessons[0].id);
            }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeChapter === chap.chapter
                ? 'bg-sky-500/20 border-sky-400 shadow-xl shadow-sky-500/10 ring-1 ring-sky-400'
                : 'glass-card hover:border-slate-700'
            }`}
          >
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
              Chương {chap.chapter}
            </span>
            <h3 className="text-lg font-bold text-slate-100 mt-2">{chap.chapterTitle}</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{chap.description}</p>
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Lesson Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
            Danh sách bài học Chương {activeChapter}:
          </h3>
          {currentChapter?.lessons.map((les) => (
            <button
              key={les.id}
              onClick={() => setActiveLessonId(les.id)}
              className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeLessonId === les.id
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold shadow-md'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{les.title}</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>
          ))}
        </div>

        {/* Right Lesson Detail Area */}
        <div className="lg:col-span-8 space-y-6">
          {currentLesson && (
            <div className="glass-card p-6 sm:p-8 space-y-8 animate-fadeIn">
              
              {/* Title & Summary */}
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  {currentChapter.chapterTitle}
                </span>
                <h2 className="text-2xl font-black text-slate-100 mt-3">
                  {currentLesson.title}
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {currentLesson.summary}
                </p>
              </div>

              {/* Key Formulas Section with KaTeX */}
              <div>
                <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Công thức trọng tâm (Bộ nhớ siêu đẳng)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentLesson.keyFormulas?.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-inner text-center"
                    >
                      <p className="text-xs text-slate-400 mb-2 font-semibold">{f.label}</p>
                      <div className="text-xl font-bold text-sky-300">
                        <MathRenderer formula={f.latex} displayMode={true} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Theory Points */}
              <div>
                <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3">
                  Kiến thức cần ghi nhớ
                </h3>
                <div className="space-y-2.5">
                  {currentLesson.theory?.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      <span><MathText text={t} /></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Practice Quiz */}
              {currentLesson.quizQuestions && currentLesson.quizQuestions.length > 0 && (
                <div className="pt-6 border-t border-slate-800">
                  <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    Thử thách kiểm tra nhanh hiểu bài
                  </h3>

                  <div className="space-y-6">
                    {currentLesson.quizQuestions.map((q) => {
                      const userChoice = selectedAnswers[q.id];
                      const isAnswered = userChoice !== undefined;
                      const isCorrect = userChoice === q.correctAnswer;

                      return (
                        <div key={q.id} className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-3">
                          <p className="text-sm font-bold text-slate-100">
                            <MathText text={q.question} />
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = userChoice === oIdx;
                              let btnClass = 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700';

                              if (isAnswered) {
                                if (oIdx === q.correctAnswer) btnClass = 'bg-teal-900/50 border-teal-400 text-teal-200 font-bold';
                                else if (isSelected) btnClass = 'bg-rose-900/50 border-rose-500 text-rose-300';
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectQuiz(q.id, oIdx)}
                                  disabled={isAnswered}
                                  className={`p-3 rounded-xl border text-xs text-left transition-all ${btnClass}`}
                                >
                                  <MathText text={opt} />
                                </button>
                              );
                            })}
                          </div>

                          {isAnswered && (
                            <div className={`p-3 rounded-xl text-xs ${isCorrect ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'}`}>
                              <p className="font-bold mb-1">
                                {isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng!'}
                              </p>
                              <div className="text-slate-300 leading-relaxed">
                                <MathText text={q.explanation} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CurriculumPage;
