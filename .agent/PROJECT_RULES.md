# Sanbanfu Project Persistent Rules

This file serves as the "Shared Memory" between the USER and the AI Agent. These rules MUST be checked before every code modification.

## 1. UI & Visual Identity
- **Page Title**: The `<h1>` title in `paipan.html` must remain exactly "八字排盘". **NEVER** add version numbers (e.g., v1.6.1) to the visible title unless explicitly requested for a specific demo.
- **Button Styling**: Primary buttons (e.g., "开始排盘") must use the **blue gradient** style:
  - `background: linear-gradient(180deg, #3a5b7b 0%, #2b4b6b 100%);`
  - `border: 1px solid #4a6b8b;`
- **Dark Theme**: The background must remain `#121212` (dark) with `#252525` cards and `#333` dividers.

## 2. Deployment & PWA
- **Manifest Paths**: `manifest.json`'s `start_url` and `scope` must **ALWAYS** be `/sanbanfu/` to support iOS "Add to Home Screen" and Vercel subpath hosting.
- **Vercel Config**: `vercel.json` must prioritize serving static assets correctly and handling the `/paipan.html` rewrite.
- **Deployment**: After any UI or manifest change, execute `npx vercel --prod --yes` to sync.

## 3. Data & Security (Ongoing)
- **Zero-Breaking-Change Policy**: Any new feature (like encryption or membership) must be developed in a way that doesn't break existing user access until explicitly ready.
- **Whitelist/Encryption**: Future implementation should use a "dist" (build) approach to avoid exposing source code.

---
*Last Updated: 2026-02-13*
