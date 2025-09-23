import "dotenv/config";
import mongoose from "mongoose";
import Movie from "../models/Movie.js";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Fetch popular movies from TMDb and get full details
async function fetchMovieData(page) {
  try {
    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`, // ✅ "Bearer" is added here
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!data?.results) return [];

    return await Promise.all(
      data.results.map(async (movie) => await getMovieDetail(movie.id))
    );
  } catch (err) {
    console.error("❌ Error fetching movie data:", err.message);
    return [];
  }
}

// Fetch detailed data for one movie
async function getMovieDetail(movieId) {
  try {
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    };

    const [detailsRes, creditsRes, keywordsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
        headers,
      }),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
        { headers }
      ),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/keywords`, {
        headers,
      }),
    ]);

    if (!detailsRes.ok || !creditsRes.ok || !keywordsRes.ok) return null;

    const data = await detailsRes.json();
    const creditData = (await creditsRes.json())?.cast || [];
    const keywordsData = (await keywordsRes.json())?.keywords || [];

    return {
      title: data.title,
      description: data.overview,
      releaseYear: data.release_date
        ? new Date(data.release_date).getFullYear()
        : null,
      genres: data.genres?.map((g) => g.name) || [],
      directors: creditData
        .filter((p) => p.known_for_department === "Directing")
        .map((p) => ({
          id: p.id,
          name: p.name,
          profileAvatar: p.profile_path
            ? `https://image.tmdb.org/t/p/w500${p.profile_path}`
            : null,
          order: p.order,
        })),
      actors: creditData
        .filter((p) => p.known_for_department === "Acting")
        .map((p) => ({
          id: p.id,
          name: p.name,
          profileAvatar: p.profile_path
            ? `https://image.tmdb.org/t/p/w500${p.profile_path}`
            : null,
          characterName: p.character,
          order: p.order,
        })),
      imdbRating: data.vote_average,
      movieId: data.id,
      posterUrl: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : null,
      popularityScore: data.popularity,
      adult: data.adult,
      keywords: keywordsData.map((k) => k.name),
    };
  } catch (err) {
    console.error(`❌ Failed to fetch movie ${movieId}:`, err.message);
    return null;
  }
}

// Main importer
async function importMovies() {
  try {
    for (let i = 1; i <= 40; i++) {
      console.log(`📥 Fetching page ${i}`);
      const movies = await fetchMovieData(i);
      const filtered = movies.filter(Boolean); // remove nulls
      await Movie.insertMany(filtered, { ordered: false });
      console.log(`✅ Imported ${filtered.length} movies from page ${i}`);
    }
    console.log("🎉 Movie import complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Import failed:", err.message);
    process.exit(1);
  }
}

importMovies();
