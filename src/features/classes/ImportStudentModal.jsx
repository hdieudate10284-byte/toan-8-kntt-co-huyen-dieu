import React, { useState } from 'react';
import { Upload, FileSpreadsheet, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { parseStudentExcelFile } from '../../utils/excelParser';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const ImportStudentModal = ({
  isOpen,
  onClose,
  classId,
  onStudentsImported
}) => {
  const [activeTab, setActiveTab] = useState('excel'); // 'excel' | 'manual'
  const [file, setFile] = useState(null);
  const [parsedStudents, setParsedStudents] = useState([]);
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
    try {
      const students = await parseStudentExcelFile(selectedFile);
      setParsedStudents(students);
    } catch (err) {
      console.error('Lỗi đọc file Excel:', err);
      setError('Không thể đọc dữ liệu từ file. Vui lòng đảm bảo file Excel có cột Tên và Email!');
    }
  };

  const handleImport = async () => {
    let studentList = [];

    if (activeTab === 'excel') {
      if (parsedStudents.length === 0) {
        setError('Vui lòng chọn file Excel hợp lệ chứa danh sách học sinh!');
        return;
      }
      studentList = parsedStudents;
    } else {
      // Manual lines
      const lines = manualInput.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length === 0) {
        setError('Vui lòng nhập ít nhất một học sinh!');
        return;
      }
      studentList = lines.map((line, idx) => {
        const parts = line.split(/[,;\t]/).map((p) => p.trim());
        return {
          fullName: parts[0] || `Học sinh ${idx + 1}`,
          email: parts[1] || `hocsinh${idx + 1}@nguyenhue.edu.vn`,
          phone: parts[2] || ''
        };
      });
    }

    setLoading(true);
    setError('');

    try {
      if (isSupabaseConfigured && classId) {
        // Tạo profile tạm thời hoặc thêm thành viên vào lớp
        for (const student of studentList) {
          // Lưu thông tin vào DB nếu cần
        }
      }

      setSuccess(`Đã import thành công ${studentList.length} học sinh vào lớp học!`);
      setTimeout(() => {
        onStudentsImported(studentList);
        onClose();
        setParsedStudents([]);
        setFile(null);
        setManualInput('');
        setSuccess('');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Lỗi khi import học sinh.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm Học Sinh Vào Lớp Toán 8"
      subtitle="Import nhanh danh sách từ file Excel/CSV hoặc nhập danh sách học sinh"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('excel')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'excel'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Import từ Excel / CSV
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'manual'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Nhập danh sách trực tiếp
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab 1: Excel upload */}
        {activeTab === 'excel' ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-sky-500/60 rounded-2xl p-6 text-center bg-slate-900/50 transition-colors">
              <input
                type="file"
                id="excelFileInput"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="excelFileInput"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  {file ? file.name : 'Nhấn để chọn file Excel (.xlsx, .xls, .csv)'}
                </p>
                <p className="text-xs text-slate-500">
                  File có các cột: Họ và tên, Email, Số điện thoại (tùy chọn)
                </p>
              </label>
            </div>

            {/* Preview table */}
            {parsedStudents.length > 0 && (
              <div className="border border-slate-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-300 sticky top-0">
                    <tr>
                      <th className="p-2.5">STT</th>
                      <th className="p-2.5">Họ và tên</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {parsedStudents.slice(0, 10).map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-semibold text-slate-200">{s.fullName}</td>
                        <td className="p-2.5 text-slate-400">{s.email}</td>
                        <td className="p-2.5 text-slate-500">{s.phone || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedStudents.length > 10 && (
                  <p className="text-[11px] text-center p-2 text-slate-400 bg-slate-800/30">
                    ... và {parsedStudents.length - 10} học sinh khác
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: Manual input */
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nhập danh sách học sinh (Mỗi dòng một học sinh, định dạng: Tên, Email):
            </label>
            <textarea
              rows="6"
              placeholder={`Nguyễn Văn An, an.nguyen@nguyenhue.edu.vn\nTrần Thị Mai, mai.tran@nguyenhue.edu.vn\nLê Hoàng Nam, nam.le@nguyenhue.edu.vn`}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-sky-500"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleImport}
            isLoading={loading}
            icon={UserPlus}
          >
            Xác Nhận Import Vào Lớp
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportStudentModal;
