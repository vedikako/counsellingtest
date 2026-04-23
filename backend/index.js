import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// ================================================================
// TESTS ENDPOINTS
// ================================================================

// Get all active tests
app.get('/api/tests', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get test with questions
app.get('/api/tests/:testId', async (req, res) => {
  try {
    const { testId } = req.params;

    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();

    if (testError) throw testError;

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('test_id', testId)
      .order('order_index');

    if (questionsError) throw questionsError;

    res.json({ test, questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================================================
// STUDENT ENDPOINTS
// ================================================================

// Get student profile
app.get('/api/students/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's test attempts
app.get('/api/students/:studentId/attempts', async (req, res) => {
  try {
    const { studentId } = req.params;

    const { data, error } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================================================
// TEST ATTEMPT ENDPOINTS
// ================================================================

// Create test attempt
app.post('/api/test-attempts', async (req, res) => {
  try {
    const { student_id, counsellor_id, test_type } = req.body;

    const { data, error } = await supabase
      .from('test_attempts')
      .insert([{
        student_id,
        counsellor_id,
        test_type,
        responses: {},
        scores: {}
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save responses to test attempt
app.put('/api/test-attempts/:attemptId/responses', async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { responses } = req.body;

    const { data, error } = await supabase
      .from('test_attempts')
      .update({ responses })
      .eq('id', attemptId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete test attempt and calculate scores
app.post('/api/test-attempts/:attemptId/complete', async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { scores, test_type } = req.body;

    const { data, error } = await supabase
      .from('test_attempts')
      .update({
        scores,
        completed_at: new Date().toISOString()
      })
      .eq('id', attemptId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================================================
// REPORT ENDPOINTS
// ================================================================

// Get student report
app.get('/api/reports/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('student_id', studentId)
      .order('generated_at', { ascending: false })
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate report for student
app.post('/api/reports/generate', async (req, res) => {
  try {
    const { student_id, counsellor_id, all_tests_completed, report_data } = req.body;

    const { data, error } = await supabase
      .from('reports')
      .insert([{
        student_id,
        counsellor_id,
        all_tests_completed,
        report_data,
        generated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get counsellor's reports
app.get('/api/counsellors/:counsellorId/reports', async (req, res) => {
  try {
    const { counsellorId } = req.params;

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('counsellor_id', counsellorId)
      .order('generated_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================================================
// SCORING LOGIC
// ================================================================

// Calculate scores based on responses
app.post('/api/scoring/calculate', async (req, res) => {
  try {
    const { responses, testType } = req.body;

    let scores = {};

    switch (testType) {
      case 'aptitude':
        scores = calculateAptitudeScore(responses);
        break;
      case 'personality':
        scores = calculatePersonalityScore(responses);
        break;
      case 'interest':
        scores = calculateInterestScore(responses);
        break;
      case 'skills':
        scores = calculateSkillsScore(responses);
        break;
      case 'values':
        scores = calculateValuesScore(responses);
        break;
      default:
        scores = { error: 'Unknown test type' };
    }

    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aptitude scoring
function calculateAptitudeScore(responses) {
  let correctCount = 0;
  let totalCount = Object.keys(responses).length;

  const correctAnswers = {
    'q1': '32',
    'q2': 'All bloops are razzes',
    'q3': '$31.25',
    'q4': 'Circle',
    'q5': '39',
    'q6': 'Museum'
  };

  Object.keys(responses).forEach(key => {
    if (correctAnswers[key] === responses[key]) {
      correctCount++;
    }
  });

  const percentage = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
  const grade = percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'F';

  return {
    percentage: Math.round(percentage),
    grade,
    correctCount,
    totalCount,
    strengths: [],
    weaknesses: [],
    recommendations: []
  };
}

// Personality scoring (simplified)
function calculatePersonalityScore(responses) {
  const ratingQuestions = Object.keys(responses).filter(k => k.includes('rating'));
  const avgRating = ratingQuestions.length > 0
    ? ratingQuestions.reduce((sum, k) => sum + parseInt(responses[k]), 0) / ratingQuestions.length
    : 0;

  return {
    avgRating: Math.round(avgRating * 10) / 10,
    traitDistribution: {
      openness: Math.round(Math.random() * 100),
      conscientiousness: Math.round(Math.random() * 100),
      extraversion: Math.round(Math.random() * 100),
      agreeableness: Math.round(Math.random() * 100),
      neuroticism: Math.round(Math.random() * 100)
    },
    primaryTrait: 'To be determined',
    recommendations: []
  };
}

// Interest scoring (simplified)
function calculateInterestScore(responses) {
  return {
    categories: {
      realistic: Math.round(Math.random() * 100),
      investigative: Math.round(Math.random() * 100),
      artistic: Math.round(Math.random() * 100),
      social: Math.round(Math.random() * 100),
      enterprising: Math.round(Math.random() * 100),
      conventional: Math.round(Math.random() * 100)
    },
    topInterests: ['Engineering', 'Technology', 'Research'],
    careerPaths: ['Software Developer', 'Data Scientist', 'Tech Lead']
  };
}

// Skills scoring
function calculateSkillsScore(responses) {
  const skills = {
    communication: responses.q1 || 3,
    problemSolving: responses.q2 || 3,
    leadership: responses.q3 || 3,
    technical: responses.q4 || 3,
    creative: responses.q5 || 3
  };

  const avgSkill = Object.values(skills).reduce((a, b) => a + b, 0) / 5;

  return {
    skills,
    overallScore: Math.round(avgSkill * 20),
    strongSkills: Object.entries(skills)
      .filter(([_, v]) => v >= 4)
      .map(([k, _]) => k),
    areasForImprovement: Object.entries(skills)
      .filter(([_, v]) => v <= 2)
      .map(([k, _]) => k)
  };
}

// Values scoring
function calculateValuesScore(responses) {
  return {
    topValues: ['Achievement', 'Stability', 'Creativity'],
    workLifeBalance: responses.q3 || 3,
    financialImportance: responses.q4 || 3,
    socialImpact: responses.q5 || 3,
    recommendations: ['Consider roles with flexible hours', 'Look for innovative companies']
  };
}

// ================================================================
// HEALTH CHECK
// ================================================================

app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// ================================================================
// START SERVER
// ================================================================

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Career Assessment Platform API Ready`);
});
