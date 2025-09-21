#!/bin/bash

echo "🚀 Running Daily Photo Enhancement..."
echo "📅 Date: $(date)"
echo ""

# Run the daily photo enhancement script
npx ts-node src/scripts/dailyPhotoEnhancement.ts

echo ""
echo "📊 Checking updated status..."
echo ""

# Check the updated status
npx ts-node src/scripts/checkPhotoStatus.ts

echo ""
echo "✅ Daily photo enhancement completed!"
echo "🔄 Run this script again tomorrow to continue the process."
