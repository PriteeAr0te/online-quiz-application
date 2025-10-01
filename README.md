# online-quiz-application
Full‑stack Online Quiz Application built with React + TypeScript (Vite) and Node.js/Express + TypeScript backed by MongoDB (via Mongoose). Users can browse quiz categories, take a quiz, submit answers, and view detailed scoring with per‑question correctness and time taken. Includes clean API design, modular scoring logic, and automated tests.

---

## Architecture

- **Monorepo layout** with separate `frontend/` and `backend/` workspaces.
- **Frontend**: React 19, Vite 7, TailwindCSS 4, React Router, Axios.
- **Backend**: Express 5, TypeScript, Mongoose 8 for MongoDB, Jest for tests.
- **CORS** configured for local dev between Vite and API.
- **Scoring** encapsulated in `backend/src/scoring.ts` and unit‑tested.

```text
online-quiz-application/
├─ backend/
│  ├─ src/
│  │  ├─ app.ts                    # Express app (CORS, routes, JSON)
│  │  ├─ index.ts                  # App bootstrap (env, DB connect, listen)
│  │  ├─ config/db.ts              # MongoDB connection
│  │  ├─ models/Quiz.ts            # Mongoose models (Quiz, Question)
│  │  ├─ controllers/quizController.ts
│  │  ├─ routes/quizRoutes.ts      # /api/quiz endpoints
│  │  ├─ scoring.ts                # Pure scoring logic (tested)
│  │  ├─ tests/                    # Jest tests
│  │  └─ utils/seed.ts             # Optional seeding utilities
│  ├─ jest.config.js
│  ├─ tsconfig.json
│  └─ package.json
└─ frontend/
   ├─ src/
   │  ├─ lib/api.ts                # Axios instance using VITE_BASE_URL
   │  └─ ...                       # React components/pages
   ├─ vite.config.ts
   ├─ tsconfig*.json
   └─ package.json
```

---

## Tech Stack

- **Frontend**: React, React Router, TailwindCSS, Vite, TypeScript
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB)
- **Testing**: Jest, ts‑jest, Supertest

---

## Prerequisites

- Node.js 18+ and npm
- MongoDB 6+ (local or cloud, e.g., MongoDB Atlas)

---

## Setup

1) Clone and install dependencies

```bash
# from repo root
npm install --prefix backend
npm install --prefix frontend
```

2) Configure environment variables

- Backend `backend/.env`:
  - `MONGO_URL`=connection string to your MongoDB instance
  - `PORT`=5000 (optional; defaults to 5000)

- Frontend `frontend/.env`:
  - `VITE_BASE_URL`=https://online-quiz-application-duig.onrender.com/api/quiz

3) Seed data (optional)

If you have a seeding script (e.g., `backend/seed.js` or `backend/src/utils/seed.ts`), run it after setting `MONGO_URL`. Example:

```bash
# Example: node backend/seed.js
```

---

## Running locally

In two terminals:

- Backend (port 5000 by default)

```bash
cd backend
npm run dev
```

- Frontend (Vite dev server, port 5173 by default)

```bash
cd frontend
npm run dev
```

The backend enables CORS for `http://localhost:5173` in `backend/src/app.ts`.

---

## Scripts

- Backend `backend/package.json`:
  - `dev`: Run API with ts-node-dev
  - `build`: Compile TypeScript to `dist/`
  - `start`: Run compiled API
  - `test`: Run Jest test suite

- Frontend `frontend/package.json`:
  - `dev`: Start Vite dev server
  - `build`: Type-check and build
  - `preview`: Preview production build
  - `lint`: ESLint

---

## API Reference

Base URL: `https://online-quiz-application-duig.onrender.com/api/quiz`

- GET `/`
  - Returns quiz categories with counts.
  - Response: `{ categories: Array<{ category: string; quizCount: number }> }`

- GET `/:id`
  - Returns a single quiz by ID without the `correctIndex` values.
  - Response: `{ quiz: { _id, category, title, questions: [{ _id, text, options }] } }`

- GET `/category/:category`
  - Returns all quizzes within a category (without `correctIndex`).
  - Response: `{ quizzes: [...] }`

- POST `/:id/submit`
  - Body:
    ```json
    {
      "answers": { "<questionId>": <number | null> },
      "startTime": "2025-10-01T12:00:00.000Z",  // optional ISO
      "endTime":   "2025-10-01T12:05:30.000Z"   // optional ISO
    }
    ```
  - Calculates score using `calculateScore()` from `backend/src/scoring.ts`.
  - Response:
    ```json
    {
      "score": 3,
      "total": 5,
      "timeTaken": 330,  // seconds (if start/end provided)
      "results": [
        {
          "questionId": "...",
          "questionText": "...",
          "options": ["..."],
          "correctIndex": 2,
          "chosen": 1,
          "isCorrect": false
        }
      ]
    }
    ```

---

## Testing

- Backend unit/integration tests (Jest):

```bash
cd backend
npm test
```

- Sample tests live under `backend/src/tests/`, including `scoring.test.ts` which exercises the pure scoring module.

---

## Production build

- Backend:
  ```bash
  cd backend
  npm run build && npm start
  ```

- Frontend:
  ```bash
  cd frontend
  npm run build
  npm run preview # optional local preview
  ```

Serve the frontend’s built assets behind a reverse proxy (e.g., Nginx) and configure the API base URL accordingly.

---

## Configuration notes

- CORS is currently configured in `backend/src/app.ts` to allow `http://localhost:5173` with credentials.
- Frontend Axios instance (`frontend/src/lib/api.ts`) uses `VITE_BASE_URL` or falls back to `https://online-quiz-application-duig.onrender.com/api/quiz`.
- The backend omits `questions.correctIndex` in GET responses to prevent answer leakage; scoring occurs server‑side on submit.

---

## Troubleshooting

- Ensure `MONGO_URL` is set and reachable. The server will exit if the connection fails (`backend/src/config/db.ts`).
- If CORS errors occur during local dev, verify ports and `origin` in `backend/src/app.ts` and `VITE_BASE_URL` in `frontend/.env`.
- For TypeScript path/alias issues, ensure imports are relative or configured in `tsconfig.json`.

---

## License

This project is licensed under the terms of the `LICENSE` file in the repository root.

