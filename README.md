# StartupHub 🚀

A full-stack MERN collaboration platform where startup founders post ideas and developers/designers join their teams — built with React, Node/Express, MongoDB, and Socket.io for real-time chat and notifications.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Seeding Demo Data](#seeding-demo-data)
- [Demo Login Credentials](#demo-login-credentials)
- [Running the App](#running-the-app)
- [Features](#features)
- [API Overview](#api-overview)
- [Troubleshooting](#troubleshooting)

---

## Tech Stack

**Frontend:** React 18 + Vite, Tailwind CSS, React Router v6, Axios, Framer Motion, Lucide React, Recharts, React Hook Form, React Hot Toast, Socket.io Client

**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT, bcrypt, Socket.io, Multer, dotenv, Helmet, CORS

---

## Project Structure

```
StartupHub/
├── server/                 # Express + MongoDB API
│   ├── controllers/        # Route handler logic
│   ├── models/             # Mongoose schemas
│   ├── routes/              # Express routers
│   ├── middleware/         # Auth, error handling, uploads
│   ├── services/           # Notification service, etc.
│   ├── sockets/            # Socket.io real-time handlers
│   ├── config/             # DB connection
│   ├── utils/              # JWT helper, seed script
│   ├── uploads/            # Uploaded files (local storage)
│   └── server.js           # Entry point
│
└── client/                 # React + Vite frontend
    └── src/
        ├── components/     # Reusable UI, dashboard, startup, task, chat components
        ├── pages/          # Route-level pages
        ├── layouts/        # Public & dashboard layouts
        ├── hooks/          # Custom hooks (useStartup, etc.)
        ├── context/        # Auth, Theme, Socket contexts
        ├── services/       # Centralized Axios API service
        ├── utils/          # Formatting/helper functions
        └── App.jsx         # Route definitions
```

---

## Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** — either:
  - A local MongoDB instance (`mongodb://localhost:27017/startuphub`), or
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (recommended)

---

## Setup Instructions

### 1. Clone / open the project

```bash
cd StartupHub
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

**Backend** — copy the example file and fill in your values:

```bash
cd ../server
cp .env.example .env
```

Edit `server/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/startuphub
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file.** `MONGO_URI` and `JWT_SECRET` are secrets — `.gitignore` already excludes `.env` files.

**Frontend** — copy its example file too:

```bash
cd ../client
cp .env.example .env
```

`client/.env` (defaults work out of the box for local dev):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Seeding Demo Data

Once `MONGO_URI` is set in `server/.env`, populate the database with realistic demo data (founders, developers, designers, startups, applications, tasks, milestones, notifications, and chat messages):

```bash
cd server
npm run seed
```

This **clears existing data** in the connected database and recreates it. Safe to re-run anytime you want a fresh demo state.

---

## Demo Login Credentials

All demo accounts share the same password: **`Password123!`**

| Role      | Email                     | Notes                              |
|-----------|---------------------------|-------------------------------------|
| Admin     | `admin@startuphub.dev`    | Full platform access               |
| Founder   | `maya@startuphub.dev`     | Owns FlowBoard & Lumen Health       |
| Founder   | `daniel@startuphub.dev`   | Owns PayBridge                      |
| Developer | `liam@startuphub.dev`     | On FlowBoard's team                 |
| Developer | `priya@startuphub.dev`    | Has a pending application           |
| Developer | `noah@startuphub.dev`     | On Lumen Health's team              |
| Designer  | `sofia@startuphub.dev`    | On FlowBoard's team                 |
| Designer  | `kenji@startuphub.dev`    | Has a rejected application          |

The login page also has one-click buttons to autofill these demo accounts.

---

## Running the App

Open **two terminals**.

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

The API starts on `http://localhost:5000` (health check at `/api/health`).

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

The app opens on `http://localhost:5173`. Vite is pre-configured to proxy `/api`, `/uploads`, and `/socket.io` requests to the backend, so no CORS setup is needed for local dev.

---

## Features

- **Authentication:** Register/login/logout, JWT auth, bcrypt password hashing, persistent login, role-based authorization (founder / developer / designer / admin)
- **Landing page:** Hero, features, how-it-works, featured startups, stats, CTA — with Framer Motion animations
- **Dashboards:** Role-aware overview with stats, charts (Recharts), and recent activity
- **Startup management:** Create/edit/delete startups with skills, tags, category, team size, remote/location, status
- **Discover:** Search, filter (category/skill/status/remote), sort, pagination
- **Applications:** Apply with a message + experience; founders accept/reject; accepted applicants auto-join the team
- **Team management:** View team member profiles (GitHub/LinkedIn/portfolio), remove members
- **Kanban tasks:** Drag-and-drop across Todo → In Progress → Review → Completed, priorities, due dates, assignment
- **Real-time chat:** 1:1 direct messages and team chat via Socket.io, online presence, typing indicators, read receipts
- **File sharing:** Upload/download images, PDFs, DOC/DOCX, ZIP (Multer + local `/uploads`, structured for easy S3/Cloudinary swap later)
- **Notifications:** Real-time + persisted notifications for applications, task assignment/completion, messages, file uploads, team joins, milestones
- **Milestones:** Create project milestones with progress visualization
- **Admin panel:** Platform stats, user management (activate/deactivate), startup moderation (hide/unhide)
- **Dark mode:** Full light/dark theme, persisted in `localStorage`
- **Polish:** Toasts, skeleton loaders, empty states, modals, confirmation dialogs, mobile-responsive sidebar/drawer

---

## API Overview

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Resource | Base path |
|---|---|
| Auth | `/api/auth` (register, login, me, logout) |
| Users | `/api/users` |
| Startups | `/api/startups` |
| Applications | `/api/applications` |
| Tasks | `/api/tasks` |
| Messages | `/api/messages` |
| Notifications | `/api/notifications` |
| Files | `/api/files` |
| Milestones | `/api/milestones` |
| Admin | `/api/admin` (admin role required) |

Socket.io events include `message:direct`, `message:team`, `typing:start/stop`, `message:read`, `presence:online`, and `notification:new`.

---

## Troubleshooting

- **"MONGO_URI is not set"** — make sure `server/.env` exists and has a valid connection string, then restart `npm run dev`.
- **CORS errors** — confirm `CLIENT_URL` in `server/.env` matches the URL your frontend runs on.
- **Socket connection fails** — check that the backend is running and `VITE_SOCKET_URL` in `client/.env` points to it; the socket handshake requires a valid JWT.
- **File uploads fail** — confirm the `server/uploads` folder exists (it's auto-created on server start) and the file type is one of: images, PDF, DOC/DOCX, ZIP (15MB limit).
- **Seed script errors** — it needs `MONGO_URI` set and a reachable database; run it from inside `server/`.
