# ⚡ Frontend-to-Backend Integration Guide

This React application has been specifically crafted according to your Node/Express backend models and controllers (`/api/auth`, `/api/accounts`, `/api/transactions`).

---

## 1. Enable CORS in your Backend (`backend/src/app.js`)

To allow the frontend running at `http://localhost:5173` to make cross-origin requests to your Express server at `http://localhost:3000`, add CORS support:

1. In your backend terminal:
```bash
cd backend
npm install cors
```

2. Update `backend/src/app.js`:
```js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // <--- 1. Import cors

const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.routes');

const app = express();
exports.app = app;

// 2. Enable CORS with credentials support
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/transactions', transactionRouter);

module.exports = app;
```

---

## 2. API Endpoint Mapping Summary

| Screen / Feature | Express Route | Request Payload | Response Data Used |
| :--- | :--- | :--- | :--- |
| **Register** | `POST /api/auth/register` | `{ email, password, name }` | `{ user, token, message }` |
| **Login** | `POST /api/auth/login` | `{ email, password }` | `{ user, token, message }` |
| **Logout** | `POST /api/auth/logout` | `Header: Authorization` or Cookie | `{ message }` |
| **Create Account** | `POST /api/accounts` | Requires Auth | `{ account, message }` |
| **Get Accounts** | `GET /api/accounts` | Requires Auth | `{ accounts: [...] }` |
| **Account Balance**| `GET /api/accounts/balance/:accountId` | Params: `accountId` | `{ balance, accountId }` |
| **Transfer Money** | `POST /api/transactions` | `{ fromAccount, toAccount, amount, idempotencyKey }` | `{ transaction, message }` |
| **System Deposit** | `POST /api/transactions/system/initial-funds` | `{ toAccount, amount, idempotencyKey }` | `{ transaction, message }` |

---

## 3. How to Run Both Projects

Open two terminals:

### Terminal 1: Express Backend
```bash
cd backend
npm run dev
```
*(Runs on `http://localhost:3000`)*

### Terminal 2: React Frontend
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## 4. Idempotency Key Feature
When performing transfers via `POST /api/transactions`, the frontend auto-generates a unique UUID v4 string (`ik_...`). Your Express controller validates this key to ensure no double-spending occurs even if the user clicks Transfer twice.
