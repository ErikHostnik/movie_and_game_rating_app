# Movie & Game Rating App

A personal tracker for movies and games. Rate what you've watched or played, keep a wishlist, and get a quick look at your stats — all in one place.

## What's inside

- **Rating cards** — rate titles on a 0.5–10 scale with a tier label (F through S), add genres, status, and a cover image
- **Tier list view** — visual breakdown of all your ratings grouped by tier
- **Timeline** — chronological view of when you added things
- **Dashboard** — stats like average rating, genre distribution, and status breakdown
- **Filter & sort** — filter by genre, status, or rating range; sort by date, rating, or name
- **Compare modal** — put two titles side by side
- **Wishlist** — separate view for things you want to watch or play
- **Image cropper** — crop and save custom cover images
- **PWA support** — installable as a standalone app

## Stack

- **React 19** — UI
- **Vite** — build tool and dev server
- **ESLint** — linting
- Vanilla CSS with inline styles — no UI library, no Tailwind

## Running locally

```bash
npm install
npm run dev
```

Data is stored in `localStorage` — no backend, no account needed.
