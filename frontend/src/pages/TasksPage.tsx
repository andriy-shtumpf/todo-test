/**
 * Tasks page - Create and manage individual tasks with Kanban board
 */

import { useState } from "react";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { Task, TaskStatus } from "../types";

interface TasksPageProps {
    tasks: Task[];
    userId: string;
    onCreateTask: (
        data: Omit<Task, "id" | "createdAt" | "updatedAt">
    ) => Promise<any>;
    onStatusChange: (id: string, data: Partial<Task>) => Promise<Task>;
    onDelete: (id: string) => Promise<void>;
    loading: boolean;
}

const STATUSES: { status: TaskStatus; label: string; color: string }[] = [
    { status: "created", label: "Created", color: "bg-gray-50" },
    { status: "in_progress", label: "In Progress", color: "bg-blue-50" },
    { status: "completed", label: "Completed", color: "bg-green-50" },
];

export function TasksPage({
    tasks,
    userId,
    onCreateTask,
    onStatusChange,
    onDelete,
    loading,
}: TasksPageProps) {
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);

    const getTasksByStatus = (status: TaskStatus) =>
        tasks.filter((task) => task.status === status);

    const handleDragStart = (task: Task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (status: TaskStatus) => {
        if (draggedTask && draggedTask.status !== status) {
            try {
                await onStatusChange(draggedTask.id, { status });
            } catch (error) {
                console.error("Error updating task status:", error);
            }
        }
        setDraggedTask(null);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Form - Sidebar on desktop, full width on mobile */}
            <div className="w-full lg:w-80 flex-shrink-0">
                <div className="sticky top-0 lg:top-6">
                    <TaskForm
                        userId={userId}
                        onSubmit={onCreateTask}
                        loading={loading}
                    />
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {STATUSES.map(({ status, label, color }) => {
                        const statusTasks = getTasksByStatus(status);
                        return (
                            <div
                                key={status}
                                className={`rounded-lg p-4 md:p-6 min-h-80 md:min-h-96 border-2 border-dashed border-gray-300 transition-all ${
                                    draggedTask && draggedTask.status === status
                                        ? "opacity-50"
                                        : ""
                                } ${color}`}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(status)}
                            >
                                <h2 className="text-base md:text-lg font-semibold mb-4 text-gray-900">
                                    {label}
                                </h2>
                                <p className="text-xs md:text-sm text-gray-500 mb-4">
                                    {statusTasks.length}{" "}
                                    {statusTasks.length === 1
                                        ? "task"
                                        : "tasks"}
                                </p>

                                {loading && tasks.length === 0 ? (
                                    <p className="text-gray-400 text-sm">
                                        Loading...
                                    </p>
                                ) : statusTasks.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 text-sm">
                                        No tasks yet
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {statusTasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onStatusChange={onStatusChange}
                                                onDelete={onDelete}
                                                onDragStart={() =>
                                                    handleDragStart(task)
                                                }
                                                isDragging={
                                                    draggedTask?.id === task.id
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
