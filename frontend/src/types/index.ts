/**
 * Type definitions for Todo App
 */

export interface User {
    id: string;
    email: string;
    name: string;
    photoURL?: string;
}

export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
}

export type TaskStatus = "created" | "in_progress" | "completed";

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    userId: string;
    location?: Location;
    createdAt: string;
    updatedAt: string;
    dueDate?: string;
}

export interface TasksState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}
