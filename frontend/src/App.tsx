import { BrowserRouter, Route, Routes } from "react-router";
import QueryProvider from "@/providers/QueryProvider";
import RootLayout from "@/layout";
import { AuthProvider } from "@/context/auth";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import { Toaster } from "sonner"; // ✅ keep sonner toaster
import MovieDetail from "./pages/movie-detail";
import Movies from "./pages/movies";
import ProfilePage from "./pages/profile";
import SearchResults from "./pages/SearchResults";

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:movieId" element={<MovieDetail />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-right" duration={1000} />
        {/* ✅ sonner toast is active everywhere */}
      </AuthProvider>
    </QueryProvider>
  );
}
