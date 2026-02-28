#!/bin/bash

echo "🚀 Starting Budget Buddy..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Build and start containers
echo "🏗️  Building Docker images..."
echo ""
docker-compose up --build

echo ""
echo "✅ Budget Buddy is running!"
echo ""
echo "🌐 Access the app at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "To stop the app, press Ctrl+C"
echo ""
