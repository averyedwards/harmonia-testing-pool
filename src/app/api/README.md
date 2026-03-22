# API Routes

API routes are backend-only. This Next.js project is a **frontend prototype** only.

All API integrations are described in `BACKEND-SPEC.md` files located per module in `docs/backend-specs/`.

Do not create API route handlers here. The backend will be built separately by Abe and deployed as a separate service. The frontend communicates with it via environment variable `NEXT_PUBLIC_API_URL`.
