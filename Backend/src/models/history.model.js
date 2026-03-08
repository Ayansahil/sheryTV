const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: String,
      required: [true, "movieId is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    poster: {
      type: String,
      default: "",
    },
    releaseYear: {
      type: String,
      default: "",
    },
    genre: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ek user ke liye movieId unique hoga — re-watch pe update hoga watchedAt
historySchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model("History", historySchema);