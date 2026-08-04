# 💳 Backend Ledger - Double-Entry Financial Ledger System

A production-grade, full-stack double-entry financial ledger and transaction management platform. Built with **Node.js, Express, MongoDB (Mongoose)** on the backend and a modern **React + Vite** frontend.

---

## 🚀 Key Features

- **Double-Entry Accounting System**: Implements strict financial ledger principles with debits, credits, and immutable transaction histories.
- **Idempotency Protection**: Guarantees transaction safety and prevents duplicate billing using unique idempotency keys.
- **Account Management**: Create and manage multi-type financial accounts (User Accounts, System Accounts, Ledger Entries).
- **Funds Transfer & System Deposits**: Instant double-entry account-to-account transfers and system fund deposits.
- **Secure Authentication**: JWT-based session security with httpOnly cookies, password hashing (`bcryptjs`), and token blacklisting.
- **Interactive Dashboard**: Real-time balance tracking, transaction filters, and financial metrics.
- **Backend API Integration Guide**: Built-in developer guide page with live API documentation.
- **Mobile Responsive Design**: Modern dark theme UI with sliding drawer navigation and responsive layout.

---

## 📁 Project Folder Structure

```
Backend-Ledger/
├── backend/                  # Express & Node.js Backend Server
│   ├── server.js             # Entry point
│   ├── package.json          # Backend dependencies
│   └── src/
│       ├── app.js            # Express app configuration
│       ├── config/           # Database & environment configuration
│       ├── controllers/      # Route controllers (Auth, Accounts, Transactions)
│       ├── middlewares/      # Authentication & Validation middleware
│       ├── models/           # Mongoose schemas (User, Account, Transaction, Ledger, BlackList)
│       ├── routes/           # API Endpoints (auth.routes, account.routes, transaction.routes)
│       └── services/         # Business logic layer
├── frontend/                 # React + Vite SPA Application
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   └── src/
│       ├── App.jsx           # Main routing & state container
│       ├── components/       # Reusable UI components (Navbar, Tables, Modals)
│       ├── hooks/            # Custom React hooks (useAccounts, useTransactions, useAuth)
│       ├── pages/            # App pages (Dashboard, Transfer, System Deposit, History, Guide)
│       ├── services/         # API integration client
│       └── styles/           # Styling & CSS utilities
└── README.md                 # Project documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or MongoDB Atlas)

---

### Step 1: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/backend_ledger
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```

Start the backend development server:
```bash
npm run dev
```
The backend API server will run at `http://localhost:5000/`.

---

### Step 2: Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
The React frontend application will launch at `http://localhost:5173/`.

---

## 🔌 API Endpoints Summary

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/login` - User login & set httpOnly JWT cookie
- `POST /api/auth/logout` - User logout & blacklist JWT session token

### 💼 Accounts (`/api/accounts`) *(Protected)*
- `POST /api/accounts/` - Create a new financial account
- `GET /api/accounts/` - Get all accounts belonging to the logged-in user
- `GET /api/accounts/balance/:accountId` - Get current balance of a specific account

### 💸 Transactions & Ledger (`/api/transactions`) *(Protected)*
- `POST /api/transactions/` - Execute double-entry transaction between accounts (with Idempotency Key support)
- `POST /api/transactions/system/initial-funds` - System deposit / initial funds allocation (System User Authorized)

---

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose ODM, JWT, BcryptJS, Cookie-Parser.
- **Frontend:** React 18, Vite, Lucide Icons, Custom CSS / Design System.
- **Tools:** Nodemon, Dotenv, CORS.
