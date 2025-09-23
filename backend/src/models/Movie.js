import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    releaseYear: { type: Number },
    adult: { type: Boolean },
    genres: [{ type: String }],
    directors: [
      {
        id: {
          type: Number,
          required: true,
        },
        name: { type: String, required: true },
        profileAvatar: { type: String },
        characterName: { type: String },
        order: { type: Number, required: true },
      },
    ],
    actors: [
      {
        id: {
          type: Number,
          required: true,
        },
        name: { type: String, required: true },
        profileAvatar: { type: String },
        characterName: { type: String },
        order: { type: Number, required: true },
      },
    ],
    imdbRating: { type: Number },
    duration: { type: Number }, // in minutes
    posterUrl: { type: String },
    keywords: [{ type: String }],
    popularityScore: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Movie", MovieSchema);
