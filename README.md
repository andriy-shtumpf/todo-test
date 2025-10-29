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
