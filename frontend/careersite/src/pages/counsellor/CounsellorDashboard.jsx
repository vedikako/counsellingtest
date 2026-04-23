// import { useEffect, useState } from "react";
// import { supabase } from "../../supabase/client";
// import { useNavigate } from "react-router-dom";
// // import "../counsellor.css";
// import "./counsellor.css";
// export default function CounsellorDashboard() {
//   const [counsellor, setCounsellor] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     const { data: userData } = await supabase.auth.getUser();

//     if (!userData.user) {
//       navigate("/counsellor/login");
//       return;
//     }

//     const { data, error } = await supabase
//       .from("counsellors")
//       .select("*")
//       .eq("id", userData.user.id)
//       .single();

//     if (error) {
//       console.log(error);
//     } else {
//       setCounsellor(data);
//     }
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     navigate("/counsellor/login");
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h2>Welcome, {counsellor?.name || "Counsellor"}</h2>
//         <button onClick={handleLogout}>Logout</button>
//       </div>

//       <div className="dashboard-cards">
//         <div className="card">
//           <h3>Total Students</h3>
//           <p>24</p>
//         </div>

//         <div className="card">
//           <h3>Tests Conducted</h3>
//           <p>12</p>
//         </div>

//         <div className="card">
//           <h3>Reports Generated</h3>
//           <p>8</p>
//         </div>
//       </div>

//       <div className="dashboard-section">
//         <h3>Your Profile</h3>
//         <p><strong>Email:</strong> {counsellor?.email}</p>
//         <p><strong>Phone:</strong> {counsellor?.phone || "Not Added"}</p>
//         <p><strong>Organization:</strong> {counsellor?.organization || "Not Added"}</p>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { useNavigate } from "react-router-dom";
import "./counsellor.css";
import StudentReport from "./StudentReport";

export default function CounsellorDashboard() {
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [reportStudent, setReportStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileAndStudents();
  }, []);

  const fetchProfileAndStudents = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        navigate("/counsellor/login");
        return;
      }

      // Get counsellor profile
      let { data: profileData, error: profileError } = await supabase
        .from("counsellors")
        .select("*")
        .eq("auth_id", user.id)
        .single();

      // If no profile exists, create one (for accounts created before this fix)
      if (profileError || !profileData) {
        const uniqueLink = `CL-${crypto.randomUUID().slice(0, 8)}`;
        const { data: newProfile, error: createError } = await supabase
          .from("counsellors")
          .insert({ auth_id: user.id, email: user.email, unique_link: uniqueLink })
          .select()
          .single();
        if (createError) throw createError;
        profileData = newProfile;
      }

      setProfile(profileData);

      // Get students assigned to this counsellor
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .eq("counsellor_id", profileData.id);

      if (studentsError) throw studentsError;
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentReport = async (studentId) => {
    try {
      // Get report if all tests done
      const { data: report } = await supabase
        .from("reports")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle();

      // Get individual test sessions with results
      const { data: sessions, error } = await supabase
        .from("test_sessions")
        .select("test_id, completed_at, status, test_results(percentage, grade, strengths, improvement_areas, career_recommendations), tests(name, test_type)")
        .eq("student_id", studentId)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      setStudentReport({ report, sessions: sessions || [] });
    } catch (error) {
      console.error("Error fetching student report:", error);
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    fetchStudentReport(student.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/counsellor/login");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Welcome, {profile?.name || "Counsellor"}</h2>
          <p style={{ margin: "5px 0", color: "#718096" }}>{profile?.email}</p>
        </div>
        <button className="auth-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Students</h3>
          <p>{students.length}</p>
        </div>
        <div className="card">
          <h3>Registration Link</h3>
          <div 
            className="link-box" 
            style={{ cursor: "pointer", fontSize: "12px" }}
            onClick={() => copyToClipboard(`http://localhost:5173/student/register/${profile?.unique_link}`)}
            title="Click to copy"
          >
            {profile?.unique_link ? `...register/${profile.unique_link}` : "Not available"}
          </div>
        </div>
        <div className="card">
          <h3>Organization</h3>
          <p>{profile?.organization || "Not specified"}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Your Students</h3>
        {students.length === 0 ? (
          <p>No students registered yet. Share your registration link to get started.</p>
        ) : (
          <div className="students-list">
            {students.map(student => (
              <div
                key={student.id}
                className={`student-item ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                onClick={() => handleStudentClick(student)}
              >
                <h4>{student.name}</h4>
                <p>Class: {student.class}</p>
                <p>Email: {student.email}</p>
                <p style={{ fontSize: "12px", color: "#a0aec0" }}>Phone: {student.phone}</p>
                <button
                  className="auth-btn"
                  style={{ marginTop: "8px", padding: "6px 14px", fontSize: "13px", background: "#764ba2" }}
                  onClick={(e) => { e.stopPropagation(); setReportStudent(student); }}
                >
                  📋 View Report
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedStudent && (
        <div className="dashboard-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Report - {selectedStudent.name}</h3>
            <button
              className="auth-btn"
              onClick={() => { setSelectedStudent(null); setStudentReport(null); }}
              style={{ padding: "8px 12px", fontSize: "14px" }}
            >
              Clear
            </button>
          </div>

          {studentReport?.report && (
            <div style={{ background: "#ebf8ff", border: "1px solid #90cdf4", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
              <h4 style={{ color: "#2b6cb0", margin: "0 0 8px 0" }}>✅ All Tests Completed — Full Report Available</h4>
              <p style={{ margin: "0", color: "#4a5568", fontSize: "14px" }}>Generated: {new Date(studentReport.report.generated_at).toLocaleString()}</p>
            </div>
          )}

          {!studentReport?.sessions?.length ? (
            <p>No tests completed yet.</p>
          ) : (
            <div className="results-grid">
              {studentReport.sessions.map(session => {
                const result = session.test_results?.[0];
                const isCompleted = !!session.completed_at;
                return (
                  <div key={session.test_id} className="result-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <h4 style={{ textTransform: "capitalize", margin: "0 0 4px 0" }}>{session.tests?.name}</h4>
                        <p style={{ fontSize: "12px", color: "#a0aec0", margin: 0 }}>
                          {session.completed_at ? new Date(session.completed_at).toLocaleDateString() : "In progress"}
                        </p>
                      </div>
                      <span style={{ background: isCompleted ? "#48bb78" : "#ed8936", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>
                        {isCompleted ? "✓ Done" : "In Progress"}
                      </span>
                    </div>

                    {result && (
                      <div style={{ marginTop: "12px" }}>
                        <div style={{ background: "#f7fafc", borderRadius: "6px", padding: "12px", marginBottom: "10px" }}>
                          <p style={{ margin: "0 0 4px 0" }}><strong>Score:</strong> {result.percentage}% — Grade: <strong>{result.grade}</strong></p>
                        </div>
                        {result.strengths?.length > 0 && (
                          <div style={{ marginBottom: "8px" }}>
                            <strong style={{ color: "#48bb78", fontSize: "13px" }}>✓ Strengths:</strong>
                            <ul style={{ margin: "4px 0", paddingLeft: "18px" }}>
                              {result.strengths.map((s, i) => <li key={i} style={{ fontSize: "13px", color: "#4a5568" }}>{s}</li>)}
                            </ul>
                          </div>
                        )}
                        {result.improvement_areas?.length > 0 && (
                          <div style={{ marginBottom: "8px" }}>
                            <strong style={{ color: "#f56565", fontSize: "13px" }}>⚠ To Improve:</strong>
                            <ul style={{ margin: "4px 0", paddingLeft: "18px" }}>
                              {result.improvement_areas.map((w, i) => <li key={i} style={{ fontSize: "13px", color: "#4a5568" }}>{w}</li>)}
                            </ul>
                          </div>
                        )}
                        {result.career_recommendations?.length > 0 && (
                          <div>
                            <strong style={{ color: "#4e73df", fontSize: "13px" }}>💡 Career Recommendations:</strong>
                            <ul style={{ margin: "4px 0", paddingLeft: "18px" }}>
                              {result.career_recommendations.map((r, i) => <li key={i} style={{ fontSize: "13px", color: "#4a5568" }}>{r}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {reportStudent && (
        <StudentReport student={reportStudent} onClose={() => setReportStudent(null)} />
      )}
    </div>
  );
}
