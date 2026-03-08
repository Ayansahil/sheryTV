const mongoose = require("mongoose");

function connectDb(app, PORT) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully ✅.");
      app.listen(PORT, () =>
        console.log(`Server is running on port ${PORT} 🚀`)
      );
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });
}

module.exports = connectDb;