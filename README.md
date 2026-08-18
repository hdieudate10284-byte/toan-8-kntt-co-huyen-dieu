# 📐 HỆ THỐNG TOÁN 8 (KNTT) - CÔ NGUYỄN THỊ HUYỀN DIỆU (THCS NGUYỄN HUỆ)
> Hệ thống Web App Quản lý Giáo dục, Kho Học liệu Số & Đấu trường Game Tương tác chuẩn Bộ sách Kết Nối Tri Thức Với Cuộc Sống.

---

## 🌟 TÍNH NĂNG NỔI BẬT

1. **Xác thực & Phân quyền (RBAC)**: Hỗ trợ 3 vai trò (Admin, Teacher - Cô Huyền Diệu, Student). Tự động tạo hồ sơ profile qua Trigger SQL.
2. **Quản lý Lớp học & Mã Mời**: Tạo lớp học, sinh mã gia nhập (Join Code) 6 ký tự ngẫu nhiên, import danh sách học sinh từ file Excel/CSV.
3. **Kho Học liệu 2 Chương Toán 8 KNTT**:
   - **Chương 1: Đa thức nhiều biến** (Bài 1 -> Bài 5 + Ôn tập chương 1).
   - **Chương 2: 7 Hằng đẳng thức đáng nhớ & Phân tích đa thức thành nhân tử** (Bài 6 -> Bài 9 + Ôn tập chương 2).
   - Hỗ trợ xem tài liệu PDF, video bài giảng, công thức KaTeX chuẩn mực.
4. **Đấu Trường Game Tương Tác**:
   - ⚡ *Đấu trường 7 Hằng đẳng thức* (Phản xạ công thức, tính điểm combo, pháo hoa ăn mừng).
   - 🧩 *Săn tìm Đơn thức đồng dạng* (Ghép cặp thẻ đại số thu gọn đa thức).
   - 🏆 *Vòng quay Tri thức Toán 8* (Trắc nghiệm giải đố kèm lời giải chi tiết của Cô Diệu).
   - 🎯 *Nhúng iFrame Wordwall, Quizizz, Kahoot* và Game HTML5 đóng gói.
5. **Giao Bài Tập & Báo Cáo Tiến Độ (Analytics)**:
   - Giao bài tập kèm hạn chót (Deadline) và thang điểm.
   - Chấm điểm tự động và ghi nhận thời gian làm bài của học sinh.
   - Xuất file Excel bảng điểm của từng lớp học.
   - Bảng vàng vinh danh học sinh xuất sắc tuần.

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY (QUICK START)

### 1. Cài đặt và Chạy thử nghiệm Local:
```bash
# Cài đặt dependencies
npm install

# Khởi chạy dev server (Port 3000)
npm run dev
```

### 2. Thiết lập Database Supabase:
1. Mở dự án Supabase của bạn tại [https://supabase.com](https://supabase.com).
2. Vào mục **SQL Editor**.
3. Sao chép toàn bộ nội dung file `schema.sql` (hoặc `supabase/schema.sql`) và nhấn **Run** (1-Click migration).
4. Vào mục **Project Settings -> API** để lấy `Project URL` và `anon key`.
5. Tạo file `.env` từ `.env.example` và điền:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Deploy lên Vercel:
- File `vercel.json` đã được cấu hình sẵn điều hướng SPA.
- Chỉ cần kết nối repository GitHub với Vercel và thêm 2 biến môi trường trên Vercel Dashboard.
