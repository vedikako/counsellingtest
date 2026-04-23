import { useState } from "react";
import { supabase } from "../../supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import "../counsellor/counsellor.css";

export default function StudentRegister() {
  const { link } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    class: "",
    email: "",
    phone: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    // 1️⃣ Get counsellor id from unique link
    const { data: counsellor, error: counsellorError } = await supabase
      .from("counsellors")
      .select("id")
      .eq("unique_link", link)
      .single();

    if (counsellorError || !counsellor) {
      setErrorMsg("Invalid registration link");
      setLoading(false);
      return;
    }

    // 2️⃣ Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.phone, // using phone as temp password
    });

    if (authError) {
      setErrorMsg(authError.message);
      setLoading(false);
      return;
    }

    // 3️⃣ Insert student profile
    const { error: insertError } = await supabase
      .from("students")
      .insert({
        auth_id: authData.user.id,
        counsellor_id: counsellor.id,
        name: formData.name,
        class: formData.class,
        email: formData.email,
        phone: formData.phone,
      });

    setLoading(false);

    if (insertError) {
      setErrorMsg("Failed to create profile: " + insertError.message);
      return;
    }

    alert("Registration successful. Please login with your email and phone number as password.");
    navigate("/student/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Student Registration</h2>

        {errorMsg && <div className="error-box">{errorMsg}</div>}

        <form onSubmit={handleRegister}>
          <label>Full Name</label>
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <label>Standard / Class</label>
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, class: e.target.value })
            }
          />

          <label>Email</label>
          <input
            type="email"
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <label>Phone (Will be your password)</label>
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}