/**
 * PostgreSQL database client
 */

import { Pool } from "pg";
import { config } from "../config.js";

export const pool = new Pool({
    connectionString: config.database.url,
});

// Test connection
pool.on("connect", () => {
    console.log("Connected to PostgreSQL database");
});

pool.on("error", (err: Error) => {
    console.error("Unexpected error on idle client", err);
});

export async function query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`Query executed in ${duration}ms:`, text.substring(0, 100));
        if (params) console.log("Query params:", params);
        return result;
    } catch (error) {
        console.error("Database query error:", error);
        console.error("Failed query:", text);
        console.error("Failed query params:", params);
        throw error;
    }
}

export async function closePool(): Promise<void> {
    await pool.end();
}
