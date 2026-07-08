# Personal Portfolio Website (Full-Stack)

A full-stack personal portfolio: a vanilla HTML/CSS/JS frontend backed by a
Node.js + Express API, with project and skill data stored in a database
(SQLite out of the box — easy to swap for MySQL/PostgreSQL/MongoDB).

```
portfolio-project/
├── backend/
│   ├── server.js          # Express app entry point
│   ├── db.js              # Database connection + schema
│   ├── seed.js            # Populates sample projects/skills
│   ├── middleware/
│   │   └── requireAdmin.js
│   ├── routes/
│   │   ├── projects.js    # /api/projects
│   │   ├── skills.js      # /api/skills
│   │   └── contact.js     # /api/contact
│   ├── data/               # SQLite DB file lives here (auto-created)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   ├── js/main.js
│   └── assets/
└── README.md
```

## 1. Requirements

- Node.js 18+ and npm
- (Optional, for production) an account on Render/Railway/Heroku for the
  backend and Netlify/Vercel for the frontend

## 2. Local setup

```bash
cd backend
npm install
cp .env.example .env      # edit PORT / ADMIN_API_KEY as you like
npm run seed              # creates & populates the SQLite database
npm start                 # starts the server
```

Then open **http://localhost:5000** in your browser — Express serves both
the API (`/api/...`) and the static frontend from this single command.

> The frontend is plain HTML/CSS/JS with no build step, so there's nothing
> extra to run — it's served directly by Express. If you prefer to develop
> the frontend separately (e.g. with Live Server or Vite), just point
> `API_BASE` in `frontend/js/main.js` at `http://localhost:5000/api`.

## 3. API Reference

| Method | Endpoint             | Auth  | Description                          |
|--------|----------------------|-------|---------------------------------------|
| GET    | `/api/projects`      | No    | List all projects (`?featured=true` to filter) |
| GET    | `/api/projects/:id`  | No    | Get a single project                  |
| POST   | `/api/projects`      | Yes*  | Create a project                      |
| DELETE | `/api/projects/:id`  | Yes*  | Delete a project                      |
| GET    | `/api/skills`        | No    | List skills grouped by category       |
| POST   | `/api/contact`       | No    | Submit the contact form               |
| GET    | `/api/contact`       | Yes*  | View submitted contact messages       |

\* Send header `x-api-key: <ADMIN_API_KEY>` (set in `.env`) for protected routes.

Example — add a project:

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me-to-a-secret-key" \
  -d '{
    "title": "My New Project",
    "description": "A cool app I built.",
    "tech_stack": ["React", "Express", "SQLite"],
    "github_url": "https://github.com/you/repo",
    "featured": true
  }'
```

## 4. Customizing content

- Edit your name, role, bio, and social links directly in `frontend/index.html`.
- Edit sample projects/skills in `backend/seed.js`, then delete
  `backend/data/portfolio.db` and re-run `npm run seed` to reset the data —
  or just use the API (see above) to add/remove projects at any time.

## 5. Swapping the database

SQLite is used here because it needs zero setup — perfect for getting the
whole stack running immediately. To use MySQL, PostgreSQL, or MongoDB instead:

- **PostgreSQL / MySQL**: replace `better-sqlite3` with `pg` or `mysql2`,
  and rewrite the queries in `db.js` / `routes/*.js` using that driver
  (or an ORM like Prisma/Sequelize). The route logic and API shape stay the same.
- **MongoDB**: install `mongoose`, define `Project`, `Skill`, and `Message`
  schemas, and swap the `db.prepare(...)` calls for Mongoose model calls.

Because the frontend only talks to `/api/...` endpoints, none of the
frontend code needs to change when you swap databases.

## 6. Deployment

**Backend (Render — free tier friendly):**
1. Push this repo to GitHub.
2. On Render, create a new "Web Service", point it at the repo,
   set root directory to `backend`, build command `npm install`,
   start command `npm start`.
3. Add environment variables from `.env.example` in Render's dashboard.
4. Note the deployed URL, e.g. `https://your-api.onrender.com`.

**Frontend (Netlify or Vercel):**
1. If deploying the frontend separately, update `API_BASE` in
   `frontend/js/main.js` to your backend's deployed URL.
2. Deploy the `frontend` folder as a static site on Netlify or Vercel
   (drag-and-drop the folder, or connect the GitHub repo and set the
   publish directory to `frontend`).

**All-in-one (simplest):** since Express already serves the frontend
as static files, you can deploy just the `backend` folder (with `frontend`
alongside it) to Render/Railway/Heroku and skip a separate frontend deploy
entirely — one URL serves everything.

## 7. What this project demonstrates

- Frontend (HTML/CSS/JS) fetching live data from a backend API
- A REST API built with Node.js/Express with proper route separation
- Persisted data in a real database (SQLite, swappable for
  MySQL/PostgreSQL/MongoDB)
- Basic write-protection via an API key middleware
- A deployable, single-repo full-stack structure
