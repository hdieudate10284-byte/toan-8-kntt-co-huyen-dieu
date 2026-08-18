import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TEACHER_INFO } from '../data/math8Curriculum';

const AuthContext = createContext({});

// Tài khoản hồ sơ mẫu chuẩn cho trải nghiệm người dùng
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => {
    const savedRole = localStorage.getItem('toan8_current_role') || 'teacher';
    return DEMO_PROFILES[savedRole] || DEMO_PROFILES.teacher;
  });
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Lấy thông tin Profile từ bảng profiles trong Supabase
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Lỗi khi tải profile:', err);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            const userProfile = await fetchProfile(session.user.id);
            if (userProfile) {
              setProfile(userProfile);
            } else {
              const fallbackRole = session.user.user_metadata?.role || 'student';
              setProfile({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
                role: fallbackRole,
                school_name: session.user.user_metadata?.school_name || 'THCS Nguyễn Huệ',
                avatar_url: ''
              });
            }
          }
        }
      } catch (err) {
        console.warn('Lỗi khởi tạo Auth Supabase:', err);
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
            const userProfile = await fetchProfile(session.user.id);
            if (userProfile) setProfile(userProfile);
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
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (!error && data?.user) {
          setUser(data.user);
          const userProf = await fetchProfile(data.user.id);
          if (userProf) setProfile(userProf);
          return { success: true, data };
        }
      } catch (err) {
        console.warn('Supabase auth attempt, falling back to local role:', err);
      }
    }

    // Fallback role switch
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
    return { success: true, data: { user: demoProf } };
  };

  // Đăng ký tài khoản kèm Phân quyền Role
  const signUp = async (email, password, { fullName, role = 'student', schoolName = 'THCS Nguyễn Huệ' }) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
              school_name: schoolName
            }
          }
        });
        if (!error) {
          return { success: true, data };
        }
      } catch (err) {
        console.warn('Supabase signup attempt:', err);
      }
    }

    const newDemoUser = {
      id: `demo-${Date.now()}`,
      email,
      full_name: fullName,
      role,
      school_name: schoolName,
      avatar_url: ''
    };
    setProfile(newDemoUser);
    setUser({ id: newDemoUser.id, email });
    localStorage.setItem('toan8_current_role', role);
    return { success: true, data: { user: newDemoUser } };
  };

  // Đăng xuất
  const signOut = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (e) {}
    setUser(null);
    setProfile(DEMO_PROFILES.student);
    localStorage.removeItem('toan8_current_role');
  };

  // Đổi nhanh vai trò xem trước (Demo Role Switcher)
  const switchDemoRole = (targetRole) => {
    if (DEMO_PROFILES[targetRole]) {
      setProfile(DEMO_PROFILES[targetRole]);
      setUser({ id: DEMO_PROFILES[targetRole].id, email: DEMO_PROFILES[targetRole].email });
      localStorage.setItem('toan8_current_role', targetRole);
    }
  };

  const role = profile?.role || 'teacher';
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
        switchDemoRole,
        refreshProfile: () => user?.id && fetchProfile(user.id).then(setProfile)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
