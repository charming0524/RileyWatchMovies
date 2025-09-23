import { GenreFilter } from "@/components/genre-filter";
import { MovieCard } from "@/components/movie-card";
import { useInfiniteFetchMovies } from "@/hooks/useMovies";
import { GENRES } from "@/lib/constant";
import { useCallback, useRef, useState } from "react";

export default function Movies() {
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteFetchMovies(selectedGenre);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastMovieElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (status === "error")
    return (
      <p className="text-center pt-10 text-red-500">Error: {error.message}</p>
    );

  return (
    <div className="min-h-screen bg-foreground">
      <div className="container mx-auto py-8 space-y-10 px-4">
        {/* Genre Filter */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Browse by Genre
            </h2>
          </div>
          <GenreFilter
            genres={GENRES.genres.map((genre) => genre.name)}
            setSelectedGenre={setSelectedGenre}
            selectedGenre={selectedGenre}
          />
        </section>

        {/* Movies Grid */}
        <section>
          {data?.pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
            >
              {page.movies.map((movie, movieIndex) => {
                const isLastMovie =
                  pageIndex === data.pages.length - 1 &&
                  movieIndex === page.movies.length - 1;

                return (
                  <div
                    key={movie._id}
                    ref={isLastMovie ? lastMovieElementRef : undefined}
                  >
                    <MovieCard movie={movie} />
                  </div>
                );
              })}
            </div>
          ))}

          {/* Loading State */}
          {isFetchingNextPage && (
            <p className="text-center mt-6 text-muted-foreground">
              Loading more movies...
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
