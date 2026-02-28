# 💰 Budget Buddy - A Cute Anime-Themed Budgeting App!

A beautiful, feature-rich budgeting application with an adorable anime aesthetic, built with React, Node.js, and MongoDB, fully containerized with Docker.

## ✨ Features

### 💵 Core Budgeting
- 📊 **Budget Management**: Create and track budgets for different categories with emoji icons
- 💳 **Transaction Tracking**: Log income and expense transactions with optional descriptions
- 📈 **Visual Progress Bars**: Animated progress bars that shimmer and change color
- ⚠️ **Smart Budget Alerts**: Real-time notifications when you exceed budgets
- 💵 **Balance Dashboard**: Live overview of total income, expenses, and balance

### 🎨 Anime-Themed UI
- 🌸 **Kawaii Design**: Pastel gradients (pink, purple, blue) with floating animations
- ✨ **Sparkle Effects**: Decorative sparkles and emojis throughout the interface
- 🎭 **Smooth Animations**: Bounce, shimmer, pulse, and shake effects
- 📱 **Fully Responsive**: Beautiful on desktop, tablet, and mobile

### 🎉 Interactive Features
- 🎊 **Confetti Celebrations**: 500-piece confetti explosion when adding income!
- 🔔 **Toast Notifications**: Cute pop-up messages for every action with custom emojis
- 😊 **Category Emoji Picker**: Choose from 13 pre-defined categories with icons
  - 🍜 Food, 🚗 Transport, 🎮 Entertainment, 🛍️ Shopping, 💡 Bills
  - 💊 Health, 📚 Education, 🏠 Rent, 💼 Salary, 📈 Investment
  - 💻 Freelance, 🎁 Gift, 📌 Other
- 🎨 **Empty State Illustrations**: Cute bouncing emojis when lists are empty
- ⏳ **Loading Animations**: Beautiful spinner with encouraging messages

### 🌙 Advanced Features
- 🌙 **Dark Mode**: Toggle between light and anime dark theme
- 🔍 **Search**: Real-time transaction search by category
- 🎯 **Filter System**: Filter by All, Income, or Expense
- 📊 **Interactive Charts**: Pie chart showing spending breakdown by category
- 📥 **Export to CSV**: Download all transactions with one click
- 📝 **Transaction Notes**: Add optional descriptions to transactions

## 🛠️ Tech Stack

- **Frontend**: React 18, Axios, React Icons, React Confetti, React Hot Toast, Recharts
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose
- **Styling**: Custom CSS with Google Fonts (Quicksand, Poppins)

## 📋 Prerequisites

- Docker and Docker Compose installed on your system
- macOS, Linux, or Windows with WSL2

## 🚀 Quick Start with Docker

### 1. Start the application
```bash
docker-compose up --build
```

Or use the convenience scripts:
```bash
# macOS/Linux
./start.sh

# Windows
start.bat
```

### 2. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **MongoDB**: mongodb://localhost:27017

### 3. Stop the application
```bash
docker-compose down
```

Or use:
```bash
# macOS/Linux
./stop.sh

# Windows
stop.bat
```

## 💡 How to Use

### Creating Your First Budget
1. Click **"Add Budget"** button
2. Type or click a category (emoji picker appears automatically)
3. Set your spending limit
4. Click **"Save Budget"**

### Adding Transactions
1. Click **"Add Transaction"**
2. Select type: 💸 Expense or 💰 Income
3. Enter category, amount, and optional description
4. Click **"Save Transaction"**
5. 🎊 Watch confetti if it's income!

### Using Advanced Features
- **Search**: Type in the search box to filter transactions
- **Filter**: Click All/Income/Expense buttons to filter by type
- **Dark Mode**: Click 🌙 moon icon in header to toggle
- **Export Data**: Click 📥 download icon to export CSV
- **View Charts**: Scroll down to see your spending breakdown

## 📊 API Endpoints

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create a new budget
  ```json
  { "category": "Food", "limit": 500 }
  ```
- `DELETE /api/budgets/:id` - Delete a budget

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
  ```json
  { 
    "category": "Food", 
    "amount": 25.50, 
    "type": "expense",
    "description": "Lunch with team"
  }
  ```
- `DELETE /api/transactions/:id` - Delete a transaction

### Health Check
- `GET /api/health` - Check API status

## 🏗️ Project Structure

```
budget-app/
├── client/                     # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js             # Main component with all features
│   │   ├── App.css            # Anime-themed styles
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json           # Includes confetti, toast, recharts
│   ├── Dockerfile
│   └── .env
├── server/                     # Node.js Backend
│   ├── src/
│   │   └── index.js           # Express API with MongoDB
│   ├── package.json
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml          # Multi-container orchestration
├── start.sh / start.bat        # Quick start scripts
├── stop.sh / stop.bat          # Stop scripts
├── README.md
├── QUICKSTART.md
└── DEVELOPMENT.md
```

## 🎨 Customization

### Change Theme Colors
Edit [client/src/App.css](client/src/App.css) and [client/src/index.css](client/src/index.css):
```css
/* Main gradient */
background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #a1c4fd 100%);

/* Adjust button colors */
background: linear-gradient(135deg, #ff6b9d 0%, #c471ed 100%);
```

### Add More Category Emojis
Edit [client/src/App.js](client/src/App.js):
```javascript
const CATEGORY_EMOJIS = {
  'YourCategory': '🎯',
  // Add more...
};
```

## 🐛 Troubleshooting

**Port 5000 already in use?**
- We use port 5001 by default (macOS Control Center uses 5000)
- Change in `docker-compose.yml` if needed

**Docker not running?**
```bash
# macOS
open /Applications/Docker.app

# Check status
docker ps
```

**Want to see logs?**
```bash
docker-compose logs -f

# Or specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

**Reset everything?**
```bash
docker-compose down -v
docker-compose up --build
```

## 🚀 Future Enhancements

- [ ] User authentication & multi-user support
- [ ] Recurring transactions (monthly bills, salary)
- [ ] Budget templates (Student, Family, Business)
- [ ] Achievement badges for budget goals
- [ ] Monthly/yearly reports with more charts
- [ ] Budget recommendations using AI
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Budget sharing with family members
- [ ] Multi-currency support

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 💖 Acknowledgments

- Built with love for the budgeting community
- Inspired by cute anime aesthetics
- Thanks to all open-source contributors

---

Made with ❤️ and ✨ for better financial management!
