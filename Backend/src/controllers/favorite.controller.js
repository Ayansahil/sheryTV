const Favorite = require("../models/favorite.model");

// @desc    Get all favorites of logged-in user
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a movie to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const { movieId, title, poster, releaseYear, genre, rating } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({
        success: false,
        message: "Movie ID and title are required.",
      });
    }

    // Check if already favorited (unique index bhi handle karta hai)
    const existing = await Favorite.findOne({ user: req.user._id, movieId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This movie is already in favorites.",
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      movieId,
      title,
      poster,
      releaseYear,
      genre,
      rating,
    });

    res.status(201).json({
      success: true,
      message: `"${title}" was added to favorites.`,
      favorite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a movie from favorites
// @route   DELETE /api/favorites/:movieId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      movieId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "This movie was not found in favorites.",
      });
    }

    res.status(200).json({
      success: true,
      message: `"${favorite.title}" was removed from favorites.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if a specific movie is in favorites
// @route   GET /api/favorites/:movieId
// @access  Private
const checkFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const favorite = await Favorite.findOne({ user: req.user._id, movieId });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorite };