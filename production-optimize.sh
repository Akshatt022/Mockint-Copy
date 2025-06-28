#!/bin/bash

# Production Optimization Script for MockInt

echo "🔧 Optimizing MockInt for Production Deployment..."

# Frontend Optimization
echo "📦 Optimizing Frontend..."
cd Frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm ci --only=production

# Build optimized version
echo "Building optimized frontend..."
npm run build

# Check build size
echo "Build size analysis:"
du -sh dist/
ls -la dist/

cd ..

# Backend Optimization
echo "🚀 Optimizing Backend..."
cd Backend

# Install dependencies
echo "Installing backend dependencies..."
npm ci --only=production

# Remove development files
echo "Cleaning up development files..."
rm -rf tests/ coverage/ *.test.js

# Check for potential security issues (if audit is available)
echo "Running security audit..."
npm audit --only=prod || echo "⚠️  Some vulnerabilities found, please review"

cd ..

echo "✅ Production optimization complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up environment variables in your hosting platform"
echo "2. Configure MongoDB Atlas connection"
echo "3. Deploy using the provided configuration files"
echo "4. Seed the database after deployment"
echo "5. Create admin account"
echo ""
echo "📁 Important files created:"
echo "- render.yaml (Render.com deployment config)"
echo "- Dockerfiles (Container deployment)"
echo "- .env.production.example (Environment variable templates)"
echo "- DEPLOYMENT_GUIDE.md (Complete deployment instructions)"