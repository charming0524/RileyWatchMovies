import { Button } from "@/components/ui/button";

interface GenreFilterProps {
  genres: string[];
  setSelectedGenre: (selectedGenre: string) => void;
  selectedGenre: string;
}

export function GenreFilter({
  genres,
  selectedGenre,
  setSelectedGenre,
}: GenreFilterProps) {
  return (
    <div className="w-full text-foreground whitespace-nowrap">
      {/* On mobile → wrap & center, On larger screens → keep horizontal scroll */}
      <div className="flex flex-wrap justify-center gap-2 sm:justify-start sm:flex-nowrap sm:overflow-x-auto sm:whitespace-nowrap pb-4">
        <Button
          variant={selectedGenre === "" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setSelectedGenre("");
          }}
          className="rounded-full"
        >
          All
        </Button>
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenre === genre ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedGenre(genre);
            }}
            className="rounded-full hover:bg-foreground hover:text-background"
          >
            {genre}
          </Button>
        ))}
      </div>
    </div>
  );
}
