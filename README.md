# AuraHabit — MERN Habit Tracker

AuraHabit is a habit-tracking application with a React/Vite frontend and a Node.js/Express API backed by MongoDB.

## Project structure

```text
habitTracker/
├── client/                 # Frontend: React + Vite + Tailwind CSS
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                 # Backend: Node.js + Express + Mongoose
│   ├── src/
│   ├── .env.example
│   └── package.json
├── package.json            # Root scripts to run both apps
└── .gitignore
```

## Requirements

- Node.js and npm
- A running local MongoDB instance or a MongoDB Atlas connection string

## Setup

1. In the project root, install the root runner dependency:

   ```bash
   npm install
   ```

2. Install frontend and backend dependencies:

   ```bash
   npm install --prefix client
   npm install --prefix server
   ```

3. Create `server/.env` by copying `server/.env.example`. Set `MONGODB_URI`, a long random `JWT_SECRET`, `PORT=5000`, `CLIENT_URL=http://localhost:5173`, and the other values shown in the example.

4. Start both applications from the project root:

   ```bash
   npm run dev
   ```

   Frontend: `http://localhost:5173`  
   Backend: `http://localhost:5000` (the health endpoint is `/api/health` if configured in the server app).

## Build the frontend

```bash
npm run build
```

This runs the Vite production build in `client/`. To run only the frontend, use `npm run dev:client`; to run only the backend, use `npm run dev:server`.

## Security notes

- Never commit `server/.env`, credentials, tokens, or database connection strings.
- Public registration should not allow users to assign themselves an admin role.
- Use HTTPS and secure cookie settings in production, and review authentication/CSRF protections before deployment.
- The backend requires a configured MongoDB database to persist accounts and habit data.
