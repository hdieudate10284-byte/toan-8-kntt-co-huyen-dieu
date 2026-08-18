import React from 'react';
import { Heart, School, BookMarked, Sparkles } from 'lucide-react';
import { TEACHER_INFO } from '../../data/math8Curriculum';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand & Teacher */}
          <div>
            <div className="flex items-center gap-3.5 mb-3">
              <img
                src={TEACHER_INFO.avatar}
                alt={TEACHER_INFO.name}
                className="w-12 h-12 rounded-2xl object-cover object-top border-2 border-amber-400 shadow-md shadow-amber-500/20"
              />
              <div>
                <h4 className="font-bold text-slate-100 text-base">Toán 8 Kết Nối Tri Thức</h4>
                <p className="text-xs text-amber-300 font-semibold">{TEACHER_INFO.name}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống Học tập Số & Game Đấu trường Toán học 8 Bộ sách Kết Nối Tri Thức Với Cuộc Sống. Giảng dạy và biên soạn bởi Cô Nguyễn Thị Huyền Diệu.
            </p>
          </div>

          {/* School info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/images/logo-thcs-nguyen-hue.png"
                alt="Logo Trường THCS Nguyễn Huệ Đà Nẵng"
                className="w-11 h-11 rounded-full object-contain bg-white p-0.5 border-2 border-sky-400 shadow-md shadow-sky-500/20"
              />
              <div>
                <h4 className="font-bold text-slate-200">Đơn vị Giảng dạy</h4>
                <p className="text-xs text-sky-300 font-bold">{TEACHER_INFO.school}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">Khối 8 - Phân môn Đại số (KNTT)</p>
            <p className="text-xs text-slate-400 mt-1">Chương 1: Đa thức nhiều biến</p>
            <p className="text-xs text-slate-400 mt-1">Chương 2: 7 Hằng đẳng thức đáng nhớ</p>
          </div>

          {/* Tech & Support */}
          <div>
            <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Nền tảng Công nghệ
            </h4>
            <p className="text-xs text-slate-400">Frontend: React 18 + Vite + Tailwind CSS</p>
            <p className="text-xs text-slate-400 mt-1">Backend: Supabase PostgreSQL + Auth + Storage</p>
            <p className="text-xs text-slate-400 mt-1">Hosting: Vercel SPA Production Ready</p>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} THCS Nguyễn Huệ - Toán 8 Cô Nguyễn Thị Huyền Diệu. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Thiết kế dành tặng các em học sinh THCS Nguyễn Huệ <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
