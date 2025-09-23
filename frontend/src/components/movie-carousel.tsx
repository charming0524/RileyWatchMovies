import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/movie-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/types";
import { useMediaQuery } from "usehooks-ts"; // ✅ detect screen size

interface MovieCarouselProps {
  movies: Movie[];
  autoScroll?: boolean;
  interval?: number;
}

export function MovieCarousel({
  movies,
  autoScroll = false,
  interval = 3000,
}: MovieCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // ✅ Detect screen size
  const isMobile = useMediaQuery("(max-width: 640px)"); // Tailwind "sm"
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)"); // Tailwind "md/lg"

  // ✅ Dynamic card width
  const cardWidth = isMobile
    ? "w-[70vw]" // wider on mobile so 1 card fits screen
    : isTablet
    ? "w-[40vw]" // medium size on tablet
    : "w-[250px]"; // fixed width on desktop

  const checkScrollButtons = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons();
      return () => { carousel.removeEventListener("scroll", checkScrollButtons); };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const carousel = carouselRef.current;
    const scrollAmount = carousel.clientWidth * 0.8;

    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // ✅ Auto-scroll
  useEffect(() => {
    if (!autoScroll || isPaused) return;

    const intervalId = setInterval(() => {
      if (!carouselRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

      if (scrollLeft >= scrollWidth - clientWidth - 5) {
        carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, interval);

    return () => { clearInterval(intervalId); };
  }, [autoScroll, interval, isPaused]);

  return (
    <div
      className="relative group"
      onMouseEnter={() => { setIsPaused(true); }}
      onMouseLeave={() => { setIsPaused(false); }}
      onTouchStart={() => { setIsPaused(true); }}
      onTouchEnd={() => { setIsPaused(false); }}
    >
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => (
          <div key={movie._id} className={`flex-none snap-start ${cardWidth}`}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Left Button */}
      {canScrollLeft && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-5 top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity"
          onClick={() => { scroll("left"); }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Right Button */}
      {canScrollRight && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-5 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity"
          onClick={() => { scroll("right"); }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
