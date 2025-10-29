/**
 * Database migration script
 */

import { closePool, query } from "./client.js";

const migrations = [
    // Create users table
    `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      photo_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,

    // Create tasks table
    `
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'created' CHECK (status IN ('created', 'in_progress', 'completed')),
      user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      address VARCHAR(500),
      due_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,

    // Create indexes
    `CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`,
    `CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC)`,

    // Drop latitude and longitude columns if they exist (for existing databases)
    `ALTER TABLE tasks DROP COLUMN IF EXISTS latitude`,
    `ALTER TABLE tasks DROP COLUMN IF EXISTS longitude`,
];

async function migrate() {
    try {
        console.log("Starting database migration...");

        for (const migration of migrations) {
            await query(migration);
            console.log("✓ Migration executed");
        }

        console.log("✓ All migrations completed successfully");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    } finally {
        await closePool();
    }
}

migrate();
