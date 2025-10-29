/**
 * Form for creating new tasks
 */

import { FormEvent, useState } from "react";
import { Task } from "../types";

interface TaskFormProps {
    userId: string;
    onSubmit: (
        data: Omit<Task, "id" | "createdAt" | "updatedAt">
    ) => Promise<void>;
    loading?: boolean;
}

export function TaskForm({ userId, onSubmit, loading }: TaskFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await onSubmit({
                title,
                description,
                status: "created",
                address: address || undefined,
                dueDate: dueDate || undefined,
                userId,
            });

            // Reset form
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
