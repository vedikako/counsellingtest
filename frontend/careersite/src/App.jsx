
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

import CounsellorLanding from "./pages/counsellor/CounsellorLanding2";
import CounsellorLogin from "./pages/counsellor/CounsellorLogin";
import CounsellorSignup from "./pages/counsellor/CounsellorSignup";
// import "./counsellor.css"; 
import CounsellorForgot from "./pages/counsellor/CounsellorForgot";


import TestDB from "./utils/testDB";
import CounsellorDashboard from "./pages/counsellor/CounsellorDashboard";

import StudentRegister from "./pages/student/StudentRegister";
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import TestPage from "./pages/student/TestPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test-db" element={<TestDB />} />
        <Route path="/counsellor/dashboard" element={<CounsellorDashboard />} />

        <Route path="/counsellor/landing" element={<CounsellorLanding />} />
        <Route path="/counsellor/login" element={<CounsellorLogin />} />
        <Route path="/counsellor/signup" element={<CounsellorSignup />} />
        <Route path="/counsellor/forgot" element={<CounsellorForgot />} />
        <Route path="/student/register/:link" element={<StudentRegister />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/test/:testId" element={<TestPage />} />

      </Routes>
      
    </BrowserRouter>
  );


}

export default App;

