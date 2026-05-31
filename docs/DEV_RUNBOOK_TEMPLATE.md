# Dev Runbook (template)

Copy to **`docs/DEV_RUNBOOK.md`** in your instantiated project. Fill in stack-specific commands and symptom/fix rows as you debug.

## Start commands

| Service | Command | URL / port |
|---------|---------|------------|
| Backend | _e.g. `npm run dev:api`_ | _e.g. `http://localhost:3001/api`_ |
| Frontend | _e.g. `npm run dev:web`_ | _e.g. `http://localhost:5173`_ |
| Database / emulators | _e.g. `npm run dev:emulators`_ | _ports_ |

## Hard requirements

| Rule | Why |
|------|-----|
| _e.g. Use localhost, not LAN IP for OAuth_ | _Firebase authorized domains_ |
| _e.g. Run seed script after emulator start_ | _Empty catalog_ |
| _e.g. Root `.env` loaded by API_ | _Missing credentials_ |

## Symptom → fix

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| _API empty response / crash_ | Unhandled error in handler | Global error handler; check API logs |
| _Auth redirect 401_ | Cross-origin auth on localhost | Popup in dev or auth proxy; see Firebase redirect best practices |
| _404 on API in production_ | Path prefix / hosting rewrite mismatch | Document in `docs/ARCHITECTURE.md`; align router mount with hosting |

Add a row here whenever debugging takes more than 30 minutes.

## QA gate

Before the next feature: run `/qa_checklist` → `/code_review` → `/postmortem`.
