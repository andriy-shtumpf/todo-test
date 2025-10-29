/**
 * API client for communicating with backend
 * - Provides authenticated HTTP requests with JWT tokens
 * - Base URL from VITE_API_URL environment variable
 * - Centralizes all backend API calls
 */

import { Task } from "../types";

// Backend API base URL from environment, defaults to localhost:3000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Make authenticated API calls with token
 * - Automatically adds Authorization header with JWT token
 * - Handles response errors with meaningful messages
 * @param endpoint - API endpoint path (e.g., '/api/tasks')
 * @param options - Fetch options (method, body, etc.)
 * @param token - JWT token for authentication
 * @returns Fetch Response object
 */
export async function apiCall(
    endpoint: string,
    options: RequestInit = {},
    token?: string
): Promise<Response> {
    // Initialize headers with default content type
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Merge any existing headers from options
    if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
            headers[key] = value;
        });
    } else if (
        typeof options.headers === "object" &&
        options.headers !== null
    ) {
        Object.assign(headers, options.headers);
    }

    // Add Firebase JWT token to Authorization header
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Make fetch request with combined options
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Throw error if response is not OK
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API error: ${response.status}`);
    }

    return response;
}

/**
 * Task API endpoints
 * - Provides methods for CRUD operations on tasks
 * - All methods require authentication token
 */
export const tasksAPI = {
    /**
     * Fetch all tasks from the backend
     */
    getAll: async (token: string): Promise<Task[]> => {
        const response = await apiCall("/api/tasks", {}, token);
        return response.json();
    },

    /**
     * Fetch tasks for a specific user
     */
    getUserTasks: async (userId: string, token: string): Promise<Task[]> => {
        const response = await apiCall(`/api/tasks/user/${userId}`, {}, token);
        return response.json();
    },

    /**
     * Fetch single task by ID
     */
    get: async (id: string, token: string): Promise<Task> => {
        const response = await apiCall(`/api/tasks/${id}`, {}, token);
        return response.json();
    },

    /**
     * Create new task
     * Requires: title, userId, status
     * Optional: description, address, dueDate
     */
    create: async (
        data: Omit<Task, "id" | "createdAt" | "updatedAt">,
        token: string
    ): Promise<Task> => {
        const response = await apiCall(
            "/api/tasks",
            {
                method: "POST",
                body: JSON.stringify(data),
            },
            token
        );
        return response.json();
    },

    /**
     * Update existing task
     * Can update any task fields partially
     */
    update: async (
        id: string,
        data: Partial<Task>,
        token: string
    ): Promise<Task> => {
        const response = await apiCall(
            `/api/tasks/${id}`,
            {
                method: "PUT",
                body: JSON.stringify(data),
            },
            token
        );
        return response.json();
    },

    /**
     * Delete task by ID
     */
    delete: async (id: string, token: string): Promise<void> => {
        await apiCall(
            `/api/tasks/${id}`,
            {
                method: "DELETE",
            },
            token
        );
    },
};
