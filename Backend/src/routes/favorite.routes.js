const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require("../controllers/favorite.controller");

// Sab routes protected hain
router.use(protect);

// GET    /api/favorites              → sabke favorites
// POST   /api/favorites              → add to favorites
// GET    /api/favorites/:movieId     → check if favorited
// DELETE /api/favorites/:movieId     → remove from favorites

router.get("/", getFavorites);
router.post("/", addFavorite);
router.get("/:movieId", checkFavorite);
router.delete("/:movieId", removeFavorite);

module.exports = router;
