import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get current user profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("watchHistory.movieId");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update user preferences
router.put("/preferences", auth, async (req, res) => {
  try {
    const {
      favoriteGenres = [],
      dislikedGenres = [],
      favoriteActors = [],
      favoriteDirectors = [],
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Helper function to update preference list
    const updatePreferences = (existingList, newItems, limit = 10) => {
      const set = new Set(existingList); // Ensure uniqueness
      for (const item of newItems) {
        if (!set.has(item)) {
          if (set.size >= limit) {
            // Remove the oldest item
            existingList.shift();
          }
          existingList.push(item);
          set.add(item);
        }
      }
      return existingList;
    };

    // Update each preference
    user.preferences.favoriteGenres = updatePreferences(
      user.preferences.favoriteGenres || [],
      favoriteGenres
    );

    user.preferences.dislikedGenres = updatePreferences(
      user.preferences.dislikedGenres || [],
      dislikedGenres
    );

    user.preferences.favoriteActors = updatePreferences(
      user.preferences.favoriteActors || [],
      favoriteActors
    );

    user.preferences.favoriteDirectors = updatePreferences(
      user.preferences.favoriteDirectors || [],
      favoriteDirectors
    );

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get user watch history

// --- Favorites endpoints ---
router.get("/me/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("favorites")
      .populate("favorites");
    res.json(user.favorites || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/me/favorites", auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.favorites) user.favorites = [];
    if (!user.favorites.find((m) => m.toString() === movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }
    await user.populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/me/favorites/:movieId", auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.favorites = (user.favorites || []).filter(
      (m) => m.toString() !== movieId
    );
    await user.save();
    await user.populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// --- Watchlist endpoints ---
router.get("/me/watchlist", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("watchlist")
      .populate("watchlist");
    res.json(user.watchlist || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/me/watchlist", auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.watchlist) user.watchlist = [];
    if (!user.watchlist.find((m) => m.toString() === movieId)) {
      user.watchlist.push(movieId);
      await user.save();
    }
    await user.populate("watchlist");
    res.json(user.watchlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/me/watchlist/:movieId", auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.watchlist = (user.watchlist || []).filter(
      (m) => m.toString() !== movieId
    );
    await user.save();
    await user.populate("watchlist");
    res.json(user.watchlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
router.get("/watch-history", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("watchHistory")
      .populate("watchHistory.movieId");

    res.json(user.watchHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
