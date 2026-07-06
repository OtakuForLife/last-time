# Last Time

A minimalistic offline app to remember when you last did something.

**No accounts. No cloud. No subscriptions. Just one tap.**

## Features

- 100% offline — all data stored locally on device
- One-tap timestamp updates
- Relative time display (Today, Yesterday, 8 days ago…)
- Custom categories
- Favorite tasks
- Instant search
- Dark mode
- Local backup & restore (JSON export/import)

## Tech Stack

- **React** + **TypeScript** + **Vite**
- **Capacitor** for iOS/Android native builds
- **@capacitor/preferences** for persistent local storage
- **@capacitor/haptics** for tap feedback on mobile

No backend. No authentication. No analytics.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

## Mobile (Capacitor)

```bash
# After first build
npm run build
npx cap add android   # or: npx cap add ios
npx cap sync
npx cap open android  # or: npx cap open ios
```

## Usage

1. **Tap a task** — records "last done" as right now
2. **+ Add** — create a new task with emoji and category
3. **⭐ Favorites** — filter to starred tasks
4. **Search** — find tasks instantly
5. **Settings** — dark mode, categories, backup/restore

## Backup Format

Exports a JSON file with all tasks, categories, and settings. Import to restore on a new device.

## License

Closed Source — All rights reserved.
