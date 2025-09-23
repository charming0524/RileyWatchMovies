import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    watchHistory: [
      {
        movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
        watchedAt: { type: Date, default: Date.now },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    preferences: {
      favoriteGenres: [{ type: String }],
      dislikedGenres: [{ type: String }],
      favoriteActors: [{ type: String }],
      favoriteDirectors: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", UserSchema);
