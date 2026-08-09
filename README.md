StartupHub

A modern MERN-stack collaboration platform where startup founders post ideas and developers/designers join their teams.

Built with React, Node.js, Express, MongoDB, and Socket.io for real-time chat and notifications.

Live Demo · Report Bug · Request Feature

</div>
📸 Screenshots
<img width="1920" height="1140" alt="image" src="https://github.com/user-attachments/assets/e997910e-84da-4495-8840-7b146464d2c9" />

<img width="1920" height="1140" alt="image" src="https://github.com/user-attachments/assets/f26a3f71-aa40-4630-806d-67f5b0e6f2db" />

<img width="1920" height="1140" alt="image" src="https://github.com/user-attachments/assets/c0b15d46-eefc-4f6c-9d49-7ceff536726e" />



📝 Note: Replace the placeholder image paths above with real screenshots — drop your PNGs into the /screenshots folder using the same filenames (or update the paths) and they'll render directly on GitHub.

🔗 Live Demo
	
Frontend	https://startup-hub-self.vercel.app/

Replace these with your actual deployment URLs once hosted (e.g. Vercel/Netlify for the client, Render/Railway for the server).

Demo credentials (password for all: Password123!):

Role	Email
Founder	maya@startuphub.dev
Developer	liam@startuphub.dev
Designer	sofia@startuphub.dev
Admin	admin@startuphub.dev
✨ Features
🔐 Authentication — JWT auth, bcrypt password hashing, persistent login, role-based access (founder / developer / designer / admin)
🏠 Landing page — animated hero, features, how-it-works, featured startups, stats
📊 Dashboards — role-aware stats, charts, recent activity
🚀 Startup management — create/edit/delete startups with skills, tags, category, status
🔍 Discover — search, filter, sort, pagination
📋 Applications — apply with a message, founders accept/reject, auto team join
👥 Team management — member profiles with GitHub/LinkedIn/portfolio links
📌 Kanban board — drag-and-drop tasks across Todo → In Progress → Review → Completed
💬 Real-time chat — 1:1 & team chat via Socket.io, online presence, typing indicators, read receipts
📁 File sharing — upload/download images, PDFs, DOC/DOCX, ZIP
🔔 Notifications — real-time + persisted, for applications, tasks, messages, files, milestones
🎯 Milestones — project goals with visual progress tracking
🛡️ Admin panel — platform stats, user & startup moderation
🌗 Dark mode — persisted theme preference
✨ Polish — toasts, skeleton loaders, empty states, modals, confirmation dialogs, mobile-responsive
🛠️ Tech Stack

Frontend: React 18 · Vite · Tailwind CSS · React Router v6 · Axios · Framer Motion · Lucide React · Recharts · React Hook Form · React Hot Toast · Socket.io Client

Backend: Node.js · Express.js · MongoDB · Mongoose · JWT · bcrypt · Socket.io · Multer · Helmet · CORS

📂 Project Structure
StartupHub/
├── server/                 # Express + MongoDB API
│   ├── controllers/        # Route handler logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routers
│   ├── middleware/          # Auth, error handling, uploads
│   ├── services/            # Notification service, etc.
│   ├── sockets/             # Socket.io real-time handlers
│   ├── config/               # DB connection
│   ├── utils/                # JWT helper, seed script
│   └── server.js
│
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/      # Reusable UI, dashboard, startup, task, chat
│       ├── pages/            # Route-level pages
│       ├── layouts/          # Public & dashboard layouts
│       ├── hooks/             # Custom hooks
│       ├── context/           # Auth, Theme, Socket contexts
│       ├── services/          # Centralized Axios API service
│       └── App.jsx
│
└── screenshots/             # README screenshots
⚙️ Getting Started
Prerequisites
Node.js v18+
MongoDB — local instance or a free MongoDB Atlas cluster
1. Clone the repo
bash
git clone https://github.com/<your-username>/StartupHub.git
cd StartupHub
2. Backend setup
bash
cd server
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run seed            # optional: populate demo data
npm run dev
3. Frontend setup
bash
cd client
npm install
cp .env.example .env
npm run dev

The app runs at http://localhost:5173, API at http://localhost:5000.

Environment Variables

server/.env

env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173

client/.env

env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

⚠️ Never commit real .env files — only .env.example is tracked.

🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

Fork the project
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📄 License

Distributed under the MIT License. See LICENSE for more information.

👤 Author

Your Name

GitHub: @your-username
LinkedIn: your-name
<div align="center">

If you found this project helpful, consider giving it a ⭐️!

</div>
