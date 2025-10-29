/**
 * Main Express server setup
 */

import cors from "cors";
import express from "express";
import { config } from "./config.js";
import healthRoutes from "./routes/health.js";
import tasksRoutes from "./routes/tasks.js";

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use("/health", healthRoutes);
app.use("/api/tasks", tasksRoutes);

// Error handling middleware
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error("Unhandled error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start server
const server = app.listen(config.port, () => {
    console.log(`✓ Server running on http://localhost:${config.port}`);
    console.log(`✓ Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
});

export default app;
