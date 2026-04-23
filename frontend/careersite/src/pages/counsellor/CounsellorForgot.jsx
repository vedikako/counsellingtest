import { useState } from "react";
import { supabase } from "../../supabase/client";
import { Link } from "react-router-dom";
import "./counsellor.css";

export default function CounsellorForgot() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/counsellor/login",
    });

    setMessage("Password reset link sent to your email.");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>

        {message && <div className="success-box">{message}</div>}

        <form onSubmit={handleReset}>
          <label>Email</label>
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="auth-btn">Send Reset Link</button>
        </form>

        <p className="auth-footer">
          <Link to="/counsellor/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
