import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteRating,
  fetchContentBasedRecommendation,
  fetchHybridRecommendation,
  fetchMovieById,
  fetchMovies,
  fetchRatingsByMovieId,
  fetchSimilarMovies,
  fetchUserBasedRecommendation,
  mutateRating,
} from "@/api/movies";

export function useMovies({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: ["movies"],
    queryFn: async () => fetchMovies({ page, limit }),
  });
}

export function useHybridRecommendation() {
  return useQuery({
    queryKey: ["movies", "hybrid"],
    queryFn: async () => fetchHybridRecommendation(),
  });
}

export function useContentBasedRecommendation() {
  return useQuery({
    queryKey: ["movies", "content-based"],
    queryFn: async () => fetchContentBasedRecommendation(),
  });
}

export function useUserBasedRecommendation() {
  return useQuery({
    queryKey: ["movies", "users-based"],
    queryFn: async () => fetchUserBasedRecommendation(),
  });
}

export function useInfiniteFetchMovies(genre?: string) {
  return useInfiniteQuery({
    queryKey: ["movies", "infinite", genre],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) =>
      await fetchMovies({ page: pageParam, genre }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.pages) {
        return lastPage.page + 1; // fetch next page
      }
      return undefined; // no more pages
    },
  });
}

export function useMovieById(movieId: string) {
  return useQuery({
    queryKey: ["movies", movieId],
    queryFn: async () => await fetchMovieById(movieId),
  });
}

export function useSimilarMovies(movieId: string) {
  return useQuery({
    queryKey: ["movies", movieId, "similar-movies"],
    queryFn: async () => await fetchSimilarMovies(movieId),
  });
}

export function useGetRatingsByMovieId(movieId: string) {
  return useQuery({
    queryKey: ["movies", movieId, "ratings"],
    queryFn: async () => await fetchRatingsByMovieId(movieId),
  });
}

export function useMutateRating() {
  return useMutation({
    mutationFn: async ({
      rating,
      comment,
      movieId,
    }: {
      rating: number;
      comment: string;
      movieId: string;
    }) =>
      await mutateRating({
        rating,
        comment,
        movieId,
      }),
  });
}

export function useDeleteRating() {
  return useMutation({
    mutationFn: async ({ movieId }: { movieId: string }) =>
      { await deleteRating({
        movieId,
      }); },
  });
}
