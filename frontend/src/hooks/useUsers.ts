import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAuthUser, updateUserPreferences } from "@/api/user";

export function useGetAuthUser() {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: fetchAuthUser,
  });
}

export function useMutateUserPreference() {
  return useMutation({
    mutationFn: async ({
      favoriteActors = [],
      favoriteDirectors = [],
      favoriteGenres = [],
    }: {
      favoriteGenres: string[];
      favoriteActors: string[];
      favoriteDirectors: string[];
    }) =>
      await updateUserPreferences({
        favoriteActors,
        favoriteDirectors,
        favoriteGenres,
      }),
  });
}
