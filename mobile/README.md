# Budget Buddy Mobile

React Native (Expo) companion app for the Budget Buddy web application. Built for iOS with iPad support and Android compatibility.

## Tech Stack

- **Framework**: React Native 0.83 via Expo SDK 55
- **Runtime**: React 19.2
- **Backend**: Connects to the existing Budget Buddy Node.js / Express API
- **Database**: MongoDB (shared with the web app)

## Features

### Dashboard
- Live totals for income, expenses, balance, and total budgeted amount
- Spending breakdown pie chart by category
- Budget progress bars with over-budget warnings
- Recent transactions preview

### Budgets
- Create budgets with a 13-category emoji picker (Food, Transport, Entertainment, Shopping, Bills, Health, Education, Rent, Salary, Investment, Freelance, Gift, Other)
- Visual progress bars showing spent vs. limit
- Swipe left to delete any budget (with haptic feedback + confirmation)
- Pull to refresh

### Transactions
- Add income or expense transactions with category, amount, and optional description
- Income/Expense type toggle
- Search transactions by category name
- Filter by All / Income / Expense
- Swipe left to delete (with haptic feedback + confirmation)
- Pull to refresh

### Settings & Theming
- Dark mode / Light mode toggle with full theme support
- API connection info display
- App version and framework details

## Prerequisites

| Tool           | Version    | Notes                                          |
|----------------|------------|------------------------------------------------|
| Node.js        | >= 18      | `brew install node` if not installed            |
| npm             | >= 9       | Ships with Node.js                             |
| Expo CLI        | latest     | Installed automatically via npx                |
| Xcode           | >= 15      | Required only for iOS Simulator                |
| Backend running | —          | `docker-compose up --build` from project root  |

## Quick Start

### 1. Start the backend (from project root)

```bash
docker-compose up --build
```

This starts the Express API on port **5001** and MongoDB on port **27017**.

### 2. Configure the API URL

```bash
cp .env.example .env
```

Edit `.env` if needed:

```
EXPO_PUBLIC_API_URL=http://localhost:5001
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run on iOS Simulator

```bash
npm run ios
```

### 5. Run on a physical iPhone

1. Install the **Expo Go** app from the App Store.
2. Find your Mac's local IP address:
   ```bash
   ipconfig getifaddr en0
   ```
3. Update `.env` with your IP:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.x.x:5001
   ```
4. Start the dev server:
   ```bash
   npm start
   ```
5. Scan the QR code in the terminal with the iPhone camera.

> Make sure your iPhone and Mac are on the same Wi-Fi network.

## Available Scripts

| Command          | Description                       |
|------------------|-----------------------------------|
| `npm start`      | Start Expo dev server             |
| `npm run ios`    | Start on iOS Simulator            |
| `npm run android`| Start on Android Emulator         |
| `npm run web`    | Start in browser (Expo Web)       |

## API Endpoints Used

The mobile app communicates with the same REST API as the web client:

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| GET    | `/api/budgets`         | Fetch all budgets        |
| POST   | `/api/budgets`         | Create a new budget      |
| DELETE | `/api/budgets/:id`     | Delete a budget          |
| GET    | `/api/transactions`    | Fetch all transactions   |
| POST   | `/api/transactions`    | Create a new transaction |
| DELETE | `/api/transactions/:id`| Delete a transaction     |
| GET    | `/api/health`          | API health check         |

## Project Structure

```
mobile/
├── App.js                          # Root: providers + tab navigation
├── index.js                        # Expo entry point
├── app.json                        # Expo config (name, icons, splash)
├── package.json                    # Dependencies and scripts
├── .env.example                    # Environment variable template
├── src/
│   ├── constants/
│   │   ├── categories.js           # Category emojis, chart colors
│   │   └── theme.js                # Light & Dark theme definitions
│   ├── context/
│   │   ├── ThemeContext.js          # Dark mode state + provider
│   │   └── DataContext.js           # Budgets, transactions, totals
│   ├── services/
│   │   └── api.js                  # REST API client (fetch wrapper)
│   ├── components/
│   │   ├── CategoryPicker.js       # Modal emoji category selector
│   │   └── SwipeableRow.js         # Swipe-to-delete row wrapper
│   └── screens/
│       ├── DashboardScreen.js      # Overview, chart, progress, recent
│       ├── BudgetsScreen.js        # Budget list + add form
│       ├── TransactionsScreen.js   # Transaction list + add/search/filter
│       └── SettingsScreen.js       # Dark mode, CSV export, connection info
└── assets/
    ├── icon.png
    ├── splash-icon.png
    ├── favicon.png
    └── android-icon-*.png
```

## Environment Variables

| Variable              | Default                    | Description                  |
|-----------------------|----------------------------|------------------------------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:5001`    | Budget Buddy API base URL    |

## Troubleshooting

**"Unable to reach API" error**
- Confirm the backend is running: `docker ps` should list the backend and MongoDB containers.
- On a physical device, `localhost` won't work — use your Mac's LAN IP instead.

**iOS Simulator not opening**
- Ensure Xcode is installed and you've opened it at least once to accept the license.
- Run `xcode-select --install` if command-line tools are missing.

**Expo Go version mismatch**
- Update Expo Go on your phone to the latest version from the App Store.
- Run `npx expo install --fix` to align dependency versions.

## Roadmap

- [x] Dashboard with totals and recent transactions
- [x] Add Budget form with emoji category picker
- [x] Add Transaction form (income/expense, category, amount, description)
- [x] Swipe-to-delete for budgets and transactions
- [x] Spending breakdown pie chart
- [x] Dark mode toggle
- [x] Search and filter transactions
- [x] Budget progress bars with over-budget warnings
- [x] Confetti celebration on income transactions
- [x] CSV export via native share sheet
- [x] Custom app icon and splash screen
- [x] EAS Build config for App Store (eas.json)
- [ ] Push notifications for budget alerts
- [ ] Offline support with local caching
