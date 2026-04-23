#!/bin/bash
# QUICK START GUIDE
# Run these commands in order

echo "==================================="
echo "Career Assessment Platform"
echo "Quick Start Setup"
echo "==================================="
echo ""

# Step 1
echo "✅ Step 1: SQL SETUP (Manual)"
echo "1. Go to: https://app.supabase.com"
echo "2. Open your project"
echo "3. Go to SQL Editor"
echo "4. Copy content from: setup_supabase.sql"
echo "5. Paste and execute"
echo "6. Wait for completion"
echo ""
echo "Press ENTER when SQL is done..."
read

# Step 2
echo "✅ Step 2: Configure Environment Variables"
echo ""
echo "Frontend setup:"
echo "File: frontend/careersite/.env.local"
echo "Add:"
echo "VITE_SUPABASE_URL=your_url"
echo "VITE_SUPABASE_ANON_KEY=your_key"
echo "VITE_API_URL=http://localhost:3000"
echo ""
echo "Backend setup:"
echo "File: backend/.env"
echo "Add:"
echo "SUPABASE_URL=your_url"
echo "SUPABASE_SERVICE_KEY=your_service_key"
echo "PORT=3000"
echo ""
echo "Press ENTER when files are created..."
read

# Step 3
echo "✅ Step 3: Starting Backend"
cd backend
npm install
npm run dev &
BACKEND_PID=$!
echo "Backend starting (PID: $BACKEND_PID)..."
sleep 3
echo ""

# Step 4
echo "✅ Step 4: Starting Frontend (in new terminal)"
echo "Run this command in a new terminal window:"
echo "cd frontend/careersite && npm install && npm run dev"
echo ""
echo "Frontend URL: http://localhost:5173"
echo "Backend URL: http://localhost:3000"
echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. Open http://localhost:5173/counsellor/signup"
echo "2. Create a counsellor account"
echo "3. Login and get registration link"
echo "4. Register students with the link"
echo "5. Students take tests"
echo "6. View results in counsellor dashboard"
