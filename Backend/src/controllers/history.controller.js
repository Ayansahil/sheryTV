const History = require("../models/history.model");

const HISTORY_LIMIT = 50;

// @desc    Get watch history of logged-in user
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const history = await History.find({ user: req.user._id })
      .sort({ watchedAt: -1 })
      .limit(HISTORY_LIMIT);

    res.status(200).json({
      success: true,
      count: history.length,
      watchHistory: history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update a movie in watch history
// @route   POST /api/history
// @access  Private
const addToHistory = async (req, res, next) => {
  try {
    const { movieId, title, poster, releaseYear, genre, rating } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({
        success: false,
        message: "movieId aur title required hain.",
      });
    }

    // Agar already hai toh watchedAt update karo, nahi toh naya create karo
    const history = await History.findOneAndUpdate(
      { user: req.user._id, movieId },
      {
        user: req.user._id,
        movieId,
        title,
        poster,
        releaseYear,
        genre,
        rating,
        watchedAt: new Date(),
      },
      {
        upsert: true,    // nahi mila toh create karo
        new: true,       // updated document return karo
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json({
      success: true,
      message: `"${title}" watch history mein add/update ho gaya.`,
      history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove one movie from watch history
// @route   DELETE /api/history/:movieId
// @access  Private
const removeFromHistory = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const history = await History.findOneAndDelete({
      user: req.user._id,
      movieId,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Yeh movie watch history mein nahi mili.",
      });
    }

    res.status(200).json({
      success: true,
      message: `"${history.title}" watch history se remove ho gaya.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire watch history of logged-in user
// @route   DELETE /api/history
// @access  Private
const clearHistory = async (req, res, next) => {
  try {
    await History.deleteMany({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: "Watch history clear ho gayi.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, addToHistory, removeFromHistory, clearHistory };