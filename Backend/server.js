require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./src/config/database");

const PORT = process.env.PORT || 3000;

// Connect to DB and then start the server
connectDb(app, PORT);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  process.exit(1);
});