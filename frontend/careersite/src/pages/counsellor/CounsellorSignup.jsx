// import "./counsellor.css";
// import { useState } from "react";
// import { supabase } from "../../supabase/client";

// export default function CounsellorSignup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: "http://localhost:5173/counsellor/login",
//       },
//     });

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     alert("Check your email to confirm signup");
//   };

//   return (
//     <form onSubmit={handleSignup}>
//       <input
//         type="email"
//         placeholder="Email"
//         required
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         required
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit">Sign up</button>
//     </form>
//   );
// }


//better ui 

import { useState } from "react";
import { supabase } from "../../supabase/client";
import { useNavigate, Link } from "react-router-dom";
import "./counsellor.css";

export default function CounsellorSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/counsellor/login",
      },
    });

    if (error) {
      setLoading(false);
      setErrorMsg(error.message);
      return;
    }

    // Insert counsellor profile with a unique registration link
    const uniqueLink = `CL-${crypto.randomUUID().slice(0, 8)}`;
    const { error: insertError } = await supabase
      .from("counsellors")
      .insert({
        auth_id: authData.user.id,
        email: email,
        unique_link: uniqueLink,
      });

    setLoading(false);

    if (insertError) {
      setErrorMsg("Account created but profile setup failed: " + insertError.message);
      return;
    }

    alert("Account created successfully! Please login.");
    navigate("/counsellor/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        {errorMsg && <div className="error-box">{errorMsg}</div>}

        <form onSubmit={handleSignup}>
          <label>Email</label>
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/counsellor/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

