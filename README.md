# itelect4-backend

The Express + MongoDB API for
[itelect4-project](https://github.com/nariokeith/itelect4-project). Both are deployed on
Vercel:

| | URL |
|---|---|
| Frontend (live) | https://itelect4-project-eta.vercel.app |
| Backend (live) | https://itelect4-backend-zeta.vercel.app |

Health check: https://itelect4-backend-zeta.vercel.app/api/health answers
`{"ok":true,"db":true}` once the API has reached MongoDB Atlas.

## Routes

| Method and path | Token? | Answers |
|---|---|---|
| `GET /api/health` | No | `{ ok, db }` |
| `GET /api/courses` | No | Every course, sorted by code |
| `GET /api/courses/:code` | No | One course, or 404 |
| `POST /api/auth/register` | No | 201 and the new user, or 409 |
| `POST /api/auth/login` | No | 200 and `{ token, user }`, or 401 |
| `GET /api/submissions` | Yes | Only this token's rows, newest first |
| `GET /api/submissions/:id` | Yes | One row, or 404 if it is not yours |
| `POST /api/submissions` | Yes | 201 and the row; owner taken from the token |
| `PATCH /api/submissions/:id` | Yes | 200 and the row after the change |
| `DELETE /api/submissions/:id` | Yes | 204 |

Private routes need the header `Authorization: Bearer <token>`, using the token from
`POST /api/auth/login`. Tokens expire after 2 hours.

Courses are read-only reference data, seeded by `npm run seed`. Submissions belong to the
account that created them.

## Environment variables

Copy `.env.example` to `.env` and fill it in. `.env` is never committed.

| Name | What it is |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign login tokens |
| `CORS_ORIGIN` | Comma-separated origins allowed to call the API, no trailing slash — `http://localhost:5173` locally, the frontend URL on Vercel |
| `PORT` | Local dev only (default 4000); not set on Vercel |

## How to install and run

```bash
npm install
npm run seed     # puts the three courses in the database; safe to run twice
npm run dev      # API on http://localhost:4000
npm run build    # type-check and compile with tsc
```

## Deployment

Vercel uses the Express preset, with `src/app.ts` and its `export default app` as the entry
point, so there is no `vercel.json`. `MONGODB_URI`, `JWT_SECRET` and `CORS_ORIGIN` are set
in the Vercel project settings. Atlas Network Access allows `0.0.0.0/0`, because Vercel's
IP addresses change. Every push to `main` redeploys.
