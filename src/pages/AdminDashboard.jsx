import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, BookOpen, Database, UserCheck, Trash2, Key, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getRoleBadge } from '../utils/formatters';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [materialCount, setMaterialCount] = useState(13);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (users) setUsersList(users);

        const { data: classes } = await supabase.from('classes').select('*, profiles(full_name)');
        if (classes) setClassList(classes);

        const { count } = await supabase.from('materials').select('*', { count: 'exact', head: true });
        if (count !== null) setMaterialCount(count);
      } else {
        // Mock fallback
        setUsersList([
          { id: '1', full_name: 'Cô Nguyễn Thị Huyền Diệu', email: 'huyen.dieu@nguyenhue.edu.vn', role: 'teacher', school_name: 'THCS Nguyễn Huệ' },
          { id: '2', full_name: 'Nguyễn Văn An', email: 'nguyen.van.an@nguyenhue.edu.vn', role: 'student', school_name: 'THCS Nguyễn Huệ' },
          { id: '3', full_name: 'Trần Mai Anh', email: 'mai.anh@nguyenhue.edu.vn', role: 'student', school_name: 'THCS Nguyễn Huệ' },
          { id: '4', full_name: 'Quản trị viên Hệ thống', email: 'admin@nguyenhue.edu.vn', role: 'admin', school_name: 'THCS Nguyễn Huệ' }
        ]);

        setClassList([
          { id: 'c1', name: 'Lớp Toán 8A1', code: 'T8A1HD', grade: '8', teacher_name: 'Cô Nguyễn Thị Huyền Diệu' },
          { id: 'c2', name: 'Lớp Toán 8A2', code: 'T8A2HD', grade: '8', teacher_name: 'Cô Nguyễn Thị Huyền Diệu' }
        ]);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu Admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId);
    try {
      if (isSupabaseConfigured) {
        await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      }
      setUsersList(usersList.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Lỗi đổi quyền:', err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border-rose-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-rose-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-100">
                  Trung Tâm Quản Trị Hệ Thống
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Toán 8 KNTT • THCS Nguyễn Huệ • Quản lý Phân quyền RBAC & Cơ sở Dữ liệu
              </p>
            </div>
          </div>

          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={loadAdminData}>
            Làm mới dữ liệu
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Tổng người dùng"
          value={usersList.length}
          subtitle="Tài khoản trên hệ thống"
          icon={Users}
          color="rose"
        />
        <StatCard
          title="Tổng số lớp học"
          value={classList.length}
          subtitle="Khối 8 THCS Nguyễn Huệ"
          icon={BookOpen}
          color="sky"
        />
        <StatCard
          title="Học liệu & Game"
          value={materialCount}
          subtitle="Chương 1 & Chương 2"
          icon={Database}
          color="teal"
        />
      </div>

      {/* User Management Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-sky-400" />
          Danh Sách Người Dùng & Phân Quyền (RBAC)
        </h3>

        {loading ? (
          <LoadingSpinner text="Đang tải danh sách người dùng..." />
        ) : (
          <div className="border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Họ và tên</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Đơn vị</th>
                    <th className="py-3.5 px-4">Vai trò hiện tại</th>
                    <th className="py-3.5 px-4 text-right">Đổi vai trò</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {usersList.map((u) => {
                    const badge = getRoleBadge(u.role);
                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-bold">{u.full_name}</td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-400">{u.email}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">{u.school_name || 'THCS Nguyễn Huệ'}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={updatingUserId === u.id}
                            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                          >
                            <option value="student">Học sinh</option>
                            <option value="teacher">Giáo viên</option>
                            <option value="admin">Quản trị viên</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
