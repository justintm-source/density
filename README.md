# DENSITY

Single-file training tracker. Strength + pump-focused lifting on a 5-week A/B/Deload cycle, plus a 12-week 10K run plan. Runs entirely in the browser, all data in localStorage under `mfm-v5`.

## Stack

- React 18 (UMD via cdnjs) + Babel Standalone (in-browser JSX)
- No build step, no backend
- Google Fonts: Bebas Neue, DM Mono, DM Sans

## Local dev

```bash
npm install      # only for puppeteer (screenshots)
npm run dev      # serves index.html at http://localhost:3000
```

## Deploy

Hosted as a single static file. Any static host works — GitHub Pages, Cloudflare Pages, Netlify, etc.

## Data

All in localStorage:

- `history[]` — completed exercise entries (sets + duration + e1RM)
- `currentWeek` — integer, increments through the 5-week cycle
- `sessions{}` — in-progress session state by week+day
- `bodyweight{}` — keyed by `YYYY-MM-DD`
- `swaps{}` — exercise swap selections by slot
- `runHistory{}` — completed run logs by run id

Clear with `localStorage.clear()` in DevTools to reset.
