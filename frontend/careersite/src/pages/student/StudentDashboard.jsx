import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import "../counsellor/counsellor.css";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [tests, setTests] = useState([]);
  const [completedTests, setCompletedTests] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (!stored) {
      navigate("/student/login");
      return;
    }

    const studentData = JSON.parse(stored);
    setStudent(studentData);
    fetchTests(studentData);
  }, []);

  const fetchTests = async (studentData) => {
    try {
      // Get all active tests
      const { data: allTests, error: testsError } = await supabase
        .from("tests")
        .select("*")
        .eq("is_active", true);

      if (testsError) throw testsError;
      setTests(allTests);

      // Get completed sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from("test_sessions")
        .select("test_id, completed_at")
        .eq("student_id", studentData.id)
        .not("completed_at", "is", null);

      if (sessionsError) throw sessionsError;

      // Build map of completed test IDs
      const completed = {};
      sessions?.forEach(session => {
        completed[session.test_id] = true;
      });
      setCompletedTests(completed);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const startTest = (testId) => {
    navigate(`/student/test/${testId}`);
  };

  const handleLogout = async () => {
    localStorage.removeItem("student");
    await supabase.auth.signOut();
    navigate("/student/login");
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!student) return <div className="error">Error loading student data</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ marginBottom: "30px" }}>
        <h2>Welcome, {student.name}!</h2>
        <button className="auth-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-card" style={{ marginBottom: "30px" }}>
        <p><strong>Class:</strong> {student.class}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone}</p>
      </div>

      <div className="dashboard-card">
        <h3>Available Tests</h3>
        {tests.length === 0 ? (
          <p>No tests available at the moment.</p>
        ) : (
          <div className="tests-grid">
            {tests.map(test => {
              const isCompleted = completedTests[test.id];
              return (
                <div key={test.id} className={`test-card ${isCompleted ? 'completed' : ''}`} style={{ position: 'relative' }}>
                  {isCompleted && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#48bb78', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>✓</div>
                  )}
                  <h4>{test.name}</h4>
                  <p>{test.description}</p>
                  <p><strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{test.test_type}</span></p>
                  <p><strong>Questions:</strong> {test.total_questions}</p>
                  <p><strong>Duration:</strong> {test.duration_minutes} minutes</p>
                  {isCompleted ? (
                    <p style={{ color: '#48bb78', fontWeight: 'bold', marginBottom: '10px' }}>✓ Test Already Given</p>
                  ) : (
                    <button className="auth-btn" onClick={() => startTest(test.id)}>Start Test</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
