@echo off
echo ================================
echo SG Prime Enterprises Setup Check
echo ================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    node --version
    echo [OK] Node.js is installed
) else (
    echo [ERROR] Node.js is NOT installed
    echo Please download from: https://nodejs.org/
)
echo.

REM Check npm
echo [2/5] Checking npm installation...
where npm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    npm --version
    echo [OK] npm is installed
) else (
    echo [ERROR] npm is NOT installed
)
echo.

REM Check MySQL
echo [3/5] Checking MySQL installation...
where mysql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    mysql --version
    echo [OK] MySQL is installed
) else (
    echo [WARNING] MySQL command not found in PATH
    echo Please verify MySQL is installed and running
)
echo.

REM Check backend dependencies
echo [4/5] Checking backend setup...
if exist "backend\node_modules" (
    echo [OK] Backend dependencies installed
) else (
    echo [WARNING] Backend dependencies NOT installed
    echo Run: cd backend && npm install
)

if exist "backend\.env" (
    echo [OK] Backend .env file exists
) else (
    echo [WARNING] Backend .env file NOT found
    echo Run: cd backend && copy .env.example .env
)
echo.

REM Check frontend dependencies
echo [5/5] Checking frontend setup...
if exist "frontend\node_modules" (
    echo [OK] Frontend dependencies installed
) else (
    echo [WARNING] Frontend dependencies NOT installed
    echo Run: cd frontend && npm install
)
echo.

echo ================================
echo Setup check complete!
echo ================================
echo.
echo Next steps:
echo 1. If warnings appear above, follow the suggestions
echo 2. Import database: mysql -u root -p sg_prime_db ^< database\schema.sql
echo 3. Configure backend\.env with your settings
echo 4. Run: npm run dev (from project root)
echo.
echo For detailed instructions, see SETUP.md
echo.
pause
