-- Database Schema for Career Assessment Site
-- Supabase PostgreSQL DDL

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Counsellors table
CREATE TABLE counsellors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    organization VARCHAR(255),
    credits_remaining INTEGER DEFAULT 0 CHECK (credits_remaining >= 0),
    unique_link VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    counsellor_id UUID NOT NULL REFERENCES counsellors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    class VARCHAR(50), -- e.g., "10th Grade", "12th Grade"
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test types enum
CREATE TYPE test_type AS ENUM (
    'aptitude',
    'personality',
    'interest',
    'skills',
    'values'
);

-- Tests table
CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    test_type test_type NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    total_questions INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple_choice', -- multiple_choice, true_false, rating_scale
    options JSONB, -- For multiple choice: ["Option A", "Option B", "Option C", "Option D"]
    correct_answer VARCHAR(255), -- For objective questions
    points INTEGER DEFAULT 1,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_id, order_index)
);

-- Student test sessions
CREATE TABLE test_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    UNIQUE(student_id, test_id)
);

-- Responses table
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL, -- Student's response
    is_correct BOOLEAN, -- For objective questions
    points_earned INTEGER DEFAULT 0,
    time_taken_seconds INTEGER,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, question_id)
);

-- Test results table
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE UNIQUE,
    total_score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage DECIMAL(5,2) CHECK (percentage >= 0 AND percentage <= 100),
    grade VARCHAR(5), -- A+, A, B+, etc.
    interpretation TEXT, -- AI-generated or rule-based interpretation
    recommendations TEXT, -- Career recommendations based on results
    strengths JSONB, -- Array of strengths identified
    areas_for_improvement JSONB, -- Areas that need work
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id)
);

-- Indexes for performance
CREATE INDEX idx_students_counsellor_id ON students(counsellor_id);
CREATE INDEX idx_questions_test_id ON questions(test_id);
CREATE INDEX idx_test_sessions_student_id ON test_sessions(student_id);
CREATE INDEX idx_test_sessions_test_id ON test_sessions(test_id);
CREATE INDEX idx_responses_session_id ON responses(session_id);
CREATE INDEX idx_responses_question_id ON responses(question_id);
CREATE INDEX idx_test_results_session_id ON test_results(session_id);

-- Row Level Security (RLS) policies for Supabase
ALTER TABLE counsellors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Counsellors can only access their own data
CREATE POLICY "Counsellors can view own profile" ON counsellors
    FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Counsellors can update own profile" ON counsellors
    FOR UPDATE USING (auth.uid() = auth_id);

-- Students can only be accessed by their counsellor
CREATE POLICY "Counsellors can manage their students" ON students
    FOR ALL USING (
        counsellor_id IN (
            SELECT id FROM counsellors WHERE auth_id = auth.uid()
        )
    );

-- Tests are readable by all authenticated users
CREATE POLICY "Authenticated users can view tests" ON tests
    FOR SELECT TO authenticated USING (true);

-- Questions are readable by authenticated users
CREATE POLICY "Authenticated users can view questions" ON questions
    FOR SELECT TO authenticated USING (true);

-- Test sessions belong to students, counsellors can view their students' sessions
CREATE POLICY "Students and counsellors can manage test sessions" ON test_sessions
    FOR ALL USING (
        student_id IN (
            SELECT s.id FROM students s
            JOIN counsellors c ON s.counsellor_id = c.id
            WHERE c.auth_id = auth.uid()
        ) OR
        student_id IN (
            SELECT id FROM students WHERE id = auth.uid()::uuid
        )
    );

-- Responses are private to the session owner and their counsellor
CREATE POLICY "Session participants can manage responses" ON responses
    FOR ALL USING (
        session_id IN (
            SELECT ts.id FROM test_sessions ts
            JOIN students s ON ts.student_id = s.id
            JOIN counsellors c ON s.counsellor_id = c.id
            WHERE c.auth_id = auth.uid() OR s.id = auth.uid()::uuid
        )
    );

-- Test results are viewable by counsellors and the student
CREATE POLICY "Counsellors and students can view results" ON test_results
    FOR SELECT USING (
        session_id IN (
            SELECT ts.id FROM test_sessions ts
            JOIN students s ON ts.student_id = s.id
            JOIN counsellors c ON s.counsellor_id = c.id
            WHERE c.auth_id = auth.uid() OR s.id = auth.uid()::uuid
        )
    );

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_counsellors_updated_at BEFORE UPDATE ON counsellors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();</content>
<parameter name="filePath">c:\Users\Vedika\OneDrive\Documents\careersite\database_schema.sql