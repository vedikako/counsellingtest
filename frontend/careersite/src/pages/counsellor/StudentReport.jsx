import { useEffect, useState, useRef } from "react";
import { supabase } from "../../supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ── Analysis helpers ──────────────────────────────────────────────────────────

// Helper: Score to tier (red/yellow/green)
function scoreTier(pct) {
  if (pct >= 70) return { tier: "Excellent", color: "#48bb78", short: "Ex" };
  if (pct >= 50) return { tier: "Good", color: "#ecc94b", short: "Go" };
  return { tier: "Fair", color: "#fc8181", short: "Fa" };
}

// Helper: Check if answer matches correct answer (handles format variations)
function isAnswerCorrect(answer, correctAnswer, questionOptions) {
  if (!answer || !correctAnswer) return false;
  
  // Direct match
  if (answer === correctAnswer) return true;
  
  // If answer is full text option and correct_answer might be letter/index
  if (questionOptions && Array.isArray(questionOptions)) {
    const ansIndex = questionOptions.indexOf(answer);
    if (ansIndex >= 0) {
      // Check if correct_answer matches this option
      if (questionOptions[ansIndex] === correctAnswer) return true;
      
      // Check if correct_answer is the index
      const correctIndex = parseInt(correctAnswer);
      if (!isNaN(correctIndex) && correctIndex === ansIndex) return true;
      
      // Check if correct_answer is a letter (A=0, B=1, etc)
      const letterIndex = correctAnswer.charCodeAt(0) - 65; // A=0, B=1, etc
      if (letterIndex >= 0 && letterIndex < questionOptions.length && letterIndex === ansIndex) return true;
    }
  }
  
  return false;
}

function analyzeAptitude(questions, responses) {
  const answerMap = buildAnswerMap(responses);
  let correct = 0, total = 0;
  questions.forEach(q => {
    if (q.correct_answer) {
      total++;
      const ans = answerMap[q.id];
      if (ans && isAnswerCorrect(ans, q.correct_answer, q.options)) {
        correct++;
      }
    }
  });
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const tier = scoreTier(pct);
  
  // Compute by category
  const categories = [
    { name: "Logical Reasoning", indices: [0,1,2,3,4] },
    { name: "Numerical", indices: [5,6,7,8] },
    { name: "Verbal", indices: [9,10,11,12] },
    { name: "Pattern Recognition", indices: [13,14,15,16] },
    { name: "Spatial & General", indices: [17,18,19] }
  ];
  
  const catData = categories.map(c => ({
    name: c.name,
    score: computeCategory(questions, answerMap, c.indices),
    pct: computeCategory(questions, answerMap, c.indices)
  }));
  
  // Build 3-tier stacked bars
  const stackedData = catData.map(d => ({
    name: d.name,
    Fair: Math.min(d.pct, 30),
    Good: Math.max(0, Math.min(d.pct - 30, 40)),
    Excellent: Math.max(0, d.pct - 70)
  }));
  
  return { pct, tier, correct, total, catData, stackedData };
}

function computeCategory(questions, answerMap, indices) {
  let score = 0, count = 0;
  indices.forEach(i => {
    if (questions[i]) {
      count++;
      const ans = answerMap[questions[i].id];
      if (ans) {
        if (questions[i].correct_answer) {
          // Use the improved answer checking logic
          if (isAnswerCorrect(ans, questions[i].correct_answer, questions[i].options)) {
            score++;
          }
        } else if (questions[i].question_type === 'rating') {
          score += parseInt(ans) / 5;
        } else {
          score += 0.5;
        }
      }
    }
  });
  return count > 0 ? Math.round((score / count) * 100) : 0;
}

function analyzePersonality(questions, responses) {
  const answerMap = buildAnswerMap(responses);
  const traits = [
    { name: "Openness", indices: [0,1,2,3] },
    { name: "Conscientiousness", indices: [4,5,6,7] },
    { name: "Extraversion", indices: [8,9,10,11] },
    { name: "Agreeableness", indices: [12,13,14,15] },
    { name: "Stability", indices: [16,17,18,19] }
  ];
  
  const data = traits.map(t => {
    let total = 0, count = 0;
    t.indices.forEach(i => {
      if (questions[i]) {
        const ans = answerMap[questions[i].id];
        if (ans) {
          const val = parseInt(ans);
          if (!isNaN(val)) { total += (val / 5) * 100; count++; }
        }
      }
    });
    const pct = count > 0 ? Math.round(total / count) : 0;
    return {
      name: t.name,
      pct,
      Fair: Math.min(pct, 30),
      Good: Math.max(0, Math.min(pct - 30, 40)),
      Excellent: Math.max(0, pct - 70),
      stars: (pct / 20).toFixed(1)
    };
  });
  
  const dominant = data.sort((a, b) => b.pct - a.pct)[0];
  return { data, dominant };
}

function analyzeInterests(questions, responses) {
  const answerMap = buildAnswerMap(responses);
  const categories = [
    { name: "Realistic (Hands-on)", indices: [0,1,2] },
    { name: "Investigative (Analytical)", indices: [3,4,5] },
    { name: "Artistic (Creative)", indices: [6,7,8] },
    { name: "Social (Helping)", indices: [9,10,11] },
    { name: "Enterprising (Leadership)", indices: [12,13,14,15] },
    { name: "Conventional (Organized)", indices: [16,17,18,19] }
  ];
  
  const data = categories.map(c => {
    let total = 0, count = 0;
    c.indices.forEach(i => {
      if (questions[i]) {
        const ans = answerMap[questions[i].id];
        if (ans) {
          if (questions[i].question_type === 'rating') {
            total += (parseInt(ans) / 5) * 100;
          } else if (questions[i].question_type === 'true_false') {
            total += ans === 'true' ? 100 : 20;
          } else {
            total += 50;
          }
          count++;
        }
      }
    });
    const pct = count > 0 ? Math.round(total / count) : 0;
    return {
      name: c.name,
      pct,
      Fair: Math.min(pct, 30),
      Good: Math.max(0, Math.min(pct - 30, 40)),
      Excellent: Math.max(0, pct - 70)
    };
  });
  
  const top = data.sort((a, b) => b.pct - a.pct).slice(0, 2).map(d => d.name);
  return { data, top };
}

function analyzeSkills(questions, responses) {
  const answerMap = buildAnswerMap(responses);
  const data = questions.map(q => {
    const pct = answerMap[q.id] ? parseInt(answerMap[q.id]) * 20 : 0;
    return {
      name: q.question_text.replace("?", "").trim(),
      pct,
      Fair: Math.min(pct, 30),
      Good: Math.max(0, Math.min(pct - 30, 40)),
      Excellent: Math.max(0, pct - 70),
      stars: (pct / 20).toFixed(1)
    };
  });
  const top = data.sort((a, b) => b.pct - a.pct).slice(0, 3).map(d => d.name);
  return { data, top };
}

function analyzeValues(questions, responses) {
  const answerMap = buildAnswerMap(responses);
  const data = questions.map(q => {
    const pct = answerMap[q.id] ? parseInt(answerMap[q.id]) * 20 : 0;
    return {
      name: q.question_text.replace("?", "").trim(),
      pct,
      Fair: Math.min(pct, 30),
      Good: Math.max(0, Math.min(pct - 30, 40)),
      Excellent: Math.max(0, pct - 70),
      stars: (pct / 20).toFixed(1)
    };
  });
  const top = data.sort((a, b) => b.pct - a.pct).slice(0, 3).map(d => d.name);
  return { data, top };
}

function buildAnswerMap(responses) {
  const map = {};
  responses.forEach(r => { map[r.question_id] = r.answer; });
  return map;
}

function renderStarRating(score) {
  const stars = (score / 20).toFixed(1);
  const fullStars = Math.floor(stars);
  const hasHalf = stars % 1 >= 0.5;
  let result = '';
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) result += '⭐';
    else if (i === fullStars && hasHalf) result += '⭐';
    else result += '☆';
  }
  return result;
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function StudentReport({ student, onClose }) {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    fetchReportData();
  }, [student.id]);

  const fetchReportData = async () => {
    try {
      // Get all sessions - separate from tests table to avoid relationship issues
      const { data: sessions, error: sessionsError } = await supabase
        .from("test_sessions")
        .select("id, test_id, completed_at")
        .eq("student_id", student.id)
        .not("completed_at", "is", null);

      if (sessionsError) {
        console.error("Sessions query error:", sessionsError);
        setLoading(false);
        return;
      }

      if (!sessions?.length) { 
        console.log("No completed sessions for student:", student.id);
        setLoading(false); 
        return; 
      }

      console.log("Found completed sessions:", sessions.length);

      // For each session, get test info and questions/responses
      const analysisMap = {};
      for (const session of sessions) {
        // Get test info
        const { data: testData } = await supabase
          .from("tests")
          .select("id, name, test_type")
          .eq("id", session.test_id)
          .single();

        const testType = testData?.test_type;
        console.log(`Processing test: ${testData?.name} (${testType})`);

        const { data: questions } = await supabase
          .from("questions")
          .select("*")
          .eq("test_id", session.test_id)
          .order("order_index");

        const { data: responses } = await supabase
          .from("responses")
          .select("question_id, answer")
          .eq("session_id", session.id);

        if (!questions || !responses) {
          console.log(`Skipping test - questions: ${questions?.length}, responses: ${responses?.length}`);
          continue;
        }

        if (testType === 'aptitude') analysisMap.aptitude = analyzeAptitude(questions, responses);
        else if (testType === 'personality') analysisMap.personality = analyzePersonality(questions, responses);
        else if (testType === 'interest') analysisMap.interests = analyzeInterests(questions, responses);
        else if (testType === 'skills') analysisMap.skills = analyzeSkills(questions, responses);
        else if (testType === 'values') analysisMap.values = analyzeValues(questions, responses);
      }

      console.log("Report data complete:", Object.keys(analysisMap).length, "sections");
      setReportData(analysisMap);
    } catch (err) {
      console.error("Fetch report error:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    setGenerating(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let y = 0;
      while (y < imgHeight) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -y, imgWidth, imgHeight);
        y += pageHeight;
      }
      pdf.save(`${student.name}_Career_Report.pdf`);
    } catch (err) {
      alert("Error generating PDF: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div style={overlay}>
      <div style={modal}>
        <div className="loading">Generating report...</div>
      </div>
    </div>
  );

  if (!reportData) return (
    <div style={overlay}>
      <div style={modal}>
        <h3>No completed tests yet for {student.name}</h3>
        <button className="auth-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );

  const { aptitude, personality, interests, skills, values } = reportData;

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", padding: "0 4px" }}>
          <h2 style={{ margin: 0 }}>📋 Career Assessment Report</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="auth-btn" onClick={downloadPDF} disabled={generating}>
              {generating ? "⏳ Generating..." : "⬇ Download PDF"}
            </button>
            <button className="auth-btn" onClick={onClose} style={{ background: "#718096" }}>✕ Close</button>
          </div>
        </div>

        {/* Printable report area */}
        <div ref={reportRef} style={{ background: "#fff", padding: "32px", fontFamily: "Arial, sans-serif", color: "#1a202c", fontSize: "14px", lineHeight: 1.6 }}>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #2d5016, #3d7426)", borderRadius: "10px", padding: "24px", color: "white", marginBottom: "24px", textAlign: "center" }}>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "bold" }}>CAREER ASSESSMENT REPORT</h1>
            <p style={{ margin: "6px 0", fontSize: "16px" }}><strong>{student.name}</strong></p>
            <p style={{ margin: "4px 0", fontSize: "13px", opacity: 0.9 }}>{student.class} • {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>

          {/* Aptitude Section */}
          {aptitude && (
            <ReportSection icon="🔢" title="Aptitude Analysis">
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ minWidth: "140px", textAlign: "center" }}>
                  <div style={{ background: "#f0fff4", borderRadius: "8px", padding: "16px", marginBottom: "10px" }}>
                    <div style={{ fontSize: "40px", fontWeight: "bold", color: "#276749" }}>{aptitude.pct}%</div>
                    <div style={{ fontSize: "12px", color: "#48bb78", fontWeight: "600", marginTop: "4px" }}>{aptitude.tier.tier}</div>
                    <div style={{ fontSize: "11px", color: "#718096" }}>{aptitude.correct}/{aptitude.total} Correct</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {aptitude.stackedData.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", fontSize: "12px", fontWeight: "600" }}>
                        <span>{item.name}</span>
                        <span>{item.Fair + item.Good + item.Excellent}%</span>
                      </div>
                      <div style={{ display: "flex", height: "24px", borderRadius: "4px", overflow: "hidden", background: "#e2e8f0" }}>
                        <div style={{ width: item.Fair + "%", background: "#fc8181" }} title="Fair" />
                        <div style={{ width: item.Good + "%", background: "#ecc94b" }} title="Good" />
                        <div style={{ width: item.Excellent + "%", background: "#48bb78" }} title="Excellent" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ marginTop: "12px", fontSize: "12px", color: "#4a5568", fontStyle: "italic", borderLeft: "3px solid #667eea", paddingLeft: "10px" }}>
                This section measures your logical reasoning, numerical ability, verbal skills, pattern recognition, and spatial aptitude through a series of multiple-choice questions.
              </p>
            </ReportSection>
          )}

          {/* Personality Section */}
          {personality && (
            <ReportSection icon="🧠" title="Personality Profile">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  {personality.data.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", fontSize: "12px", fontWeight: "600" }}>
                        <span>{item.name}</span>
                        <span style={{ color: "#667eea" }}>{renderStarRating(item.pct)}</span>
                      </div>
                      <div style={{ display: "flex", height: "18px", borderRadius: "3px", overflow: "hidden", background: "#e2e8f0" }}>
                        <div style={{ width: item.Fair + "%", background: "#fc8181" }} />
                        <div style={{ width: item.Good + "%", background: "#ecc94b" }} />
                        <div style={{ width: item.Excellent + "%", background: "#48bb78" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#f7fafc", borderRadius: "8px", padding: "12px", borderLeft: "4px solid #f6ad55" }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", fontSize: "13px" }}>Dominant Trait:</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#2d3748", fontWeight: "600" }}>{personality.dominant.name}</p>
                  <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#718096" }}>You show strong tendencies toward {personality.dominant.name.toLowerCase()}. This is a core part of your personality profile.</p>
                </div>
              </div>
              <p style={{ marginTop: "12px", fontSize: "12px", color: "#4a5568", fontStyle: "italic", borderLeft: "3px solid #667eea", paddingLeft: "10px" }}>
                Personality traits include Openness (creativity), Conscientiousness (organization), Extraversion (sociability), Agreeableness (compassion), and Stability (emotional control).
              </p>
            </ReportSection>
          )}

          {/* Interests Section */}
          {interests && (
            <ReportSection icon="🎯" title="Career Interests (RIASEC Model)">
              <div style={{ marginBottom: "14px" }}>
                {interests.data.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px", fontSize: "12px", fontWeight: "600" }}>
                      <span>{item.name}</span>
                      <span>{item.pct}%</span>
                    </div>
                    <div style={{ display: "flex", height: "16px", borderRadius: "2px", overflow: "hidden", background: "#e2e8f0" }}>
                      <div style={{ width: item.Fair + "%", background: "#fc8181" }} />
                      <div style={{ width: item.Good + "%", background: "#ecc94b" }} />
                      <div style={{ width: item.Excellent + "%", background: "#48bb78" }} />
                    </div>
                  </div>
                ))}
              </div>
              {interests.top && interests.top.length > 0 && (
                <div style={{ background: "#ebf8ff", borderRadius: "8px", padding: "12px", borderLeft: "4px solid #0284c7" }}>
                  <p style={{ margin: "0 0 6px 0", fontWeight: "600", fontSize: "13px", color: "#075985" }}>Your Top Interests:</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#0c51be" }}>{interests.top.join(" • ")}</p>
                </div>
              )}
              <p style={{ marginTop: "12px", fontSize: "12px", color: "#4a5568", fontStyle: "italic", borderLeft: "3px solid #667eea", paddingLeft: "10px" }}>
                RIASEC model identifies 6 interest categories: Realistic (hands-on), Investigative (analytical), Artistic (creative), Social (helping), Enterprising (leadership), and Conventional (organized).
              </p>
            </ReportSection>
          )}

          {/* Skills Section */}
          {skills && (
            <ReportSection icon="⚡" title="Skills Assessment">
              <div style={{ marginBottom: "12px" }}>
                {skills.data.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px", fontSize: "12px", fontWeight: "600" }}>
                      <span>{item.name}</span>
                      <span style={{ color: "#667eea" }}>{renderStarRating(item.pct)}</span>
                    </div>
                    <div style={{ display: "flex", height: "14px", borderRadius: "2px", overflow: "hidden", background: "#e2e8f0" }}>
                      <div style={{ width: item.Fair + "%", background: "#fc8181" }} />
                      <div style={{ width: item.Good + "%", background: "#ecc94b" }} />
                      <div style={{ width: item.Excellent + "%", background: "#48bb78" }} />
                    </div>
                  </div>
                ))}
              </div>
              {skills.top && skills.top.length > 0 && (
                <div style={{ background: "#f0fff4", borderRadius: "8px", padding: "12px", borderLeft: "4px solid #16a34a" }}>
                  <p style={{ margin: "0 0 4px 0", fontWeight: "600", fontSize: "12px", color: "#165e31" }}>📌 Strong Areas:</p>
                  {skills.top.map((s, i) => <p key={i} style={{ margin: "2px 0", fontSize: "12px", color: "#166534" }}>✓ {s}</p>)}
                </div>
              )}
            </ReportSection>
          )}

          {/* Values Section */}
          {values && (
            <ReportSection icon="💎" title="Core Values">
              <div style={{ marginBottom: "12px" }}>
                {values.data.slice(0, 10).map((item, idx) => (
                  <div key={idx} style={{ marginBottom: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px", fontSize: "11px", fontWeight: "600" }}>
                      <span>{item.name}</span>
                      <span style={{ color: "#be185d" }}>{renderStarRating(item.pct)}</span>
                    </div>
                    <div style={{ display: "flex", height: "12px", borderRadius: "1px", overflow: "hidden", background: "#e2e8f0" }}>
                      <div style={{ width: item.Fair + "%", background: "#fc8181" }} />
                      <div style={{ width: item.Good + "%", background: "#ecc94b" }} />
                      <div style={{ width: item.Excellent + "%", background: "#48bb78" }} />
                    </div>
                  </div>
                ))}
              </div>
              {values.top && values.top.length > 0 && (
                <div style={{ background: "#fce7f3", borderRadius: "8px", padding: "12px", borderLeft: "4px solid #ec4899" }}>
                  <p style={{ margin: "0 0 4px 0", fontWeight: "600", fontSize: "12px", color: "#be185d" }}>🌟 Most Important Values:</p>
                  {values.top.map((v, i) => <p key={i} style={{ margin: "2px 0", fontSize: "12px", color: "#be123c" }}>⟳ {v}</p>)}
                </div>
              )}
            </ReportSection>
          )}

          {/* Footer */}
          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "2px solid #e2e8f0", textAlign: "center", color: "#a0aec0", fontSize: "11px" }}>
            <p style={{ margin: "0 0 4px 0" }}>This career assessment report is designed for self-discovery and career planning purposes.</p>
            <p style={{ margin: 0 }}>Results should be discussed with a career counsellor for personalized guidance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportSection({ icon, title, children }) {
  return (
    <div style={{ marginBottom: "20px", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ background: "#f7fafc", padding: "14px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "18px" }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#2d3748" }}>{title}</h3>
      </div>
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
}

const overlay = {
  position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
  background: "rgba(0,0,0,0.6)", zIndex: 1000,
  display: "flex", alignItems: "flex-start", justifyContent: "center",
  overflowY: "auto", padding: "20px"
};

const modal = {
  background: "#f7fafc", borderRadius: "12px", padding: "24px",
  width: "100%", maxWidth: "950px", maxHeight: "95vh", overflowY: "auto",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
};
