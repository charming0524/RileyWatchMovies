import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/movie-card";
import { MovieCarousel } from "@/components/movie-carousel";
import { Link } from "react-router";
import {
  useContentBasedRecommendation,
  useHybridRecommendation,
  useMovies,
  useUserBasedRecommendation,
} from "@/hooks/useMovies";
import { useAuth } from "@/context/auth";

export default function Home() {
  const auth = useAuth();
  const { data } = useMovies();
  const { data: hybridRecommendationMovies } = useHybridRecommendation();
  const { data: contentBasedRecommendationMovies } =
    useContentBasedRecommendation();
  const { data: usersBasedRecommendationMovies } = useUserBasedRecommendation();

  return (
    <div className="bg-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />

        {/* Banner image */}
        <img
          src="/banner.jpg"
          alt="Featured Movie"
          className="w-full h-[45vh] sm:h-[50vh] md:h-[75vh] object-cover"
        />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-8 pb-8 z-20 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Discover Amazing Movies
          </h1>
          <p className="text-sm sm:text-lg text-white mb-2 sm:mb-2 leading-relaxed line-clamp-4">
            Explore thousands of movies, track what you've watched, and create
            your personal watchlist with ease. Enjoy tailored recommendations
            just for you.
          </p>
          <Link to={"/movies"}>
            <Button size="lg" className="rounded-xl shadow-md">
              Browse Movies
            </Button>
          </Link>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {!auth.loading && auth.user && (
          <>
            {/* Recommendations */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Recommended for You
                </h2>
                <Link
                  to="/movies"
                  className="text-xs sm:text-sm text-chart-3 hover:bg-background/80 rounded-2xl px-2"
                >
                  View All
                </Link>
              </div>
              <MovieCarousel
                movies={hybridRecommendationMovies || []}
                autoScroll={true}
                interval={4000}
              />
            </section>

            {/* Based on Interest */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Based on Your Interests
                </h2>
                <Link
                  to="/movies"
                  className="text-xs sm:text-sm text-chart-3 hover:bg-background/80 rounded-2xl px-2"
                >
                  View All
                </Link>
              </div>
              <MovieCarousel
                movies={contentBasedRecommendationMovies || []}
                autoScroll={false}
              />
            </section>

            {/* Similar Users */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Similar Users Like These
                </h2>
                <Link
                  to="/movies"
                  className="text-xs sm:text-sm text-chart-3 hover:bg-background/80 rounded-2xl px-2"
                >
                  View All
                </Link>
              </div>
              <MovieCarousel
                movies={usersBasedRecommendationMovies || []}
                autoScroll={false}
              />
            </section>
          </>
        )}

        {/* Trending Movies */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Trending Now
            </h2>
            <Link
              to="/movies"
              className="text-xs sm:text-sm text-chart-3 hover:bg-background/80 rounded-2xl px-2"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {data?.movies?.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
