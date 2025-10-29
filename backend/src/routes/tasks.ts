/**
 * Tasks API routes
 */

import { Router } from "express";
import { query } from "../db/client.js";
import { AuthRequest, authenticateToken } from "../middleware/auth.js";

const router = Router();

// Apply auth middleware to all task routes
router.use(authenticateToken);

// GET /api/tasks - Get all tasks
router.get("/", async (req: AuthRequest, res) => {
    try {
        const result = await query(
            `SELECT * FROM tasks ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// GET /api/tasks/user/:userId - Get user tasks
router.get("/user/:userId", async (req: AuthRequest, res) => {
    try {
        const { userId } = req.params;

        const result = await query(
            `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        res.status(500).json({ error: "Failed to fetch user tasks" });
    }
});

// GET /api/tasks/:id - Get single task
router.get("/:id", async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;

        const result = await query(`SELECT * FROM tasks WHERE id = $1`, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Task not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ error: "Failed to fetch task" });
    }
});

// POST /api/tasks - Create task
router.post("/", async (req: AuthRequest, res) => {
    try {
        const { title, description, status, userId, address, dueDate } =
            req.body;

        if (!title || !userId) {
            res.status(400).json({ error: "Title and userId are required" });
            return;
        }

        const result = await query(
            `INSERT INTO tasks (title, description, status, user_id, address, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [
                title,
                description || null,
                status || "created",
                userId,
                address || null,
                dueDate || null,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
});

// PUT /api/tasks/:id - Update task
router.put("/:id", async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, address, dueDate } = req.body;

        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (title !== undefined) {
            updates.push(`title = $${paramCount}`);
            values.push(title);
            paramCount++;
        }
        if (description !== undefined) {
            updates.push(`description = $${paramCount}`);
            values.push(description);
            paramCount++;
        }
        if (status !== undefined) {
            updates.push(`status = $${paramCount}`);
            values.push(status);
            paramCount++;
        }
        if (address !== undefined) {
            updates.push(`address = $${paramCount}`);
            values.push(address || null);
            paramCount++;
        }
        if (dueDate !== undefined) {
            updates.push(`due_date = $${paramCount}`);
            values.push(dueDate);
            paramCount++;
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);

        if (updates.length === 1) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        values.push(id);

        const result = await query(
            `UPDATE tasks SET ${updates.join(
                ", "
            )} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Task not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            `DELETE FROM tasks WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Task not found" });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
});

export default router;
