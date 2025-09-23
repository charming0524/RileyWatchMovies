import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Movie } from "@/types";
import { useAuth } from "@/context/auth";
import {
  fetchContentBasedRecommendation,
  fetchHybridRecommendation,
  fetchUserBasedRecommendation,
} from "@/api/movies";
import { MovieCarousel } from "@/components/movie-carousel";

export default function SearchResults() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  // ✅ redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  // ✅ fetch search results
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
        const data = await res.json();
        setMovies(data || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [query, user]);

  // ✅ fetch recommended movies (You may also like)
  useEffect(() => {
    if (!user) return;

    async function fetchRecommended() {
      try {
        const [content, hybrid, userBased] = await Promise.all([
          fetchContentBasedRecommendation(),
          fetchHybridRecommendation(),
          fetchUserBasedRecommendation(),
        ]);
        const combined = [...content, ...hybrid, ...userBased];
        const unique = Array.from(
          new Map(combined.map((m) => [m._id, m])).values()
        );
        setRecommended(unique.slice(0, 15));
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    }

    fetchRecommended();
  }, [user]);

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

      {/* ✅ Carousel for search results */}
      {!loading && movies.length > 0 ? (
        <MovieCarousel movies={movies} autoScroll={false} />
      ) : (
        !loading && <p>No results found.</p>
      )}

      {/* ✅ You may also like section */}
      {recommended.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">You May Also Like</h3>
          <MovieCarousel movies={recommended} autoScroll />
        </div>
      )}
    </div>
  );
}
