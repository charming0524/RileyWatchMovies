import User from "../models/User.js";
import Movie from "../models/Movie.js";

export default async function getContentBasedRecommendations(
  userId,
  limit = 20
) {
  try {
    const user = await User.findById(userId).populate("watchHistory.movieId");

    if (!user) {
      return await Movie.find().sort({ popularityScore: -1 }).limit(limit);
    }

    const favoriteGenres = user.preferences?.favoriteGenres || [];
    const favoriteActors = user.preferences?.favoriteActors || [];
    const dislikedGenres = user.preferences?.dislikedGenres || [];

    const likedMovies = user.watchHistory
      .filter((wh) => wh.rating >= 3)
      .map((wh) => wh.movieId);

    const dislikedGenresQuery =
      dislikedGenres.length > 0 ? { genres: { $nin: dislikedGenres } } : {};
    const excludeLikedMovies =
      likedMovies.length > 0
        ? { _id: { $nin: likedMovies.map((m) => m._id) } }
        : {};

    let recommendations = [];
    const addedMovieIds = new Set(); // ✅ Track added movies

    async function addUniqueMovies(query, howMany) {
      if (howMany <= 0) return;

      const movies = await Movie.find(query).limit(howMany);

      for (const movie of movies) {
        if (!addedMovieIds.has(movie._id.toString())) {
          recommendations.push(movie);
          addedMovieIds.add(movie._id.toString());

          if (recommendations.length >= limit) {
            break;
          }
        }
      }
    }

    const commonKeywords =
      likedMovies.length > 0 ? extractCommonKeywords(likedMovies) : [];

    // 1. Genre + Actor + Keywords
    if (
      favoriteGenres.length > 0 &&
      favoriteActors.length > 0 &&
      commonKeywords.length > 0
    ) {
      await addUniqueMovies(
        {
          ...dislikedGenresQuery,
          ...excludeLikedMovies,
          genres: { $in: favoriteGenres },
          "actors.name": { $in: favoriteActors },
          keywords: { $in: commonKeywords },
        },
        limit - recommendations.length
      );
    }

    // 2. Genre + Actor
    if (favoriteGenres.length > 0 && favoriteActors.length > 0) {
      await addUniqueMovies(
        {
          ...dislikedGenresQuery,
          ...excludeLikedMovies,
          genres: { $in: favoriteGenres },
          "actors.name": { $in: favoriteActors },
        },
        limit - recommendations.length
      );
    }

    // 3. Actor + Keywords
    if (favoriteActors.length > 0 && commonKeywords.length > 0) {
      await addUniqueMovies(
        {
          ...dislikedGenresQuery,
          ...excludeLikedMovies,
          "actors.name": { $in: favoriteActors },
          keywords: { $in: commonKeywords },
        },
        limit - recommendations.length
      );
    }

    // 4. Genre + Keywords
    if (favoriteGenres.length > 0 && commonKeywords.length > 0) {
      await addUniqueMovies(
        {
          ...dislikedGenresQuery,
          ...excludeLikedMovies,
          genres: { $in: favoriteGenres },
          keywords: { $in: commonKeywords },
        },
        limit - recommendations.length
      );
    }

    // 5. Actor only
    if (favoriteActors.length > 0) {
      await addUniqueMovies(
        {
          ...dislikedGenresQuery,
          ...excludeLikedMovies,
          "actors.name": { $in: favoriteActors },
        },
        limit - recommendations.length
      );
    }

    // 6. Genre only
    if (favoriteGenres.length > 0) {
      await addUniqueMovies(
        {
          ...dislikedGenresQuery,
          ...excludeLikedMovies,
          genres: { $in: favoriteGenres },
        },
        limit - recommendations.length
      );
    }

    // 7. Keywords only
    if (commonKeywords.length > 0) {
      await addUniqueMovies(
        {
          ...dislikedGenresQuery,
          ...excludeLikedMovies,
          keywords: { $in: commonKeywords },
        },
        limit - recommendations.length
      );
    }

    // 8. Fallback: Top popular movies
    if (recommendations.length < limit) {
      await addUniqueMovies({}, limit - recommendations.length);
    }

    return recommendations;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function extractCommonKeywords(movies) {
  const keywordFrequency = {};
  movies.forEach((movie) => {
    if (movie.keywords && movie.keywords.length > 0) {
      movie.keywords.forEach((keyword) => {
        keywordFrequency[keyword] = (keywordFrequency[keyword] || 0) + 1;
      });
    }
  });

  return Object.entries(keywordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword]) => keyword);
}
