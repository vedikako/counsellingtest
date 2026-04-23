import { Link } from "react-router-dom";
import "./counsellor.css";

function CounsellorLanding() {
  return (
    <div className="container">
      <h1>Counsellor Portal</h1>
      <p >
        Create your counsellor account or log in to manage students,
        tests, and insights from one place.
      </p>

      <Link to="/counsellor/signup" className="btn">
        Create Account
      </Link>

      <Link to="/counsellor/login" className="btn btn-outline">
        Login
      </Link>
    </div>
  );
}

export default CounsellorLanding;
