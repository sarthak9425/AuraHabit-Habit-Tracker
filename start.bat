@echo off
setlocal
cd /d "%~dp0"
echo ========================================================
echo   AuraHabit MERN Habit Tracker
echo ========================================================
echo.
if not exist "server\.env" (
  echo Missing server\.env. Copy server\.env.example to server\.env and configure MongoDB and JWT_SECRET first.
  pause
  exit /b 1
)
echo Installing root dependencies...
call npm install
if errorlevel 1 goto :error
echo Installing frontend dependencies...
call npm install --prefix client
if errorlevel 1 goto :error
echo Installing backend dependencies...
call npm install --prefix server
if errorlevel 1 goto :error
echo Starting frontend and backend...
call npm run dev
pause
exit /b 0
:error
echo Dependency installation failed. Check the terminal output.
pause
exit /b 1
