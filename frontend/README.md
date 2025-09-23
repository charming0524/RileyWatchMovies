# 🎬 RileyWatch Frontend

## 📖 Overview

This is the **frontend client** for the RileyWatch, Movie Recommendation App.  
It is built with **React (TypeScript) + Vite** and styled with **modern UI libraries**.

Features:

- 🔑 User authentication (login/register)
- 🎥 Browse movies with search & filters
- ⭐ Rate movies & leave comments
- ❤️ Save preferences & watch history
- 🤖 Personalized recommendations via backend APIs

---

## 🚀 Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **HTTP client:** Axios (with JWT + cookie interceptor)
- **UI:** Radix, lucide-react icons, Framer Motion, Embla Carousel
- **State/data:** React Query (TanStack)

---

## ⚡ Quick Start

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Configure environment variables**  
   Create a `.env` in `frontend/`:

```env
VITE_API_URL=http://localhost:5500/api
```

3. **Start development server**

```bash
npm run dev
```

Frontend runs by default at `http://localhost:5173`

4. **Build production bundle**

```bash
npm run build
npm run preview
```

---

## 🔧 Environment Variables

| Variable       | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `VITE_API_URL` | Base backend API URL (default: `http://localhost:5500/api`) |

---

## 📡 API Integration

Frontend uses `src/lib/api.ts` to:

- Attach `Authorization: Bearer <token>` to every request
- Use `withCredentials: true` for cookie-based session
- Handle errors gracefully

Key API wrapper files:

- `src/api/movies.ts` → fetch movies, recommendations, ratings
- `src/api/user.ts` → authentication & preferences

---

## 📌 Features

- 🔎 Movie search (with genre filter)
- 🏷️ Genres & pagination
- 🖤 Favourites & watchlist integration
- 🎥 Trending, popular & blockbuster sections
- 🤖 AI-powered recommendation display

---

## 📌 To Do

- [ ] Add DB seed UI button (for testing)
- [ ] Improve error handling (toasts/UI feedback)
- [ ] Persist login session across reloads
- [ ] Add responsive optimizations

---

## 📜 License

MIT
