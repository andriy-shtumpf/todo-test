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
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [address, setAddress] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const location =
                latitude && longitude
                    ? {
                          latitude: parseFloat(latitude),
                          longitude: parseFloat(longitude),
                          address: address || undefined,
                      }
                    : undefined;

            await onSubmit({
                title,
                description,
                status: "created",
                userId,
                location,
                dueDate: dueDate || undefined,
            });

            // Reset form
            setTitle("");
            setDescription("");
            setLatitude("");
            setLongitude("");
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
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
            <h2 className="text-lg font-semibold mb-4">Create New Task</h2>

            <div className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task title"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task description"
                        rows={3}
                    />
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Latitude
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 40.7128"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Longitude
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., -74.0060"
                        />
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Location address"
                    />
                </div>

                {/* Due Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                    </label>
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={submitting || loading}
                className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
                {submitting ? "Creating..." : "Create Task"}
            </button>
        </form>
    );
}
