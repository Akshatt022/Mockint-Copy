#!/bin/bash

# Production startup script for MockInt Backend

echo "🚀 Starting MockInt Backend in Production Mode..."

# Set NODE_ENV to production if not already set
export NODE_ENV=${NODE_ENV:-production}

# Print environment info
echo "Environment: $NODE_ENV"
echo "Node Version: $(node --version)"
echo "NPM Version: $(npm --version)"
echo "Port: ${PORT:-5000}"

# Check if required environment variables are set
if [ -z "$MONGOURI" ]; then
    echo "❌ Error: MONGOURI environment variable is required"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ Error: JWT_SECRET environment variable is required"
    exit 1
fi

# Install dependencies if node_modules doesn't exist or package.json is newer
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --only=production
fi

# Run database seed if SEED_DB is set to true
if [ "$SEED_DB" = "true" ]; then
    echo "🌱 Seeding database..."
    npm run seed
fi

# Start the application
echo "🎯 Starting server..."
exec npm start