# BizCore Nexus – Enterprise AI Operating System
### Distribution & Wholesale Enterprise SaaS Platform (Phase 1 to Phase 6 Complete)

BizCore Nexus is an enterprise-grade AI-powered MERN business operating platform engineered with strict Role-Based Access Control (RBAC), JWT authentication, MongoDB Atlas live aggregations, interactive Nexus AI Copilot, automated Supplier Procurement, real-time Logistics Dispatch tracking, full-cycle Financial Invoicing & Accounts Receivable, Multi-Branch Nodes, Immutable SOC-2 Audit Trail, jsPDF Document Engines, Autonomous AI Workflows, Predictive Demand ML Forecasting, and Universal Spotlight Command Center (`Ctrl+K`).

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v3, React Router DOM v6, Redux Toolkit, React Hook Form, Framer Motion, React Hot Toast, Lucide Icons |
| **Backend** | Node.js, Express.js, MongoDB Atlas (Mongoose ODM), JWT, bcryptjs, Cookie Parser, Helmet, CORS, Morgan, Express Validator, Rate Limiter |
| **Tooling** | Concurrently, Nodemon, Prettier, PostCSS, Autoprefixer |

---

## 📂 Enterprise Project Structure

```
project-fsd/
├── package.json               # Root orchestrator with concurrently scripts
├── .gitignore
│
├── server/                    # Backend REST API Service
│   ├── config/
│   │   ├── db.js              # MongoDB Atlas connection manager with retry logic
│   │   └── constants.js       # Enterprise roles, permissions, and HTTP codes
│   ├── controllers/
│   │   ├── authController.js  # Registration, login, logout, me, password reset
│   │   └── userController.js  # CRUD and user management
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT cookie & bearer validator
│   │   ├── roleMiddleware.js  # RBAC authorization middleware
│   │   ├── errorMiddleware.js # Centralized 404 & error handlers
│   │   └── rateLimiter.js     # DDoS & brute-force rate limiters
│   ├── models/
│   │   └── User.js            # Mongoose schema with bcrypt hashing & JWT methods
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth routes
│   │   ├── userRoutes.js      # /api/users routes (RBAC protected)
│   │   └── index.js           # API route aggregator and health check
│   ├── services/
│   │   └── tokenService.js    # JWT signing and HttpOnly cookie manager
│   ├── utils/
│   │   ├── ApiResponse.js     # Standardized JSON response envelope
│   │   └── logger.js          # Morgan HTTP request logger
│   ├── validators/
│   │   └── authValidators.js  # Express-validator schema rules
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js              # Express app entry point
│
└── client/                    # Frontend Vite React SPA
    ├── src/
    │   ├── components/
    │   │   ├── common/        # ErrorBoundary, PageTitle
    │   │   └── ui/            # Button, Input, Card, Badge, Spinner, Skeleton, Avatar, Modal
    │   ├── constants/
    │   │   ├── roles.js       # Role mappings and badge styles
    │   │   └── routes.js      # Central route paths
    │   ├── hooks/
    │   │   ├── useAuth.js     # Auth state selector hook
    │   │   └── usePermission.js # RBAC permission evaluator hook
    │   ├── layouts/
    │   │   ├── AuthLayout.jsx # Split-screen auth branding layout
    │   │   ├── DashboardLayout.jsx # Enterprise layout with sidebar & topbar
    │   │   ├── Sidebar.jsx    # Collapsible RBAC-filtered sidebar
    │   │   └── Topbar.jsx     # Header with search, notifications, & user menu
    │   ├── pages/
    │   │   ├── auth/          # LoginPage, RegisterPage, ForgotPasswordPage
    │   │   ├── dashboard/     # DashboardPage (KPIs, Telemetry, Orders)
    │   │   ├── profile/       # ProfilePage (User details & updates)
    │   │   ├── users/         # UsersPage (Staff directory)
    │   │   └── errors/        # UnauthorizedPage (403), NotFoundPage (404)
    │   ├── routes/
    │   │   ├── AppRouter.jsx  # Route configuration tree
    │   │   ├── ProtectedRoute.jsx # Auth & RBAC route guard
    │   │   └── PublicRoute.jsx    # Guest redirect guard
    │   ├── services/
    │   │   ├── api.js         # Axios instance with credentials & interceptors
    │   │   ├── authService.js # Auth API calls
    │   │   └── userService.js # User management API calls
    │   ├── store/
    │   │   ├── authSlice.js   # Auth Redux slice with async thunks
    │   │   ├── userSlice.js   # Users Redux slice
    │   │   └── index.js       # Redux Toolkit store
    │   ├── utils/
    │   │   └── formatters.js  # Currency, date, and initials formatters
    │   ├── App.jsx            # App root with session restoration
    │   ├── main.jsx           # React DOM mount
    │   └── index.css          # Tailwind CSS directives & glassmorphism
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| Enterprise Role | Level | Access Scope & Permissions |
|---|---|---|
| **SuperAdmin** | 100 | Full Access: Global Settings, User Provisioning, System Audits |
| **BranchManager** | 80 | Branch Operations: Local Staff, Inventory Oversight, Regional KPIs |
| **HRManager** | 60 | HR Operations: Personnel Directory, User Status, Onboarding |
| **InventoryManager**| 50 | Inventory Operations: Warehouse Stock, SKUs, Supplier Orders |
| **SalesExecutive** | 40 | Sales & CRM: B2B Wholesale Leads, Quotes, Order Ledger |
| **Employee** | 10 | Staff Portal: Personal Profile, Assigned Tasks, Company Hub |

---

## 🗄️ MongoDB Atlas Setup Guide

1. Log in to [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a new Cluster (M0 Free Tier or Dedicated).
3. Under **Database Access**, create a database user with read/write permissions.
4. Under **Network Access**, add IP `0.0.0.0/0` (or your static server IP) to the whitelist.
5. In **Database** > **Connect** > **Drivers**, copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/bizcore_nexus?retryWrites=true&w=majority
   ```
6. Paste the connection string into `server/.env` under `MONGODB_URI`.

---

## ⚙️ Environment Variables Setup

### Server (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bizcore_nexus?retryWrites=true&w=majority
JWT_SECRET=bizcore_nexus_super_secret_jwt_key_2026_enterprise_production_ready
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Quick Start & Installation

### Step 1: Install all dependencies across root, server, and client
```bash
npm run install:all
```
*(or manually run `npm install` inside root, `server/`, and `client/`)*

### Step 2: Run both Backend and Frontend concurrently
```bash
npm run dev
```

- **Backend API**: `http://localhost:5000`
- **Frontend SPA**: `http://localhost:5173`
- **Health Endpoint**: `http://localhost:5000/api/health`

---

## 📡 REST API Reference

### Authentication Endpoints
- `POST /api/auth/register` – Register new user with designated role
- `POST /api/auth/login` – Login & set HttpOnly JWT cookie
- `POST /api/auth/logout` – Terminate session & clear cookie
- `GET /api/auth/me` – Retrieve currently logged in profile
- `POST /api/auth/forgot-password` – Password recovery request

### User Management Endpoints (RBAC Protected)
- `GET /api/users` – Retrieve paginated users list (`SuperAdmin`, `BranchManager`, `HRManager`)
- `GET /api/users/:id` – Retrieve user details (Self or elevated managers)
- `PATCH /api/users/:id` – Update user profile (Self or `SuperAdmin`/`HRManager`)
- `DELETE /api/users/:id` – Delete user (`SuperAdmin` only)
