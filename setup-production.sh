#!/bin/bash

# Quick Setup Script for Production-Ready Changes
# Run this before deploying to production

echo "========================================"
echo "SG Prime Enterprises - Production Setup"
echo "========================================"
echo ""

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Step 1: Installing backend dependencies..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "📝 Step 2: Checking database migration script..."
cd ../database

if [ -f "migrate-to-production.js" ]; then
    echo "✅ Migration script found"
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ Database migration dependencies installed"
    else
        echo "❌ Failed to install migration dependencies"
        exit 1
    fi
else
    echo "❌ Migration script not found"
    exit 1
fi

cd ..

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Next Steps for Production Deployment:"
echo ""
echo "1. Review changes:
   cat PRODUCTION-READY-CHANGES.md"
echo ""
echo "2. On your production server, run database migration:
   cd database && node migrate-to-production.js"
echo ""
echo "3. Configure production environment:
   - Copy backend/.env.production.example to backend/.env
   - Fill in all production values (DB, JWT secret, email, domain)"
echo ""
echo "4. Deploy and test using:
   PRODUCTION-DEPLOYMENT-CHECKLIST.md"
echo ""
echo "5. Change admin password after first login!"
echo ""
echo "⚠️  IMPORTANT REMINDERS:"
echo "   - Generate new JWT_SECRET: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
echo "   - Use Gmail App Password for EMAIL_PASSWORD"
echo "   - Change admin password from default (admin123)"
echo "   - Test all endpoints before going live"
echo ""
echo "📚 Documentation:"
echo "   - PRODUCTION-READY-CHANGES.md (What was fixed)"
echo "   - PRODUCTION-DEPLOYMENT-CHECKLIST.md (Deployment guide)"
echo "   - HOSTINGER_VPS_DEPLOYMENT.md (Server setup)"
echo ""
echo "🚀 Good luck with your deployment!"
echo ""
