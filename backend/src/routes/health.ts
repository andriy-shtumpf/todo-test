/**
 * Health check route
 */

import { Router } from "express";
import { query } from "../db/client.js";

const router = Router();

// Health check endpoint
router.get("/", async (req, res) => {
    try {
        // Check database connection
        await query("SELECT 1");

        res.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            database: "connected",
        });
    } catch (error) {
        res.status(503).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            database: "disconnected",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;
