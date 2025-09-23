import getContentBasedRecommendations from "./contentBasedRecommender.js";
import getUserBasedRecommendations from "./collaborativeFiltering.js";

export default async function getHybridRecommendations(userId, limit = 20) {
  try {
    const contentLimit = Math.ceil(limit * 0.8); // 80% content-based
    const collaborativeLimit = limit - contentLimit; // 20% collaborative-based

    const [contentBased, collaborative] = await Promise.all([
      getContentBasedRecommendations(userId, contentLimit),
      getUserBasedRecommendations(userId, collaborativeLimit),
    ]);

    const combined = [...contentBased, ...collaborative];

    const uniqueMovies = [];
    const seen = new Set();

    for (const movie of combined) {
      const id = movie._id.toString();
      if (!seen.has(id)) {
        seen.add(id);
        uniqueMovies.push(movie);
      }
      if (uniqueMovies.length >= limit) {
        break; // Only up to the requested limit
      }
    }

    return uniqueMovies;
  } catch (err) {
    console.error("Failed to get hybrid recommendations:", err);
    throw err;
  }
}
