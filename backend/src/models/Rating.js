import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

RatingSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Rating", RatingSchema);
