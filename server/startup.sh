#!/bin/bash

# Azure App Service Startup Script
# This runs when your backend starts in Azure

echo "🚀 Starting UX Audit Backend..."

# Generate Prisma client (needed after deployment)
echo "📦 Generating Prisma client..."
npx prisma generate

# Start the Express server (compiled JavaScript)
echo "🌐 Starting Express server on port ${PORT:-8080}..."
node dist/index.js
