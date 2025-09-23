import { Link } from "react-router";

export function MobileNav() {
  return (
    <nav className="flex items-center px-2 py-1 bg-chart-3 rounded-2xl shadow-md">
      {/* Left side links */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center rounded-xl transition-all duration-200 text-chart-2 hover:bg-foreground hover:text-background"
        >
          <span className="font-bold text-lg bg-foreground px-1 py-1 rounded-xl shadow-sm">
            🎬RileyWatch
          </span>
        </Link>

        <Link
          to="/movies"
          className="text-sm font-bold text-lg px-3 py-1 rounded-xl transition-all duration-200 text-background hover:bg-foreground hover:text-chart-2"
        >
          Movies
        </Link>
      </div>
    </nav>
  );
}
