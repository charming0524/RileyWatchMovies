import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieReviews } from "@/components/movie-reviews";
import { Star, Clock, Heart, PlusCircle, CheckCircle } from "lucide-react";
import { MovieCast } from "@/components/movie-cast";
import { Link, useNavigate, useParams } from "react-router";
import { useMovieById, useSimilarMovies } from "@/hooks/useMovies";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";
import {
  addFavorite,
  removeFavorite,
  addToWatchlist as addWatchlistApi,
  removeFromWatchlist as removeWatchlistApi,
} from "@/api/user";

// --- LocalStorage helpers ---
function getStorageKey(user: any, key: string) {
  if (user && (user._id || user.id)) return `${key}_${user._id || user.id}`;
  return key;
}
function getList(user: any, key: string) {
  const storageKey = getStorageKey(user, key);
  const existing = localStorage.getItem(storageKey);
  return existing ? JSON.parse(existing) : [];
}
function isInList(user: any, key: string, movieId: string) {
  const list = getList(user, key);
  return list.some((m: any) => m._id === movieId);
}
function addToList(user: any, key: string, movie: any) {
  const storageKey = getStorageKey(user, key);
  const list = getList(user, key);
  if (!list.find((m: any) => m._id === movie._id)) {
    list.push(movie);
    localStorage.setItem(storageKey, JSON.stringify(list));
  }
}
function removeFromList(user: any, key: string, movieId: string) {
  const storageKey = getStorageKey(user, key);
  const list = getList(user, key).filter((m: any) => m._id !== movieId);
  localStorage.setItem(storageKey, JSON.stringify(list));
}

export default function MovieDetail() {
  const { movieId } = useParams();
  const { data: movie, isLoading: loading, error } = useMovieById(movieId!);
  const { data: similarMovies, isLoading: similarLoading } = useSimilarMovies(
    movieId!
  );
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (movie) {
      setIsFavorite(isInList(user, "favorites", movie._id));
      setIsInWatchlist(isInList(user, "watchlist", movie._id));
    }
  }, [movie, user]);

  const requireAuth = () => {
    toast.error("You must be logged in to add movies");
    navigate("/login");
    return false;
  };

  const handleFavoriteClick = async () => {
    if (!user) return requireAuth();

    if (isFavorite) {
      await removeFavorite(movie!._id); // ✅ backend sync
      removeFromList(user, "favorites", movie!._id); // local fallback
      setIsFavorite(false);
      toast.error(`Removed "${movie?.title}" from Favorites`);
    } else {
      await addFavorite(movie!._id); // ✅ backend sync
      addToList(user, "favorites", movie);
      setIsFavorite(true);
      toast.success(`Added "${movie?.title}" to Favorites`);
    }
  };

  const handleWatchlistClick = async () => {
    if (!user) return requireAuth();

    if (isInWatchlist) {
      await removeWatchlistApi(movie!._id); // ✅ backend sync
      removeFromList(user, "watchlist", movie!._id);
      setIsInWatchlist(false);
      toast.error(`Removed "${movie?.title}" from Watchlist`);
    } else {
      await addWatchlistApi(movie!._id); // ✅ backend sync
      addToList(user, "watchlist", movie);
      setIsInWatchlist(true);
      toast.success(`Added "${movie?.title}" to Watchlist`);
    }
  };

  // --- Loading & Error states ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] animate-fade-in">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-400 animate-fade-in">
        <p>Failed to load movie details.</p>
      </div>
    );
  }
  if (!movie) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-400 animate-fade-in">
        <p>Movie not found.</p>
      </div>
    );
  }

  // --- Main content ---
  return (
    <div className="container py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster + Buttons */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="rounded-lg overflow-hidden">
              <img
                src={movie?.posterUrl || "/placeholder.png"}
                alt={movie.title}
              />
            </div>
            <div className="mt-4 space-y-2">
              <Button
                onClick={handleFavoriteClick}
                className={`w-full flex items-center gap-2 cursor-pointer ${
                  isFavorite
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "hover:text-foreground hover:bg-background"
                }`}
              >
                {isFavorite ? (
                  <>
                    <Heart className="h-4 w-4 fill-red-600 text-white" />
                    Remove from Favorites
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4" />
                    Add to Favorites
                  </>
                )}
              </Button>
              <Button
                onClick={handleWatchlistClick}
                className={`w-full flex items-center gap-2 cursor-pointer ${
                  isInWatchlist
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-background text-foreground hover:bg-foreground hover:text-background"
                }`}
                variant={isInWatchlist ? "default" : "outline"}
              >
                {isInWatchlist ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Remove from Watchlist
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    Add to Watchlist
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Details + Tabs */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie?.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <span>{movie?.releaseYear}</span>
              {!!movie?.duration && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> {movie?.duration} min
                  </span>
                </>
              )}
              <span>•</span>
              <div className="flex items-center text-yellow-400">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 stroke-yellow-400" />
                <span>{movie?.imdbRating}/10</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {movie?.genres?.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
            <p className="text-lg">{movie?.description}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="cast">
            <TabsList className="grid w-full grid-cols-3 rounded-lg border bg-muted p-1">
              <TabsTrigger
                value="cast"
                className="data-[state=active]:bg-chart-3 data-[state=active]:text-background rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all"
              >
                Cast & Crew
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-chart-3 data-[state=active]:text-background rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="similar"
                className="data-[state=active]:bg-chart-3 data-[state=active]:text-background rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all"
              >
                Similar Movies
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cast" className="pt-6">
              <MovieCast
                directors={movie?.directors || []}
                actors={movie?.actors || []}
              />
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              {movie && <MovieReviews movieId={movie._id} />}
            </TabsContent>

            <TabsContent value="similar" className="pt-6">
              {similarLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
                </div>
              ) : similarMovies && similarMovies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {similarMovies.map((movie) => (
                    <Link
                      to={`/movies/${movie._id}`}
                      key={movie._id}
                      className="flex gap-4 animate-fade-in"
                    >
                      <img
                        src={movie.posterUrl || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-24 h-36 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{movie.title}</h3>
                        <div className="text-sm text-muted-foreground mb-1">
                          {movie.releaseYear} • {movie.genres?.join(", ")}
                        </div>
                        <div className="flex items-center text-yellow-400 text-sm mb-2">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 stroke-yellow-400" />
                          <span>{movie.imdbRating}</span>
                        </div>
                        <p className="text-sm line-clamp-2">
                          {movie.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center">
                  No similar movies found.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
