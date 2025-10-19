@echo off
echo ==========================================
echo AI Resume Generator v2.0 - Setup
echo ==========================================

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js 16 or higher
    pause
    exit /b 1
)

echo Python and Node.js found
echo.

REM Backend setup
echo Setting up backend...
cd backend

python -m venv venv
call venv\Scripts\activate.bat

python -m pip install --upgrade pip
pip install -r requirements.txt

echo Downloading spaCy model...
python -m spacy download en_core_web_sm

echo Backend setup complete!
echo.

REM Frontend setup
echo Setting up frontend...
cd ..\frontend

call npm install

echo Frontend setup complete!
echo.

echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   python app.py
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm start
echo.
echo Then open: http://localhost:3000
echo ==========================================
pause