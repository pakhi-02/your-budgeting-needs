@echo off
echo.
echo Launching Budget Buddy...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker is not installed. Please install Docker first.
    echo Visit: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

REM Start Docker containers
echo Building and starting Docker containers...
echo.
docker-compose up --build

echo.
echo Budget Buddy is running!
echo.
echo Access the app at:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo Press Ctrl+C to stop the app
echo.
pause
