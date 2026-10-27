# start.ng homepage, concept redesign (prototype)

An unofficial, independent concept for a livelier start.ng homepage. It is not affiliated with start.ng and does not change the live site. Every game, sign-in and tournament link goes to the real start.ng.

It covers the whole homepage: the **hero**, **today's tournament**, the **daily challenge**, **categories**, **games from the community** (most played, new this week, and every game A to Z), **independent creators**, the **publishing guide**, **About**, **FAQ** and the **footer**. The wording is start.ng's own.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

`npm run snapshot` refreshes `src/data/snapshot.json` from start.ng's public API (it also runs before every build).

## Where the data comes from

- **Games, covers, creators:** `api.start.ng/games` and the most-played shelf (`/discover/shelves`), saved at build time.
- **Categories, shelves, independent creators:** `/tags`, `/discover/shelves` and `/indie`, saved at build time. Category art loads from start.ng's own `/category-art/`.
- **Today's tournament and daily challenge:** fetched live from `/tournaments/current` and `/spotlight` through the `/sng` proxy (Vite in dev and preview, a Vercel rewrite in production). If that fails, the saved data is shown and labelled as saved.
- Titles are built from game names the same way start.ng does (`lagos-bike-rush` → `Lagos Bike Rush`).

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. In Vercel, **Add New → Project**, import the repo. It detects Vite; `vercel.json` sets the build, the `/sng` rewrite and a `noindex` header.
3. Or from this folder: `npx vercel` (preview) and `npx vercel --prod`.

## Stack

Vite, React, TypeScript, plain CSS with start.ng's own colour tokens, and Motion for animation. Respects `prefers-reduced-motion` (the scroll scene un-pins and shows its final state).
