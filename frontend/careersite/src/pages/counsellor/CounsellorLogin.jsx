// import { supabase } from "../../supabase/client";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import "./counsellor.css";
// function CounsellorLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     const user = data.user;

//     // 🔥 Insert profile if not exists
//     const { error: insertError } = await supabase
//       .from("counsellors")
//       .insert({
//         auth_id: user.id,
//         email: user.email,
//         unique_link: `CL-${crypto.randomUUID().slice(0, 8)}`,
//       })
//       .select()
//       .maybeSingle();

//     // ignore duplicate insert errors
//     navigate("/counsellor/dashboard");
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <input onChange={(e) => setEmail(e.target.value)} />
//       <input type="password" onChange={(e) => setPassword(e.target.value)} />
//       <button>Login</button>
//     </form>
//   );
// }

// export default CounsellorLogin;



//Better ui
import { useState } from "react";
import { supabase } from "../../supabase/client";
import { useNavigate, Link } from "react-router-dom";
import "./counsellor.css";

export default function CounsellorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    navigate("/counsellor/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>

        {errorMsg && <div className="error-box">{errorMsg}</div>}

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <div className="auth-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>

            <Link to="/counsellor/forgot">Forgot password?</Link>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/counsellor/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

