#!/bin/bash

# Kill any existing node processes
killall node 2>/dev/null || true

# Wait a moment
sleep 2

# Start the server
echo "Starting Afritable backend server..."
npm start
