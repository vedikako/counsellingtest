import { useState } from "react";
import { supabase } from "../../supabase/client";
import { useNavigate } from "react-router-dom";
import "../counsellor/counsellor.css";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: phone,
    });

    if (error) {
      setErrorMsg("Invalid credentials");
      return;
    }

    // Fetch student profile
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("auth_id", data.user.id)
      .single();

    if (studentError || !studentData) {
      setErrorMsg("Profile not found");
      return;
    }

    localStorage.setItem("student", JSON.stringify(studentData));
    navigate("/student/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Student Login</h2>

        {errorMsg && <div className="error-box">{errorMsg}</div>}

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Phone Number</label>
          <input
            type="text"
            required
            onChange={(e) => setPhone(e.target.value)}
          />

          <button className="auth-btn">Login</button>
        </form>
      </div>
    </div>
  );
}
