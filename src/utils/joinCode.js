/**
 * Tạo mã mời vào lớp gồm 6 ký tự viết hoa và số (ví dụ: TOAN8A, M8H92K)
 */
export function generateJoinCode(prefix = 'T8') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = prefix;
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
