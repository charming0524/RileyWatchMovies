import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Movie } from "@/types";
import { useAuth } from "@/context/auth";
import { MovieCarousel } from "@/components/movie-carousel";
import { useRecommendations } from "@/hooks/useRecommendations";

export default function SearchResults() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const { recommended } = useRecommendations(15);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  // redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  // fetch search results
  useEffect(() => {
    if (!query || !user) return;

    async function fetchMovies() {
      try {
        setLoading(true);

        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/movies/search?query=${encodeURIComponent(query)}`
        );

        // <-- IMPORTANT: cast the JSON to Movie[]
        const data = (await res.json()) as Movie[];

        // dedupe by _id and keep typing
        const unique = Array.from(
          new Map((data || []).map((m: Movie) => [m._id, m])).values()
        ) as Movie[];

        setMovies(unique);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [query, user]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h2 className="text-2xl font-bold mb-6">Search Results for "{query}"</h2>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        </div>
      )}

      {/* Carousel for search results */}
      {!loading && movies.length > 0 ? (
        <MovieCarousel movies={movies} autoScroll={false} />
      ) : (
        !loading && <p>No results found.</p>
      )}

      {/* You may also like section */}
      {recommended.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">You May Also Like</h3>
          <MovieCarousel
            movies={
              Array.from(
                new Map(recommended.map((m) => [m._id, m])).values()
              ) as Movie[]
            }
            autoScroll
          />
        </div>
      )}
    </div>
  );
}
