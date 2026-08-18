import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Sparkles, School, ShieldCheck, GraduationCap, UserCheck, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { TEACHER_INFO } from '../data/math8Curriculum';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, switchDemoRole, isDemoMode } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!fullName.trim()) {
          throw new Error('Vui lòng nhập họ và tên của bạn!');
        }
        await signUp(email, password, { fullName, role });
      }

      // Điều hướng theo vai trò
      if (role === 'admin' || email.includes('admin')) {
        navigate('/admin');
      } else if (role === 'teacher' || email.includes('dieu') || email.includes('teacher')) {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (err) {
      console.error('Lỗi xác thực:', err);
      setError(err.message || 'Đăng nhập/Đăng ký không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole) => {
    switchDemoRole(demoRole);
    if (demoRole === 'teacher') navigate('/teacher');
    else if (demoRole === 'admin') navigate('/admin');
    else navigate('/student');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 relative group">
            <img
              src="/images/logo-thcs-nguyen-hue.png"
              alt="Logo Trường THCS Nguyễn Huệ Đà Nẵng"
              className="w-full h-full rounded-full object-contain bg-white p-1 border-2 border-sky-400 shadow-xl shadow-sky-500/30"
            />
          </div>
          <h2 className="text-2xl font-black text-slate-100">
            Toán 8 KNTT • THCS Nguyễn Huệ
          </h2>
          <p className="text-xs text-amber-300/90 font-medium mt-1">
            Cô Nguyễn Thị Huyền Diệu đồng hành cùng các em
          </p>
        </div>

        {/* 1-Click Quick Demo Login Box */}
        <div className="glass-card p-4 border-amber-500/30 bg-amber-500/5">
          <p className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Đăng nhập nhanh 1-Click (Xem thử các vai trò):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo('teacher')}
              className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-medium flex flex-col items-center gap-1 transition-all"
            >
              <span>👩‍🏫 Cô Diệu</span>
              <span className="text-[10px] text-amber-400 font-bold">Giáo viên</span>
            </button>
            <button
              onClick={() => handleQuickDemo('student')}
              className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-sky-400 text-slate-200 text-xs font-medium flex flex-col items-center gap-1 transition-all"
            >
              <span>🎒 Văn An</span>
              <span className="text-[10px] text-sky-400 font-bold">Học sinh</span>
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-rose-400 text-slate-200 text-xs font-medium flex flex-col items-center gap-1 transition-all"
            >
              <span>🛡️ Admin</span>
              <span className="text-[10px] text-rose-400 font-bold">Quản trị</span>
            </button>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="glass-card p-6 sm:p-8 border-slate-800">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                isLogin ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                !isLogin ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Đăng ký mới
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Họ và tên của bạn <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Vai trò trên hệ thống:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        role === 'student'
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      🎒 Học sinh (Khối 8)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        role === 'teacher'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      👩‍🏫 Giáo viên Toán
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Địa chỉ Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                placeholder="name@nguyenhue.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mật khẩu <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500"
                required
                minLength={6}
              />
            </div>

            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={loading}
              icon={isLogin ? LogIn : UserPlus}
              className="w-full mt-2"
            >
              {isLogin ? 'Đăng Nhập Vào Hệ Thống' : 'Hoàn Tất Đăng Ký'}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
