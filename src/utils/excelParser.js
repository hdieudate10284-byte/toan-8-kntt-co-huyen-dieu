import * as XLSX from 'xlsx';

/**
 * Đọc file Excel / CSV danh sách học sinh
 * File có thể có các cột: Họ và tên (hoặc Name), Email, Số điện thoại (Phone)
 */
export async function parseStudentExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData || jsonData.length < 2) {
          throw new Error('File Excel rỗng hoặc không có dữ liệu hàng!');
        }

        // Tìm chỉ số các cột
        const headers = jsonData[0].map(h => String(h || '').trim().toLowerCase());
        const nameIdx = headers.findIndex(h => h.includes('tên') || h.includes('name') || h.includes('họ'));
        const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('thư'));
        const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('điện thoại') || h.includes('sđt'));

        const students = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          const fullName = nameIdx !== -1 && row[nameIdx] ? String(row[nameIdx]).trim() : `Học sinh ${i}`;
          const email = emailIdx !== -1 && row[emailIdx] ? String(row[emailIdx]).trim() : `hocsinh${i}@nguyenhue.edu.vn`;
          const phone = phoneIdx !== -1 && row[phoneIdx] ? String(row[phoneIdx]).trim() : '';

          if (fullName || email) {
            students.push({
              fullName,
              email,
              phone,
              rowNumber: i + 1
            });
          }
        }

        resolve(students);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Xuất bảng điểm lớp học ra file Excel
 */
export function exportGradebookToExcel(className, studentsWithProgress, assignmentTitle = 'Bảng điểm') {
  const exportData = studentsWithProgress.map((item, index) => ({
    'STT': index + 1,
    'Họ và tên học sinh': item.student_name || item.student?.full_name || 'Học sinh',
    'Email': item.student_email || item.student?.email || '',
    'Trạng thái': item.status === 'completed' ? 'Đã hoàn thành' : (item.status === 'in_progress' ? 'Đang làm' : 'Chưa nộp'),
    'Điểm số': item.score ?? 0,
    'Thời gian làm bài (giây)': item.completion_time_seconds ?? 0,
    'Ngày nộp': item.completed_at ? new Date(item.completed_at).toLocaleString('vi-VN') : 'Chưa'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảng điểm');

  // Đặt tên file
  const safeName = className.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
  const fileName = `BangDiem_${safeName}_${Date.now()}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}
