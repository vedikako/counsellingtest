# ✅ Setup Checklist - Career Assessment Platform

## Prerequisites ✓

- [x] Node.js installed (v16+)
- [x] npm installed
- [x] Supabase account and project created
- [x] Git (optional)

---

## Database Setup (CRITICAL FIRST STEP)

### 1. Go to Supabase Dashboard

```
https://app.supabase.com
- Select your project
- Navigate to SQL Editor
```

### 2. Copy all SQL from this file:

📄 **setup_supabase.sql**

### 3. Execute in Supabase SQL Editor

- [ ] Paste SQL
- [ ] Click "Run"
- [ ] Wait for completion
- [ ] Verify tables created in Table Editor

**Tables Created:**

- tests (with 5 test types)
- questions (with 60+ sample questions)
- Indexes and RLS policies

---

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend/careersite
npm install
```

### Step 2: Create .env.local file

Create: `frontend/careersite/.env.local`

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:3000
```

**How to get these values:**

1. Go to Supabase Project Settings → API
2. Copy "Project URL"
3. Copy "anon public key"

### Step 3: Start Frontend

```bash
npm run dev
```

✅ Frontend running on: `http://localhost:5173`

---

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Create .env file

Create: `backend/.env`

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
PORT=3000
NODE_ENV=development
```

**How to get service role key:**

1. Go to Supabase Project Settings → API
2. Under "Project API keys", find "service_role" (secret)
3. Copy it carefully (keep it private!)

### Step 3: Start Backend

```bash
npm run dev
```

✅ Backend running on: `http://localhost:3000`

---

## Testing the Platform

### ✅ Test 1: Register Counsellor

```
URL: http://localhost:5173/counsellor/signup
Email: counsellor@test.com
Password: test@123
Name: Ms. Smith
```

### ✅ Test 2: Login & Get Link

```
URL: http://localhost:5173/counsellor/login
- Login with above credentials
- Copy the registration link shown
```

### ✅ Test 3: Register Student

```
URL: http://localhost:5173/student/register/{paste_link_here}
- Name: John Doe
- Class: 9
- Email: student@test.com
- Phone: 9876543210
```

### ✅ Test 4: Student Takes Test

```
URL: http://localhost:5173/student/login
- Email: student@test.com
- Phone: 9876543210
- Select "Aptitude Explorer"
- Answer questions and submit
```

### ✅ Test 5: View Results

```
- Counsellor logs back in
- Clicks on student name
- Views test results and scores
```

---

## File Structure Overview

```
careersite/
├── frontend/careersite/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx ✅
│   │   │   │   ├── StudentLogin.jsx ✅
│   │   │   │   ├── StudentRegister.jsx ✅
│   │   │   │   └── TestPage.jsx ✅
│   │   │   └── counsellor/
│   │   │       ├── CounsellorDashboard.jsx ✅
│   │   │       ├── CounsellorLogin.jsx ✅
│   │   │       └── counsellor.css ✅
│   │   └── supabase/client.js ✅
│   ├── .env.local ⚙️ (Create this)
│   └── package.json ✅
├── backend/
│   ├── index.js ✅
│   ├── .env ⚙️ (Create this)
│   └── package.json ✅
└── setup_supabase.sql ✅
```

---

## 🐛 Troubleshooting

### Frontend won't start

```bash
# Try deleting node_modules and reinstalling
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Backend port 3000 already in use

```bash
# Either: Find process on port 3000 and kill it
# Or: Change PORT in backend/.env to 3001
```

### Students table error

✅ Make sure you ran `setup_supabase.sql` in Supabase

### "Cannot find module" errors

```bash
# Reinstall dependencies in both frontend and backend
npm install
```

### Tests not showing up

1. Check Supabase: Table Editor → tests → verify data exists
2. Check browser console for API errors
3. Make sure backend is running

---

## 📊 What's Included

### 5 Complete Test Types:

1. ✅ **Aptitude Explorer** - 12 questions
2. ✅ **Personality Compass** - 15 questions
3. ✅ **Interest Navigator** - 12 questions
4. ✅ **Skills Inventory** - 10 questions
5. ✅ **Values Compass** - 12 questions

### Features:

- ✅ Counsellor registration & login
- ✅ Student registration via link
- ✅ Student test taking interface
- ✅ Progress tracking
- ✅ Score calculation
- ✅ Results viewing for counsellors
- ✅ Database with RLS security

---

## 🚀 Production Checklist

- [ ] Set VITE_API_URL to production backend
- [ ] Enable CORS for production domain
- [ ] Test all flows in production
- [ ] Set up error logging
- [ ] Enable rate limiting
- [ ] Add email notifications
- [ ] Generate PDF reports
- [ ] Set up automated backups

---

## 📞 Support Docs

- Database Schema: See `database_schema.sql` and `setup_supabase.sql`
- API Docs: See `SETUP_GUIDE.md`
- Component Details: See code comments in React files

---

**Status: ✅ Ready to Deploy!**

All files are configured and ready to run. Follow the steps above and you'll have a fully functional Career Assessment Platform. 🎓🚀
