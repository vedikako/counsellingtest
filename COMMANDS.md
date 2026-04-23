# Supabase Setup & Command Reference

## 📋 SUPABASE SETUP (What to do in Supabase Dashboard)

### Step 1: Execute SQL Script

1. Go to: **https://app.supabase.com**
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Paste the entire content of **`setup_supabase.sql`**
6. Click **"Run"** button
7. Wait for completion ✅

**This creates:**

- ✅ `tests` table (with 5 test types)
- ✅ `questions` table (with 60+ questions)
- ✅ Proper indexes
- ✅ RLS (Row Level Security) policies

### Step 2: Get Your API Keys

1. Go to **Project Settings** (gear icon)
2. Click **API** in left menu
3. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role (secret)** → `SUPABASE_SERVICE_KEY` (for backend only!)

### Step 3: Verify Tables Were Created

1. Go to **Table Editor** (left sidebar)
2. You should see:
   - counsellors ✅
   - students ✅
   - test_attempts ✅
   - reports ✅
   - **tests** ✅ (newly created)
   - **questions** ✅ (newly created)
   - profiles ✅

---

## 💻 TERMINAL COMMANDS

### Terminal 1: Backend Setup & Start

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
echo "SUPABASE_URL=https://your-project.supabase.co" > .env
echo "SUPABASE_SERVICE_KEY=your_service_role_key" >> .env
echo "PORT=3000" >> .env
echo "NODE_ENV=development" >> .env

# Start backend
npm run dev

# Expected output:
# 🚀 Backend server running on http://localhost:3000
# 📊 Career Assessment Platform API Ready
```

### Terminal 2: Frontend Setup & Start

```bash
# Navigate to frontend
cd frontend/careersite

# Install dependencies
npm install

# Create .env.local file
echo "VITE_SUPABASE_URL=https://your-project.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your_anon_public_key" >> .env.local
echo "VITE_API_URL=http://localhost:3000" >> .env.local

# Start frontend
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
```

---

## 🔗 URLs & Credentials

After setup, you'll have these running:

| Component   | URL                     | Purpose                      |
| ----------- | ----------------------- | ---------------------------- |
| Frontend    | `http://localhost:5173` | Student/Counsellor interface |
| Backend     | `http://localhost:3000` | API server                   |
| Supabase DB | (cloud)                 | Database & Auth              |

---

## 📝 SQL SCRIPT SUMMARY

The `setup_supabase.sql` file contains:

### Creates These Tables:

```sql
1. tests (if not exists)
   - id, name, description, test_type, duration_minutes, total_questions

2. questions (if not exists)
   - id, test_id, question_text, question_type, options, correct_answer, order_index
```

### Inserts This Data:

```
1. 5 Tests:
   - Aptitude Explorer (12 questions)
   - Personality Compass (15 questions)
   - Interest Navigator (12 questions)
   - Skills Inventory (10 questions)
   - Values Compass (12 questions)

2. 60+ Questions:
   - Multiple choice questions
   - True/false questions
   - Rating scale questions (1-5)
```

### Adds:

```
✅ Indexes for performance
✅ RLS (Row Level Security) policies
✅ ON CONFLICT DO NOTHING (safe to re-run)
```

---

## ⚙️ Configuration Files to Create

### 1. `frontend/careersite/.env.local`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
VITE_API_URL=http://localhost:3000
```

### 2. `backend/.env`

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_secret_key_here
PORT=3000
NODE_ENV=development
```

---

## 🧪 Test Endpoints (via curl or browser)

### Check Backend Health

```bash
curl http://localhost:3000/health
```

### Get All Tests

```bash
curl http://localhost:3000/api/tests
```

### Get Specific Test with Questions

```bash
curl http://localhost:3000/api/tests/{testId}
```

### Calculate Scores

```bash
curl -X POST http://localhost:3000/api/scoring/calculate \
  -H "Content-Type: application/json" \
  -d '{"responses":{"q1":"answer"},"testType":"aptitude"}'
```

---

## 🚨 Common Issues & Fixes

### "EADDRINUSE: address already in use :::3000"

**Fix:**

```bash
# Change port in backend/.env to 3001
PORT=3001

# Or kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID {PID} /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### "Cannot connect to Supabase"

**Fix:**

```bash
# Check .env files have correct values
# Verify URL starts with https://
# Verify keys are correct (no extra spaces)
# Check if Supabase project is active
```

### "Tables not found"

**Fix:**

```
1. Go to Supabase SQL Editor
2. Run setup_supabase.sql again
3. Check Table Editor for created tables
4. Refresh page (Ctrl+R)
```

### "Tests not showing in frontend"

**Fix:**

```bash
# Check if tests table has data
SELECT COUNT(*) FROM tests;

# Check browser console for API errors
# Make sure backend is running
```

---

## 📊 Data Flow

```
User Browser
    ↓
    ↓ http://localhost:5173
Vite Frontend (React)
    ↓ (Supabase Client)
Supabase Auth & Database
    ↓ (HTTP)
Express Backend (http://localhost:3000)
    ↓ (Supabase SDK)
Supabase Database
```

---

## ✅ Verification Checklist

- [ ] SQL script executed in Supabase
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Both `.env` files created correctly
- [ ] Can access `http://localhost:5173`
- [ ] Can access `http://localhost:3000/health`
- [ ] Tables visible in Supabase Table Editor
- [ ] Test data visible in `tests` table

---

## 📞 What's Next?

1. ✅ Run SQL setup
2. ✅ Start backend
3. ✅ Start frontend
4. ✅ Go to http://localhost:5173/counsellor/signup
5. ✅ Register & login
6. ✅ Get registration link
7. ✅ Register student
8. ✅ Student takes test
9. ✅ View results

**Expected time: 5-10 minutes** ⏱️

Ready to deploy? Go to **CHECKLIST.md** for detailed testing steps!
