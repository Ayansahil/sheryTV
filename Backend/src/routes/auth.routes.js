const express = require("express");
const router = express.Router();
const { signup, login, logout, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", protect, logout);

// GET /api/auth/me
router.get("/me", protect, getMe);

module.exports = router;