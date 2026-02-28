# 💰 Budget Buddy - A Cute Budgeting App!

A beautiful and user-friendly budgeting application built with React, Node.js, and MongoDB, containerized with Docker.

## Features ✨

- 📊 **Budget Management**: Create and track budgets for different categories
- 💳 **Transaction Tracking**: Log income and expense transactions
- 📈 **Visual Progress Bars**: See how much you've spent vs. your budget limit
- ⚠️ **Budget Alerts**: Get notified when you exceed your budget
- 💵 **Balance Overview**: See your total income, expenses, and balance at a glance
- 🎨 **Cute UI**: Beautiful gradient design with smooth transitions

## Tech Stack

- **Frontend**: React 18, Axios, React Icons
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker and Docker Compose installed on your system
- macOS, Linux, or Windows with WSL2

## Quick Start with Docker

### 1. Start the application
```bash
docker-compose up --build
```

### 2. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Project Structure

```
budget-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   └── Dockerfile
├── server/                 # Node.js backend
│   ├── src/
│   ├── .env
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Features

- Create budgets by category
- Track income and expenses
- Visual progress bars for budget tracking
- Real-time balance overview
- Delete budgets and transactions
- Beautiful, responsive UI

## API Endpoints

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create a new budget
- `DELETE /api/budgets/:id` - Delete a budget

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `DELETE /api/transactions/:id` - Delete a transaction

## Stopping the Application

```bash
docker-compose down
```

---

Made with ❤️ for better financial management!
