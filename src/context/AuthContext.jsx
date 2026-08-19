import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TEACHER_INFO } from '../data/math8Curriculum';

const AuthContext = createContext({});

// Tài khoản hồ sơ mẫu chuẩn cho trải nghiệm nhanh (Fallback Demo)
const DEMO_PROFILES = {
  teacher: {
    id: 'demo-teacher-id',
    email: 'huyen.dieu@nguyenhue.edu.vn',
    full_name: TEACHER_INFO.name,
    role: 'teacher',
    school_name: 'THCS Nguyễn Huệ',
    avatar_url: TEACHER_INFO.avatar
  },
  student: {
    id: 'demo-student-id',
    email: 'nguyen.van.an@nguyenhue.edu.vn',
    full_name: 'Nguyễn Văn An (8A1)',
    role: 'student',
    school_name: 'THCS Nguyễn Huệ',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
  },
  admin: {
    id: 'demo-admin-id',
    email: 'admin@nguyenhue.edu.vn',
    full_name: 'Quản trị viên Hệ thống THCS Nguyễn Huệ',
    role: 'admin',
    school_name: 'THCS Nguyễn Huệ',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
  }
};

/**
 * Dịch thông báo lỗi từ Supabase Auth sang Tiếng Việt dễ hiểu
 */
const translateAuthError = (message = '') => {
  const msg = String(message).toLowerCase();
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!';
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'Email này đã được đăng ký tài khoản. Vui lòng chuyển sang tab Đăng nhập!';
  }
  if (msg.includes('password should be at least') || msg.includes('weak password')) {
    return 'Mật khẩu phải có tối thiểu 6 ký tự!';
  }
  if (msg.includes('unable to validate email') || msg.includes('invalid email')) {
    return 'Địa chỉ email không hợp lệ. Vui lòng nhập đúng định dạng (ví dụ: ten@gmail.com)!';
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Bạn đã thử quá nhiều lần liên tiếp. Vui lòng đợi 1-2 phút rồi thử lại!';
  }
  if (msg.includes('database error saving new user')) {
    return 'Đang lưu tài khoản... Vui lòng thử đăng nhập lại với email vừa tạo!';
  }
  return message || 'Đã có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại!';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => {
    const savedRole = localStorage.getItem('toan8_current_role') || 'teacher';
    return DEMO_PROFILES[savedRole] || DEMO_PROFILES.teacher;
  });
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  // Lấy thông tin Profile từ bảng profiles trong Supabase
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Lỗi khi tải profile từ Supabase:', err);
      return null;
    }
  };

  // Đồng bộ hoặc tạo mới profile cho user
  const syncOrCreateProfile = async (authUser, extraMeta = {}) => {
    if (!authUser?.id) return null;

    try {
      let existing = await fetchProfile(authUser.id);
      if (existing) {
        setProfile(existing);
        localStorage.setItem('toan8_current_role', existing.role);
        return existing;
      }

      // Tạo mới profile nếu chưa có
      const role = extraMeta.role || authUser.user_metadata?.role || 'student';
      const fullName = extraMeta.fullName || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Học sinh';
      const schoolName = extraMeta.schoolName || authUser.user_metadata?.school_name || 'THCS Nguyễn Huệ';

      const newProf = {
        id: authUser.id,
        email: authUser.email,
        full_name: fullName,
        role: role,
        school_name: schoolName,
        avatar_url: authUser.user_metadata?.avatar_url || ''
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(newProf)
        .select()
        .maybeSingle();

      const finalProf = data || newProf;
      setProfile(finalProf);
      localStorage.setItem('toan8_current_role', finalProf.role);
      return finalProf;
    } catch (err) {
      console.warn('Lỗi đồng bộ profile:', err);
      const fallbackProf = {
        id: authUser.id,
        email: authUser.email,
        full_name: extraMeta.fullName || authUser.email?.split('@')[0],
        role: extraMeta.role || 'student',
        school_name: 'THCS Nguyễn Huệ'
      };
      setProfile(fallbackProf);
      return fallbackProf;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        if (isSupabaseConfigured) {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (session?.user && !error) {
            setUser(session.user);
            await syncOrCreateProfile(session.user);
            setIsDemoMode(false);
          } else {
            setIsDemoMode(false);
          }
        } else {
          setIsDemoMode(true);
        }
      } catch (err) {
        console.warn('Lỗi khởi tạo Auth Supabase:', err);
        setIsDemoMode(true);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Lắng nghe thay đổi trạng thái đăng nhập từ Supabase
    let subscription = null;
    try {
      if (isSupabaseConfigured) {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            await syncOrCreateProfile(session.user);
            setIsDemoMode(false);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            const savedRole = localStorage.getItem('toan8_current_role') || 'student';
            setProfile(DEMO_PROFILES[savedRole] || DEMO_PROFILES.student);
          }
        });
        subscription = data?.subscription;
      }
    } catch (e) {
      console.warn('Auth state subscription error:', e);
    }

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  // Đăng nhập Email + Password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (error) {
          throw new Error(translateAuthError(error.message));
        }

        if (data?.user) {
          setUser(data.user);
          const userProf = await syncOrCreateProfile(data.user);
          setIsDemoMode(false);
          return { success: true, data, profile: userProf };
        }
      }

      // Fallback demo mode nếu Supabase không phản hồi
      let matchedRole = 'student';
      if (email.toLowerCase().includes('dieu') || email.toLowerCase().includes('teacher')) {
        matchedRole = 'teacher';
      } else if (email.toLowerCase().includes('admin')) {
        matchedRole = 'admin';
      }
      const demoProf = DEMO_PROFILES[matchedRole];
      setProfile(demoProf);
      setUser({ id: demoProf.id, email: demoProf.email });
      localStorage.setItem('toan8_current_role', matchedRole);
      return { success: true, data: { user: demoProf }, profile: demoProf };
    } finally {
      setLoading(false);
    }
  };

  // Đăng ký tài khoản kèm Phân quyền Role
  const signUp = async (email, password, { fullName, role = 'student', schoolName = 'THCS Nguyễn Huệ' }) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
              role: role,
              school_name: schoolName.trim()
            }
          }
        });

        if (error) {
          throw new Error(translateAuthError(error.message));
        }

        if (data?.user) {
          setUser(data.user);
          const userProf = await syncOrCreateProfile(data.user, { fullName, role, schoolName });
          setIsDemoMode(false);
          return { success: true, data, profile: userProf };
        }
      }

      // Fallback demo mode
      const newDemoUser = {
        id: `demo-${Date.now()}`,
        email: email.trim(),
        full_name: fullName.trim(),
        role,
        school_name: schoolName.trim(),
        avatar_url: ''
      };
      setProfile(newDemoUser);
      setUser({ id: newDemoUser.id, email: email.trim() });
      localStorage.setItem('toan8_current_role', role);
      return { success: true, data: { user: newDemoUser }, profile: newDemoUser };
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const signOut = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Lỗi đăng xuất:', e);
    } finally {
      setUser(null);
      setProfile(DEMO_PROFILES.student);
      localStorage.removeItem('toan8_current_role');
      setLoading(false);
    }
  };

  // Quên mật khẩu
  const resetPassword = async (email) => {
    if (!email) throw new Error('Vui lòng nhập địa chỉ email của bạn!');
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + '/auth?mode=reset'
      });
      if (error) throw new Error(translateAuthError(error.message));
      return { success: true, data };
    }
    return { success: true };
  };

  // Đổi nhanh vai trò xem trước (Demo Role Switcher)
  const switchDemoRole = (targetRole) => {
    if (DEMO_PROFILES[targetRole]) {
      setProfile(DEMO_PROFILES[targetRole]);
      setUser({ id: DEMO_PROFILES[targetRole].id, email: DEMO_PROFILES[targetRole].email });
      localStorage.setItem('toan8_current_role', targetRole);
    }
  };

  const role = profile?.role || 'student';
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher' || role === 'admin';
  const isStudent = role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isTeacher,
        isStudent,
        loading,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        resetPassword,
        switchDemoRole,
        refreshProfile: () => user?.id && fetchProfile(user.id).then((p) => p && setProfile(p))
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

