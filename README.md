<div align="center">

# 🚌 TransitOps

### Smart Transport Operations Platform

**A full-stack fleet management system built for real-time tracking of vehicles, drivers, trips, maintenance, and operational costs.**

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Database Setup](#2-database-setup)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Frontend Setup](#4-frontend-setup)
  - [5. Run the Application](#5-run-the-application)
- [Demo Credentials](#-demo-credentials)
- [API Reference](#-api-reference)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Business Rules & Logic](#-business-rules--logic)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)

---

## 🌐 Overview

TransitOps is a comprehensive **fleet operations management platform** designed to help transport companies manage their entire vehicle lifecycle — from acquisition and dispatch through maintenance, refuelling, and financial reporting.

The system enforces strict business rules around trip dispatching, driver eligibility, and vehicle availability, while providing real-time dashboards and multi-format reports for decision-makers.

---

## ✨ Features

### 🌐 Public Marketing Landing Page (`/`)
- A beautiful, responsive public-facing showcase explaining TransitOps features, business benefits, and role roles.
- Easy navigation links allowing users to quickly access the **Login** portal or the **Driver Application Form**.
- Automatic session check: authenticated users visiting `/` are automatically routed to the internal `/dashboard`.

### 📝 Driver Self-Registration & Onboarding (`/apply`)
- Public registration form enabling aspiring drivers to submit details (name, email, contact, license number, license category, and license expiry).
- **Duplicate Prevention Guard**: Enforces strict unique license constraints (against both active drivers and pending applications) returning `409 Conflict` on duplicates.
- Complete application tracking and status badge updates (`PENDING` ➔ `APPROVED` or `REJECTED`).

### 👨‍✈️ Driver Requests Approval Portal (`/driver-requests`)
- **Fleet Managers** and **Safety Officers** can view, filter, and review submissions in a tabbed panel.
- **One-click approval** atomically creates the active `Driver` record and triggers status update.
- **Rejection with Reason** logs the specific grounds for refusal and alerts the applicant status.

### 🚗 Vehicle Management
- Register, update, and decommission fleet vehicles.
- Track vehicle status: `AVAILABLE`, `ON_TRIP`, `IN_SHOP`, `RETIRED`.
- Record acquisition cost, max load capacity, and odometer readings.
- Automatic odometer increment on trip completion.
- Prevent duplicate registration numbers (`409 Conflict`).

### 👨‍✈️ Driver Management
- Full driver profiles with license category tracking.
- License expiry countdown badges (green ➔ amber ➔ red) alert officers to expiring driving privileges.
- Driver status: `AVAILABLE`, `ON_TRIP`, `OFF_DUTY`, `SUSPENDED`.
- Prevent duplicate license numbers (`409 Conflict`).

### 🗺️ Trip Lifecycle (State Machine)
```
DRAFT ──► DISPATCHED ──► COMPLETED
                    └──► CANCELLED
```
- Create trip drafts containing origin, destination, planned distance, cargo weight, revenue, driver, and vehicle.
- Enforce **4 sequential business rules** before dispatch (see [Business Rules](#-business-rules--logic)).
- Atomic state transitions using database transactions.
- Revenue tracking per trip for ROI calculations.

### 🔧 Maintenance Workflow
- Log maintenance events that automatically set vehicle status to `IN_SHOP`.
- Closing a log restores the vehicle to `AVAILABLE`.
- In-shop vehicles are automatically filtered out from trip vehicle selection.

### ⛽ Fuel & Expenses
- Log fuel refills per vehicle (liters + cost).
- Track operational expenses: `TOLL`, `MAINTENANCE`, `OTHER` categories.
- Aggregated operational cost per vehicle for reporting.

### 📊 Dashboard & Reports
- **KPI Cards**: Interactive cards for Fleet Size, Active Trips, Fleet Availability, and Driver Availability.
- **Fuel Efficiency Report**: km/L ratio per vehicle.
- **Fleet Utilisation Report**: % of time each vehicle was active.
- **Operational Cost Report**: Full cost breakdown per vehicle.
- **Vehicle ROI Report**: `(revenue − costs) / acquisitionCost × 100`.
- **CSV Export**: Export any report as a formatted spreadsheet.

### 🔐 Auth & Security
- JWT-based authentication (7-day tokens).
- Password hashing with bcryptjs.
- Role-based access control (RBAC) enforced on every API route and UI component.
- Token auto-refresh via Axios interceptors.

### 🎨 New Premium UI/UX Redesign
- Fully redesigned frontend using a modern, high-fidelity purple color palette.
- Implemented responsive glassmorphism styles, transition states, and micro-interactions.
- Integrated sidebar layout with quick action drawers, notification badges, active page indicators, and unified form inputs.

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Runtime** | Node.js | 22.x |
| **Backend Framework** | Express.js | 5.x |
| **Language** | TypeScript | 5.x / 6.x |
| **ORM** | Prisma | 5.x |
| **Database** | MySQL | 8.x |
| **Authentication** | JWT + bcryptjs | — |
| **Validation** | Zod | 4.x |
| **Frontend Framework** | React | 19.x |
| **Build Tool** | Vite | 8.x |
| **Styling** | Tailwind CSS | v4 |
| **HTTP Client** | Axios | 1.x |
| **Charts** | Recharts | 3.x |
| **Icons** | Lucide React | 1.x |
| **Notifications** | react-hot-toast | 2.x |
| **Routing** | React Router DOM | 7.x |

---

## 📁 Project Structure

```
TransitOps/
│
├── backend/                          # Express API server
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema (MySQL)
│   │   ├── seed.ts                   # Demo data seeder
│   │   └── migrations/               # Auto-generated SQL migrations
│   │
│   ├── src/
│   │   ├── server.ts                 # Entry point — starts HTTP server
│   │   ├── app.ts                    # Express app setup, routes mounting
│   │   ├── config/
│   │   │   └── env.ts                # Environment variable validation
│   │   ├── lib/
│   │   │   ├── prisma.ts             # Prisma client singleton
│   │   │   └── jwt.ts                # JWT sign/verify helpers
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # Bearer token validation
│   │   │   ├── rbac.middleware.ts    # Role enforcement (requireRole)
│   │   │   ├── validate.middleware.ts# Zod request validation
│   │   │   └── error.middleware.ts   # Global error handler
│   │   ├── modules/
│   │   │   ├── auth/                 # Login + /me endpoint
│   │   │   ├── vehicles/             # Vehicle CRUD
│   │   │   ├── drivers/              # Driver CRUD
│   │   │   ├── driver-requests/      # Driver applications / request management
│   │   │   ├── trips/                # Trip lifecycle + state machine
│   │   │   ├── maintenance/          # Maintenance log CRUD
│   │   │   ├── fuel-expenses/        # Fuel logs + expense records
│   │   │   ├── dashboard/            # KPI aggregations
│   │   │   └── reports/              # Analytics + CSV export
│   │   └── utils/
│   │       ├── calculations.ts       # ROI, efficiency, utilisation formulas
│   │       └── csvExport.ts          # CSV generation helpers
│   │
│   ├── .env.example                  # Environment variable template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                         # React + Vite SPA
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── main.tsx                  # React app entry point
│   │   ├── App.tsx                   # Router + route definitions
│   │   ├── index.css                 # Premium custom styles integrated with Tailwind v4
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx       # JWT auth state + login/logout
│   │   ├── lib/
│   │   │   └── api.ts                # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Layout.tsx            # App shell (Sidebar + TopBar + Outlet)
│   │   │   ├── Sidebar.tsx           # Redesigned sidebar with quick actions & footer
│   │   │   ├── TopBar.tsx            # Navigation, active profile overview
│   │   │   ├── KpiCard.tsx           # Interactive KPI card with charts
│   │   │   ├── StatusBadge.tsx       # Dynamic badge for trips, drivers, and requests
│   │   │   └── RoleGate.tsx          # Declarative UI-level RBAC wrapper
│   │   └── pages/
│   │       ├── LandingPage.tsx       # Responsive marketing homepage
│   │       ├── Apply.tsx             # Public driver application form
│   │       ├── Login.tsx             # Redesigned login form with role autofill
│   │       ├── Dashboard.tsx         # Real-time KPIs and system metrics
│   │       ├── Vehicles.tsx          # Vehicle registry with CRUD modals
│   │       ├── Drivers.tsx           # Active driver management
│   │       ├── DriverRequests.tsx    # Approvals dashboard for manager & safety
│   │       ├── Trips.tsx             # Trip planning + state transition forms
│   │       ├── Maintenance.tsx       # Fleet service logging & shop releases
│   │       ├── FuelExpenses.tsx      # Cost ledger and fuel refills
│   │       └── Reports.tsx           # Rich analytical charts (Recharts) and exports
│   │
│   ├── index.html
│   ├── vite.config.ts                # API proxy → :3001
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## ✅ Prerequisites

Make sure you have the following installed before you start:

| Tool | Version | Check |
|---|---|---|
| [Node.js](https://nodejs.org/) | ≥ 18.x | `node --version` |
| [npm](https://npmjs.com/) | ≥ 9.x | `npm --version` |
| [MySQL](https://dev.mysql.com/downloads/) | ≥ 8.0 | `mysql --version` |
| [Git](https://git-scm.com/) | any | `git --version` |

> **Note:** MySQL must be running locally before you start the backend.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Navjyothari/Smart-Transport-Operations-Platform.git
cd Smart-Transport-Operations-Platform
```

---

### 2. Database Setup

Open MySQL and create the database:

```sql
-- Connect to MySQL
mysql -u root -p

-- Create the database
CREATE DATABASE transitops;

-- Verify it was created
SHOW DATABASES;

-- Exit
EXIT;
```

---

### 3. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install all dependencies
npm install

# Copy the environment variable template
cp .env.example .env
```

Now open `backend/.env` in any text editor and fill in your values:

```env
# Your MySQL connection string
DATABASE_URL="mysql://root:YOUR_PASSWORD_HERE@localhost:3306/transitops"

# JWT secret — change this to a long random string in production
JWT_SECRET="your-super-secret-jwt-key-minimum-32-chars"

# Token expiry
JWT_EXPIRES_IN="7d"

# API port
PORT=3001

# Environment
NODE_ENV=development
```

Run the database migration (creates all tables):

```bash
# Run migrations — this also seeds the database with demo data
npx prisma migrate dev --name init
```

If you need to re-seed the database manually at any time:

```bash
npm run seed
```

You can inspect the database visually with Prisma Studio:

```bash
npm run db:studio
# Opens a browser at http://localhost:5555
```

---

### 4. Frontend Setup

Open a **new terminal** and run:

```bash
# From the project root
cd frontend

# Install all dependencies
npm install
```

No additional environment setup is needed for the frontend — the Vite dev server automatically proxies all `/api` requests to `http://localhost:3001`.

---

### 5. Run the Application

You need **two terminal windows** running simultaneously.

**Terminal 1 — Backend API:**
```bash
cd backend
npm run dev
```

Expected output:
```
✅ Database connected
🚀 TransitOps API running on http://localhost:3001
   Environment: development
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v8.x  ready in ~300ms

  ➜  Local:   http://localhost:5173/
```

**Open your browser and visit:**
- **Public Marketing Website**: [http://localhost:5173/](http://localhost:5173/)
- **Driver Self-Registration (Public)**: [http://localhost:5173/apply](http://localhost:5173/apply)
- **Fleet Portal Dashboard** (authenticated redirects): [http://localhost:5173/dashboard](http://localhost:5173/dashboard)

---

## 🔑 Demo Credentials

The seed script creates **4 demo accounts**, one for each role. All share the same password.

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Fleet Manager** | manager@transitops.com | `password123` | Full access to everything |
| **Driver** | driver@transitops.com | `password123` | View trips, log fuel |
| **Safety Officer** | safety@transitops.com | `password123` | View vehicles, drivers, maintenance |
| **Financial Analyst** | finance@transitops.com | `password123` | View reports, log expenses |

> 💡 The Login page has **one-click autofill buttons** for each role — no typing required during demos.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected endpoints require an `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | None | Returns a JWT access token |
| `GET` | `/api/auth/me` | Required | Returns current user profile |

**Login request body:**
```json
{
  "email": "manager@transitops.com",
  "password": "password123"
}
```

**Login response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Fleet Manager",
    "email": "manager@transitops.com",
    "role": "MANAGER"
  }
}
```

---

### Driver Applications (New Feature)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/driver-requests` | None (Public) | Submit a new driver registration application |
| `GET` | `/api/driver-requests` | Manager, Safety | List all driver applications (supports `?status=PENDING/APPROVED/REJECTED`) |
| `POST` | `/api/driver-requests/:id/approve` | Manager, Safety | Approve request (atomically registers Driver, marks request APPROVED) |
| `POST` | `/api/driver-requests/:id/reject` | Manager, Safety | Reject request (marks REJECTED, logs rejectionReason) |

**Submit application request body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "contactNumber": "+1234567890",
  "licenseNumber": "DL-987654321",
  "licenseCategory": "Heavy Vehicle Class A",
  "licenseExpiryDate": "2027-12-31"
}
```

**Reject request body:**
```json
{
  "rejectionReason": "Driver's license must be valid for at least 6 months."
}
```

---

### Vehicles

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/vehicles` | Required | List all vehicles |
| `POST` | `/api/vehicles` | Manager | Create a vehicle |
| `GET` | `/api/vehicles/:id` | Required | Get vehicle by ID |
| `PATCH` | `/api/vehicles/:id` | Manager | Update vehicle details |
| `DELETE` | `/api/vehicles/:id` | Manager | Delete a vehicle |

---

### Drivers

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/drivers` | Required | List all active drivers |
| `POST` | `/api/drivers` | Manager | Create a driver |
| `GET` | `/api/drivers/:id` | Required | Get driver by ID |
| `PATCH` | `/api/drivers/:id` | Manager | Update driver details |
| `DELETE` | `/api/drivers/:id` | Manager | Delete a driver |

---

### Trips

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/trips` | Required | List all trips |
| `POST` | `/api/trips` | Manager | Create a trip draft |
| `POST` | `/api/trips/:id/dispatch` | Manager | Dispatch trip (validates business rules) |
| `POST` | `/api/trips/:id/complete` | Manager | Complete trip (updates odometer) |
| `POST` | `/api/trips/:id/cancel` | Manager | Cancel trip (restores vehicle + driver) |

---

### Maintenance

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/maintenance` | Required | List all maintenance logs |
| `POST` | `/api/maintenance` | Manager, Safety | Open a maintenance log (sets vehicle → IN_SHOP) |
| `POST` | `/api/maintenance/:id/close` | Manager, Safety | Close log (restores vehicle → AVAILABLE) |

---

### Fuel & Expenses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/fuel-logs` | Required | List all fuel logs |
| `POST` | `/api/fuel-logs` | Driver, Manager | Log a refuel event |
| `GET` | `/api/expenses` | Required | List all expenses |
| `POST` | `/api/expenses` | Finance, Manager | Log an expense |

---

### Dashboard & Reports

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/kpis` | Required | Fleet KPI metrics |
| `GET` | `/api/reports/fuel-efficiency` | Required | Fuel efficiency per vehicle |
| `GET` | `/api/reports/fleet-utilization` | Required | Fleet utilisation % |
| `GET` | `/api/reports/operational-cost` | Required | Cost breakdown per vehicle |
| `GET` | `/api/reports/vehicle-roi` | Required | ROI % per vehicle |
| `GET` | `/api/reports/export.csv?type=vehicles` | Required | CSV export |

**CSV export `type` options:** `vehicles`, `drivers`, `trips`, `fuel-logs`, `expenses`

---

## 🔐 Role-Based Access Control (RBAC)

TransitOps enforces RBAC at **both the API level** (middleware) **and the UI level** (`RoleGate` component).

| Action | MANAGER | DRIVER | SAFETY_OFFICER | FINANCIAL_ANALYST |
|---|:---:|:---:|:---:|:---:|
| View vehicles & drivers | ✅ | ✅ | ✅ | ✅ |
| Create / update vehicle | ✅ | ❌ | ❌ | ❌ |
| Create / update driver | ✅ | ❌ | ❌ | ❌ |
| Submit driver application | Public | Public | Public | Public |
| View driver applications | ✅ | ❌ | ✅ | ❌ |
| Approve / reject applications | ✅ | ❌ | ✅ | ❌ |
| Create & dispatch trips | ✅ | ❌ | ❌ | ❌ |
| View trips | ✅ | ✅ | ✅ | ✅ |
| Open maintenance log | ✅ | ❌ | ✅ | ❌ |
| Close maintenance log | ✅ | ❌ | ✅ | ❌ |
| Log fuel | ✅ | ✅ | ❌ | ❌ |
| Log expenses | ✅ | ❌ | ❌ | ✅ |
| View dashboard & reports | ✅ | ✅ | ✅ | ✅ |
| Export CSV | ✅ | ✅ | ✅ | ✅ |

---

## ⚙️ Business Rules & Logic

### Trip Dispatch — 4 Sequential Guards

When a trip is dispatched, the API validates **all four rules in order**. If any rule fails, the dispatch is rejected with a descriptive error:

1. **Vehicle availability** — Vehicle status must be `AVAILABLE`. An `IN_SHOP` or `IN_TRIP` vehicle cannot be dispatched.
2. **Driver availability** — Driver status must be `AVAILABLE`. A `SUSPENDED` or `ON_TRIP` driver cannot be assigned.
3. **License validity** — Driver's license expiry date must be in the future. Expired licenses block dispatch entirely.
4. **Load capacity** — Cargo weight must be ≤ the vehicle's `maxLoadCapacity`. Overweight loads are rejected.

All passing dispatch operations use a **Prisma `$transaction`** to atomically:
- Update `Trip.status → DISPATCHED`
- Update `Vehicle.status → IN_TRIP`
- Update `Driver.status → ON_TRIP`

### Driver Application & Onboarding

1. **License Uniqueness Guard** — When submitting a new driver request, the platform validates that `licenseNumber` is unique among all existing active drivers AND pending requests. A duplicate yields a `409 Conflict`.
2. **Atomic Onboarding Transaction** — On approval, the database transaction atomically sets the request status to `APPROVED` and creates a new active `Driver` record with `AVAILABLE` status.
3. **Rejection Logging** — On rejection, the request status is set to `REJECTED` and the specified `rejectionReason` is recorded in the database, with no active driver profile generated.

### Trip Completion
On completion, the API:
- Sets `Trip.status → COMPLETED`
- Sets `Vehicle.status → AVAILABLE`
- Sets `Driver.status → AVAILABLE`
- Increments `Vehicle.odometer` by the trip's `actualDistance`

### Vehicle ROI Formula

```
ROI (%) = (revenue − (totalFuelCost + totalMaintenanceCost)) / acquisitionCost × 100
```

### Fuel Efficiency Formula

```
Fuel Efficiency (km/L) = totalDistanceTravelled / totalLitresConsumed
```

---

## 🗃️ Database Schema

```
User
├── id
├── name
├── email (unique)
├── passwordHash
├── roleId (relation to Role)
└── createdAt

Role
├── id
├── name (FLEET_MANAGER | DRIVER | SAFETY_OFFICER | FINANCIAL_ANALYST)
└── users[]

Vehicle
├── id
├── registrationNumber (unique)
├── name
├── type
├── maxLoadCapacityKg
├── odometer
├── acquisitionCost
├── status (AVAILABLE | ON_TRIP | IN_SHOP | RETIRED)
├── region
├── createdAt
└── → trips[], maintenanceLogs[], fuelLogs[], expenses[]

Driver
├── id
├── name
├── licenseNumber (unique)
├── licenseCategory
├── licenseExpiryDate
├── contactNumber
├── safetyScore
├── status (AVAILABLE | ON_TRIP | OFF_DUTY | SUSPENDED)
├── createdAt
└── → trips[]

Trip
├── id
├── source
├── destination
├── vehicleId, driverId
├── cargoWeightKg
├── plannedDistanceKm
├── actualDistanceKm
├── fuelConsumedL
├── revenue
├── status (DRAFT | DISPATCHED | COMPLETED | CANCELLED)
├── dispatchedAt, completedAt, cancelledAt
└── createdAt

MaintenanceLog
├── id, vehicleId
├── type, cost
├── status (ACTIVE | CLOSED)
├── openedAt, closedAt
└── notes

FuelLog
├── id, vehicleId, liters, cost, date

Expense
├── id, vehicleId
├── category (TOLL | MAINTENANCE | OTHER)
├── amount, date, notes

DriverRequest
├── id, name, email, contactNumber
├── licenseNumber (unique in active/pending)
├── licenseCategory, licenseExpiryDate
├── status (PENDING | APPROVED | REJECTED)
├── reviewedBy, reviewedAt, rejectionReason
└── createdAt
```

---

## 🌍 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Prisma MySQL connection string | `mysql://root:pass@localhost:3306/transitops` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `my-super-long-random-secret` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `PORT` | API server port | `3001` |
| `NODE_ENV` | Runtime environment | `development` |

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`. Use `.env.example` as the template.

---

## 📜 Available Scripts

### Backend

```bash
# Start dev server with hot-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server (after build)
npm start

# Run database migrations
npm run db:migrate

# Generate Prisma client after schema changes
npm run db:generate

# Open Prisma Studio (visual database browser)
npm run db:studio

# Re-seed the database with demo data
npm run seed
```

### Frontend

```bash
# Start Vite dev server (hot module replacement)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

---

<div align="center">

Built with ❤️ for the hackathon

**[GitHub Repository](https://github.com/Navjyothari/Smart-Transport-Operations-Platform)**

</div>
