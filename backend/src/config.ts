/**
 * Backend application configuration
 * - Loads environment variables from .env file
 * - Provides defaults for local development
 * - Configures database, Firebase, CORS, and server settings
 */

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Export application configuration
export const config = {
    // Server port (default: 3000)
    port: parseInt(process.env.PORT || "3000", 10),

    // Node environment (development/production)
    nodeEnv: process.env.NODE_ENV || "development",

    // PostgreSQL database configuration
    database: {
        url:
            process.env.DATABASE_URL ||
            "postgresql://todouser:todopass@localhost:5432/tododb", // Local dev default
    },

    // Firebase configuration
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID, // Required for JWT verification
    },

    // CORS configuration
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Frontend URL
    },
};
