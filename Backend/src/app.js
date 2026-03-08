const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const historyRoutes = require("./routes/history.routes");
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');

const { notFound, errorHandler } = require("./middlewares/error.middleware");


const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/history", historyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;