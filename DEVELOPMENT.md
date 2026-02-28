# 👨‍💻 Development Guide

## Project Structure

```
budget-app/
├── client/                      # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js              # Main app component
│   │   ├── App.css             # App styling
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── Dockerfile
│   └── .env                    # Frontend environment variables
│
├── server/                      # Node.js/Express Backend
│   ├── src/
│   │   └── index.js            # Express server
│   ├── package.json
│   ├── Dockerfile
│   ├── .env                    # Backend environment variables
│   └── .env.example
│
├── docker-compose.yml          # Docker orchestration
├── start.sh / start.bat        # Quick start scripts
├── stop.sh / stop.bat          # Stop scripts
├── README.md                   # Full documentation
└── QUICKSTART.md              # Quick start guide
```

## Development Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB (or Docker)

### Local Development (Without Docker)

**Backend:**
```bash
cd server
npm install
npm start
```
Runs on http://localhost:5000

**Frontend:**
```bash
cd client
npm install
npm start
```
Runs on http://localhost:3000

### Development with Docker

```bash
docker-compose up --build
```

Both services have hot-reload enabled:
- Frontend: Changes to `client/src` auto-reload
- Backend: Changes to `server/src` auto-restart (nodemon)

## API Reference

### Budget Endpoints

**Get all budgets:**
```bash
GET /api/budgets
```

**Create a budget:**
```bash
POST /api/budgets
Body: {
  "category": "string",
  "limit": number
}
```

**Delete a budget:**
```bash
DELETE /api/budgets/:id
```

### Transaction Endpoints

**Get all transactions:**
```bash
GET /api/transactions
```

**Create a transaction:**
```bash
POST /api/transactions
Body: {
  "category": "string",
  "amount": number,
  "type": "income" | "expense"
}
```

**Delete a transaction:**
```bash
DELETE /api/transactions/:id
```

## Database Schema

### Budget Collection
```javascript
{
  _id: ObjectId,
  category: String,
  limit: Number,
  createdAt: Date
}
```

### Transaction Collection
```javascript
{
  _id: ObjectId,
  category: String,
  amount: Number,
  type: "income" | "expense",
  date: Date
}
```

## Extending the App

### Adding a New Feature

1. **Backend:**
   - Add new route in `server/src/index.js`
   - Update MongoDB schema if needed

2. **Frontend:**
   - Update `App.js` with new state/handlers
   - Update `App.css` for styling

3. **Test:**
   - Test locally first
   - Then test in Docker

### Common Extensions

**Add user authentication:**
- Install `jsonwebtoken` and `bcryptjs`
- Add User schema in MongoDB
- Add auth middleware

**Add monthly reports:**
- Create new API endpoint
- Filter transactions by month
- Calculate statistics

**Add data export:**
- Install `papaparse` for CSV
- Create export endpoint
- Add download button in UI

## Environment Variables

### Backend (.env)
```
NODE_ENV=development|production
PORT=5000
MONGO_URI=mongodb://mongo:27017/budgetapp
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Debugging

### Check server logs:
```bash
docker-compose logs -f backend
```

### Check frontend logs:
```bash
docker-compose logs -f frontend
```

### Access MongoDB:
```bash
docker exec -it budgetapp_mongo_1 mongosh
```

## Testing

Add tests to improve code quality:

**Backend:**
```bash
npm install --save-dev jest
```

**Frontend:**
```bash
npm install --save-dev @testing-library/react
```

## Deployment

### Deploy to production:
1. Update `docker-compose.yml` for production settings
2. Set `NODE_ENV=production`
3. Use environment-specific configs
4. Deploy to cloud (AWS, Heroku, DigitalOcean, etc.)

## Performance Tips

1. Use MongoDB indexes for frequently queried fields
2. Implement pagination for transaction lists
3. Cache budget calculations
4. Optimize React components with React.memo

## Code Style

- Use consistent indentation (2 spaces)
- Name components in PascalCase
- Name functions/variables in camelCase
- Add comments for complex logic
- Keep functions small and focused

---

Happy coding! 🚀
(readme file genetated via AI)