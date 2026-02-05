-- Add new columns for enhanced analysis data
ALTER TABLE public.analysis_history 
ADD COLUMN IF NOT EXISTS score_explanation TEXT,
ADD COLUMN IF NOT EXISTS ats_issues JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS rewrite_suggestions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS generated_summary TEXT,
ADD COLUMN IF NOT EXISTS skill_weights JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS experience_gap TEXT,
ADD COLUMN IF NOT EXISTS seniority_fit TEXT,
ADD COLUMN IF NOT EXISTS impact_analysis JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS action_verb_analysis JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS redundancies JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS hidden_requirements JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS must_have_vs_nice_to_have JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS improvement_plan JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS confidence_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tailoring_score INTEGER DEFAULT 0;