@echo off
echo 🧪 Starting TrackFit AI Testing Environment...
echo.

echo 📋 Starting development server...
start /B npm run dev

echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak > nul

echo 🌐 Opening test dashboard in browser...
start http://localhost:8080/test

echo.
echo ✅ Testing environment ready!
echo 📍 Test Dashboard: http://localhost:8080/test
echo 📍 Main App: http://localhost:8080
echo.
echo 🧪 You can now:
echo   1. Login to your account
echo   2. Navigate to "Test Dashboard" in the sidebar
echo   3. Click "Run All Tests" to test everything
echo   4. Or run individual tests using the buttons
echo.
pause 