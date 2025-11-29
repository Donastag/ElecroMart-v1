# Elecro.Mart — Enterprise

Short repository for the Elecro.Mart enterprise storefront and CMS integration.

**Environment**
- This repository uses an example environment file at `./.env.example`.
- Do NOT store real secrets in source control. Copy `./.env.example` to
  `./.env` locally and fill in real values for development.

Example:

```powershell
cp .env.example .env
# Edit .env with your editor and fill in credentials
```

**Run (development)**
- Install dependencies:

```powershell
npm install
```

- Start the dev server:

```powershell
npm run dev
```

If your project uses `pnpm` or `yarn`, replace commands accordingly.

**Security & secrets**
- If any keys or secrets were accidentally committed, rotate or revoke them immediately (Supabase, Google APIs, S3, etc.).
- Keep `.env` listed in `.gitignore` (this repo includes a `.gitignore` that excludes `.env`).

**Contributing**
- See project docs for coding guidelines. Open an issue or PR for changes.

---
Generated: sanitized `.env.example` and `.gitignore` were added to avoid committing secrets.
