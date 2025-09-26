import { useEffect, useState, useMemo } from "react";
import { Movie } from "@/types";
import { useAuth } from "@/context/auth";
import { fetchFavorites, fetchWatchlist } from "@/api/user";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { MovieCarousel } from "@/components/movie-carousel";

export default function ProfilePage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = useAuth();
  const { recommended, loading: recLoading } = useRecommendations();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (auth?.user) {
          const fav = await fetchFavorites();
          const watch = await fetchWatchlist();
          if (mounted) {
            setFavorites(fav || []);
            setWatchlist(watch || []);
          }
        } else {
          // fallback to localStorage for guests
          const fav = localStorage.getItem("favorites");
          const watch = localStorage.getItem("watchlist");
          if (fav) setFavorites(JSON.parse(fav));
          if (watch) setWatchlist(JSON.parse(watch));
        }
      } catch (err) {
        console.error("Failed to fetch lists", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [auth?.user]);

  // ✅ Deduplicate movies by _id
  const uniqueFavorites = useMemo(
    () => Array.from(new Map(favorites.map((m) => [m._id, m])).values()),
    [favorites]
  );
  const uniqueWatchlist = useMemo(
    () => Array.from(new Map(watchlist.map((m) => [m._id, m])).values()),
    [watchlist]
  );
  const uniqueRecommended = useMemo(
    () => Array.from(new Map(recommended.map((m) => [m._id, m])).values()),
    [recommended]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] animate-fade-in">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 sm:mb-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-700 flex items-center justify-center">
          <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mt-3 sm:mt-4 text-center">
          {auth.user?.username || "Guest"}
        </h1>
        {auth.user && (
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Joined: Jan 2025
          </p>
        )}

        {/* Action buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
          <Button
            variant="destructive"
            className="flex-1 sm:flex-none rounded-lg px-4 sm:px-6 py-2 font-semibold
                  bg-gradient-to-r from-chart-3 via-foreground/25 to-amber-900 text-white
                 shadow-md transition-all duration-200 ease-in-out
                 hover:from-amber-900 hover:to-chart-3 hover:scale-105 hover:shadow-lg
                  disabled:opacity-50"
          >
            Edit Profile
          </Button>
          <Button
            variant="destructive"
            className="flex-1 sm:flex-none rounded-lg px-4 sm:px-6 py-2 font-semibold
                  bg-gradient-to-r from-amber-900 via-foreground/25 to-chart-3 text-white
                 shadow-md transition-all duration-200 ease-in-out
                 hover:from-chart-3 hover:to-amber-900 hover:scale-105 hover:shadow-lg
                  disabled:opacity-50"
          >
            Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center mb-8 sm:mb-10">
        <div>
          <p className="text-lg sm:text-2xl font-bold">
            {uniqueFavorites.length}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">Favorites</p>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-bold">
            {uniqueWatchlist.length}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">Watchlist</p>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-bold">
            {uniqueRecommended.length}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">Recs</p>
        </div>
      </div>

      {/* Favorites */}
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
          Favorites
        </h2>
        {uniqueFavorites.length > 0 ? (
          <MovieCarousel movies={uniqueFavorites} autoScroll={false} />
        ) : (
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
            No favorites yet.{" "}
            <a href="/movies" className="text-blue-400 underline">
              Browse movies
            </a>
          </p>
        )}
      </section>

      {/* Watchlist */}
      <section className="mt-8 sm:mt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
          Watchlist
        </h2>
        {uniqueWatchlist.length > 0 ? (
          <MovieCarousel movies={uniqueWatchlist} autoScroll={false} />
        ) : (
          <p className="text-gray-400 text-sm sm:text-base">
            Nothing in watchlist yet.{" "}
            <a href="/movies" className="text-blue-400 underline">
              Start adding
            </a>
          </p>
        )}
      </section>

      {/* Recommendations */}
      {uniqueRecommended.length > 0 && (
        <section className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Recommended for You
          </h2>
          {recLoading ? (
            <div className="flex justify-center items-center py-6">
              <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
            </div>
          ) : (
            <MovieCarousel movies={uniqueRecommended} autoScroll />
          )}
        </section>
      )}
    </div>
  );
}
