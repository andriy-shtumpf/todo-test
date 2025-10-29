/**
 * Task card component - Draggable card for kanban board
 */

import { Task, TaskStatus } from "../types";

interface TaskCardProps {
    task: Task;
    onStatusChange: (id: string, data: Partial<Task>) => Promise<Task>;
    onDelete: (id: string) => Promise<void>;
    onDragStart?: (task: Task) => void;
    isDragging?: boolean;
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

export function TaskCard({
    task,
    onStatusChange,
    onDelete,
    onDragStart,
    isDragging,
}: TaskCardProps) {
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
        <div
            draggable={true}
            onDragStart={() => onDragStart?.(task)}
            className={`bg-white border border-gray-200 rounded-lg p-3 md:p-4 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing ${
                isDragging ? "opacity-50" : ""
            }`}
        >
            <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="font-semibold text-gray-900 flex-1 text-sm md:text-base line-clamp-2">
                    {task.title}
                </h3>
                <button
                    onClick={() => onDelete(task.id)}
                    className="text-red-500 hover:text-red-700 text-xs md:text-sm font-medium flex-shrink-0 whitespace-nowrap"
                >
                    Delete
                </button>
            </div>

            <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
                {task.description}
            </p>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                <button
                    onClick={handleStatusChange}
                    className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${statusColor.bg} ${statusColor.text} hover:opacity-80 transition whitespace-nowrap`}
                >
                    {statusColor.label}
                </button>

                {task.address && (
                    <span className="text-xs text-gray-500 line-clamp-1">
                        📍 {task.address}
                    </span>
                )}
            </div>

            {task.dueDate && (
                <p className="text-xs text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
            )}
        </div>
    );
}
