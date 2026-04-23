import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import "../counsellor/counsellor.css";

export default function TestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));
    if (!student) {
      navigate("/student/login");
      return;
    }
    initializeTest(student.id);
  }, [testId]);

  const initializeTest = async (studentId) => {
    try {
      // Get test details
      const { data: testData, error: testError } = await supabase
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (testError) throw testError;
      setTest(testData);

      // Get questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("test_id", testId)
        .order("order_index");

      if (questionsError) throw questionsError;
      setQuestions(questionsData);

      // Check if there's an existing session
      const { data: existingSession, error: sessionError } = await supabase
        .from("test_sessions")
        .select("*")
        .eq("student_id", studentId)
        .eq("test_id", testId)
        .maybeSingle();

      if (sessionError) throw sessionError;

      if (existingSession) {
        setSessionId(existingSession.id);
        // Load existing answers
        const { data: existingResponses, error: responsesError } = await supabase
          .from("responses")
          .select("question_id, answer")
          .eq("session_id", existingSession.id);

        if (!responsesError && existingResponses) {
          const answersMap = {};
          existingResponses.forEach(response => {
            answersMap[response.question_id] = response.answer;
          });
          setAnswers(answersMap);
          // Find the first unanswered question
          const firstUnansweredIndex = questionsData.findIndex(q => !answersMap[q.id]);
          setCurrentQuestionIndex(firstUnansweredIndex >= 0 ? firstUnansweredIndex : questionsData.length - 1);
        }
      } else {
        // Create new session (or fetch existing if constraint conflict)
        const { data: newSession, error: newSessionError } = await supabase
          .from("test_sessions")
          .upsert({
            student_id: studentId,
            test_id: testId,
            status: 'in_progress'
          }, { onConflict: 'student_id,test_id' })
          .select()
          .single();

        if (newSessionError) throw newSessionError;
        setSessionId(newSession.id);
      }
    } catch (error) {
      console.error("Error initializing test:", error);
      alert("Error loading test: " + (error?.message || JSON.stringify(error)));
      navigate("/student/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));

    // Save response to database
    try {
      const { error } = await supabase
        .from("responses")
        .upsert({
          session_id: sessionId,
          question_id: questionId,
          answer: answer
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitTest = async () => {
    setSubmitting(true);
    try {
      const student = JSON.parse(localStorage.getItem("student"));

      // Mark session as completed
      const { error: sessionError } = await supabase
        .from("test_sessions")
        .update({ completed_at: new Date().toISOString(), status: 'completed' })
        .eq("id", sessionId);

      if (sessionError) throw sessionError;

      // Calculate results
      const totalQuestions = questions.length;
      const answeredQuestions = Object.keys(answers).length;
      const percentage = Math.round((answeredQuestions / totalQuestions) * 100);

      let grade = 'F';
      if (percentage >= 90) grade = 'A';
      else if (percentage >= 80) grade = 'B';
      else if (percentage >= 70) grade = 'C';
      else if (percentage >= 60) grade = 'D';

      // Generate insights based on test type
      const strengths = answeredQuestions >= totalQuestions ? ["Completed all questions", "Good engagement"] : ["Partial completion"];
      const improvementAreas = answeredQuestions < totalQuestions ? ["Answer all questions"] : ["Review weak areas"];
      const recommendations = ["Explore related career paths", "Discuss results with your counsellor"];

      const { error: resultError } = await supabase
        .from("test_results")
        .upsert({
          session_id: sessionId,
          percentage: percentage,
          grade: grade,
          strengths: strengths,
          improvement_areas: improvementAreas,
          career_recommendations: recommendations
        }, { onConflict: 'session_id' });

      if (resultError) throw resultError;

      // Check if all tests are now completed — if so, notify counsellor
      const { data: allTests } = await supabase.from("tests").select("id").eq("is_active", true);
      const { data: completedSessions } = await supabase
        .from("test_sessions")
        .select("test_id")
        .eq("student_id", student.id)
        .not("completed_at", "is", null);

      const completedIds = new Set(completedSessions?.map(s => s.test_id));
      const allDone = allTests?.every(t => completedIds.has(t.id));

      if (allDone) {
        // Build summary report for counsellor
        const { data: allResults } = await supabase
          .from("test_sessions")
          .select("test_id, completed_at, test_results(percentage, grade, strengths, career_recommendations), tests(name, test_type)")
          .eq("student_id", student.id)
          .not("completed_at", "is", null);

        const summary = allResults?.map(s => ({
          test: s.tests?.name,
          type: s.tests?.test_type,
          grade: s.test_results?.[0]?.grade,
          percentage: s.test_results?.[0]?.percentage,
          recommendations: s.test_results?.[0]?.career_recommendations
        }));

        // Save report to reports table
        await supabase.from("reports").upsert({
          student_id: student.id,
          counsellor_id: student.counsellor_id,
          summary: summary,
          generated_at: new Date().toISOString()
        }, { onConflict: 'student_id' });

        alert(`Test completed! All tests done. Your report has been sent to your counsellor.`);
      } else {
        alert(`Test completed! ${percentage}% (${grade})`);
      }

      navigate("/student/dashboard");
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Error submitting test: " + (error?.message || JSON.stringify(error)));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading test...</div>;
  if (!test || questions.length === 0) return <div className="error">Test not found</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="test-container">
      <div className="test-header">
        <h2>{test.name}</h2>
        <div className="test-progress">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>Answered: {answeredCount}/{questions.length}</span>
        </div>
      </div>

      <div className="question-card">
        <h3>{currentQuestion.question_text}</h3>

        {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="option">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.question_type === 'true_false' && (
          <div className="options">
            <label className="option">
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value="true"
                checked={currentAnswer === "true"}
                onChange={(e) => handleAnswer(currentQuestion.id, "true")}
              />
              <span>True</span>
            </label>
            <label className="option">
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value="false"
                checked={currentAnswer === "false"}
                onChange={(e) => handleAnswer(currentQuestion.id, "false")}
              />
              <span>False</span>
            </label>
          </div>
        )}

        {currentQuestion.question_type === 'rating' && (
          <div className="rating-options">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#718096', marginBottom: '8px', padding: '0 4px' }}>
              {test.test_type === 'aptitude' ? null : (
                <>
                  <span>{test.test_type === 'personality' ? '1 = Strongly Disagree' : '1 = Not Important / Poor'}</span>
                  <span>{test.test_type === 'personality' ? '5 = Strongly Agree' : '5 = Very Important / Excellent'}</span>
                </>
              )}
            </div>
            {[1, 2, 3, 4, 5].map(rating => (
              <label key={rating} className="rating-option">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={rating.toString()}
                  checked={currentAnswer === rating.toString()}
                  onChange={(e) => handleAnswer(currentQuestion.id, rating.toString())}
                />
                <span>{rating}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Testing helper: auto-fill all answers */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button
          style={{ background: '#e2e8f0', border: '1px dashed #a0aec0', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#718096' }}
          onClick={() => {
            const autoAnswers = {};
            questions.forEach(q => {
              if (q.question_type === 'multiple_choice' && q.options?.length > 0) autoAnswers[q.id] = q.options[0];
              else if (q.question_type === 'true_false') autoAnswers[q.id] = 'true';
              else if (q.question_type === 'rating') autoAnswers[q.id] = '3';
            });
            setAnswers(autoAnswers);
          }}
        >
          [Testing] Auto-fill all answers
        </button>
      </div>

      <div className="test-navigation">
        <button
          className="nav-btn"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        {!isLastQuestion ? (
          <button
            className="nav-btn primary"
            onClick={nextQuestion}
          >
            Next
          </button>
        ) : (
          <button
            className="nav-btn primary"
            onClick={submitTest}
            disabled={submitting || answeredCount < questions.length}
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        )}
      </div>
    </div>
  );
}
