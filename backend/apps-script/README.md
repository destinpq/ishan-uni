# Google Apps Script Backend

This folder contains the Apps Script web app that owns the Google Sheet
"database". The NestJS backend talks to it over HTTPS.

## One-time setup

1. Create a new Google Sheet (any name, e.g. `UniHub DB`).
2. In the Sheet: **Extensions → Apps Script**.
3. Replace the default `Code.gs` with the contents of [Code.gs](Code.gs).
4. **Project Settings → Script properties → Add property**:
   - Name: `SHARED_TOKEN`
   - Value: a long random string (use the same value for `APPS_SCRIPT_TOKEN`
     in the NestJS `.env`).
5. **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone with the link** (required — Apps Script web
     apps cannot accept anonymous POSTs otherwise).
6. Copy the resulting `/exec` URL into `APPS_SCRIPT_URL` in the NestJS `.env`.

The first call auto-creates the `users`, `universities`, `applications`,
and `sessions` sheets with the correct headers.

## Wire protocol

Single endpoint, `POST` JSON:

```json
{
  "token": "<SHARED_TOKEN>",
  "action": "list | findById | findBy | insert | update | remove",
  "sheet":  "users | universities | applications | sessions",
  "id":     "<uuid>           (findById / update / remove)",
  "where":  { "email": "x" }  // (findBy)
  "row":    { ... },          // (insert)
  "patch":  { ... }           // (update)
}
```

Response: `{ "ok": true, "data": ... }` or `{ "ok": false, "error": "..." }`.

Per the project rules, this file has no LOC ceiling.
