# 🚀 Quick Start Guide - Budget Buddy

## Super Easy Start (Recommended)

### On macOS/Linux:
```bash
./start.sh
```

### On Windows:
```cmd
start.bat
```

That's it! The app will be running at http://localhost:3000 🎉

---

## Manual Docker Start

```bash
docker-compose up --build
```

---

## Features to Try

1. **Add a Budget**
   - Click "Add Budget"
   - Enter category (e.g., "Groceries", "Entertainment")
   - Set a spending limit
   - Click "Save Budget"

2. **Add Transactions**
   - Click "Add Transaction"
   - Select Income or Expense
   - Enter category
   - Enter amount
   - Click "Save Transaction"

3. **View Dashboard**
   - See total income, expenses, and balance
   - Watch progress bars show your spending
   - Budget turns red if you exceed the limit

---

## Stop the App

### On macOS/Linux:
```bash
./stop.sh
```

### On Windows:
```cmd
stop.bat
```

Or simply press `Ctrl+C` in the terminal running the app.

---

## Where to Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

---

## Troubleshooting

**Port already in use?**
```bash
# Stop other services on port 3000 or 5000
# Or change the ports in docker-compose.yml
```

**Docker not installed?**
- Visit: https://docs.docker.com/get-docker/

**Want to see logs?**
```bash
docker-compose logs -f
```

**Want to clean everything?**
```bash
docker-compose down -v
```

---

Enjoy budgeting! 💰
