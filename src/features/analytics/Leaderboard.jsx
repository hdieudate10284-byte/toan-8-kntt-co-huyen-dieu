import React from 'react';
import { Trophy, Medal, Flame, Star, Sparkles } from 'lucide-react';
import { formatScore } from '../../utils/formatters';

export const Leaderboard = ({
  leaderboardData = [
    { rank: 1, name: "Trần Mai Anh", class: "8A1", score: 980, streak: 14, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
    { rank: 2, name: "Lê Hoàng Nam", class: "8A1", score: 940, streak: 10, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" },
    { rank: 3, name: "Nguyễn Văn An", class: "8A1", score: 850, streak: 7, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" },
    { rank: 4, name: "Phạm Quỳnh Như", class: "8A2", score: 820, streak: 6, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop" },
    { rank: 5, name: "Đỗ Minh Đức", class: "8A1", score: 790, streak: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" }
  ]
}) => {
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-sm">🥇</div>;
      case 2:
        return <div className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-300 border border-slate-400/40 flex items-center justify-center font-black text-sm">🥈</div>;
      case 3:
        return <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center font-black text-sm">🥉</div>;
      default:
        return <span className="font-mono font-bold text-slate-400 text-sm">{rank}</span>;
    }
  };

  return (
    <div className="glass-card p-6 border-slate-800">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Bảng Vàng Danh Dự Toán 8 (KNTT)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Vinh danh các bạn học sinh có điểm rèn luyện cao nhất</p>
        </div>
        <span className="text-xs font-bold text-amber-400 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Tuần này
        </span>
      </div>

      <div className="divide-y divide-slate-800/80">
        {leaderboardData.map((st) => (
          <div
            key={st.rank}
            className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 flex justify-center">{getRankBadge(st.rank)}</div>
              <img
                src={st.avatar}
                alt={st.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-100">{st.name}</h4>
                <p className="text-xs text-slate-400">Lớp {st.class} • THCS Nguyễn Huệ</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div className="hidden sm:flex items-center gap-1 text-xs text-rose-400">
                <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>{st.streak} ngày</span>
              </div>
              <div>
                <p className="text-base font-black text-amber-400 font-mono">{st.score}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Điểm</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
