# 🎬 RileyWatch

## 📖 Overview

This is the **backend API** for the RileyWatch, Movie Recommendation App.  
It is built with **Node.js, Express, and MongoDB**, providing:

- 🔑 **Authentication** (JWT-based login & register)
- 👤 **User profiles** with saved preferences & watch history
- ⭐ **Ratings system** for movies
- 🎥 **Movie catalog** (CRUD & search endpoints)
- 🤖 **Recommendation engine**:
  - Content-based recommendations
  - Collaborative filtering (user-based)
  - Hybrid (80% content + 20% collaborative)

---

## 🚀 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken), bcryptjs
- **Utilities:** dotenv, cors, nodemon (dev)

---

## ⚡ Quick Start

1. **Clone repository** and install dependencies:

```bash
cd backend
npm install
```

2. **Set up environment variables**  
   Create a `.env` file in `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/moviedb
JWT_SECRET=your_jwt_secret
PORT=5500
```

3. **Start the server**  
   Development mode (auto-reload with nodemon):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

---

## 🔧 Environment Variables

| Variable     | Description                                  |
| ------------ | -------------------------------------------- |
| `MONGO_URI`  | MongoDB connection string (required)         |
| `JWT_SECRET` | Secret key for signing JWT tokens (required) |
| `PORT`       | API port (default: `5500`)                   |

---

## 📡 API Endpoints

**Base URL:** `http://localhost:5500/api`

### 🔐 Auth

- `POST /auth/register` → Register new user
- `POST /auth/login` → Login user & return JWT token

### 👤 User

- `GET /users/me` → Fetch current user profile (protected)
- `PUT /users/preferences` → Update user preferences (protected)
- `GET /users/watch-history` → Get watch history (protected)

### 🎥 Movies

- `GET /movies` → Paginated list of movies (supports `page`, `limit`, `genre`)
- `GET /movies/search?q=title` → Search movies by title
- `GET /movies/:id` → Fetch movie details by ID

### ⭐ Ratings

- `GET /movies/:id/ratings` → Get all ratings for a movie
- `POST /movies/:id/ratings` → Add/update rating (protected)
- `DELETE /movies/:id/ratings` → Remove user’s rating (protected)

### 🤖 Recommendations

- `GET /movies/recommendations/personalized` → Hybrid recommendations (protected)
- `GET /movies/recommendations/content-based` → Content-based (protected)
- `GET /movies/recommendations/users-based` → Collaborative (protected)
- `GET /movies/:id/similar-movies` → Find similar movies

---

## 🗄️ Data Models

### User

```js
{
  username: String,
  email: String,
  password: String,
  preferences: {
    favoriteGenres: [String],
    dislikedGenres: [String],
    favoriteActors: [String],
    favoriteDirectors: [String]
  },
  watchHistory: [ObjectId]
}
```

### Movie

```js
{
  movieId: String,
  title: String,
  description: String,
  releaseYear: Number,
  genres: [String],
  actors: [String],
  directors: [String]
}
```

### Rating

```js
{
  userId: ObjectId,
  movieId: ObjectId,
  rating: Number, // 1–5
  comment: String
}
```

---

## 🧠 Recommendation Engine

- **Content-based:** Matches movies with user’s liked genres, actors, directors.
- **Collaborative filtering:** Finds similar users and recommends what they enjoyed.
- **Hybrid:** Combines both (80% content, 20% collaborative).

> ⚠️ Requires movie data + user preferences to generate meaningful results.

## 📌 To Do

- [ ] Add database seeding script
- [ ] Add input validation (Joi/Zod)
- [ ] Write automated tests
- [ ] Add better error handling & logging

---

## 📜 License

MIT
