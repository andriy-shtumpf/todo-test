/**
 * Task card component
 */

import { Task, TaskStatus } from "../types";

interface TaskCardProps {
    task: Task;
    onStatusChange: (id: string, data: Partial<Task>) => Promise<Task>;
    onDelete: (id: string) => Promise<void>;
}

const statusColors: Record<
    TaskStatus,
    { bg: string; text: string; label: string }
> = {
    created: { bg: "bg-gray-100", text: "text-gray-800", label: "✓ Created" },
    in_progress: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "⏳ In Progress",
    },
    completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "✅ Completed",
    },
};

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
    const statusColor = statusColors[task.status];

    const handleStatusChange = async () => {
        const nextStatus: Record<TaskStatus, TaskStatus> = {
            created: "in_progress",
            in_progress: "completed",
            completed: "created",
        };
        try {
            await onStatusChange(task.id, { status: nextStatus[task.status] });
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 flex-1">
                    {task.title}
                </h3>
                <button
                    onClick={() => onDelete(task.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                    Delete
                </button>
            </div>

            <p className="text-gray-600 text-sm mb-3">{task.description}</p>

            <div className="flex justify-between items-center">
                <button
                    onClick={handleStatusChange}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor.bg} ${statusColor.text} hover:opacity-80 transition`}
                >
                    {statusColor.label}
                </button>

                {task.address && (
                    <span className="text-xs text-gray-500">
                        📍 {task.address}
                    </span>
                )}
            </div>

            {task.dueDate && (
                <p className="text-xs text-gray-400 mt-2">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
            )}
        </div>
    );
}
