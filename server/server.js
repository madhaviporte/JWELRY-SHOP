require("dotenv").config();

// Validate critical environment variables at startup
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `FATAL: Missing required environment variables: ${missing.join(", ")}`
  );
  process.exit(1);
}

const app = require("./app");
const connectDB = require("./config/db");

const PORT = parseInt(process.env.PORT, 10) || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();