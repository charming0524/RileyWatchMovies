import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { MobileNav } from "@/components/mobile.nav";
import { SearchBar } from "./components/SearchBar";
import { Link, Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 py-4">
          {/* Main nav (desktop) */}
          <nav className="hidden md:block">
            <MainNav />
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <MobileNav />
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex justify-center">
            <SearchBar />
          </div>

          {/* User menu (login/logout/profile) */}
          <div className="px-2">
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Rileywatch. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            Built with ❤️ by{" "}
            <Link
              to="https://github.com/charming0524"
              target="_blank"
              className="text-blue-500 underline hover:text-blue-700 hover:no-underline transition-all"
            >
              Adeola Oni
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
