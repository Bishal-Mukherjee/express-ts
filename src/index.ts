import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
// import { pool } from "./config/db";
import { pool } from "@/config/db";
import { rateLimiter } from "./utils/rate-limit";
import { logger } from "./utils/logger";
import apiRoutes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(rateLimiter);

// DB Connection
pool.connect((err) => {
  if (err) {
    logger.error("Error connecting to Database", err.message);
    process.exit(1);
  } else {
    logger.info("✅ Connected to Database");
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("🚀🚀 SERVER WORKING");
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
    });
  }
});

app.use("/api/v1", apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `${req.method} ${req.originalUrl} not found`,
  });
});

// Error Handler
app.use(errorHandler);

export default app;
