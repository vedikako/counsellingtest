# Career Assessment Platform - Complete Setup Guide

## 🚀 Project Structure

```
careersite/
├── frontend/
│   └── careersite/          # React Vite app
│       ├── src/
│       │   ├── pages/
│       │   │   ├── student/
│       │   │   │   ├── StudentDashboard.jsx
│       │   │   │   ├── StudentLogin.jsx
│       │   │   │   ├── StudentRegister.jsx
│       │   │   │   └── TestPage.jsx
│       │   │   └── counsellor/
│       │   │       ├── CounsellorDashboard.jsx
│       │   │       ├── CounsellorLogin.jsx
│       │   │       └── CounsellorSignup.jsx
│       │   └── supabase/
│       │       └── client.js
│       └── .env.local
├── backend/                 # Node.js Express API
│   ├── index.js
│   ├── package.json
│   └── .env
├── setup_supabase.sql       # SQL setup script
└── README.md
```

## 📋 Step-by-Step Setup

### Step 1: Setup Supabase Database

1. **Go to your Supabase Dashboard**
2. **Open SQL Editor**
3. **Copy the entire content of `setup_supabase.sql`**
4. **Paste and execute it**
   - This creates: `tests`, `questions` tables
   - Inserts 5 test types with all questions
   - Sets up RLS policies

#### What gets created:

- `tests` table - Test definitions (Aptitude, Personality, Interest, Skills, Values)
- `questions` table - All questions for each test
- Sample data for all 5 tests with 10-12 questions each
- Proper indexes for performance

### Step 2: Get Your Supabase Credentials

1. **Go to Project Settings → API**
2. **Copy your `Project URL` and `anon public key`**
3. **For backend, also get `service_role secret key`** from Settings → API

### Step 3: Setup Frontend (.env.local)

Create file: `frontend/careersite/.env.local`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:3000
```

### Step 4: Setup Backend

1. **Navigate to backend folder:**

   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file:**

   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   PORT=3000
   NODE_ENV=development
   ```

3. **Start backend:**
   ```bash
   npm run dev
   ```

   - Backend will run on `http://localhost:3000`

### Step 5: Run Frontend

```bash
cd frontend/careersite
npm install
npm run dev
```

- Frontend will run on `http://localhost:5173`

---

## 📱 How to Use the Platform

### For Counsellors:

1. **Go to** `http://localhost:5173/counsellor/signup`
2. **Sign up** with email and password
3. **Login** to dashboard
4. **Copy the registration link** shown in dashboard
5. **Share link with students** for them to register

### For Students:

1. **Use the counsellor's link** to register:
   `http://localhost:5173/student/register/{unique_link}`
2. **Fill registration form** (Name, Class, Email, Phone)
3. **Login** with email and phone
4. **Select tests** from dashboard
5. **Complete tests** one by one
6. **View results** immediately after submission

### For Counsellors (Dashboard):

1. **View all registered students**
2. **Click on a student** to see their test results
3. **View scores**, strengths, and improvement areas
4. **Make data-driven recommendations**

---

## 🗄️ Database Schema Overview

### Tables (Your Current Schema):

**counsellors**

- id, email, name, phone, organization
- unique_link, credits_remaining, auth_id
- created_at, is_active

**students**

- id, counsellor_id, name, class, email, phone
- auth_id, tests_completed, registered_at
- interests (JSONB)

**test_attempts**

- id, student_id, counsellor_id, test_type
- responses (JSONB) - stores answers
- scores (JSONB) - calculated scores
- completed_at

**reports**

- id, student_id, counsellor_id
- report_data (JSONB) - full analysis
- generated_at, emailed_at, viewed_at

**tests** (CREATED)

- id, name, description, test_type
- duration_minutes, total_questions, is_active

**questions** (CREATED)

- id, test_id, question_text, question_type
- options (JSONB), correct_answer, order_index

---

## 🎯 API Endpoints (Backend)

### Tests

- `GET /api/tests` - Get all active tests
- `GET /api/tests/:testId` - Get test with questions

### Student

- `GET /api/students/:studentId` - Get student profile
- `GET /api/students/:studentId/attempts` - Get test attempts

### Test Attempts

- `POST /api/test-attempts` - Create new attempt
- `PUT /api/test-attempts/:attemptId/responses` - Save responses
- `POST /api/test-attempts/:attemptId/complete` - Complete test

### Reports

- `GET /api/reports/student/:studentId` - Get student report
- `POST /api/reports/generate` - Generate report
- `GET /api/counsellors/:counsellorId/reports` - Get all reports

### Scoring

- `POST /api/scoring/calculate` - Calculate scores for responses

---

## 🧪 Test The Flow

### Test 1: Counsellor Signup & Login

```
1. Visit: http://localhost:5173/counsellor/signup
2. Register with email: test@counsellor.com, password: test123
3. Login at: http://localhost:5173/counsellor/login
4. Copy registration link from dashboard
```

### Test 2: Student Registration

```
1. Use counsellor link at: http://localhost:5173/student/register/{link}
2. Fill form: Name, Class (8 or 9), Email, Phone
3. Click Register
```

### Test 3: Student Login & Take Test

```
1. Visit: http://localhost:5173/student/login
2. Email: student@email.com, Phone: student_phone
3. Dashboard shows 5 available tests
4. Click "Start Test" on any test
5. Answer questions and submit
```

### Test 4: Counsellor Dashboard

```
1. Counsellor logs back in
2. See list of all registered students
3. Click on a student to see test results
4. View scores, strengths, recommendations
```

---

## 📊 5 Test Types Included

1. **Aptitude Explorer** (12 questions)
   - Logical reasoning, math, verbal reasoning
   - Pattern completion, critical thinking

2. **Personality Compass** (15 questions)
   - Big Five traits assessment
   - Work preference indicators

3. **Interest Navigator** (12 questions)
   - RIASEC model based
   - Career interest exploration
   - Subject preference mapping

4. **Skills Inventory** (10 questions)
   - Self-assessment of abilities
   - Strength identification

5. **Values Compass** (12 questions)
   - Work value prioritization
   - Life-career balance
   - Personal fulfillment drivers

---

## 🔧 Troubleshooting

### Frontend won't connect to Supabase

- Check `.env.local` has correct URL and key
- Verify Supabase project is active
- Check browser console for errors

### Backend not responding

- Make sure backend is running on port 3000
- Check `.env` file in backend folder
- Verify Node.js is installed (v16+)

### Database tables not found

- Run `setup_supabase.sql` in Supabase SQL Editor
- Check all tables are created in Supabase dashboard

### Tests not showing up

- Verify tests table has data
- Check questions are inserted properly
- Use Supabase dashboard to verify data

---

## 🚀 Production Checklist

- [ ] Set up proper authentication flow
- [ ] Enable RLS policies (already included)
- [ ] Create email notification system
- [ ] Generate PDF reports
- [ ] Add analytics dashboard
- [ ] Implement report caching
- [ ] Set up CI/CD pipeline
- [ ] Enable CORS properly
- [ ] Add rate limiting
- [ ] Implement proper error handling

---

## 📚 Next Steps

1. ✅ Setup database with SQL script
2. ✅ Configure environment variables
3. ✅ Start backend and frontend
4. ✅ Test the complete flow
5. ❓ Customize test questions
6. ❓ Add more test types
7. ❓ Create PDF report generation
8. ❓ Add email notifications

---

**Your platform is now ready to help students discover their career path!** 🎓✨
