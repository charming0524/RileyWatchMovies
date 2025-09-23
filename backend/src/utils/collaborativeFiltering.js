import Rating from "../models/Rating.js";
import Movie from "../models/Movie.js";

/**
 * Fetch personalized movie recommendations for a user.
 */
export default async function getUserBasedRecommendations(userId, limit = 20) {
  try {
    const userRatings = await getUserRatingsMatrix();

    if (!userRatings[userId]) {
      return await getFallbackMovies(limit); // No ratings, fallback immediately
    }

    const similarUsers = findTopSimilarUsers(userId, userRatings);

    const recommendedMovieIds = generateRecommendations(
      userId,
      similarUsers,
      userRatings,
      limit
    );

    let recommendedMovies = [];

    if (recommendedMovieIds.length > 0) {
      const movies = await Movie.find({
        _id: { $in: recommendedMovieIds },
      });

      // Sort movies by the original recommendation order
      const movieMap = new Map(
        movies.map((movie) => [movie._id.toString(), movie])
      );
      recommendedMovies = recommendedMovieIds
        .map((id) => movieMap.get(id))
        .filter(Boolean);
    }

    // If not enough recommendations, fallback
    if (recommendedMovies.length < limit) {
      const fallbackMovies = await getFallbackMovies(
        limit - recommendedMovies.length
      );

      // Create a Set of existing movie IDs
      const existingMovieIds = new Set(
        recommendedMovies.map((m) => m._id.toString())
      );

      // Filter fallbackMovies to only include movies not already in recommendations
      const uniqueFallbackMovies = fallbackMovies.filter(
        (movie) => !existingMovieIds.has(movie._id.toString())
      );

      recommendedMovies = [...recommendedMovies, ...uniqueFallbackMovies];
    }

    return recommendedMovies.slice(0, limit);
  } catch (error) {
    console.error("Failed to get recommendations:", error);
    throw error;
  }
}

// Helper fallback function
async function getFallbackMovies(limit) {
  // Example fallback: return latest/popular/random movies
  const fallbackMovies = await Movie.find()
    .sort({ popularityScore: -1 }, { createdAt: -1 }) // newest first
    .limit(limit);

  return fallbackMovies;
}

/**
 * Build user-movie rating matrix.
 */
async function getUserRatingsMatrix() {
  const ratings = await Rating.find({}, "userId movieId rating").lean();

  const matrix = {};
  for (const { userId, movieId, rating } of ratings) {
    const user = userId.toString();
    const movie = movieId.toString();
    if (!matrix[user]) {
      matrix[user] = {};
    }
    matrix[user][movie] = rating;
  }
  return matrix;
}

/**
 * Find the top K similar users to the target user based on cosine similarity.
 */
function findTopSimilarUsers(targetUserId, userRatings, k = 5) {
  const similarities = [];

  for (const [userId, ratings] of Object.entries(userRatings)) {
    if (userId === targetUserId) continue;

    const similarity = calculateCosineSimilarity(
      userRatings[targetUserId],
      ratings
    );
    if (similarity > 0) {
      similarities.push([userId, similarity]);
    }
  }

  return similarities.sort((a, b) => b[1] - a[1]).slice(0, k);
}

/**
 * Generate recommended movie IDs sorted by predicted scores.
 */
function generateRecommendations(
  targetUserId,
  similarUsers,
  userRatings,
  limit
) {
  const scores = {};
  const targetRatedMovies = new Set(Object.keys(userRatings[targetUserId]));

  for (const [similarUserId, similarity] of similarUsers) {
    const similarUserRatings = userRatings[similarUserId];

    for (const [movieId, rating] of Object.entries(similarUserRatings)) {
      if (targetRatedMovies.has(movieId)) continue; // Already rated by target user

      scores[movieId] = (scores[movieId] || 0) + rating * similarity;
    }
  }

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1]) // Higher score first
    .slice(0, limit)
    .map(([movieId]) => movieId);
}

/**
 * Calculate cosine similarity between two users.
 */
function calculateCosineSimilarity(ratingsA, ratingsB) {
  const commonMovies = Object.keys(ratingsA).filter(
    (movieId) => ratingsB[movieId]
  );

  if (commonMovies.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const movieId of commonMovies) {
    const ratingA = ratingsA[movieId];
    const ratingB = ratingsB[movieId];

    dotProduct += ratingA * ratingB;
    magnitudeA += ratingA * ratingA;
    magnitudeB += ratingB * ratingB;
  }

  const denominator = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}
