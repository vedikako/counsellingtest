# Career Assessment Platform

A comprehensive career guidance system that helps students discover their aptitudes, personalities, interests, skills, and values through psychometric tests. Counsellors can view detailed reports and provide guidance based on student results.

---

## 📋 Project Overview

This platform provides:

- **5 Psychometric Tests** for students (20 questions each)
- **Real-time Reporting** with visual analytics
- **PDF Export** with professional formatting
- **Counsellor Dashboard** to track students and view reports
- **Role-based Access** (Student & Counsellor)

---

## 🛠️ Tech Stack

### **Frontend**

- **React 18** - UI framework
- **Vite 7.3** - Build tool (fast, modern bundling)
- **React Router v7** - Client-side routing
- **Recharts** - Charts & data visualization (RadarChart, BarChart)
- **html2canvas + jsPDF** - PDF generation from HTML
- **CSS** - Styling with custom stylesheets

### **Backend**

- **Supabase** - PostgreSQL database + Auth
- **Node.js** - Optional backend (for future APIs)

### **Database**

- **PostgreSQL** (via Supabase)
- **Tables**: users, counsellors, students, tests, questions, test_sessions, responses, test_results, reports

---

## 🏗️ Architecture & Folder Structure

```
careersite/
├── backend/                          # Future API server
│   ├── index.js
│   └── package.json
│
├── frontend/careersite/              # React app
│   ├── src/
│   │   ├── App.jsx                   # Main router
│   │   ├── App.css                   # Global styles
│   │   ├── main.jsx                  # Entry point
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Landing page
│   │   │   │
│   │   │   ├── counsellor/
│   │   │   │   ├── CounsellorLogin.jsx
│   │   │   │   ├── CounsellorSignup.jsx
│   │   │   │   ├── CounsellorDashboard.jsx
│   │   │   │   ├── StudentReport.jsx      # ⭐ Report generation
│   │   │   │   ├── CounsellorLanding2.jsx
│   │   │   │   └── counsellor.css
│   │   │   │
│   │   │   └── student/
│   │   │       ├── StudentRegister.jsx
│   │   │       ├── StudentLogin.jsx
│   │   │       ├── StudentDashboard.jsx   # Shows available tests
│   │   │       └── TestPage.jsx           # Test taking interface
│   │   │
│   │   ├── supabase/
│   │   │   └── client.js             # Supabase config
│   │   │
│   │   └── utils/
│   │       └── testDB.jsx
│   │
│   ├── vite.config.ts
│   ├── package.json
│   └── index.html
│
├── setup_supabase.sql                # Database initialization
├── database_schema.sql               # Schema reference
└── README.md                         # This file
```

---

## 🔐 Authentication Flow

### **Counsellor Registration & Login**

1. Counsellor signs up → Creates auth user in Supabase
2. Generates unique link: `CL-{UUID}` (used for student registration)
3. Profile auto-created on first login to dashboard
4. Stores: email, password, unique_link, counsellor_id

### **Student Registration & Login**

1. Student enters **counsellor's unique link** (CL-xxxx)
2. Looks up counsellor by unique_link
3. Creates auth user + student profile linked to counsellor
4. Password = phone number (auto-set during registration)
5. Stores: name, email, phone, counsellor_id, auth_id

---

## 📊 Five Test Types

Each test has **20 carefully designed questions** mapped to specific analysis parameters:

### **1. Aptitude Explorer** (multiple_choice)

- **Purpose**: Measures cognitive abilities
- **Questions**: 20 (4-5 per category)
  - Logical Reasoning (0-4): Syllogisms, relationships
  - Numerical (5-8): Math, percentages, speed/distance
  - Verbal (9-12): Antonyms, analogies, grammar
  - Pattern Recognition (13-16): Number series, Fibonacci
  - Spatial & General (17-19): 3D reasoning, fractions
- **Scoring**: Percentage correct (0-100%)
- **Output**: Bar chart by category (Fair/Good/Excellent)

### **2. Personality Compass** (rating 1-5)

- **Purpose**: Assess Big Five personality traits
- **Questions**: 20 (4 per trait)
  - Openness: Creativity, exploration
  - Conscientiousness: Organization, planning
  - Extraversion: Sociability, leadership
  - Agreeableness: Compassion, cooperation
  - Stability: Emotional control, resilience
- **Scoring**: Average rating per trait (1-5 scale → 0-100%)
- **Output**: Radar chart + dominant trait highlight

### **3. Interest Navigator** (true_false + rating)

- **Purpose**: Career interest assessment using RIASEC model
- **Questions**: 20 (3-4 per category)
  - Realistic (Hands-on): Engineering, mechanics
  - Investigative (Analytical): Science, research
  - Artistic (Creative): Design, arts, writing
  - Social (Helping): Teaching, counselling
  - Enterprising (Leadership): Business, sales
  - Conventional (Organized): Admin, banking
- **Scoring**: Mixed question types, percentage per category
- **Output**: Stacked bar chart + top 2 interests

### **4. Skills Inventory** (rating 1-5)

- **Purpose**: Self-assess 20 key professional skills
- **Questions**: 20 skills rated 1-5
  - Communication, Problem-solving, Leadership, etc.
- **Scoring**: 1=Poor (20%) to 5=Excellent (100%)
- **Output**: Horizontal bar chart (20 bars) + top 3 highlighted

### **5. Values Compass** (rating 1-5)

- **Purpose**: Identify core work values
- **Questions**: 20 values rated 1-5
  - Financial security, Work-life balance, Learning, etc.
- **Scoring**: 1=Not important (20%) to 5=Very important (100%)
- **Output**: Horizontal bar chart + top 3 highlighted

---

## 👨‍🎓 Student Journey

```
Student Login
    ↓
View Available Tests (5 tests, all 20 questions)
    ↓
Start Test → Question interface (one at a time)
    ↓
Answer all questions → Submit test
    ↓
Test marked as completed ✓
    ↓
After all 5 tests complete:
    → Report saved to database
    → Counsellor notified
    → Student can view PDF report
```

### **StudentDashboard Flow**

- Fetches all active tests from `tests` table
- Checks `test_sessions` for completed_at timestamp
- Shows ✓ tick and "Test Already Given" for completed tests
- Button to start test → navigates to `/student/test/{testId}`

### **TestPage Flow**

1. Initialize test session (upsert to handle duplicates)
2. Load existing answers if retaking test
3. Show one question at a time
4. Save each answer to `responses` table immediately
5. On submit:
   - Mark `test_sessions.completed_at = now()`
   - Check if all 5 tests are done
   - If yes → generate report → save to `reports` table
   - Navigate back to dashboard

---

## 👨‍🏫 Counsellor Dashboard Flow

```
Counsellor Login
    ↓
View linked students (students with same counsellor_id)
    ↓
Click "📋 View Report" on any student
    ↓
StudentReport modal opens
    ↓
Fetches completed test_sessions
    ↓
Loads questions + responses for each test
    ↓
Analyzes data = generates stats
    ↓
Renders 5 sections with charts
    ↓
Download PDF button → generates multi-page report
```

---

## 📈 Report Generation (**StudentReport.jsx**)

### **Data Flow**

```
test_sessions (completed)
    ↓
For each session:
    ├→ Get test_id → look up test_type
    ├→ Fetch questions by test_id
    ├→ Fetch responses by session_id
    └→ Run analysis function for that test_type
         ↓
         ├→ analyzeAptitude()
         ├→ analyzePersonality()
         ├→ analyzeInterests()
         ├→ analyzeSkills()
         └→ analyzeValues()
```

### **Analysis Functions** (Convert raw data → charts)

#### **analyzeAptitude(questions, responses)**

- Matches student answers to correct answers
- Handles format variations: "C" vs "Flowers do not need water"
- Groups by category (5 categories)
- Returns: percentage correct, tier (Fair/Good/Excellent), stacked bar data

**Key Logic:**

```javascript
isAnswerCorrect(answer, correctAnswer, options)
  ↓
Tries 4 matching strategies:
  1. Direct match: "C" === "C"
  2. Full text match: options.indexOf(answer)
  3. Index match: options[0] === correctAnswer
  4. Letter index: charCode (A=0, B=1, etc)
```

#### **analyzePersonality(questions, responses)**

- Groups questions 0-3 = Openness, 4-7 = Conscientiousness, etc.
- Averages rating scores per trait (1-5 scale)
- Returns: trait percentages, dominant trait

#### **analyzeInterests(questions, responses)**

- Groups by RIASEC categories
- Handles mixed question types (true/false + rating)
- True/false: true=100%, false=20%
- Rating: scales 1-5 to 0-100%
- Returns: category percentages, top 2 interests

#### **analyzeSkills(questions, responses)**

- Each question = one skill bar
- Question text = bar label (stripped of "?")
- Converts rating (1-5) → percentage (20-100)
- Returns: all 20 skills + top 3

#### **analyzeValues(questions, responses)**

- Same as skills (20 values)
- Returns: all 20 values + top 3 highlighted

### **PDF Generation**

```
1. Render report in React → HTML
2. html2canvas() → screenshot as PNG
3. jsPDF() → create PDF
4. Loop through canvas height:
   - addPage() for each page
   - addImage() with offset
5. Save as: {StudentName}_Career_Assessment_Report.pdf
```

---

## 🗄️ Database Schema

### **users** (Supabase Auth)

```sql
id (UUID)
email (text)
password (hashed)
```

### **counsellors**

```sql
id (UUID) [PK]
auth_id (UUID) [FK → auth.users]
email (text)
unique_link (text) - e.g., "CL-a1b2c3d4"
created_at (timestamp)
```

### **students**

```sql
id (UUID) [PK]
auth_id (UUID) [FK → auth.users]
counsellor_id (UUID) [FK → counsellors]
name (text)
email (text)
phone (text) - used as password
class (text)
created_at (timestamp)
```

### **tests**

```sql
id (UUID) [PK]
name (text) - e.g., "Aptitude Explorer"
description (text)
test_type (text) - 'aptitude', 'personality', 'interest', 'skills', 'values'
total_questions (int) - 20
duration_minutes (int)
is_active (boolean)
created_at (timestamp)
```

### **questions**

```sql
id (UUID) [PK]
test_id (UUID) [FK → tests]
question_text (text)
question_type (text) - 'multiple_choice', 'true_false', 'rating'
options (text[]) - JSON array for MC questions
correct_answer (text) - For MC questions (e.g., "C" or full text option)
order_index (int) - 1-20
created_at (timestamp)
```

### **test_sessions**

```sql
id (UUID) [PK]
student_id (UUID) [FK → students]
test_id (UUID) [FK → tests]
status (text) - 'in_progress', 'completed'
completed_at (timestamp) - NULL until submitted
created_at (timestamp)
```

### **responses**

```sql
id (UUID) [PK]
session_id (UUID) [FK → test_sessions]
question_id (UUID) [FK → questions]
answer (text) - Student's answer
answered_at (timestamp)
```

### **test_results**

```sql
id (UUID) [PK]
session_id (UUID) [FK → test_sessions]
percentage (int)
grade (text)
strengths (text[])
improvement_areas (text[])
career_recommendations (text[])
created_at (timestamp)
```

### **reports**

```sql
id (UUID) [PK]
student_id (UUID) [FK → students]
counsellor_id (UUID) [FK → counsellors]
summary (JSON) - Analysis results for all 5 tests
generated_at (timestamp)
```

---

## 🔄 Data Collection Example

**When a student takes Aptitude test:**

1. **Student answers Q1-Q20** in TestPage

   ```
   Each answer immediately saved to responses table:
   - session_id: abc123
   - question_id: q1
   - answer: "Flowers do not need water"
   ```

2. **Student submits test**

   ```
   test_sessions.completed_at = 2026-04-10 12:34:56
   test_sessions.status = 'completed'
   ```

3. **Counsellor views report**

   ```
   StudentReport fetches:
   - All test_sessions where completed_at IS NOT NULL
   - For each session:
     a) Get questions table
     b) Get all responses for that session
     c) Run analyzeAptitude()
        → Matches each answer to correct_answer
        → Calculates percentage
        → Groups by category
        → Returns stacked bar data
   - Renders charts
   ```

4. **PDF downloaded**
   ```
   html2canvas captures the rendered report
   → Multi-page PDF with all sections
   ```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 20.19+
- Supabase account (free tier)
- Modern web browser

### **Installation**

1. **Clone/Setup**

   ```bash
   cd careersite/frontend/careersite
   npm install
   ```

2. **Configure Supabase**
   - Create Supabase project
   - Copy anon key to `src/supabase/client.js`
   - Run `setup_supabase.sql` in SQL Editor
   - Disable "Confirm email" in Auth → Settings

3. **Start Development Server**

   ```bash
   npm run dev
   ```

   Opens at `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```

---

## 📱 Routes

### **Public Routes**

- `/` - Home page with login options

### **Counsellor Routes**

- `/counsellor/landing` - Landing page
- `/counsellor/login` - Login
- `/counsellor/signup` - Registration
- `/counsellor/dashboard` - Main dashboard (students list)

### **Student Routes**

- `/student/login` - Login
- `/student/register?link=CL-xxx` - Registration with counsellor link
- `/student/dashboard` - Available tests
- `/student/test/:testId` - Take test

---

## 💡 Key Features Explained

### **1. Stacked Bar Charts**

```
Fair (0-30%):    Red
Good (30-70%):   Yellow
Excellent (70-100%): Green
```

Visual at a glance: Red = needs improvement, Yellow = okay, Green = strong

### **2. Star Ratings**

- ⭐ = 5/5 (excellent)
- 4.5/5 stars shows mostly filled stars
- ☆ = not rated yet

### **3. Answer Format Matching**

Problem: Student answered "Flowers do not need water" but DB has correct_answer = "C"
Solution: `isAnswerCorrect()` tries 4 ways to match them intelligently

### **4. Session Upsert**

```javascript
.upsert({
  student_id, test_id, status: 'in_progress'
}, { onConflict: 'student_id,test_id' })
```

If session exists (student retaking), update it. Otherwise, create new.

### **5. PDF Multi-page Support**

```javascript
while (y < imgHeight) {
  if (y > 0) pdf.addPage()
  pdf.addImage(imgData, 'PNG', 0, -y, ...)
  y += pageHeight
}
```

Splits long report into multiple A4 pages

---

## 🔍 Troubleshooting

### **Issue: "No completed tests yet"**

**Check:**

1. Are test_sessions rows marked with `completed_at`?
   ```sql
   SELECT * FROM test_sessions WHERE completed_at IS NOT NULL;
   ```
2. Are responses saved?
   ```sql
   SELECT COUNT(*) FROM responses;
   ```
3. Do questions exist?
   ```sql
   SELECT COUNT(*) FROM questions;
   ```

### **Issue: Report shows 0% everywhere**

**Causes:**

1. `correct_answer` format doesn't match student's answer format
2. Run the SQL to insert questions (may have been deleted)
3. Check browser console for errors

### **Issue: Student not appearing on counsellor dashboard**

1. Verify `students.counsellor_id` matches counsellor's ID
2. Check that counsellor profile exists in `counsellors` table

---

## 📝 Development Notes

- **Questions are loaded on page load**, not dynamically
- **Responses are saved immediately** on each answer, not just on submit
- **Reports are generated client-side** (no server processing needed)
- **PDF uses html2canvas** (screenshot-based, not true PDF generation)
- **All data is relational** (no NoSQL or document storage)

---

## 🎯 Future Enhancements

- [ ] Email notifications to counsellors
- [ ] Career recommendations based on RIASEC scores
- [ ] Progress tracking over time
- [ ] Peer comparison analytics
- [ ] Mobile app version
- [ ] Payment integration for premium features
- [ ] AI-powered career suggestions
- [ ] Bulk student import

---

## 📄 License

Private project - All rights reserved

---

## ✅ Summary

This platform provides a **complete psychometric assessment experience**:

1. Students login with counsellor's unique link
2. Take 5 tests with 20 questions each
3. Answers immediately saved to database
4. Counsellors view professional reports with charts
5. Reports exportable as PDF

**Tech: React + Vite + Supabase + Recharts + html2canvas**

---

For questions or issues, check the database schema and ensure all tables are populated correctly!
