# Multi-User Todo List with Map Integration

A modern React application for managing todo tasks across multiple users with location-based visualization using maps.

## Features

-   🔐 Firebase Authentication
-   📝 Multi-user task management
-   🗺️ Map integration (OpenStreetMap)
-   📊 Dashboard with task overview
-   🎯 Task states: Created, In Progress, Completed
-   🐳 Docker & Docker Compose support
-   ⚡ TypeScript for type safety
-   🎨 Tailwind CSS + Shadcn UI components

## Tech Stack

**Frontend:**

-   React 18 with TypeScript
-   Vite
-   Tailwind CSS
-   Shadcn UI
-   React Router
-   Leaflet (Maps)
-   Firebase (Auth)

**Backend:**

-   Node.js + Express
-   PostgreSQL
-   TypeORM/Prisma
-   Firebase Admin

**DevOps:**

-   Docker
-   Docker Compose

## Prerequisites

-   Node.js 18+
-   Docker & Docker Compose
-   Firebase project setup
-   npm or yarn

## Firebase Setup Guide

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create project"**
3. Enter project name: `lyteforge` (or your preferred name)
4. Accept terms and click **"Create project"**
5. Wait for project to be created (1-2 minutes)

### 2. Register Web App

1. On the Firebase Console, click the **Web icon** (`</>`) to create a web app
2. Enter app name: `lyteforge-web`
3. Check **"Also set up Firebase Hosting for this app"** (optional)
4. Click **"Register app"**
5. Copy the Firebase configuration object (you'll need this next)

### 3. Get Firebase Credentials

The Firebase config will look like:

```javascript
{
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
}
```

**Map these values:**

| Firebase Config     | .env.local Variable                 |
| ------------------- | ----------------------------------- |
| `apiKey`            | `VITE_FIREBASE_API_KEY`             |
| `authDomain`        | `VITE_FIREBASE_AUTH_DOMAIN`         |
| `projectId`         | `VITE_FIREBASE_PROJECT_ID`          |
| `storageBucket`     | `VITE_FIREBASE_STORAGE_BUCKET`      |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId`             | `VITE_FIREBASE_APP_ID`              |

### 4. Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**:
    - Click **Email/Password**
    - Toggle **Enabled**
    - Toggle **Email link (passwordless sign-in)** (optional)
    - Click **Save**
3. Enable **Google** (optional):
    - Click **Google**
    - Toggle **Enabled**
    - Select support email
    - Click **Save**

### 5. Set Up Backend Firebase Admin

1. In Firebase Console, go to **Project Settings** (gear icon) → **Service Accounts**
2. Click **Generate New Private Key**
3. A JSON file downloads with your service account credentials
4. In `backend/.env`, set:
    ```
    FIREBASE_PROJECT_ID=your_project_id
    ```
5. Save the service account JSON file securely (you'll need it for production)

### 6. Populate Environment Files

**Frontend (`frontend/.env.local`):**

```bash
# From Firebase web config
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# API Configuration
VITE_API_URL=http://localhost:3000
```

**Backend (`backend/.env`):**

```bash
# Firebase
FIREBASE_PROJECT_ID=your_project_id

# Database
DATABASE_URL=postgresql://todouser:todopass@localhost:5432/tododb

# Server
PORT=3000
NODE_ENV=development
```

### 7. Verify Setup

1. Run the app:
    ```bash
    npm run docker:up
    ```
2. Open http://localhost:5173
3. Try signing up with email
4. If authentication works, Firebase is configured correctly!

### Troubleshooting

| Issue                   | Solution                                                                         |
| ----------------------- | -------------------------------------------------------------------------------- |
| "Invalid API key"       | Check that all Firebase config values are correct in `.env.local`                |
| "Auth domain not found" | Verify `VITE_FIREBASE_AUTH_DOMAIN` matches Firebase project exactly              |
| "CORS error"            | Ensure backend `FIREBASE_PROJECT_ID` matches frontend `VITE_FIREBASE_PROJECT_ID` |
| Tasks not saving        | Check that backend `.env` has correct `FIREBASE_PROJECT_ID`                      |

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create `.env.local` in both frontend and backend:

**Frontend (.env.local):**

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_API_URL=http://localhost:3000
```

**Backend (.env):**

```
DATABASE_URL=postgresql://todouser:todopass@localhost:5432/tododb
FIREBASE_PROJECT_ID=your_project_id
PORT=3000
```

### 3. Start with Docker

```bash
npm run docker:up
```

### 4. Start Development (Local)

```bash
npm run dev
```

## Project Structure

```
.
├── frontend/          # React Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── App.tsx
│   └── package.json
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── db/
│   │   └── server.ts
│   └── package.json
└── docker-compose.yml
```

## Development

### Frontend Development

```bash
cd frontend
npm run dev
```

### Backend Development

```bash
cd backend
npm run dev
```

### Database Migrations

```bash
cd backend
npm run migrate
```

## API Endpoints

-   `GET /api/tasks` - Get all tasks
-   `POST /api/tasks` - Create new task
-   `PUT /api/tasks/:id` - Update task
-   `DELETE /api/tasks/:id` - Delete task
-   `GET /api/tasks/user/:userId` - Get user tasks

## Author

Andriy Shtumpf

## License

MIT
