import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Movie } from "@/types";
import { Link } from "react-router";
import { useMutateUserPreference } from "@/hooks/useUsers";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { mutate } = useMutateUserPreference();
  return (
    <Link
      to={`/movies/${movie._id}`}
      onClick={() => {
        mutate({
          favoriteActors: movie.actors.slice(0, 5).map((actor) => actor.name),
          favoriteDirectors: movie.directors?.map?.(
            (director) => director.name
          ),
          favoriteGenres: movie?.genres,
        });
      }}
    >
      <Card className="overflow-hidden h-auto transition-all hover:scale-[1.02] hover:shadow-lg pt-0 pb-0">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl || "/placeholder.svg"}
            alt={movie.title}
            className="object-cover w-full"
          />
          {movie.imdbRating && (
            <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-sm font-medium px-2 py-1 rounded-md flex items-center">
              <Star className="h-3.5 w-3.5 mr-1 fill-yellow-400 stroke-yellow-400" />
              {movie.imdbRating}
            </div>
          )}
        </div>
        <CardContent className="px-2">
          <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-2">
            <span>{movie.releaseYear}</span>
            {!!movie.directors[0]?.name && (
              <>
                <span>•</span>
                <span>{movie.directors[0]?.name}</span>
              </>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
            {movie.genres.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{movie.genres.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="text-xs text-muted-foreground line-clamp-2">
            {movie.description}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
