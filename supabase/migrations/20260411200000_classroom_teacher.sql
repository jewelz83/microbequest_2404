-- ─── Classroom Teacher Migration ─────────────────────────────────────────────
-- Creates classroom_rosters and classroom_metadata tables for teacher dashboard

-- 1. Classroom metadata table (stores classroom info per teacher)
CREATE TABLE IF NOT EXISTS public.classroom_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    classroom_name TEXT NOT NULL DEFAULT 'My Classroom',
    grade_level TEXT,
    school_name TEXT,
    academic_year TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Classroom rosters table (links teacher to students)
CREATE TABLE IF NOT EXISTS public.classroom_rosters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES public.classroom_metadata(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT,
    parent_email TEXT,
    grade TEXT,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_classroom_metadata_teacher_id ON public.classroom_metadata(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classroom_rosters_classroom_id ON public.classroom_rosters(classroom_id);
CREATE INDEX IF NOT EXISTS idx_classroom_rosters_teacher_id ON public.classroom_rosters(teacher_id);

-- 4. Enable RLS
ALTER TABLE public.classroom_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_rosters ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for classroom_metadata
DROP POLICY IF EXISTS "teachers_manage_own_classroom_metadata" ON public.classroom_metadata;
CREATE POLICY "teachers_manage_own_classroom_metadata"
ON public.classroom_metadata
FOR ALL
TO authenticated
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

-- 6. RLS Policies for classroom_rosters
DROP POLICY IF EXISTS "teachers_manage_own_classroom_rosters" ON public.classroom_rosters;
CREATE POLICY "teachers_manage_own_classroom_rosters"
ON public.classroom_rosters
FOR ALL
TO authenticated
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());
