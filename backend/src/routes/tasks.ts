/**
 * Tasks API routes
 * - Implements RESTful API for task management
 * - All routes require Firebase authentication
 * - Converts database snake_case fields to API camelCase
 * - Supports Create, Read, Update, Delete operations
 */

import { Router } from "express";
import { query } from "../db/client.js";
import { AuthRequest, authenticateToken } from "../middleware/auth.js";

const router = Router();

/**
 * Convert database snake_case field names to API camelCase
 * Maps PostgreSQL column names to frontend-friendly format
 */
function convertToCamelCase(obj: any): any {
    if (!obj) return obj;
    return {
        id: obj.id,
        title: obj.title,
        description: obj.description,
        status: obj.status,
        userId: obj.user_id, // user_id -> userId
        address: obj.address,
        dueDate: obj.due_date, // due_date -> dueDate
        createdAt: obj.created_at, // created_at -> createdAt
        updatedAt: obj.updated_at, // updated_at -> updatedAt
    };
}

// Apply auth middleware to all task routes
router.use(authenticateToken);

// GET /api/tasks - Fetch all tasks
router.get("/", async (req: AuthRequest, res) => {
    try {
        // Fetch all tasks, sorted by creation date (newest first)
        const result = await query(
            `SELECT * FROM tasks ORDER BY created_at DESC`
        );
        // Convert snake_case to camelCase for API response
        res.json(result.rows.map(convertToCamelCase));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// GET /api/tasks/user/:userId - Fetch tasks for specific user
router.get("/user/:userId", async (req: AuthRequest, res) => {
    try {
        const { userId } = req.params;

        // Fetch user-specific tasks, sorted by creation date
        const result = await query(
            `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        // Convert results to camelCase format
        res.json(result.rows.map(convertToCamelCase));
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        res.status(500).json({ error: "Failed to fetch user tasks" });
    }
});

// GET /api/tasks/:id - Fetch single task by ID
router.get("/:id", async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;

        // Query for specific task
        const result = await query(`SELECT * FROM tasks WHERE id = $1`, [id]);

        // Validate task exists
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Task not found" });
            return;
        }

        // Return task with converted field names
        res.json(convertToCamelCase(result.rows[0]));
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ error: "Failed to fetch task" });
    }
});

// POST /api/tasks - Create new task
router.post("/", async (req: AuthRequest, res) => {
    try {
        const { title, description, status, address, dueDate } = req.body;
        const userId = req.user?.uid;

        // Validate required fields
        if (!title || !userId) {
            res.status(400).json({ error: "Title is required" });
            return;
        }

        // Ensure user exists in database (create if needed)
        await query(
            `INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
            [userId, req.user?.email || ""]
        );

        // Insert task into database with default status "created"
        const result = await query(
            `INSERT INTO tasks (title, description, status, user_id, address, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [
                title,
                description || null,
                status || "created", // Default to "created" status
                userId,
                address || null,
                dueDate || null,
            ]
        );

        // Return created task with converted field names
        res.status(201).json(convertToCamelCase(result.rows[0]));
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
});

// PUT /api/tasks/:id - Update existing task
router.put("/:id", async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, address, dueDate } = req.body;

        // Build dynamic UPDATE query based on provided fields
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        // Only include fields that were provided in the request
        if (title !== undefined) {
            updates.push(`title = $${paramCount}`);
            values.push(title);
            paramCount++;
        }
        if (description !== undefined) {
            updates.push(`description = $${paramCount}`);
            values.push(description || null);
            paramCount++;
        }
        if (status !== undefined) {
            updates.push(`status = $${paramCount}`);
            values.push(status); // Validates against CHECK constraint
            paramCount++;
        }
        if (address !== undefined) {
            updates.push(`address = $${paramCount}`);
            values.push(address || null);
            paramCount++;
        }
        if (dueDate !== undefined) {
            updates.push(`due_date = $${paramCount}`);
            // Validate date format before inserting
            if (dueDate && !isNaN(new Date(dueDate).getTime())) {
                values.push(new Date(dueDate).toISOString());
            } else {
                values.push(null);
            }
            paramCount++;
        }

        // Always update the timestamp
        updates.push(`updated_at = CURRENT_TIMESTAMP`);

        // Ensure at least one field is being updated
        if (updates.length === 1) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        values.push(id);

        // Execute dynamic UPDATE query
        const result = await query(
            `UPDATE tasks SET ${updates.join(
                ", "
            )} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        // Check if task exists
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Task not found" });
            return;
        }

        // Return updated task with converted field names
        res.json(convertToCamelCase(result.rows[0]));
    } catch (error) {
        console.error("Error updating task:", error);
        console.error("Request body:", req.body);
        res.status(500).json({
            error: "Failed to update task",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;

        // Delete task and return its ID to confirm deletion
        const result = await query(
            `DELETE FROM tasks WHERE id = $1 RETURNING id`,
            [id]
        );

        // Check if task existed before deletion
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Task not found" });
            return;
        }

        // Return 204 No Content for successful deletion
        res.status(204).json({ success: true });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
});

export default router;
