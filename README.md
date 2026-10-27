# start.ng homepage, concept redesign

An unofficial, independent concept for a livelier start.ng homepage. It is not affiliated with start.ng and does not change the live site. Every game, sign-in and tournament link goes to the real start.ng.

**See it live:** https://startng-redesign-dun.vercel.app · **Original:** https://start.ng

It covers the whole homepage: the **hero**, **today's tournament**, the **daily challenge**, **categories**, **games from the community** (most played, new this week, and every game A to Z), **independent creators**, the **publishing guide**, **About**, **FAQ** and the **footer**. The wording is start.ng's own.

## Before and after

| | Link |
|---|---|
| Original | https://start.ng |
| Redesign | https://startng-redesign-dun.vercel.app |

What changed, keeping start.ng's colours, typography, copy and real game data:

- **Hero:** the most-played game covers float around the headline and flip over to show who made them; the game address retypes itself through real games.
- **Today's tournament:** a scroll-pinned scene that deals out today's real line-up, with a live countdown.
- **Daily challenge:** a featured card for today's goal, live from start.ng.
- **Categories:** start.ng's category art, each one reacting in its own way on hover.
- **Game cards:** each game plays a small ink-and-lime illustration matched to its start.ng tags (board games fan cards, racing games bump a bus), and every card leans toward the cursor and sinks when pressed.
- **Browsing:** switch between Most played and New this week; the full A to Z list is grouped by letter with a jump strip.
- **Make games:** the four publishing steps light up as you scroll.
- **For everyone:** light by default with a remembered dark mode, full keyboard support, and reduced-motion support.

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
