export interface Credit {
  _id: string;
  id: string;
  name: string;
  profileAvatar?: string | null;
  characterName?: string | null;
  order?: number;
}

export interface Rating {
  _id: string;
  userId: {
    _id: string;
    username: string;
  };
  movieId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Movie {
  _id: string;
  title: string;
  adult: boolean;
  description: string;
  releaseYear: number;
  genres: string[];
  keywords: string[];
  popularityScore: number;
  imdbRating?: number;
  posterUrl: string;
  directors: Credit[];
  actors: Credit[];
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  watchHistory: {
    _id: string;
    movieId: string;
    watchedAt: Date;
    rating: number;
  }[];
  preferences: {
    favoriteGenres: string[];
    dislikedGenres: string[];
    favoriteActors: string[];
    favoriteDirectors: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
