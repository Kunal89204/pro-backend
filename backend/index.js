import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";
import Redis from "ioredis";

// Load environment variables
dotenv.config();

// Parse Redis port as a number
const redisPort = parseInt(process.env.REDIS_PORT, 10);

// Optional: Enable TLS for cloud Redis (set REDIS_TLS=true in env if required)
const redisOptions = {
  host: process.env.REDIS_HOST?.trim(),
  port: redisPort,
  username: process.env.REDIS_USERNAME?.trim() || undefined,
  password: process.env.REDIS_PASSWORD?.trim(),
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
};

// Initialize Redis
export const redis = new Redis(redisOptions);

redis.on("connect", () => console.log("✅ Redis connected!"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, "0.0.0.0", () => {
      console.log(`⚙️ Server is running at port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
