#!/bin/bash

set -e  # Exit on any error

echo "🔧 Installing dependencies..."
npm ci

echo "🗄️ Generating Prisma client..."
npx prisma generate

echo "🏗️ Building TypeScript..."
npx tsc --noEmitOnError

echo "📊 Running database migrations..."
npx prisma db push --accept-data-loss

echo "✅ Build completed successfully!"
