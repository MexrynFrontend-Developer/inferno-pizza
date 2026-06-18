# 🍕 Inferno Pizza

Premium artisan pizza restaurant website — built with React, Vite, and Tailwind CSS.

## Features

- Mobile-responsive design with hamburger menu
- Supabase integration with hardcoded fallback data for menu & testimonials
- "View Full Menu" modal with all items
- Reservation form with Telegram notifications
- Dark luxury theme with gold accents

## Stack

- React 18 + TypeScript
- Vite 7
- Tailwind CSS v4
- Supabase (optional)
- Lucide React icons

## Setup

```bash
npm install
npm run dev
```

### Environment variables

Create a `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_url         # optional
VITE_SUPABASE_ANON_KEY=your_supabase_key    # optional
VITE_TELEGRAM_BOT_TOKEN=your_bot_token      # for reservation notifications
```

## Deploy to Netlify

```bash
npm run build
# upload the dist/ folder to Netlify
```

Or connect this repo to Netlify — it will auto-detect `netlify.toml`.

---

Designed & Developed by [Mexryn](https://github.com/MexrynFrontend-Developer)