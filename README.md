# Proctor AI &mdash; Intelligent Full-Stack Assessment & Proctoring System

Proctor AI is a production-grade full-stack remote assessment and proctoring web application built using **React.js, Node.js, Express, MongoDB, and Tailwind CSS**.

The system pairs an in-browser code editor powered by **Monaco Editor (VS Code core)** with client-side security event detection (tab switching via HTML5 Page Visibility API and full-screen enforcement via Fullscreen API) and real-time algorithmic cheat scoring for administrators.

---

## 🚀 Key Features

### 1. In-Browser Coding Sandbox (Monaco Editor)
- High-fidelity in-browser coding experience powered by `@monaco-editor/react`.
- Multi-language support (JavaScript, Python, C++, Java) with syntax highlighting, automatic indentation, bracket matching, and code resetting.
- Integrated test runner simulation with interactive output console for rapid validation of algorithms and data structure solutions.

### 2. Client-Side Security Event Listeners (Proctor Engine)
- **Tab Switch Detection**: Employs the HTML5 `visibilitychange` event listener on `document.hidden`. Switching away, minimizing the browser window, or navigating to another application logs an infraction and triggers an instant alert.
- **Fullscreen Lockdown**: Listens to the `fullscreenchange` event. If a candidate leaves fullscreen mode, an unclosable warning overlay immediately blocks access to questions and code until fullscreen is re-engaged.
- **Automated Telemetry**: Sends structured violation events (`/api/proctor/log-violation`) containing timestamps, infraction types, and severity ratings to the backend.

### 3. Automated Cheat Scoring & Risk Assessment
- Infractions dynamically recalculate a normalized `0-100%` cheat score:
  - Tab Switch: `+15 points` per occurrence
  - Fullscreen Exit: `+20 points` per occurrence
  - Clipboard/External Pastes: `+10 points` per occurrence
- Scores are categorized into color-coded risk tiers:
  - **Clean / Low Risk**: `< 30%` (Emerald)
  - **Moderate Suspicion**: `30% - 69%` (Amber)
  - **High Risk / Flagged**: `≥ 70%` (Red)

### 4. Admin Proctoring Dashboard
- Overview KPI metrics: Total Candidates Assessed, High-Risk Flagged Submissions, Average Cheat Score, and Integrity Status.
- Filterable candidate log table with search by username, email, or assessment title.
- Deep-dive Inspector modal detailing the chronological infraction timeline and submitted code solutions.

---

## 🛠 Tech Stack

### Client (Frontend)
- **React 18** (Vite build pipeline)
- **Tailwind CSS v3** (Custom dark/light styling and glassmorphism)
- **@monaco-editor/react** (VS Code in-browser code editor)
- **React Router v6** (Client-side routing with role-based views)
- **Lucide React** (Vector icons)
- **React Hook Form** (Form validation)
- **React Hot Toast** (Real-time security notifications)
- **Axios** (REST client with automatic JWT bearer interceptor)

### Server (Backend)
- **Node.js & Express.js** (REST API)
- **MongoDB & Mongoose** (Database schemas & relations)
- **jsonwebtoken (JWT)** & **bcryptjs** (Authentication & password hashing)
- **express-rate-limit** & **helmet** (Security headers & rate limiting)
- **express-validator** (Request payload validation)
- **morgan** & **cors** (HTTP request logger & cross-origin resource sharing)

---

## 📂 Project Architecture

```
Backend/
├── client/                     # React Vite client
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, Footer, ErrorBoundary
│   │   ├── context/            # AuthContext (JWT & Role state), ThemeContext
│   │   ├── hooks/              # useAuth, useTheme
│   │   ├── layouts/            # AuthLayout, DashboardLayout
│   │   ├── pages/              # Home, Login, Register, Dashboard, TestView, AdminDashboard
│   │   ├── services/           # api.js, authService.js, proctorService.js, testService.js
│   │   ├── App.jsx             # React Router routing tree
│   │   ├── main.jsx            # React root DOM mount
│   │   └── index.css           # Tailwind directives & glass styles
│   ├── package.json
│   └── vite.config.js          # Vite configuration with /api proxy to port 5000
│
├── server/                     # Express REST API
│   ├── src/
│   │   ├── config/             # db.js (Mongoose connection), seed.js (Demo seeder)
│   │   ├── controllers/        # authController.js, proctorController.js, testController.js
│   │   ├── middleware/         # auth.js (JWT protect & authorize), error.js, validation.js
│   │   ├── models/             # User.js, Test.js, ProctorLog.js
│   │   ├── routes/             # authRoutes.js, proctorRoutes.js, testRoutes.js
│   │   └── server.js           # Express application entry point
│   ├── .env                    # Environment configuration
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml          # Container configuration for Mongo, Server, and Client
└── README.md
```

---

## 🗄 Database Schemas

### 1. User (`server/src/models/User.js`)
- `username`: String, required, unique, trimmed (min: 3, max: 30)
- `email`: String, required, unique, trimmed, validated email format
- `password`: String, required, hashed with bcrypt (salt rounds: 10)
- `role`: String, enum: `['candidate', 'admin']`, default: `'candidate'`
- `timestamps`: `createdAt`, `updatedAt`

### 2. Test (`server/src/models/Test.js`)
- `title`: String, required
- `description`: String, required
- `durationMinutes`: Number, required, default: 45
- `questions`: Array of Question objects:
  - `title`: String
  - `description`: String (Markdown formatted)
  - `difficulty`: `'Easy' | 'Medium' | 'Hard'`
  - `language`: String (`javascript`, `python`, etc.)
  - `starterCode`: String
  - `testCases`: Array of `{ input, expectedOutput, isSample }`
- `isActive`: Boolean, default: true

### 3. ProctorLog (`server/src/models/ProctorLog.js`)
- `userId`: ObjectId (ref: `User`)
- `testId`: ObjectId (ref: `Test`)
- `tabSwitchCount`: Number, default: 0
- `fullscreenExitCount`: Number, default: 0
- `cheatScore`: Number (0 - 100), computed dynamically based on infractions
- `violationLogs`: Array of objects:
  - `type`: `'tab_switch' | 'fullscreen_exit' | 'copy_paste' | 'devtools_opened' | 'window_blur'`
  - `timestamp`: Date
  - `details`: String
  - `severity`: `'low' | 'medium' | 'high'`
- `codeSubmissions`: Array of `{ questionId, code, language, submittedAt }`
- `status`: `'in_progress' | 'submitted' | 'flagged' | 'auto_terminated'`
- `startedAt`: Date
- `submittedAt`: Date

---

## 🌐 API Endpoints Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user (`username`, `email`, `password`, `role`) | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Private (Bearer Token) |

### Proctoring Routes (`/api/proctor`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/proctor/session/start` | Initialize or resume candidate's proctoring session | Candidate |
| `POST` | `/api/proctor/log-violation` | Log security event (`tab_switch`, `fullscreen_exit`, etc.) | Candidate |
| `POST` | `/api/proctor/submit` | Submit test code solutions & finalize proctor log | Candidate |
| `GET` | `/api/proctor/session/:testId`| Retrieve live proctor statistics for current test | Candidate |
| `GET` | `/api/proctor/admin/logs` | Fetch all candidate logs & cheat scores | Admin |
| `GET` | `/api/proctor/admin/logs/:id`| Fetch single proctor log detail with full violation logs | Admin |

### Test Routes (`/api/tests`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/tests` | Retrieve all active tests | Private |
| `GET` | `/api/tests/:id` | Retrieve single test with questions & duration | Private |
| `POST` | `/api/tests` | Create a new test | Admin |

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally on `mongodb://localhost:27017` or MongoDB Atlas URI

### 1. Server Setup
```bash
cd server
npm install
npm run seed     # (Optional: seeds sample users, tests, and demo proctor logs)
npm run dev      # Runs Express server on http://localhost:5000
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev      # Runs Vite dev server on http://localhost:5173
```

### 3. Demo Credentials
If you run `npm run seed`:
- **Admin**: `admin@proctorai.com` / `password123`
- **Candidate 1**: `alex@example.com` / `password123`
- **Candidate 2**: `priya@example.com` / `password123`
- **Candidate 3**: `john@example.com` / `password123`
*(Quick-fill demo buttons are also provided on the Login page).*
