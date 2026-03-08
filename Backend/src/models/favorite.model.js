const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true, // addedAt = createdAt
  }
);

// Ek user ek movie ko sirf ek baar favorite kar sake
favoriteSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);