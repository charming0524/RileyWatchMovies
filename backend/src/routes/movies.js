import express from "express";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Rating from "../models/Rating.js";
import auth from "../middleware/auth.js";
import getHybridRecommendations from "../utils/hybridRecommender.js";
import getContentBasedRecommendations from "../utils/contentBasedRecommender.js";
import getUserBasedRecommendations from "../utils/collaborativeFiltering.js";

const router = express.Router();

// Get all movies (paginated)
router.get("/", async (req, res) => {
  try {
    const genre = req.query.genre;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (genre) {
      query.genres = { $in: [genre] }; // wrap genre in an array
    }

    const movies = await Movie.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ popularityScore: -1 });

    const total = await Movie.countDocuments(query); // Count based on filtered query

    res.json({
      movies,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Search movies
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { genres: { $regex: query, $options: "i" } },
        { keywords: { $regex: query, $options: "i" } },
      ],
    }).limit(20);

    res.json(movies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get recommendations
router.get("/recommendations/personalized", auth, async (req, res) => {
  try {
    const recommendations = await getHybridRecommendations(req.user.id);

    res.json(recommendations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/recommendations/content-based", auth, async (req, res) => {
  try {
    const recommendations = await getContentBasedRecommendations(req.user.id);
    res.json(recommendations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/recommendations/users-based", auth, async (req, res) => {
  try {
    const recommendations = await getUserBasedRecommendations(req.user.id);
    res.json(recommendations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: "Movie not found" });
    res.json(movie);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Rate a movie
router.post("/:id/ratings", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Check if rating exists
    let existingRating = await Rating.findOne({
      userId: req.user.id,
      movieId: req.params.id,
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.comment = comment;
      await existingRating.save();
    } else {
      // Create new rating
      existingRating = new Rating({
        userId: req.user.id,
        movieId: req.params.id,
        rating,
        comment,
      });
      await existingRating.save();

      // Add to user's watch history
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          watchHistory: {
            movieId: req.params.id,
            rating,
          },
        },
      });
    }

    res.json(existingRating);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all ratings for a specific movie
router.get("/:id/ratings", async (req, res) => {
  try {
    const movieId = req.params.id;

    const ratings = await Rating.find({ movieId }).populate(
      "userId",
      "username"
    );

    res.json(ratings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete a rating
router.delete("/:id/ratings", auth, async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user.id;

    const deletedRating = await Rating.findOneAndDelete({ movieId, userId });

    if (!deletedRating) {
      return res.status(404).json({ msg: "Rating not found" });
    }

    // Optionally, you can also remove it from watch history
    await User.findByIdAndUpdate(userId, {
      $pull: { watchHistory: { movieId } },
    });

    res.json({ msg: "Rating deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/:id/similar-movies", async (req, res) => {
  try {
    const referenceMovie = await Movie.findById(req.params.id);

    if (!referenceMovie) {
      return [];
    }

    const genres = referenceMovie.genres || [];
    const actorIds = referenceMovie.actors?.map((actor) => actor.id) || [];
    const directorIds =
      referenceMovie.directors?.map((director) => director.id) || [];
    const keywords = referenceMovie.keywords || [];

    // 1. Find potential candidates (matches at least one genre or actor or director)
    const candidates = await Movie.find({
      _id: { $ne: referenceMovie._id },
      $or: [
        { genres: { $in: genres } },
        { keywords: { $in: keywords } },
        { "actors.id": { $in: actorIds } },
        { "directors.id": { $in: directorIds } },
      ],
    });

    // 2. Score each candidate
    const scoredCandidates = candidates.map((movie) => {
      let score = 0;

      // Match genres
      const matchedGenres =
        movie.genres?.filter((genre) => genres.includes(genre)) || [];
      score += matchedGenres.length;

      // Match keywords
      const matchedKeywords =
        movie.keywords?.filter((keyword) => keywords.includes(keyword)) || [];
      score += matchedKeywords.length;

      // Match actors
      const movieActorIds = movie.actors?.map((actor) => actor.id) || [];
      const matchedActors = movieActorIds.filter((id) => actorIds.includes(id));
      score += matchedActors.length;

      // Match directors
      const movieDirectorIds =
        movie.directors?.map((director) => director.id) || [];
      const matchedDirectors = movieDirectorIds.filter((id) =>
        directorIds.includes(id)
      );
      score += matchedDirectors.length;

      return {
        movie,
        score,
      };
    });

    // 3. Sort: first by score (descending), then by popularityScore (also descending)
    scoredCandidates.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (b.movie.popularityScore || 0) - (a.movie.popularityScore || 0);
    });

    // 4. Return only the movies, limited
    const similarMovies = scoredCandidates
      .slice(0, 20)
      .map((entry) => entry.movie);

    res.json(similarMovies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
