import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  School, 
  KeyRound, 
  Mail, 
  User, 
  ArrowLeft 
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, switchDemoRole } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('THCS Nguyễn Huệ');
  const [role, setRole] = useState('student');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (showForgot) {
        if (!email.trim()) throw new Error('Vui lòng nhập địa chỉ Email của bạn!');
        await resetPassword(email);
        setSuccessMsg('Đã gửi link khôi phục mật khẩu tới Email của bạn. Vui lòng kiểm tra hộp thư!');
        setLoading(false);
        return;
      }

      if (isLogin) {
        const result = await signIn(email, password);
        setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
        
        setTimeout(() => {
          const userRole = result?.profile?.role || role;
          if (userRole === 'admin') navigate('/admin');
          else if (userRole === 'teacher') navigate('/teacher');
          else navigate('/student');
        }, 600);
      } else {
        if (!fullName.trim()) {
          throw new Error('Vui lòng nhập họ và tên đầy đủ của bạn!');
        }
        if (password.length < 6) {
          throw new Error('Mật khẩu phải có tối thiểu 6 ký tự để đảm bảo an toàn!');
        }

        const result = await signUp(email, password, { 
          fullName: fullName.trim(), 
          role, 
          schoolName: schoolName.trim() 
        });

        if (result?.notice) {
          setSuccessMsg(result.notice);
        } else {
          setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng...');
        }
        
        setTimeout(() => {
          const userRole = result?.profile?.role || role;
          if (userRole === 'admin') navigate('/admin');
          else if (userRole === 'teacher') navigate('/teacher');
          else navigate('/student');
        }, 1000);
      }
    } catch (err) {
      console.error('Lỗi xác thực:', err);
      let message = 'Đã có lỗi xảy ra. Vui lòng thử lại!';
      if (typeof err === 'string') {
        message = err;
      } else if (err?.message && typeof err.message === 'string') {
        message = err.message;
      } else if (err?.error_description) {
        message = String(err.error_description);
      } else if (err?.msg) {
        message = String(err.msg);
      }
      setError(message);
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        
        {/* Brand header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 relative group">
            <img
              src="/images/logo-thcs-nguyen-hue.png"
              alt="Logo Trường THCS Nguyễn Huệ Đà Nẵng"
              className="w-full h-full rounded-full object-contain bg-white p-1 border-2 border-sky-400 shadow-xl shadow-sky-500/30 group-hover:scale-105 transition-transform"
            />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">
            TOÁN 8 KNTT • THCS NGUYỄN HUỆ
          </h2>
          <p className="text-xs text-amber-300 font-semibold mt-1">
            👩‍🏫 Cô Nguyễn Thị Huyền Diệu đồng hành cùng các em
          </p>
        </div>

        {/* 1-Click Quick Demo Login Box */}
        <div className="glass-card p-3.5 border-amber-500/30 bg-amber-500/5">
          <p className="text-[11px] font-bold text-amber-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Trải nghiệm nhanh 1-Click (Dành cho Xem thử / Giám thị):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('teacher')}
              className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-medium flex flex-col items-center gap-0.5 transition-all cursor-pointer"
            >
              <span>👩‍🏫 Cô Diệu</span>
              <span className="text-[10px] text-amber-400 font-bold">Giáo viên</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-sky-400 text-slate-200 text-xs font-medium flex flex-col items-center gap-0.5 transition-all cursor-pointer"
            >
              <span>🎒 Văn An</span>
              <span className="text-[10px] text-sky-400 font-bold">Học sinh 8A1</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-rose-400 text-slate-200 text-xs font-medium flex flex-col items-center gap-0.5 transition-all cursor-pointer"
            >
              <span>🛡️ Admin</span>
              <span className="text-[10px] text-rose-400 font-bold">Quản trị</span>
            </button>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="glass-card p-6 sm:p-7 border-slate-800 shadow-2xl">
          
          {/* Form Title & Tabs */}
          {!showForgot ? (
            <div className="flex border-b border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isLogin ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  !isLogin ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Đăng ký mới
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => { setShowForgot(false); setError(''); setSuccessMsg(''); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-bold text-slate-100">Khôi phục mật khẩu qua Email</h3>
            </div>
          )}

          {/* Error & Success Messages */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 mb-4 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/40 text-teal-300 text-xs flex items-start gap-2 mb-4 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-teal-400" />
              <span className="leading-relaxed font-semibold">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Fields when Registering */}
            {!isLogin && !showForgot && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Họ và tên của bạn <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Vai trò trên hệ thống:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        role === 'student'
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-md'
                          : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>🎒</span>
                      <span>Học sinh Toán 8</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        role === 'teacher'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                          : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>👩‍🏫</span>
                      <span>Giáo viên</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Trường học:
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="THCS Nguyễn Huệ"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Địa chỉ Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="name@nguyenhue.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field (not shown in forgot mode) */}
            {!showForgot && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Mật khẩu <span className="text-rose-400">*</span>
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 6 ký tự..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-200"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Gợi ý: Mật khẩu nên gồm cả chữ cái và số để bảo mật tài khoản.
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={loading}
              icon={showForgot ? Mail : (isLogin ? LogIn : UserPlus)}
              className="w-full mt-3 font-bold shadow-lg shadow-sky-500/20"
            >
              {showForgot
                ? 'Gửi Link Khôi Phục Mật Khẩu'
                : (isLogin ? 'Đăng Nhập Vào Hệ Thống' : 'Hoàn Tất Đăng Ký Tài Khoản')}
            </Button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default AuthPage;

