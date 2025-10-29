/**
 * API client for communicating with backend
 */

import { Task } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper to make authenticated API calls
export async function apiCall(
    endpoint: string,
    options: RequestInit = {},
    token?: string
): Promise<Response> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API error: ${response.status}`);
    }

    return response;
}

// Task API endpoints
export const tasksAPI = {
    // Get all tasks
    getAll: async (token: string): Promise<Task[]> => {
        const response = await apiCall("/api/tasks", {}, token);
        return response.json();
    },

    // Get user tasks
    getUserTasks: async (userId: string, token: string): Promise<Task[]> => {
        const response = await apiCall(`/api/tasks/user/${userId}`, {}, token);
        return response.json();
    },

    // Get single task
    get: async (id: string, token: string): Promise<Task> => {
        const response = await apiCall(`/api/tasks/${id}`, {}, token);
        return response.json();
    },

    // Create task
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

    // Update task
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

    // Delete task
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
