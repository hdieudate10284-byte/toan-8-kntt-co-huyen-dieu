-- ==============================================================================
-- HỆ THỐNG QUẢN LÝ GIÁO DỤC, KHO HỌC LIỆU & GAME TOÁN 8 KNTT
-- GIÁO VIÊN: NGUYỄN THỊ HUYỀN DIỆU - TRƯỜNG THCS NGUYỄN HUỆ
-- CƠ SỞ DỮ LIỆU SUPABASE POSTGRESQL + ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. KÍCH HOẠT EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TẠO TYPE ENUM
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE material_type AS ENUM ('document', 'video', 'game_iframe', 'game_html5');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. BẢNG PROFILES (HỒ SƠ NGƯỜI DÙNG LIÊN KẾT VỚI AUTH.USERS)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    school_name TEXT DEFAULT 'THCS Nguyễn Huệ',
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. BẢNG CLASSES (LỚP HỌC TOÁN 8)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    grade VARCHAR(10) NOT NULL DEFAULT '8',
    subject TEXT NOT NULL DEFAULT 'Toán học (KNTT)',
    description TEXT,
    code VARCHAR(12) UNIQUE NOT NULL, -- Mã gia nhập lớp (Join Code)
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) DEFAULT '2025 - 2026',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. BẢNG CLASS_MEMBERS (DANH SÁCH HỌC SINH TRONG LỚP)
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status VARCHAR(20) DEFAULT 'active',
    CONSTRAINT unique_class_student UNIQUE (class_id, student_id)
);

-- 6. BẢNG MATERIALS (KHO HỌC LIỆU & GAME TOÁN 8)
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    chapter INT NOT NULL CHECK (chapter IN (1, 2)), -- Chương 1 hoặc Chương 2 Toán 8 KNTT
    lesson_number INT NOT NULL, -- Bài 1 đến 5 (Chương 1) hoặc Bài 6 đến 9 (Chương 2), 0 là Ôn tập
    lesson_name TEXT NOT NULL,
    type material_type NOT NULL DEFAULT 'document',
    file_url TEXT, -- Link file lưu trên Supabase Storage
    embed_url TEXT, -- Link iFrame (Wordwall, Quizizz, Kahoot...)
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_public BOOLEAN NOT NULL DEFAULT true,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. BẢNG ASSIGNMENTS (GIAO BÀI TẬP / GAME CHO LỚP)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    due_date TIMESTAMPTZ,
    max_score NUMERIC(5, 2) DEFAULT 100.0,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. BẢNG STUDENT_PROGRESS (TIẾN ĐỘ, ĐIỂM SỐ & THỜI GIAN HOÀN THÀNH)
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
    status progress_status NOT NULL DEFAULT 'not_started',
    score NUMERIC(5, 2) DEFAULT 0.0,
    completion_time_seconds INT DEFAULT 0,
    answers_data JSONB DEFAULT '{}'::JSONB,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_assignment_student UNIQUE (assignment_id, student_id)
);

-- 9. TẠO INDEXES TỐI ƯU TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_code ON public.classes(code);
CREATE INDEX IF NOT EXISTS idx_class_members_class_id ON public.class_members(class_id);
CREATE INDEX IF NOT EXISTS idx_class_members_student_id ON public.class_members(student_id);
CREATE INDEX IF NOT EXISTS idx_materials_chapter ON public.materials(chapter, lesson_number);
CREATE INDEX IF NOT EXISTS idx_materials_type ON public.materials(type);
CREATE INDEX IF NOT EXISTS idx_assignments_class_id ON public.assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON public.student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_assignment_id ON public.student_progress(assignment_id);

-- 10. HÀM & TRIGGER TỰ ĐỘNG TẠO HỒ SƠ (PROFILES) KHI USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role user_role;
    user_fullname TEXT;
    user_school TEXT;
BEGIN
    -- Lấy role từ user_metadata gửi từ Client, mặc định là 'student'
    IF new.raw_user_meta_data->>'role' = 'teacher' THEN
        default_role := 'teacher'::user_role;
    ELSIF new.raw_user_meta_data->>'role' = 'admin' THEN
        default_role := 'admin'::user_role;
    ELSE
        default_role := 'student'::user_role;
    END IF;

    user_fullname := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
    user_school := COALESCE(new.raw_user_meta_data->>'school_name', 'THCS Nguyễn Huệ');

    INSERT INTO public.profiles (id, email, full_name, role, avatar_url, school_name)
    VALUES (
        new.id,
        new.email,
        user_fullname,
        default_role,
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        user_school
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger vào bảng auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. HÀM TỰ ĐỘNG CẬP NHẬT UPDATED_AT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_classes_updated_at ON public.classes;
CREATE TRIGGER set_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_materials_updated_at ON public.materials;
CREATE TRIGGER set_materials_updated_at BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 12. BẬT ROW LEVEL SECURITY (RLS) TRÊN TẤT CẢ CÁC BẢNG
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- 13. POLICIES CHO BẢNG PROFILES
-- Mọi người có thể đọc profile của nhau (để hiển thị tên giáo viên, học sinh)
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- User có thể tự cập nhật profile của mình
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Admin có thể toàn quyền chỉnh sửa profiles
CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 14. POLICIES CHO BẢNG CLASSES
-- Xem lớp học: Giáo viên tạo lớp, Học sinh là thành viên, hoặc Admin
CREATE POLICY "View classes policy"
ON public.classes FOR SELECT
TO authenticated
USING (
    teacher_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.class_members WHERE class_id = classes.id AND student_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR true -- Cho phép tìm kiếm mã lớp để tham gia
);

-- Tạo lớp học: Chỉ Giáo viên hoặc Admin
CREATE POLICY "Create classes policy"
ON public.classes FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Sửa/Xóa lớp học: Chỉ Giáo viên chủ nhiệm lớp hoặc Admin
CREATE POLICY "Update/Delete classes policy"
ON public.classes FOR ALL
TO authenticated
USING (
    teacher_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 15. POLICIES CHO BẢNG CLASS_MEMBERS
CREATE POLICY "View class members policy"
ON public.class_members FOR SELECT
TO authenticated
USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.classes WHERE id = class_members.class_id AND teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Join or add class members policy"
ON public.class_members FOR INSERT
TO authenticated
WITH CHECK (
    student_id = auth.uid() -- Học sinh tự join bằng mã
    OR EXISTS (SELECT 1 FROM public.classes WHERE id = class_members.class_id AND teacher_id = auth.uid()) -- Giáo viên thêm
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Remove class members policy"
ON public.class_members FOR DELETE
TO authenticated
USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.classes WHERE id = class_members.class_id AND teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 16. POLICIES CHO BẢNG MATERIALS
-- Xem học liệu: Tài liệu công khai hoặc do chính mình tạo hoặc Admin
CREATE POLICY "View materials policy"
ON public.materials FOR SELECT
TO authenticated
USING (
    is_public = true 
    OR author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Thêm học liệu: Giáo viên hoặc Admin
CREATE POLICY "Insert materials policy"
ON public.materials FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Sửa / Xóa học liệu: Tác giả hoặc Admin
CREATE POLICY "Update/Delete materials policy"
ON public.materials FOR ALL
TO authenticated
USING (
    author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 17. POLICIES CHO BẢNG ASSIGNMENTS
CREATE POLICY "View assignments policy"
ON public.assignments FOR SELECT
TO authenticated
USING (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.class_members WHERE class_id = assignments.class_id AND student_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.classes WHERE id = assignments.class_id AND teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Manage assignments policy"
ON public.assignments FOR ALL
TO authenticated
USING (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.classes WHERE id = assignments.class_id AND teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 18. POLICIES CHO BẢNG STUDENT_PROGRESS
CREATE POLICY "View student progress policy"
ON public.student_progress FOR SELECT
TO authenticated
USING (
    student_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.assignments a
        JOIN public.classes c ON a.class_id = c.id
        WHERE a.id = student_progress.assignment_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Insert or update own progress policy"
ON public.student_progress FOR ALL
TO authenticated
USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 19. CẤU HÌNH STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('materials', 'materials', true),
    ('game-packages', 'game-packages', true),
    ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
CREATE POLICY "Public Read Materials Bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('materials', 'game-packages', 'avatars'));

CREATE POLICY "Authenticated Upload to Materials Bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('materials', 'game-packages', 'avatars'));

CREATE POLICY "Author Update/Delete in Storage Bucket"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id IN ('materials', 'game-packages', 'avatars') AND auth.uid()::text = (storage.foldername(name))[1]);

-- 20. KHỞI TẠO DỮ LIỆU MẪU TOÁN 8 KẾT NỐI TRI THỨC (CÔ HUYỀN DIỆU - THCS NGUYỄN HUỆ)
-- Dữ liệu này sẽ tự động có sẵn trong hệ thống để phục vụ giảng dạy ngay!
INSERT INTO public.materials (title, description, chapter, lesson_number, lesson_name, type, embed_url, is_public, tags)
VALUES
-- CHƯƠNG 1: ĐA THỨC NHIỀU BIẾN
('Bài 1: Lý thuyết & Ví dụ Đơn thức', 'Khái niệm đơn thức, đơn thức thu gọn, bậc của đơn thức và đơn thức đồng dạng. Phân biệt phần hệ số và phần biến.', 1, 1, 'Bài 1: Đơn thức', 'document', 'https://drive.google.com/viewerng/viewer?embedded=true', true, ARRAY['Toán 8', 'KNTT', 'Chương 1', 'Đơn thức']),
('Minigame: Ghép đôi Đơn thức đồng dạng', 'Trò chơi rèn luyện nhận biết các đơn thức đồng dạng và thu gọn biểu thức đại số nhanh.', 1, 1, 'Bài 1: Đơn thức', 'game_iframe', 'https://wordwall.net/embed/math-monomial-match', true, ARRAY['Game', 'Chương 1', 'Đơn thức đồng dạng']),
('Bài 2: Đa thức & Bậc của Đa thức', 'Định nghĩa đa thức, nhận biết hạng tử, cách thu gọn đa thức nhiều biến và xác định bậc.', 1, 2, 'Bài 2: Đa thức', 'document', 'https://drive.google.com/viewerng/viewer?embedded=true', true, ARRAY['Toán 8', 'Chương 1', 'Đa thức']),
('Bài 3: Phép cộng và phép trừ đa thức', 'Quy tắc cộng trừ đa thức nhiều biến, nhóm các hạng tử đồng dạng và quy tắc đổi dấu ngoặc.', 1, 3, 'Bài 3: Phép cộng và phép trừ đa thức', 'document', 'https://drive.google.com/viewerng/viewer?embedded=true', true, ARRAY['Toán 8', 'Chương 1', 'Cộng trừ đa thức']),
('Bài 4: Phép nhân đa thức', 'Quy tắc nhân đơn thức với đa thức A(B+C) = AB + AC và nhân đa thức với đa thức (A+B)(C+D).', 1, 4, 'Bài 4: Phép nhân đa thức', 'document', 'https://drive.google.com/viewerng/viewer?embedded=true', true, ARRAY['Toán 8', 'Chương 1', 'Nhân đa thức']),
('Bài 5: Phép chia đa thức cho đơn thức', 'Quy tắc chia đơn thức cho đơn thức và đa thức cho đơn thức (chia từng hạng tử của đa thức cho đơn thức).', 1, 5, 'Bài 5: Phép chia đa thức cho đơn thức', 'document', 'https://drive.google.com/viewerng/viewer?embedded=true', true, ARRAY['Toán 8', 'Chương 1', 'Chia đa thức']),
('Ôn tập cuối Chương 1: Đa thức nhiều biến', 'Hệ thống sơ đồ tư duy toàn bộ Chương 1 kèm bộ đề trắc nghiệm ôn tập trọng tâm.', 1, 0, 'Ôn tập cuối chương 1', 'document', 'https://drive.google.com/viewerng/viewer?embedded=true', true, ARRAY['Toán 8', 'Chương 1', 'Ôn tập tổng hợp']),

-- CHƯƠNG 2: HẰNG ĐẲNG THỨC ĐÁNG NHỚ VÀ ỨNG DỤNG
('Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu', 'Hằng đẳng thức số 1, 2, 3: (a+b)^2 = a^2 + 2ab + b^2, (a-b)^2 = a^2 - 2ab + b^2, a^2 - b^2 = (a-b)(a+b).', 2, 6, 'Bài 6: Hiệu hai bình phương. Bình phương tổng hiệu', 'document', 'https://drive.google.com/viewerng/viewer?embedded=true', true, ARRAY['Toán 8', 'Chương 2', 'Hằng đẳng thức 1 2 3']),
('Đấu trường: Thử thách 7 Hằng đẳng thức', 'Game trắc nghiệm tốc độ và điền khuyết 7 hằng đẳng thức đáng nhớ Toán 8.', 2, 6, 'Bài 6: Hiệu hai bình phương. Bình phương tổng hiệu', 'game_iframe', 'https://quizizz.com/embed/quiz/hang-dang-thuc-toan-8', true, ARRAY['Game', 'Chương 2', 'Đấu trường HĐT']),
('Bài 7: Lập phương của một tổng. Lập phương của một hiệu', 'Hằng đẳng thức số 4, 5: (a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3 và (a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3.', 2, 7, 'Bài 7: Lập phương của một tổng, một hiệu', 'document', 'https://drive.google.com/viewerng/viewer?embedded=true', true, ARRAY['Toán 8', 'Chương 2', 'Hằng đẳng thức 4 5']),
('Bài 8: Tổng và hiệu hai lập phương', 'Hằng đẳng thức số 6, 7: a^3 + b^3 = (a+b)(a^2 - ab + b^2) và a^3 - b^3 = (a-b)(a^2 + ab + b^2).', 2, 8, 'Bài 8: Tổng và hiệu hai lập phương', 'document', 'https://drive.google.com/viewerng/viewer?embedded=true', true, ARRAY['Toán 8', 'Chương 2', 'Hằng đẳng thức 6 7']),
('Bài 9: Phân tích đa thức thành nhân tử', 'Các phương pháp: Đặt nhân tử chung, dùng hằng đẳng thức, nhóm hạng tử và phối hợp nhiều phương pháp.', 2, 9, 'Bài 9: Phân tích đa thức thành nhân tử', 'document', 'https://drive.google.com/viewerng/viewer?embedded=true', true, ARRAY['Toán 8', 'Chương 2', 'Phân tích nhân tử']),
('Ôn tập cuối Chương 2: Cẩm nang 7 Hằng đẳng thức', 'Bảng tra cứu 7 hằng đẳng thức, bài tập tính nhanh giá trị biểu thức và tìm x.', 2, 0, 'Ôn tập cuối chương 2', 'document', 'https://drive.google.com/viewerng/viewer?embedded=true', true, ARRAY['Toán 8', 'Chương 2', 'Cẩm nang 7 HĐT'])
ON CONFLICT DO NOTHING;
