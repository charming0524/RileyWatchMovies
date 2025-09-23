import { Link } from "react-router";

export function MainNav() {
  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link
        to="/"
        className="flex items-center px-4 py-0 rounded-xl transition-all duration-200 text-chart-2 hover:bg-chart-3 hover:text-background"
      >
        <span className="hidden font-bold text-2xl sm:inline-block bg-foreground px-3 py-1 rounded-2xl shadow-md">
          🎬RileyWatch
        </span>
      </Link>
      <nav className="hidden gap-6 md:flex bg-chart-3 px-6 py-1 rounded-2xl shadow-md">
        <Link
          to="/movies"
          className="text-sm font-bold text-lg px-2 py-1 rounded-xl transition-all duration-200 text-background hover:bg-foreground hover:text-chart-2"
        >
          Movies
        </Link>
      </nav>
    </div>
  );
}
