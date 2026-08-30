@echo off
echo.
echo ==========================================
echo   ScreenSaathi — Set Gemini API Key
echo ==========================================
echo.
echo Your browser should be open at:
echo   https://aistudio.google.com/app/apikey
echo.
echo Steps:
echo   1. Sign in with your Google account
echo   2. Click "Create API key"
echo   3. Copy the key (it starts with "AIza...")
echo   4. Paste it below and press ENTER
echo.
set /p APIKEY="Paste your Gemini API key here: "

if "%APIKEY%"=="" (
    echo ERROR: No key entered. Please try again.
    pause
    exit /b 1
)

echo.
echo Writing key to server\.env...
(
    echo GEMINI_API_KEY=%APIKEY%
    echo PORT=3001
    echo ALLOWED_ORIGIN=http://localhost:5173
    echo CONFIDENCE_THRESHOLD=0.55
    echo MONEY_CONFIDENCE_THRESHOLD=0.80
) > server\.env

echo Done! Key saved.
echo.
echo Restarting the server...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 1 /nobreak >nul

start "ScreenSaathi Server" cmd /c "cd /d %~dp0server && node index.js"
timeout /t 2 /nobreak >nul

echo.
echo ==========================================
echo   Server restarted with your API key!
echo   Go to: http://localhost:5173
echo   Upload any screenshot for REAL AI analysis
echo ==========================================
echo.
pause
