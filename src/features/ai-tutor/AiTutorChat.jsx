import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  Copy, 
  Check, 
  Zap, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Lightbulb, 
  ListOrdered, 
  HelpCircle,
  Dumbbell
} from 'lucide-react';
import { askAiTutor } from './aiTutorService';
import { AI_MATH_PROMPTS, MATH_SYMBOL_BUTTONS } from './MathPromptSuggestions';
import { TEACHER_INFO } from '../../data/math8Curriculum';
import MathRenderer from '../../components/common/MathRenderer';
import Button from '../../components/common/Button';

// Phân tách và render văn bản có chứa KaTeX $...$ hoặc $$...$$
const FormattedMessageText = ({ text = '' }) => {
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g);

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const formula = part.slice(2, -2).trim();
          return (
            <div key={index} className="my-2.5 text-center overflow-x-auto py-1 bg-slate-950/40 rounded-xl p-2 border border-slate-800/50">
              <MathRenderer formula={formula} displayMode={true} />
            </div>
          );
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1).trim();
          return <MathRenderer key={index} formula={formula} displayMode={false} className="mx-1 font-semibold text-amber-300" />;
        } else {
          return (
            <span key={index} className="whitespace-pre-line">
              {part}
            </span>
          );
        }
      })}
    </div>
  );
};

export const AiTutorChat = () => {
  const [learningMode, setLearningMode] = useState('detailed'); // 'detailed' | 'socratic' | 'practice'
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Chào em! Cô Huyền Diệu rất vui được đồng hành cùng em trong môn **Toán 8 - Bộ sách Kết Nối Tri Thức Với Cuộc Sống**.

Cô có thể giúp em:
1. 📝 **Hướng dẫn giải chi tiết:** Khai triển & Phân tích nhân tử bằng 7 Hằng đẳng thức đáng nhớ.
2. 💡 **Phương pháp gợi mở:** Gợi ý từng bước để em tự tìm ra đáp án.
3. 🎯 **Luyện tập:** Giải các bài toán tìm $x$, chia đa thức, mẹo tính nhẩm nhanh và hình học tứ giác.

Em hãy nhập bài toán hoặc chọn câu hỏi gợi ý bên dưới để cô trò mình cùng bắt đầu nhé! ✨`,
      topic: 'Gia sư Toán 8 1-1',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Xử lý gửi tin nhắn hỏi AI
  const handleSend = async (textToSend = input) => {
    const query = textToSend.trim();
    if (!query || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askAiTutor(query, { mode: learningMode });
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        topic: response.topic,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Lỗi hỏi AI:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Cô đang kiểm tra lại bài giảng một chút. Em thử hỏi lại nhé!',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInsertSymbol = (symbol) => {
    setInput((prev) => prev + symbol);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Tính năng giọng đọc cô giáo bằng Web Speech API
  const handleSpeak = (id, text) => {
    if (!window.speechSynthesis) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Loại bỏ ký tự công thức $ và markdown trước khi đọc
    const cleanText = text
      .replace(/\$\$[\s\S]*?\$\$/g, ' biểu thức toán học ')
      .replace(/\$[^\$]+?\$/g, ' công thức ')
      .replace(/[#*`_]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95; // Tốc độ đọc dễ nghe

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `Chào em! Em cần Cô Huyền Diệu hướng dẫn bài tập hoặc công thức Toán 8 nào tiếp theo?`,
        topic: 'Toán 8 KNTT',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="glass-card flex flex-col h-[740px] max-w-4xl mx-auto border-sky-500/30 overflow-hidden shadow-2xl">
      
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={TEACHER_INFO.avatar}
              alt={TEACHER_INFO.name}
              className="w-12 h-12 rounded-2xl object-cover object-top border-2 border-amber-500/70 shadow-lg shadow-amber-500/20"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-teal-500 border-2 border-slate-950 animate-pulse" title="Trợ giảng đang trực tuyến" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-100 text-base sm:text-lg">
                Gia Sư AI: {TEACHER_INFO.name}
              </h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Toán 8 KNTT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Trường THCS Nguyễn Huệ • Hướng dẫn giải chi tiết & Gợi mở Socratic
            </p>
          </div>
        </div>

        {/* Learning Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setLearningMode('detailed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              learningMode === 'detailed'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Trình bày bài giải mẫu chi tiết từng bước"
          >
            <ListOrdered className="w-3.5 h-3.5" /> Lời giải mẫu
          </button>

          <button
            onClick={() => setLearningMode('socratic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              learningMode === 'socratic'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Đặt câu hỏi gợi mở, hướng dẫn tư duy"
          >
            <Lightbulb className="w-3.5 h-3.5" /> Gợi mở
          </button>

          <button
            onClick={() => setLearningMode('practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              learningMode === 'practice'
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Luyện tập bài toán tương tự"
          >
            <Dumbbell className="w-3.5 h-3.5" /> Luyện tập
          </button>

          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg ml-1"
            title="Xóa lịch sử đoạn chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Suggested Prompts Pill Bar */}
      <div className="p-2.5 bg-slate-900/95 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 pl-2 flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          Gợi ý nhanh:
        </span>
        {AI_MATH_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 hover:border-sky-500/40 border border-slate-700 text-slate-300 whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'} animate-fadeIn`}
            >
              {isAi && (
                <img
                  src={TEACHER_INFO.avatar}
                  alt="Cô Diệu"
                  className="w-9 h-9 rounded-2xl object-cover object-top border-2 border-amber-500/60 flex-shrink-0 mt-1 shadow-md shadow-amber-500/20"
                />
              )}

              <div
                className={`relative max-w-[88%] sm:max-w-[78%] p-4 sm:p-5 rounded-2xl shadow-lg ${
                  isAi
                    ? 'bg-slate-900/90 border border-slate-800 text-slate-200 backdrop-blur-sm'
                    : 'bg-gradient-to-r from-sky-600 to-blue-600 text-white font-medium ml-auto shadow-sky-600/20'
                }`}
              >
                {/* Topic badge if available */}
                {msg.topic && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 inline-block">
                      {msg.topic}
                    </span>
                  </div>
                )}

                {/* Body Text with KaTeX formulas */}
                <FormattedMessageText text={msg.text} />

                {/* Footer time, copy & voice */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{msg.time}</span>
                  
                  {isAi && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className={`flex items-center gap-1 transition-colors ${
                          speakingId === msg.id ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
                        }`}
                        title={speakingId === msg.id ? 'Dừng đọc' : 'Nghe cô giảng bài'}
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                            <span>Dừng đọc</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Nghe giảng</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                        title="Sao chép lời giải"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-teal-400" />
                            <span className="text-teal-400">Đã sao chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-9 h-9 rounded-2xl bg-sky-500 flex items-center justify-center font-bold text-xs text-white flex-shrink-0 mt-1 shadow-md shadow-sky-500/30">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <img
              src={TEACHER_INFO.avatar}
              alt="Cô Diệu"
              className="w-9 h-9 rounded-2xl object-cover object-top border-2 border-amber-500/60 flex-shrink-0"
            />
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Cô Huyền Diệu đang phân tích cấu trúc bài toán và soạn lời giải chuẩn sư phạm...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Math Symbols Keyboard Bar */}
      <div className="px-4 py-2 bg-slate-950/95 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-500 flex-shrink-0 mr-1">
          Ký hiệu toán:
        </span>
        {MATH_SYMBOL_BUTTONS.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleInsertSymbol(btn.insert)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 flex-shrink-0 transition-colors"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Nhập câu hỏi hoặc biểu thức toán... (Ví dụ: (3x + 2y)^2 hoặc x^2 - 16 = 0)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500"
          disabled={loading}
        />
        <Button
          variant="gold"
          size="md"
          type="submit"
          disabled={!input.trim() || loading}
          icon={Send}
          className="btn-gold-glow px-6 font-bold"
        >
          Gửi câu hỏi
        </Button>
      </form>
    </div>
  );
};

export default AiTutorChat;
