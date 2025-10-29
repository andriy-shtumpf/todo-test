/**
 * Configuration for the backend application
 */

import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    database: {
        url:
            process.env.DATABASE_URL ||
            "postgresql://todouser:todopass@localhost:5432/tododb",
    },
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
    },
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    },
};
