/**
 * Main Express server setup
 * - Configures middleware (CORS, JSON parsing, logging)
 * - Mounts API routes (health check, tasks management)
 * - Implements error handling and 404 responses
 * - Handles graceful shutdown on SIGTERM signal
 */

import cors from "cors";
import express from "express";
import { config } from "./config.js";
import healthRoutes from "./routes/health.js";
import tasksRoutes from "./routes/tasks.js";

const app = express();

// Configure CORS to allow requests from frontend
app.use(cors(config.cors));

// Parse incoming JSON request bodies
app.use(express.json());

// Simple request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Mount API routes
app.use("/health", healthRoutes); // Health check endpoint
app.use("/api/tasks", tasksRoutes); // Task management endpoints

/**
 * Global error handling middleware
 * Catches unhandled errors from routes
 */
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        // Log error details for debugging
        console.error("Unhandled error:", err);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);

        // Return generic error response
        res.status(500).json({
            error: "Internal server error",
            details: err.message,
        });
    }
);

/**
 * 404 handler for unmatched routes
 */
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start server and listen on configured port
const server = app.listen(config.port, () => {
    console.log(`✓ Server running on http://localhost:${config.port}`);
    console.log(`✓ Environment: ${config.nodeEnv}`);
});

/**
 * Graceful shutdown handler
 * Closes server when SIGTERM signal received (e.g., from Docker/Kubernetes)
 */
process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
});

export default app;
