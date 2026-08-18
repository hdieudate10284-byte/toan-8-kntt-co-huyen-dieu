import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Gamepad2, 
  GraduationCap, 
  Users, 
  BarChart3, 
  Sparkles, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  UserCheck, 
  ShieldAlert,
  ChevronDown,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRoleBadge } from '../../utils/formatters';
import Button from '../common/Button';

export const Navbar = () => {
  const { user, profile, role, signOut, switchDemoRole, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleInfo = getRoleBadge(role);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/', icon: GraduationCap },
    { name: 'Cẩm nang Toán 8', path: '/curriculum', icon: BookOpen },
    { name: 'Kho Game & Học liệu', path: '/games', icon: Gamepad2 },
    { name: 'Trợ giảng AI', path: '/ai-tutor', icon: Sparkles, isHighlight: true },
    { 
      name: role === 'admin' ? 'Bảng Quản trị' : (role === 'teacher' ? 'Lớp học của Cô' : 'Góc Học sinh'), 
      path: role === 'admin' ? '/admin' : (role === 'teacher' ? '/teacher' : '/student'), 
      icon: Users 
    },
    { name: 'Thống kê & BXH', path: '/analytics', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-40 glass-header">
      {/* Thông báo chế độ thử nghiệm nếu chưa cấu hình Supabase */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-600/90 via-yellow-600/90 to-amber-700/90 text-slate-950 text-xs py-1.5 px-4 text-center font-semibold flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
          <span>Hệ thống đang chạy chế độ Thử nghiệm Nhanh (Demo Mode) cho trường THCS Nguyễn Huệ. Thầy/Cô có thể đổi vai trò trực tiếp trên thanh điều hướng!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & School Brand */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative flex items-center justify-center">
              <img
                src="/images/logo-thcs-nguyen-hue.png"
                alt="Logo Trường THCS Nguyễn Huệ Đà Nẵng"
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-contain bg-white p-1 border-2 border-sky-400 shadow-xl shadow-sky-500/30 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-teal-400 rounded-full border-2 border-slate-950 animate-pulse" title="Trực tuyến" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-slate-100 tracking-tight">TOÁN 8 KNTT</span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-sky-500/30 to-blue-500/30 text-sky-200 border border-sky-400/50 shadow-sm">
                  THCS Nguyễn Huệ
                </span>
              </div>
              <p className="text-xs text-amber-300/90 font-medium">Cô Nguyễn Thị Huyền Diệu • Đà Nẵng</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    link.isHighlight
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/25'
                      : isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.isHighlight ? 'text-amber-400 animate-pulse' : ''}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Actions & Role Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${roleInfo.color}`}
                title="Nhấn để đổi vai trò xem thử nghiệm"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{roleInfo.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 glass-card bg-slate-900 border-slate-700 p-2 shadow-2xl z-50 animate-fadeIn"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <p className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Đổi vai trò trải nghiệm:
                  </p>
                  <button
                    onClick={() => { switchDemoRole('teacher'); navigate('/teacher'); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-amber-300 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>👩‍🏫 Giáo viên (Cô Diệu)</span>
                    {role === 'teacher' && <span className="text-teal-400">✓</span>}
                  </button>
                  <button
                    onClick={() => { switchDemoRole('student'); navigate('/student'); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-sky-300 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>🎒 Học sinh (Nguyễn Văn An)</span>
                    {role === 'student' && <span className="text-teal-400">✓</span>}
                  </button>
                  <button
                    onClick={() => { switchDemoRole('admin'); navigate('/admin'); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>🛡️ Quản trị viên (Admin)</span>
                    {role === 'admin' && <span className="text-teal-400">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar / Login */}
            {profile ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-slate-200">{profile.full_name}</p>
                  <p className="text-[10px] text-slate-400">{profile.email}</p>
                </div>
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className={`w-10 h-10 rounded-full object-cover object-top border-2 shadow-md ${
                      role === 'teacher' ? 'border-amber-400 shadow-amber-500/30 ring-2 ring-amber-400/20' : 'border-sky-400/60 shadow-sky-500/20'
                    }`}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center font-bold text-sm text-white border border-sky-400/40">
                    {profile.full_name?.charAt(0) || 'U'}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  title="Đăng xuất"
                  className="p-2 text-slate-400 hover:text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={LogIn}
                onClick={() => navigate('/auth')}
              >
                Đăng nhập
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl p-4 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
              <span className="text-xs text-slate-400">{profile?.full_name}</span>
            </div>
            {profile ? (
              <button
                onClick={handleSignOut}
                className="text-xs text-rose-400 flex items-center gap-1 hover:underline"
              >
                <LogOut className="w-3.5 h-3.5" /> Đăng xuất
              </button>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm">Đăng nhập</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
