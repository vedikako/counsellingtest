-- ================================================================
-- SUPABASE SETUP FOR CAREER ASSESSMENT PLATFORM
-- Run this in Supabase SQL Editor
-- ================================================================

-- 1. CREATE TESTS AND QUESTIONS TABLES
CREATE TABLE IF NOT EXISTS public.tests (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  test_type text NOT NULL CHECK (test_type IN ('aptitude', 'personality', 'interest', 'skills', 'values')),
  duration_minutes integer DEFAULT 30,
  total_questions integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.questions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  test_id uuid NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'rating')),
  options jsonb,
  correct_answer text,
  scoring_logic jsonb,
  order_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(test_id, order_index)
);

-- 2. INSERT TEST DEFINITIONS (5 Tests)
INSERT INTO public.tests (name, description, test_type, duration_minutes, total_questions) VALUES
  ('Aptitude Explorer', 'Discover your natural abilities in reasoning, problem-solving, and learning styles.', 'aptitude', 25, 12),
  ('Personality Compass', 'Understand your personality traits and work preferences.', 'personality', 20, 15),
  ('Interest Navigator', 'Explore what activities and subjects excite you most.', 'interest', 20, 12),
  ('Skills Inventory', 'Assess your current abilities and strengths.', 'skills', 15, 10),
  ('Values Compass', 'Identify what matters most to you in work and life.', 'values', 20, 12)
ON CONFLICT DO NOTHING;

-- 3. INSERT APTITUDE TEST QUESTIONS
INSERT INTO public.questions (test_id, question_text, question_type, options, correct_answer, order_index) VALUES
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'Complete the pattern: 2, 4, 8, 16, ?', 'multiple_choice', '["24", "32", "18", "20"]', '32', 1),
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'If all bloops are razzes, which statement is true?', 'multiple_choice', '["All bloops are razzes", "Some bloops are razzes", "No bloops are razzes", "None"]', 'All bloops are razzes', 2),
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'A store sells a shirt for $25 after 20% discount. Original price?', 'multiple_choice', '["$30", "$31.25", "$28.75", "$32.50"]', '$31.25', 3),
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'Which word does not belong?', 'multiple_choice', '["Square", "Circle", "Triangle", "Rectangle"]', 'Circle', 4),
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'Find the missing number: 3, 6, 9, 15, 24, ?', 'multiple_choice', '["36", "42", "39", "45"]', '39', 5),
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'Complete analogy: Book is to Library as Painting is to:', 'multiple_choice', '["Museum", "Gallery", "Artist", "Frame"]', 'Museum', 6),
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'How many minutes to measure exactly 15 minutes with 7 and 11 minute hourglasses?', 'multiple_choice', '["5", "7", "11", "15"]', '7', 7),
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'Enjoy solving mathematical problems?', 'true_false', '["true", "false"]', 'true', 8),
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'Prefer logical puzzles?', 'true_false', '["true", "false"]', 'true', 9),
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'Find patterns easily?', 'true_false', '["true", "false"]', 'true', 10),
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'Rate your math comfort (1-5)', 'rating', '["1", "2", "3", "4", "5"]', NULL, 11),
  ((SELECT id FROM tests WHERE test_type = 'aptitude' LIMIT 1), 'Rate reasoning ability (1-5)', 'rating', '["1", "2", "3", "4", "5"]', NULL, 12)
ON CONFLICT DO NOTHING;

-- 4. INSERT PERSONALITY TEST QUESTIONS
INSERT INTO public.questions (test_id, question_text, question_type, options, correct_answer, order_index) VALUES
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'At parties, you usually:', 'multiple_choice', '["Stay quiet", "Jump in conversations", "Talk to few people", "Leave early"]', NULL, 1),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'On group projects, you prefer to:', 'multiple_choice', '["Take charge", "Do your part", "Create ideas", "Keep harmony"]', NULL, 2),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'When you make a mistake:', 'multiple_choice', '["Get upset", "Fix quickly", "Laugh and move on", "Blame others"]', NULL, 3),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'In free time, you enjoy:', 'multiple_choice', '["New activities", "Familiar hobbies", "Friends", "Learning"]', NULL, 4),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'When disagreed with:', 'multiple_choice', '["Defend position", "Listen carefully", "Find compromise", "Avoid conflict"]', NULL, 5),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'You work best with:', 'multiple_choice', '["Clear plans", "Flexibility", "Others", "Alone"]', NULL, 6),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'Facing challenges makes you:', 'multiple_choice', '["Energized", "Worried", "Calm", "Seek help"]', NULL, 7),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'Prefer teachers who are:', 'multiple_choice', '["Strict", "Fun", "Caring", "Clear"]', NULL, 8),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'You get stressed by:', 'multiple_choice', '["Unpredictability", "Too much", "Difficult people", "Being alone"]', NULL, 9),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'Enjoy physical activities?', 'true_false', '["true", "false"]', NULL, 10),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'Organize things easily?', 'true_false', '["true", "false"]', NULL, 11),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'Create things easily?', 'true_false', '["true", "false"]', NULL, 12),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'Rate openness (1-5)', 'rating', '["1", "2", "3", "4", "5"]', NULL, 13),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'Rate conscientiousness (1-5)', 'rating', '["1", "2", "3", "4", "5"]', NULL, 14),
  ((SELECT id FROM tests WHERE test_type = 'personality' LIMIT 1), 'Rate extraversion (1-5)', 'rating', '["1", "2", "3", "4", "5"]', NULL, 15)
ON CONFLICT DO NOTHING;

-- 5. INSERT INTEREST TEST QUESTIONS
INSERT INTO public.questions (test_id, question_text, question_type, options, correct_answer, order_index) VALUES
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'Most fun activity:', 'multiple_choice', '["Fix things", "Research", "Draw", "Organize events"]', NULL, 1),
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'Science class, you enjoy:', 'multiple_choice', '["Building models", "Research", "Presentations", "Group work"]', NULL, 2),
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'Your ideal career involves:', 'multiple_choice', '["Hands-on work", "Analysis", "Creativity", "Helping"]', NULL, 3),
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'You would rather:', 'multiple_choice', '["Build something", "Discover something", "Create art", "Lead team"]', NULL, 4),
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'Interested in tech?', 'true_false', '["true", "false"]', NULL, 5),
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'Interested in arts?', 'true_false', '["true", "false"]', NULL, 6),
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'Interested in science?', 'true_false', '["true", "false"]', NULL, 7),
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'Interested in business?', 'true_false', '["true", "false"]', NULL, 8),
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'Rate engineering interest (1-5)', 'rating', '["1", "2", "3", "4", "5"]', NULL, 9),
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'Rate creative interest (1-5)', 'rating', '["1", "2", "3", "4", "5"]', NULL, 10),
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'Rate people-helping interest (1-5)', 'rating', '["1", "2", "3", "4", "5"]', NULL, 11),
  ((SELECT id FROM tests WHERE test_type = 'interest' LIMIT 1), 'Rate leadership interest (1-5)', 'rating', '["1", "2", "3", "4", "5"]', NULL, 12)
ON CONFLICT DO NOTHING;

-- 6. INSERT SKILLS TEST QUESTIONS
INSERT INTO public.questions (test_id, question_text, question_type, options, correct_answer, order_index) VALUES
  ((SELECT id FROM tests WHERE test_type = 'skills' LIMIT 1), 'Communication skills?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 1),
  ((SELECT id FROM tests WHERE test_type = 'skills' LIMIT 1), 'Problem-solving skills?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 2),
  ((SELECT id FROM tests WHERE test_type = 'skills' LIMIT 1), 'Leadership skills?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 3),
  ((SELECT id FROM tests WHERE test_type = 'skills' LIMIT 1), 'Technical skills?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 4),
  ((SELECT id FROM tests WHERE test_type = 'skills' LIMIT 1), 'Creative skills?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 5),
  ((SELECT id FROM tests WHERE test_type = 'skills' LIMIT 1), 'Time management?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 6),
  ((SELECT id FROM tests WHERE test_type = 'skills' LIMIT 1), 'Teamwork?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 7),
  ((SELECT id FROM tests WHERE test_type = 'skills' LIMIT 1), 'Adaptability?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 8),
  ((SELECT id FROM tests WHERE test_type = 'skills' LIMIT 1), 'Research skills?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 9),
  ((SELECT id FROM tests WHERE test_type = 'skills' LIMIT 1), 'Public speaking?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 10)
ON CONFLICT DO NOTHING;

-- 7. INSERT VALUES TEST QUESTIONS
INSERT INTO public.questions (test_id, question_text, question_type, options, correct_answer, order_index) VALUES
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'Most important in work:', 'multiple_choice', '["Good salary", "Help others", "Job security", "Creativity"]', NULL, 1),
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'You value:', 'multiple_choice', '["Achievement", "Relationships", "Stability", "Freedom"]', NULL, 2),
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'Work-life balance importance?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 3),
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'Making money importance?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 4),
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'Helping others importance?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 5),
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'Learning importance?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 6),
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'Independence importance?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 7),
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'Recognition importance?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 8),
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'Job satisfaction importance?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 9),
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'Travel in job importance?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 10),
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'Teamwork importance?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 11),
  ((SELECT id FROM tests WHERE test_type = 'values' LIMIT 1), 'Innovation importance?', 'rating', '["1", "2", "3", "4", "5"]', NULL, 12)
ON CONFLICT DO NOTHING;

-- 8. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_questions_test_id ON public.questions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_student_id ON public.test_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_counsellor_id ON public.test_attempts(counsellor_id);
CREATE INDEX IF NOT EXISTS idx_reports_student_id ON public.reports(student_id);
CREATE INDEX IF NOT EXISTS idx_reports_counsellor_id ON public.reports(counsellor_id);

-- 9. CREATE FUNCTION TO CALCULATE SCORES
CREATE OR REPLACE FUNCTION calculate_test_score(
  p_responses jsonb,
  p_test_type text
)
RETURNS jsonb AS $$
DECLARE
  v_correct_count integer := 0;
  v_total_count integer := 0;
  v_percentage numeric;
  v_result jsonb;
BEGIN
  -- Count correct answers from responses
  v_total_count := jsonb_array_length(p_responses);
  
  -- Basic calculation: assume answers are stored as array of correct/incorrect
  -- This should be customized based on your response structure
  
  v_percentage := CASE 
    WHEN v_total_count = 0 THEN 0
    ELSE (v_correct_count::numeric / v_total_count::numeric) * 100
  END;
  
  v_result := jsonb_build_object(
    'percentage', ROUND(v_percentage, 2),
    'total_questions', v_total_count,
    'correct_answers', v_correct_count,
    'test_type', p_test_type
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 10. CREATE MISSING TABLES (test_sessions, responses, test_results)
CREATE TABLE IF NOT EXISTS public.test_sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  test_id uuid NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  PRIMARY KEY (id),
  UNIQUE(student_id, test_id)
);

CREATE TABLE IF NOT EXISTS public.responses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL REFERENCES public.test_sessions(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answer text NOT NULL,
  answered_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(session_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.test_results (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL REFERENCES public.test_sessions(id) ON DELETE CASCADE UNIQUE,
  percentage numeric CHECK (percentage >= 0 AND percentage <= 100),
  grade text,
  strengths jsonb,
  improvement_areas jsonb,
  career_recommendations jsonb,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on new tables
ALTER TABLE public.test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can manage their sessions" ON test_sessions;
DROP POLICY IF EXISTS "Students can manage their responses" ON responses;
DROP POLICY IF EXISTS "Students can view their results" ON test_results;

CREATE POLICY "Students can manage their sessions" ON test_sessions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Students can manage their responses" ON responses
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Students can view their results" ON test_results
  FOR ALL USING (auth.role() = 'authenticated');

-- 11. FIX DUPLICATE TESTS (keep only one of each test_type)
DELETE FROM public.tests
WHERE id NOT IN (
  SELECT MIN(id) FROM public.tests GROUP BY test_type
);

-- 12. ENABLE ROW LEVEL SECURITY ON EXISTING TABLES
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tests are viewable by authenticated users" ON tests;
DROP POLICY IF EXISTS "Questions are viewable by authenticated users" ON questions;

CREATE POLICY "Tests are viewable by authenticated users" ON tests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Questions are viewable by authenticated users" ON questions
  FOR SELECT USING (auth.role() = 'authenticated');

-- ================================================================
-- SETUP COMPLETE
-- ================================================================
-- Next steps:
-- 1. Set up environment variables in .env.local
-- 2. Run the React frontend
-- 3. Create students and counsellors
-- 4. Students can now take tests
-- ================================================================
