/**
 * Task creation form component
 * - Allows users to create new tasks with title, description, address, and due date
 * - Includes form validation
 * - Resets form after successful submission
 */

import { FormEvent, useState } from "react";
import { Task } from "../types";

interface TaskFormProps {
    userId: string; // Current user ID
    onSubmit: (
        data: Omit<Task, "id" | "createdAt" | "updatedAt">
    ) => Promise<void>; // Submit handler
    loading?: boolean; // Global loading state
}

export function TaskForm({ userId, onSubmit, loading }: TaskFormProps) {
    // Form state
    const [title, setTitle] = useState(""); // Required
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState(""); // For geocoding on map
    const [dueDate, setDueDate] = useState(""); // Optional deadline
    const [submitting, setSubmitting] = useState(false); // Form submission in progress

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Submit task data with required and optional fields
            await onSubmit({
                title,
                description,
                status: "created", // All new tasks start as "created"
                address: address || undefined, // Convert empty string to undefined
                dueDate: dueDate || undefined,
                userId,
            });

            // Clear form after successful submission
            setTitle("");
            setDescription("");
            setAddress("");
            setDueDate("");
        } catch (error) {
            console.error("Error creating task:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm"
        >
            <h2 className="text-base md:text-lg font-semibold mb-4">
                Create New Task
            </h2>

            <div className="space-y-3 md:space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task title"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Task description"
                        rows={3}
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 123 Main St"
                    />
                </div>

                {/* Due Date */}
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Due Date
                    </label>
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={submitting || loading}
                className="mt-4 md:mt-6 w-full px-4 py-2 bg-blue-500 text-white text-sm md:text-base rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
                {submitting ? "Creating..." : "Create Task"}
            </button>
        </form>
    );
}
