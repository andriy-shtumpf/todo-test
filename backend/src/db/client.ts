/**
 * PostgreSQL database client
 * - Manages connection pool to PostgreSQL database
 * - Provides query execution with performance logging
 * - Handles connection errors gracefully
 */

import { Pool } from "pg";
import { config } from "../config.js";

// Initialize connection pool with database URL from environment
export const pool = new Pool({
    connectionString: config.database.url,
});

// Log successful connection events
pool.on("connect", () => {
    console.log("Connected to PostgreSQL database");
});

// Log connection errors
pool.on("error", (err: Error) => {
    console.error("Unexpected error on idle client", err);
});

/**
 * Execute SQL query with performance logging
 * @param text - SQL query string with $1, $2, etc. placeholders
 * @param params - Array of parameters to safely bind to query
 * @returns Query result object with rows array
 */
export async function query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
        // Execute parameterized query (prevents SQL injection)
        const result = await pool.query(text, params);
        const duration = Date.now() - start;

        // Log query performance
        console.log(`Query executed in ${duration}ms:`, text.substring(0, 100));
        if (params) console.log("Query params:", params);

        return result;
    } catch (error) {
        // Log detailed error information for debugging
        console.error("Database query error:", error);
        console.error("Failed query:", text);
        console.error("Failed query params:", params);
        throw error;
    }
}

export async function closePool(): Promise<void> {
    await pool.end();
}
