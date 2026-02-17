#!/bin/bash

echo "================================"
echo "SG Prime Enterprises Setup Check"
echo "================================"
echo ""

# Check Node.js
echo "[1/5] Checking Node.js installation..."
if command -v node &> /dev/null; then
    node --version
    echo "[OK] Node.js is installed"
else
    echo "[ERROR] Node.js is NOT installed"
    echo "Please download from: https://nodejs.org/"
fi
echo ""

# Check npm
echo "[2/5] Checking npm installation..."
if command -v npm &> /dev/null; then
    npm --version
    echo "[OK] npm is installed"
else
    echo "[ERROR] npm is NOT installed"
fi
echo ""

# Check MySQL
echo "[3/5] Checking MySQL installation..."
if command -v mysql &> /dev/null; then
    mysql --version
    echo "[OK] MySQL is installed"
else
    echo "[WARNING] MySQL command not found in PATH"
    echo "Please verify MySQL is installed and running"
fi
echo ""

# Check backend dependencies
echo "[4/5] Checking backend setup..."
if [ -d "backend/node_modules" ]; then
    echo "[OK] Backend dependencies installed"
else
    echo "[WARNING] Backend dependencies NOT installed"
    echo "Run: cd backend && npm install"
fi

if [ -f "backend/.env" ]; then
    echo "[OK] Backend .env file exists"
else
    echo "[WARNING] Backend .env file NOT found"
    echo "Run: cd backend && cp .env.example .env"
fi
echo ""

# Check frontend dependencies
echo "[5/5] Checking frontend setup..."
if [ -d "frontend/node_modules" ]; then
    echo "[OK] Frontend dependencies installed"
else
    echo "[WARNING] Frontend dependencies NOT installed"
    echo "Run: cd frontend && npm install"
fi
echo ""

echo "================================"
echo "Setup check complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. If warnings appear above, follow the suggestions"
echo "2. Import database: mysql -u root -p sg_prime_db < database/schema.sql"
echo "3. Configure backend/.env with your settings"
echo "4. Run: npm run dev (from project root)"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""
