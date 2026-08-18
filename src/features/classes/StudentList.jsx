import React from 'react';
import { UserCheck, Trash2, Mail, Phone } from 'lucide-react';
import Badge from '../../components/common/Badge';

export const StudentList = ({
  students = [],
  isTeacher = false,
  onRemoveStudent
}) => {
  if (!students || students.length === 0) {
    return (
      <div className="p-8 text-center glass-card border-dashed text-slate-400 text-sm">
        Chưa có học sinh nào tham gia lớp này. Thầy/Cô hãy gửi Mã lớp hoặc Import file Excel nhé!
      </div>
    );
  }

  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden glass-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">STT</th>
              <th className="py-3.5 px-4 font-semibold">Học sinh</th>
              <th className="py-3.5 px-4 font-semibold">Email</th>
              <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
              {isTeacher && <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-200">
            {students.map((st, index) => {
              const studentName = st.full_name || st.fullName || st.student?.full_name || `Học sinh ${index + 1}`;
              const studentEmail = st.email || st.student?.email || 'Chưa cập nhật';
              const isJoined = st.status === 'active' || !st.status;

              return (
                <tr key={st.id || index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                    {(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="py-3.5 px-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-teal-600 flex items-center justify-center font-bold text-xs text-white">
                      {studentName.charAt(0)}
                    </div>
                    <span>{studentName}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 opacity-60" />
                      {studentEmail}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={isJoined ? 'emerald' : 'amber'}>
                      {isJoined ? 'Đang học' : 'Chờ duyệt'}
                    </Badge>
                  </td>
                  {isTeacher && (
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onRemoveStudent && onRemoveStudent(st.id || index)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Xóa khỏi lớp"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
