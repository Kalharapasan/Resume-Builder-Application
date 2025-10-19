````batch
@echo off
echo ================================
echo AI Resume Generator Setup
echo ================================

REM Backend setup
echo Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate.bat

REM Install dependencies
pip install -r requirements.txt

REM Download spaCy model
python -m spacy download en_core_web_sm

echo Backend setup complete!

REM Frontend setup
echo Setting up frontend...
cd ..\frontend

REM Install dependencies
call npm install

echo Frontend setup complete!

echo.
echo ================================
echo Setup Complete!
echo ================================
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
echo ================================
pause
````