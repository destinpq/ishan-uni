# UniHub Backend (NestJS)

NestJS API for an international university application aggregator:

- JWT auth (register / login / me)
- Personal hub of universities (website + portal links)
- Application tracking with status workflow
- OpenAI-powered advisor that has read-only context over your saved data
- All persistence lives in **Google Sheets**, accessed via a Google
  Apps Script web app (see [`apps-script/README.md`](apps-script/README.md))

> Convention: every TypeScript file in `src/` is kept **under 250 LOC**.
> Apps Script files have no size limit.

## Quick start

```bash
cd backend
cp .env.example .env          # fill in the values
npm install
npm run start:dev             # http://localhost:3000/api
```

Required env:

| Var                 | Notes                                              |
| ------------------- | -------------------------------------------------- |
| `JWT_SECRET`        | Long random string                                 |
| `OPENAI_API_KEY`    | From https://platform.openai.com                   |
| `OPENAI_MODEL`      | Default `gpt-4o-mini`                              |
| `APPS_SCRIPT_URL`   | `/exec` URL from the deployed Apps Script web app  |
| `APPS_SCRIPT_TOKEN` | Must match `SHARED_TOKEN` script property          |

## Modules

```
src/
├── auth/           POST /api/auth/register | /login | GET /me
├── users/          GET/PATCH /api/users/me
├── universities/   CRUD /api/universities
├── applications/   CRUD + GET /api/applications/summary
├── llm/            POST /api/llm/ask | /chat   (OpenAI, user-scoped context)
├── sheets/         Apps Script HTTP client (global)
├── common/         JwtAuthGuard, @CurrentUser()
└── config/         Typed env loader
```

## Auth flow

```
POST /api/auth/register { email, name, password }
  → { accessToken, user }

POST /api/auth/login { email, password }
  → { accessToken, user }

# Send on every subsequent request:
Authorization: Bearer <accessToken>
```

## LLM

```
POST /api/llm/ask
{ "prompt": "Which of my saved unis have spring intake for MSc CS?" }
  → { "reply": "..." }
```

The service injects a short system context summarising the caller's saved
universities and tracked applications, so the model can answer relative to
the user's own data.
