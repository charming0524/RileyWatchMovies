import { useEffect, useState } from "react";
import {
  fetchContentBasedRecommendation,
  fetchHybridRecommendation,
  fetchUserBasedRecommendation,
} from "@/api/movies";
import { Movie } from "@/types";

/**
 * Hook to fetch and combine recommendations (content, hybrid, user-based).
 * Deduplicates results by _id.
 */
export function useRecommendations(limit: number = 15) {
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRecs() {
      try {
        setLoading(true);

        const [content, hybrid, userBased] = await Promise.all([
          fetchContentBasedRecommendation(),
          fetchHybridRecommendation(),
          fetchUserBasedRecommendation(),
        ]);

        const combined = [...content, ...hybrid, ...userBased];

        // ✅ Deduplicate by _id
        const unique = Array.from(
          new Map(combined.map((m) => [m._id, m])).values()
        );

        setRecommended(limit > 0 ? unique.slice(0, limit) : unique);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
        setRecommended([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecs();
  }, [limit]);

  return { recommended, loading };
}
