-- ==============================================================================
-- BẢNG PARENT_REPORTS: LƯU TRỮ VÀ THEO DÕI BÁO CÁO HỌC TẬP GỬI PHỤ HUYNH
-- HỆ THỐNG TOÁN 8 KNTT - CÔ NGUYỄN THỊ HUYỀN DIỆU (THCS NGUYỄN HUỆ)
-- ==============================================================================

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
    channel VARCHAR(20) DEFAULT 'email', -- 'email' | 'zalo' | 'sms'
    status VARCHAR(20) DEFAULT 'sent', -- 'draft' | 'sent' | 'viewed'
    sent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index tối ưu truy vấn
CREATE INDEX IF NOT EXISTS idx_parent_reports_student_id ON public.parent_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_reports_class_id ON public.parent_reports(class_id);

-- Bật RLS
ALTER TABLE public.parent_reports ENABLE ROW LEVEL SECURITY;

-- Policies RLS
CREATE POLICY "View parent reports policy"
ON public.parent_reports FOR SELECT
TO authenticated
USING (
    teacher_id = auth.uid()
    OR student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Manage parent reports policy"
ON public.parent_reports FOR ALL
TO authenticated
USING (
    teacher_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
