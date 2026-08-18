/**
 * Định dạng ngày giờ tiếng Việt
 */
export function formatDate(dateString) {
  if (!dateString) return 'Chưa xác định';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Định dạng thời gian giây sang định dạng mm:ss
 */
export function formatSecondsToTime(seconds) {
  if (!seconds || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Định dạng điểm số
 */
export function formatScore(score) {
  if (score === null || score === undefined) return '0.0';
  return Number(score).toFixed(1);
}

/**
 * Chuyển đổi mã vai trò sang tiếng Việt
 */
export function getRoleBadge(role) {
  switch (role) {
    case 'admin':
      return { label: 'Quản trị viên', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    case 'teacher':
      return { label: 'Giáo viên', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    case 'student':
    default:
      return { label: 'Học sinh', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
  }
}
