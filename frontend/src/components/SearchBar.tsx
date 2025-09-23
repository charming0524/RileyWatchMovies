import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth";
import { toast } from "sonner"; // ✅ use sonner toast

export function SearchBar() {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Track window width
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); };
  }, []);

  // Collapse when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (!user) {
      toast.error("You must be logged in to use search"); // ✅ sonner toast
      navigate("/login");
      return;
    }

    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    setExpanded(false);
    setQuery("");
  };

  const getTargetWidth = () => {
    if (windowWidth < 640) return "25vw"; // mobile
    if (windowWidth < 1024) return "16rem"; // tablet
    return "20rem"; // desktop
  };

  return (
    <div ref={wrapperRef} className="relative flex items-center">
      <form
        onSubmit={handleSearch}
        className="relative flex items-center mx-auto"
      >
        <AnimatePresence initial={false}>
          {expanded && user && (
            <motion.input
              key="search-input"
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); }}
              placeholder="Search movies..."
              className="h-10 rounded-full border border-gray-300 bg-white px-4 pr-10 text-sm text-black outline-none"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: getTargetWidth(), opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        <button
          type={expanded && user ? "submit" : "button"}
          onClick={() => {
            if (!user) {
              toast.error("You must be logged in to use search"); // ✅
              navigate("/login");
              return;
            }

            if (!expanded) {
              setExpanded(true);
              setTimeout(() => inputRef.current?.focus(), 200);
            }
          }}
          className="absolute right-0 flex h-10 w-10 items-center justify-center text-gray-500"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
