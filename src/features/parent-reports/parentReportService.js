import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { TEACHER_INFO } from '../../data/math8Curriculum';
import { formatScore } from '../../utils/formatters';

/**
 * Tạo lời nhận xét sư phạm tự động của Cô Huyền Diệu dựa trên điểm số
 */
export function generateTeacherComment(studentName, averageScore, completedRate) {
  if (averageScore >= 90) {
    return `Khen ngợi em ${studentName} tuần này học tập rất xuất sắc! Em nắm vững toàn bộ 7 Hằng đẳng thức và các phép toán Đa thức nhiều biến. Đề nghị phụ huynh tiếp tục động viên để em duy trì phong độ đứng đầu lớp!`;
  } else if (averageScore >= 75) {
    return `Em ${studentName} có tinh thần tự giác học tập tốt, hoàn thành đầy đủ bài tập và minigame được giao. Cần chú ý thêm một số bài toán biến đổi nâng cao ở Chương 2 để đạt điểm tối đa.`;
  } else if (averageScore >= 50) {
    return `Em ${studentName} đã nắm được kiến thức cơ bản nhưng cần dành thêm thời gian luyện tập nhận biết đơn thức đồng dạng và quy tắc đổi dấu khi nhân chia đa thức. Cô sẽ kèm thêm cho em trong tuần tới.`;
  } else {
    return `Nhắc nhở em ${studentName} tuần này chưa hoàn thành đủ bài tập về nhà. Kính nhờ Quý Phụ huynh phối hợp cùng cô nhắc nhở em vào góc Game Toán 8 để ôn luyện lại kiến thức hằng đẳng thức.`;
  }
}

/**
 * Định dạng mẫu tin nhắn Zalo chuẩn đẹp gửi Phụ huynh
 */
export function formatZaloMessage(reportData) {
  const { studentName, className, week, avgScore, completedCount, totalCount, points, badges, comment, shareUrl } = reportData;

  return `🏫 [TRƯỜNG THCS NGUYỄN HUỆ]
📚 BÁO CÁO HỌC TẬP TOÁN 8 (KNTT) - ${week}
👩‍🏫 Giáo viên phụ trách: ${TEACHER_INFO.name}

Kính gửi Quý Phụ huynh của em: *${studentName}* (${className})

📊 KẾT QUẢ RÈN LUYỆN TRONG TUẦN:
✅ Bài tập hoàn thành: ${completedCount}/${totalCount} bài
🎯 Điểm trung bình: ${formatScore(avgScore)}/100
⚡ Điểm đấu trường Game: ${points} điểm
🏆 Danh hiệu đạt được: ${badges && badges.length > 0 ? badges.join(', ') : 'Chiến binh chăm chỉ'}

💡 LỜI NHẬN XÉT CỦA CÔ HUYỀN DIỆU:
"${comment}"

🔗 Xem chi tiết bài làm và bảng điểm của học sinh tại:
${shareUrl || window.location.origin + '/parent-report/' + (reportData.id || 'preview')}

Trân trọng cảm ơn Quý Phụ huynh đã luôn đồng hành cùng nhà trường! ❤️`;
}

/**
 * Gửi và lưu báo cáo vào Database
 */
export async function sendParentReport(reportData) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('parent_reports')
        .insert([
          {
            student_id: reportData.studentId,
            class_id: reportData.classId,
            teacher_id: reportData.teacherId,
            report_week: reportData.week || 'Tuần 1 - Học kỳ I',
            parent_email: reportData.parentEmail,
            parent_phone: reportData.parentPhone,
            completed_assignments_count: reportData.completedCount,
            total_assignments_count: reportData.totalCount,
            average_score: reportData.avgScore,
            game_points: reportData.points,
            badges_earned: reportData.badges,
            teacher_comment: reportData.comment,
            channel: reportData.channel || 'zalo',
            status: 'sent'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.warn('Lỗi lưu báo cáo vào Supabase:', err);
    }
  }

  return { success: true, data: { ...reportData, id: `rep-${Date.now()}` } };
}
