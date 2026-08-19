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

-- 3. BẢNG PROFILES (HỒ SƠ NGƯỜI DÙNG)
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
    code VARCHAR(12) UNIQUE NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) DEFAULT '2024 - 2025',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. BẢNG CLASS_MEMBERS (THÀNH VIÊN LỚP)
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status VARCHAR(20) DEFAULT 'active',
    CONSTRAINT unique_class_student UNIQUE (class_id, student_id)
);

-- 6. BẢNG MATERIALS (KHO HỌC LIỆU & GAME)
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    chapter INT NOT NULL CHECK (chapter IN (1, 2)),
    lesson_number INT NOT NULL,
    lesson_name TEXT NOT NULL,
    type material_type NOT NULL DEFAULT 'document',
    file_url TEXT,
    embed_url TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_public BOOLEAN NOT NULL DEFAULT true,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. BẢNG ASSIGNMENTS (BÀI TẬP GIAO CHO LỚP)
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

-- 8. BẢNG STUDENT_PROGRESS (TIẾN ĐỘ & ĐIỂM SỐ)
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

-- 9. BẢNG PARENT_REPORTS (BÁO CÁO GỬI PHỤ HUYNH)
CREATE TABLE IF NOT EXISTS public.parent_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    report_week VARCHAR(50) NOT NULL DEFAULT 'Tuần hiện tại',
    parent_email TEXT,
    parent_phone TEXT,
    completed_assignments_count INT DEFAULT 0,
    total_assignments_count INT DEFAULT 0,
    average_score NUMERIC(5, 2) DEFAULT 0.0,
    game_points INT DEFAULT 0,
    badges_earned TEXT[] DEFAULT ARRAY[]::TEXT[],
    teacher_comment TEXT,
    channel VARCHAR(20) DEFAULT 'email',
    status VARCHAR(20) DEFAULT 'sent',
    sent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. TRIGGER TỰ ĐỘNG TẠO PROFILE KHI SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role public.user_role;
    user_fullname TEXT;
    user_school TEXT;
    meta_role TEXT;
BEGIN
    meta_role := COALESCE(new.raw_user_meta_data->>'role', 'student');
    
    IF meta_role = 'teacher' THEN
        default_role := 'teacher'::public.user_role;
    ELSIF meta_role = 'admin' THEN
        default_role := 'admin'::public.user_role;
    ELSE
        default_role := 'student'::public.user_role;
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
    SET full_name = EXCLUDED.full_name, 
        role = EXCLUDED.role, 
        updated_at = now();

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created 
AFTER INSERT OR UPDATE ON auth.users 
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. BẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_reports ENABLE ROW LEVEL SECURITY;

-- 12. RLS POLICIES
CREATE POLICY "Public profiles are viewable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "View classes policy" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Create classes policy" ON public.classes FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));
CREATE POLICY "View materials policy" ON public.materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert materials policy" ON public.materials FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));
CREATE POLICY "View assignments policy" ON public.assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Manage assignments policy" ON public.assignments FOR ALL TO authenticated USING (true);
CREATE POLICY "View progress policy" ON public.student_progress FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert progress policy" ON public.student_progress FOR ALL TO authenticated USING (true);
CREATE POLICY "View parent reports policy" ON public.parent_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Manage parent reports policy" ON public.parent_reports FOR ALL TO authenticated USING (true);

-- 13. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true), ('game-packages', 'game-packages', true), ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT TO public USING (bucket_id IN ('materials', 'game-packages', 'avatars'));
CREATE POLICY "Upload Storage" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('materials', 'game-packages', 'avatars'));
