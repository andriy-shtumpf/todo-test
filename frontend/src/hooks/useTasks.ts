/**
 * Custom hook for managing tasks
 * - Fetches and caches tasks from the API
 * - Provides CRUD operations (Create, Read, Update, Delete)
 * - Manages loading and error states
 * - Automatically fetches tasks when token is available
 */

import { useCallback, useEffect, useState } from "react";
import { tasksAPI } from "../lib/api";
import { Task, TasksState } from "../types";

interface UseTasksReturn extends TasksState {
    createTask: (
        data: Omit<Task, "id" | "createdAt" | "updatedAt">
    ) => Promise<Task>; // Create new task
    updateTask: (id: string, data: Partial<Task>) => Promise<Task>; // Update existing task
    deleteTask: (id: string) => Promise<void>; // Delete a task
    fetchTasks: () => Promise<void>; // Manually fetch all tasks
    fetchUserTasks: (userId: string) => Promise<void>; // Fetch user-specific tasks
}

export function useTasks(token: string | null): UseTasksReturn {
    const [state, setState] = useState<TasksState>({
        tasks: [],
        loading: false,
        error: null,
    });

    // Fetch all tasks from API
    const fetchTasks = useCallback(async () => {
        if (!token) return; // Wait for token to be available

        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const tasks = await tasksAPI.getAll(token);
            setState((prev) => ({ ...prev, tasks, loading: false }));
        } catch (error) {
            // Update state with error message
            setState((prev) => ({
                ...prev,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch tasks",
                loading: false,
            }));
        }
    }, [token]);

    const fetchUserTasks = useCallback(
        async (userId: string) => {
            if (!token) return;

            setState((prev) => ({ ...prev, loading: true, error: null }));
            try {
                const tasks = await tasksAPI.getUserTasks(userId, token);
                setState((prev) => ({ ...prev, tasks, loading: false }));
            } catch (error) {
                setState((prev) => ({
                    ...prev,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Failed to fetch user tasks",
                    loading: false,
                }));
            }
        },
        [token]
    );

    const createTask = useCallback(
        async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
            if (!token) throw new Error("No token available");

            setState((prev) => ({ ...prev, loading: true, error: null }));
            try {
                const task = await tasksAPI.create(data, token);
                setState((prev) => ({
                    ...prev,
                    tasks: [...prev.tasks, task],
                    loading: false,
                }));
                return task;
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to create task";
                setState((prev) => ({
                    ...prev,
                    error: errorMessage,
                    loading: false,
                }));
                throw error;
            }
        },
        [token]
    );

    const updateTask = useCallback(
        async (id: string, data: Partial<Task>) => {
            if (!token) throw new Error("No token available");

            setState((prev) => ({ ...prev, loading: true, error: null }));
            try {
                const updated = await tasksAPI.update(id, data, token);
                setState((prev) => ({
                    ...prev,
                    tasks: prev.tasks.map((t) => (t.id === id ? updated : t)),
                    loading: false,
                }));
                return updated;
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to update task";
                setState((prev) => ({
                    ...prev,
                    error: errorMessage,
                    loading: false,
                }));
                throw error;
            }
        },
        [token]
    );

    const deleteTask = useCallback(
        async (id: string) => {
            if (!token) throw new Error("No token available");

            setState((prev) => ({ ...prev, loading: true, error: null }));
            try {
                await tasksAPI.delete(id, token);
                setState((prev) => ({
                    ...prev,
                    tasks: prev.tasks.filter((t) => t.id !== id),
                    loading: false,
                }));
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to delete task";
                setState((prev) => ({
                    ...prev,
                    error: errorMessage,
                    loading: false,
                }));
                throw error;
            }
        },
        [token]
    );

    useEffect(() => {
        if (token) {
            fetchTasks();
        }
    }, [token, fetchTasks]);

    return {
        ...state,
        createTask,
        updateTask,
        deleteTask,
        fetchTasks,
        fetchUserTasks,
    };
}
