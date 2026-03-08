const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const historyRoutes = require("./routes/history.routes");

const { notFound, errorHandler } = require("./middlewares/error.middleware");


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/history", historyRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;