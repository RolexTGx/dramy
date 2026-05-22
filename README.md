# 🎬 MN Dramas — Stream Asian Dramas & Anime

A modern, full-stack streaming platform for Asian dramas, anime, and movies. Built with **Vite + React + TypeScript** and deployable to **Vercel** with serverless API functions.

![MN Dramas](https://img.shields.io/badge/MN-Dramas-rose?style=for-the-badge&logo=netflix)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)

---

## ✨ Features

### 🎨 Frontend
- **Netflix-style UI** with dark theme, smooth animations, and responsive design
- **Hero banners** with featured content
- **Horizontal scrolling rows** for Latest, Popular, Top Rated, Anime, and Upcoming
- **Advanced search** with filters (type, country)
- **Drama detail pages** with episode grids and metadata
- **Video player** with HLS.js support, subtitle tracks, and quality controls
- **Client-side routing** with HashRouter (works in single-file builds)

### 🔌 API (Vercel Serverless Functions)
All endpoints are implemented as serverless functions in `/api/` and proxy requests to kisskh.co's internal APIs.

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /api/latest?page=0&pagesize=40&type=0` | Latest updated dramas | `/api/latest?page=0` |
| `GET /api/popular?type=0` | Most viewed dramas | `/api/popular` |
| `GET /api/toprated?type=0` | Top rated dramas | `/api/toprated` |
| `GET /api/anime` | Popular anime list | `/api/anime` |
| `GET /api/upcoming` | Upcoming releases | `/api/upcoming` |
| `GET /api/search?q=<query>&type=0` | Search dramas | `/api/search?q=Off%20Campus` |
| `GET /api/detail?id=<dramaId>` | Drama metadata + episodes | `/api/detail?id=12979` |
| `GET /api/episodes?id=<dramaId>` | Episode list only | `/api/episodes?id=12979` |
| `GET /api/watch?id=<epId>&dramaId=<dramaId>` | Stream manifest (m3u8) + subtitles | `/api/watch?id=213515&dramaId=12319` |
| `GET /api/subtitles?id=<epId>` | Subtitle tracks | `/api/subtitles?id=213515` |
| `GET /api/explore?type=0&country=2&page=0` | Advanced filtering | `/api/explore?country=2` |
| `GET /api/filters` | Filter metadata | `/api/filters` |

**Type codes:**
- `0` = All, `1` = Drama, `2` = Movie, `3` = Hollywood, `4` = Anime

**Country codes:**
- `0` = All, `2` = Korea, `3` = China, `4` = Japan, `5` = Hong Kong, `6` = Taiwan, `7` = Thailand, `8` = Philippines, `9` = Turkey

---

## 🚀 Deploy to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/mn-dramas)

### Manual deploy

```bash
# 1. Clone the repo
git clone https://github.com/your-org/mn-dramas.git
cd mn-dramas

# 2. Install dependencies
npm install

# 3. Deploy to Vercel
npx vercel --prod
```

Vercel will automatically:
- Detect the Vite framework
- Build the frontend (`npm run build`)
- Deploy the `/api` folder as serverless functions
- Configure rewrites for SPA routing

### Environment Variables (Optional)

Create a `.env.local` file or add these to Vercel Dashboard → Settings → Environment Variables:

```env
# Override the upstream source (defaults to https://kisskh.co)
KISSKH_BASE_URL=https://kisskh.co

# Pre-generated kkey token for stream endpoint (required for some episodes)
KISSKH_STREAM_KEY=

# Pre-generated kkey token for subtitles
KISSKH_SUB_KEY=

# Public base URL of your deployed API (used by frontend in dev)
VITE_API_BASE=/api
```

**Note:** kisskh.co now requires browser-generated `kkey` tokens for some stream endpoints. If `/api/watch` returns `null` for the stream, you'll need to generate a kkey using Playwright or set the `KISSKH_STREAM_KEY` env var.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server (frontend only)
npm run dev

# For full API testing, use Vercel CLI:
npm install -g vercel
vercel dev
```

The app will be available at `http://localhost:5173` (Vite) or `http://localhost:3000` (Vercel).

**Important:** The frontend is configured to:
1. Try `/api/<endpoint>` first (works on Vercel)
2. Fall back to a public CORS proxy for direct kisskh.co calls (works in preview/demo mode)

This ensures the app is functional even without the serverless layer deployed.

---

## 📁 Project Structure

```
mn-dramas/
├── api/                      # Vercel serverless functions
│   ├── _lib.ts              # Shared utilities (fetch, CORS, etc.)
│   ├── index.ts             # API documentation endpoint
│   ├── latest.ts            # /api/latest
│   ├── popular.ts           # /api/popular
│   ├── toprated.ts          # /api/toprated
│   ├── anime.ts             # /api/anime
│   ├── upcoming.ts          # /api/upcoming
│   ├── search.ts            # /api/search
│   ├── detail.ts            # /api/detail
│   ├── episodes.ts          # /api/episodes
│   ├── watch.ts             # /api/watch (stream + subtitles)
│   ├── subtitles.ts         # /api/subtitles
│   ├── explore.ts           # /api/explore (advanced filters)
│   └── filters.ts           # /api/filters
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── DramaCard.tsx
│   │   ├── DramaRow.tsx
│   │   ├── DramaGrid.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── Spinner.tsx
│   ├── pages/               # Route pages
│   │   ├── Home.tsx
│   │   ├── Search.tsx
│   │   ├── Drama.tsx        # Drama detail page
│   │   ├── Watch.tsx        # Video player page
│   │   ├── Popular.tsx
│   │   ├── Anime.tsx
│   │   └── Explore.tsx
│   ├── lib/
│   │   ├── api.ts           # API client with fallback
│   │   └── types.ts         # TypeScript types
│   ├── App.tsx              # Router setup
│   ├── main.tsx             # React root
│   ├── index.css            # Tailwind + custom styles
│   └── vite-env.d.ts        # Vite type definitions
├── public/                  # Static assets
├── vercel.json              # Vercel deployment config
├── .env.example             # Environment variables template
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎯 API Usage Examples

### Fetch latest dramas

```bash
curl https://your-app.vercel.app/api/latest?page=0&pagesize=20
```

**Response:**
```json
{
  "source": "kisskh",
  "endpoint": "latest",
  "data": {
    "totalCount": 1234,
    "data": [
      {
        "id": 12979,
        "title": "Off Campus (2026)",
        "originalTitle": "Off Campus",
        "thumbnail": "https://image-v1.pages.dev/...",
        "episodesCount": 8,
        "latestEpisode": 8,
        "countryID": 2,
        "type": "1",
        "status": "Ongoing"
      }
    ]
  }
}
```

### Search for a drama

```bash
curl "https://your-app.vercel.app/api/search?q=Hell%20University"
```

### Get drama details with episodes

```bash
curl https://your-app.vercel.app/api/detail?id=12319
```

### Watch an episode

```bash
curl "https://your-app.vercel.app/api/watch?id=213515&dramaId=12319"
```

**Response:**
```json
{
  "source": "kisskh",
  "endpoint": "watch",
  "episodeId": "213515",
  "stream": {
    "Video": "https://.../playlist.m3u8",
    "ThirdParty": null
  },
  "subtitles": [
    {
      "id": 1,
      "label": "English",
      "src": "https://.../sub.vtt",
      "default": true
    }
  ]
}
```

---

## ⚠️ Important Notes

1. **kkey Token Requirement:** kisskh.co now requires browser-generated `kkey` tokens for some stream endpoints. The `/api/watch` endpoint may return `null` for streams if no kkey is provided. To enable full streaming:
   - Use Playwright to generate kkeys programmatically
   - Set `KISSKH_STREAM_KEY` and `KISSKH_SUB_KEY` env vars
   - Or implement a kkey generation flow in the serverless function

2. **CORS Fallback:** In preview/demo mode (when `/api` is not available), the frontend uses public CORS proxies (`corsproxy.io`, `allorigins.win`) to fetch directly from kisskh.co. This is slower and less reliable but ensures the demo works.

3. **Rate Limiting:** kisskh.co may rate-limit or block requests. The serverless functions include proper headers and user agents to mimic browser behavior, but heavy usage may still trigger blocks.

4. **Legal Disclaimer:** This is a fan-made educational project. MN Dramas does not host any content and is not affiliated with kisskh.co. All metadata and streams are sourced from kisskh.co's public APIs.

---

## 🧰 Tech Stack

- **Frontend:** React 19,  TypeScript, Vite, Tailwind CSS, React Router, HLS.js, Lucide Icons
- **Backend:** Vercel Serverless Functions (Node.js runtime)
- **Data Source:** kisskh.co internal APIs
- **Deployment:** Vercel (auto-detected Vite framework + serverless functions)

---

## 📦 Build for Production

```bash
npm run build
```

The build output is a single HTML file (`dist/index.html`) with all assets inlined (via `vite-plugin-singlefile`). This is ideal for:
- Static hosting
- Offline use
- Embedding in other apps

For Vercel deployment, the build output is served alongside the `/api` serverless functions.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or PR for:
- Bug fixes
- New API endpoints
- UI improvements
- Additional filters (genre, year, status)

---

## 📄 License

MIT License — feel free to fork, modify, and deploy your own instance.

---

**Made with ❤️ for drama fans**

🎬 Stream • 🌏 Asia • 📺 HD
