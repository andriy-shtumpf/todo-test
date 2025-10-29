/**
 * Type definitions for backend
 */

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: "created" | "in_progress" | "completed";
    user_id: string;
    address: string | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string;
    name: string | null;
    photo_url: string | null;
    created_at: string;
    updated_at: string;
}
