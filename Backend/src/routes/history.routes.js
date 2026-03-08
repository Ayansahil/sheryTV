const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  getHistory,
  addToHistory,
  removeFromHistory,
  clearHistory,
} = require("../controllers/history.controller");

// Sab routes protected hain
router.use(protect);

// GET    /api/history              → poori history
// POST   /api/history              → add/update movie in history
// DELETE /api/history              → clear sab history
// DELETE /api/history/:movieId     → ek movie remove

router.get("/", getHistory);
router.post("/", addToHistory);
router.delete("/", clearHistory);
router.delete("/:movieId", removeFromHistory);

module.exports = router;