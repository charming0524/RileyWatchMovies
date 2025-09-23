# RileyWatch

**RileyWatch** is a full‑stack movie recommendation app that combines a React + Vite TypeScript frontend with a Node.js + Express + MongoDB backend. The project includes a hybrid recommender system (content‑based + user‑based collaborative filtering) and features user authentication, watch history, ratings/comments, and personalized recommendations.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started (Local Development)](#getting-started-local-development)

  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)

- [API Reference (Highlights)](#api-reference-highlights)
- [Recommender System (How it Works)](#recommender-system-how-it-works)
- [Data Models (Overview)](#data-models-overview)
- [Seeding The Database](#testing--seeding-data)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

RileyWatch aims to deliver relevant movie recommendations by combining content signals (genres, actors, keywords, popularity) with collaborative signals (user ratings, similar users). It ships with a simple auth system, ratings & comments, watch history tracking, and endpoints for fetching paginated movies and personalized recommendations.

## Project Demo Images

![img1](/img/GuestHomePage.png)

![img2](/img/RegisteredUserHomePage.png)

![img3](/img/MoviesPage.png)

![img4](/img/LoginPage.png)

![img5](/img/SearchResults.png)

![img6](/img/MovieDetails.png)

![img7](/img/ProfilePage.png)

![img8](/img/SimilarMovies.png)

## Features

- User registration and login (JWT)
- Watch history tracking and per‑user preferences
- Rating and commenting on movies (unique per user/movie)
- Movie browsing with pagination and genre filters
- Personalized recommendations (hybrid approach)
- Basic fallback strategy if a user has no history

## Tech Stack

- Frontend: React (Vite) + TypeScript, TailwindCSS, ShadcnUI
- Backend: Node.js, Express (ESM), MongoDB (Mongoose)
- Authentication: JSON Web Tokens (JWT)
- APIs: TMDB API for movie data
- Packages of note: bcryptjs, jsonwebtoken, dotenv, mongoose, axios

## Repository Structure

```
movie/
├─ backend/                # Express + Mongoose API server
│  ├─ src/
│  │  ├─ models/           # Mongoose models (User, Movie, Rating)
│  │  ├─ routes/           # Auth, users, movies routes
│  │  ├─ utils/            # Recommender implementations (hybrid, content, collaborative)
│  │  ├─ middleware/       # auth middleware
│  │  └─ server.js         # App entry
│  ├─ package.json
│  └─ .env (not committed)

├─ frontend/               # Vite + React TypeScript app
│  ├─ src/
│  │  ├─ api/              # API wrappers using axios
│  │  ├─ lib/              # helpers (api client, constants)
│  │  └─ components/       # UI components
│  ├─ public/
│  └─ package.json

```

## Getting Started (Local Development)

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)
- API Key from TMDB

### Environment Variables

Create a `.env` file in the `backend/` folder with values like:

```
# backend/.env

MONGODB_URI=<YOUR_MONGODB_URI>
JWT_SECRET=<YOUR_JWT_SECRET>
PORT=<YOUR_PORT>
TMDB_API_KEY=<YOUR_TMDB_API_KEY>
```

Frontend environment variables create `.env` in `frontend/`:

```
VITE_API_URL=http://localhost:5500/api
```

### Backend Setup

1. `cd movie/backend`
2. `npm install`
3. Start the server in development mode:

   - `npm run dev` (uses nodemon)

Default server port: `5500` (can be changed with `PORT` in .env). CORS is configured to allow `http://localhost:5173`.

### Frontend Setup

1. `cd movie/frontend`
2. `npm install`
3. `npm run dev`

This will start Vite on the port shown in your terminal (usually 5173). The frontend uses an axios instance configured to read `VITE_API_URL`.

## API Reference (Highlights)

> Base path: `/api` (default `http://localhost:5500/api`)

### Auth

- `POST /api/auth/register` — register with `{ username, email, password }` → returns token + user
- `POST /api/auth/login` — login with `{ email, password }` → returns token + user

### Users

- `GET /api/users/me` — get current user profile (requires auth)
- `GET /api/users/watch-history` — get watch history for current user

### Movies

- `GET /api/movies` — list movies (supports `page`, `limit`, `genre` query params)
- `GET /api/movies/:id` — movie details
- `GET /api/movies/recommendations/personalized` — personalized recommendations (requires auth)
- Rating endpoints are implemented via the `Rating` model (check `routes/movies.js` for exact routes and payloads)

## Recommender System (How it Works)

RileyWatch uses a **hybrid recommender** implemented server‑side in `backend/src/utils/`:

1. **Content‑based recommender** (`contentBasedRecommender.js`)

- Examines movie attributes such as genre, cast, director, and keywords.
- Suggests titles that align with the user’s previous preferences.
- Example: _“Since you liked sci-fi thrillers, you may also enjoy Blade Runner 2049.”_
  - Falls back to popular movies if the user has little/no preference data.

2. **Collaborative filtering** (`collaborativeFiltering.js`)

- Suggests movies by identifying users with similar tastes.
- Recommendations are driven by interactions like ratings, likes, and watchlists.
- Example: _“Viewers who enjoyed Inception also enjoyed Interstellar.”_

3. **Hybrid** (`hybridRecommender.js`)

   - Integrates both collaborative and content-based approaches for improved precision.

- Delivers a balance between personalized suggestions and trending discoveries.

## Data Models (Overview)

- **User** (`models/User.js`)

  - `username`, `email`, `password` (hashed), `watchHistory` (refs to Movie + rating + date), `preferences` (favoriteGenres, favoriteActors, dislikedGenres), timestamps

- **Movie** (`models/Movie.js`)

  - `movieId` (numeric id), `title`, `description`, `genres`, `actors`, `directors`, `keywords`, `posterUrl`, `popularityScore`, `imdbRating`, `duration` etc.

- **Rating** (`models/Rating.js`)

  - `userId`, `movieId`, `rating` (1–5), `comment` — unique index on `(userId, movieId)` to ensure one rating per user/movie.

## Seeding The Database

```bash
# Navigate to backend folder
cd backend
node src/scripts/importMovies.js
```

## Contributing

Contributions are welcome. Suggested workflow:

- Fork the repo
- Create a feature branch
- Run both frontend and backend locally and ensure no breaking changes
- Open a pull request describing your changes

## Licens

This project is licensed under the [MIT License](LICENSE).

## 🌟 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) API
