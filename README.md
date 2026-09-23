# WorkUp — Project-Management SaaS Landing Page

Pixel-perfect build of the WorkUp landing page from Figma.

- **Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · next/font (Manrope, Inter) · Framer Motion · cva + clsx + tailwind-merge
- **Hosting:** Vercel — `main` deploys to production, every other branch gets a preview URL.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npm run lint
npm run build
```

## Structure

| Path | Contents |
|------|----------|
| `app/` | Layout, page, metadata routes, design tokens (`globals.css`) |
| `components/ui/` | Primitives: Button, Badge, Avatar, AvatarStack, Toggle, Input, Card, SectionHeading |
| `components/sections/` | One component per landing-page section |
| `content/` | All copy and links as typed data |
| `public/figma/` | Assets exported from Figma |

Project rules for contributors and AI agents live in [`CLAUDE.md`](./CLAUDE.md).
