import { useEffect, useState } from "react";
import { Movie } from "@/types";
import { MovieCard } from "@/components/movie-card";
import { useAuth } from "@/context/auth";

export default function ProfilePage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true); // ✅ spinner state

  const auth = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (auth?.user) {
          const { fetchFavorites, fetchWatchlist } = await import("@/api/user");
          const fav = await fetchFavorites();
          const watch = await fetchWatchlist();
          if (mounted) {
            setFavorites(fav || []);
            setWatchlist(watch || []);
          }
        } else {
          // fallback to localStorage for anonymous users
          const fav = localStorage.getItem("favorites");
          const watch = localStorage.getItem("watchlist");
          if (fav) setFavorites(JSON.parse(fav));
          if (watch) setWatchlist(JSON.parse(watch));
        }
      } catch (err) {
        console.error("Failed to fetch lists", err);
      } finally {
        if (mounted) setLoading(false); // ✅ stop spinner once done
      }
    })();
    return () => {
      mounted = false;
    };
  }, [auth?.user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] animate-fade-in">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          Welcome, {auth.user?.username || "Guest"}
        </h1>
      </div>

      {/* Favorites */}
      <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {favorites.map((movie) => (
            <div key={movie._id} className="transform scale-100">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mb-8">No favorites added yet.</p>
      )}

      {/* Watchlist */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">Watchlist</h2>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {watchlist.map((movie) => (
            <div key={movie._id} className="transform scale-100">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No movies in watchlist yet.</p>
      )}
    </div>
  );
}
