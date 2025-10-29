/**
 * Dashboard page - Overview of all tasks with responsive kanban board
 * - Displays task statistics at the top
 * - Three-column kanban board layout (Created, In Progress, Completed)
 * - Supports drag-and-drop between columns
 * - Mobile responsive with grid layout
 */

import { useState } from "react";
import { TaskCard } from "../components/TaskCard";
import { Task, TaskStatus } from "../types";

interface DashboardProps {
    tasks: Task[]; // All tasks to display
    onStatusChange: (id: string, data: Partial<Task>) => Promise<Task>; // Handle status updates
    onDelete: (id: string) => Promise<void>; // Handle task deletion
    loading: boolean; // Loading state
}

export function Dashboard({
    tasks,
    onStatusChange,
    onDelete,
    loading,
}: DashboardProps) {
    const [draggedTask, setDraggedTask] = useState<Task | null>(null); // Track dragged task

    // Group tasks by status for kanban display
    const tasksByStatus = {
        created: tasks.filter((t) => t.status === "created"),
        in_progress: tasks.filter((t) => t.status === "in_progress"),
        completed: tasks.filter((t) => t.status === "completed"),
    };

    // Calculate task statistics for overview cards
    const stats = {
        total: tasks.length,
        created: tasksByStatus.created.length,
        in_progress: tasksByStatus.in_progress.length,
        completed: tasksByStatus.completed.length,
    };

    // Handle drag start - store reference to dragged task
    const handleDragStart = (task: Task) => {
        setDraggedTask(task);
    };

    // Allow drop on column
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Enable drop
    };

    // Handle drop - update task status and clear drag state
    const handleDrop = async (status: TaskStatus) => {
        if (draggedTask && draggedTask.status !== status) {
            try {
                // Update task with new status
                await onStatusChange(draggedTask.id, { status });
            } catch (error) {
                console.error("Error updating task status:", error);
            }
        }
        // Clear dragged task
        setDraggedTask(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4">
                    <p className="text-gray-600 text-xs md:text-sm">
                        Total Tasks
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {stats.total}
                    </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4">
                    <p className="text-gray-600 text-xs md:text-sm">
                        ✓ Created
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {stats.created}
                    </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4">
                    <p className="text-gray-600 text-xs md:text-sm">
                        ⏳ In Progress
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-600">
                        {stats.in_progress}
                    </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4">
                    <p className="text-gray-600 text-xs md:text-sm">
                        ✅ Completed
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600">
                        {stats.completed}
                    </p>
                </div>
            </div>

            {/* Task Columns - Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Created */}
                <div
                    className={`rounded-lg p-4 md:p-6 min-h-80 md:min-h-96 border-2 border-dashed border-gray-300 transition-all bg-gray-50 ${
                        draggedTask && draggedTask.status === "created"
                            ? "opacity-50"
                            : ""
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("created")}
                >
                    <h2 className="text-base md:text-lg font-semibold mb-4 text-gray-900">
                        ✓ Created
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mb-4">
                        {stats.created} {stats.created === 1 ? "task" : "tasks"}
                    </p>
                    <div className="space-y-3">
                        {tasksByStatus.created.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">
                                No created tasks
                            </p>
                        ) : (
                            tasksByStatus.created.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusChange={onStatusChange}
                                    onDelete={onDelete}
                                    onDragStart={() => handleDragStart(task)}
                                    isDragging={draggedTask?.id === task.id}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* In Progress */}
                <div
                    className={`rounded-lg p-4 md:p-6 min-h-80 md:min-h-96 border-2 border-dashed border-gray-300 transition-all bg-blue-50 ${
                        draggedTask && draggedTask.status === "in_progress"
                            ? "opacity-50"
                            : ""
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("in_progress")}
                >
                    <h2 className="text-base md:text-lg font-semibold mb-4 text-blue-600">
                        ⏳ In Progress
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mb-4">
                        {stats.in_progress}{" "}
                        {stats.in_progress === 1 ? "task" : "tasks"}
                    </p>
                    <div className="space-y-3">
                        {tasksByStatus.in_progress.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">
                                No in-progress tasks
                            </p>
                        ) : (
                            tasksByStatus.in_progress.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusChange={onStatusChange}
                                    onDelete={onDelete}
                                    onDragStart={() => handleDragStart(task)}
                                    isDragging={draggedTask?.id === task.id}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Completed */}
                <div
                    className={`rounded-lg p-4 md:p-6 min-h-80 md:min-h-96 border-2 border-dashed border-gray-300 transition-all bg-green-50 ${
                        draggedTask && draggedTask.status === "completed"
                            ? "opacity-50"
                            : ""
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("completed")}
                >
                    <h2 className="text-base md:text-lg font-semibold mb-4 text-green-600">
                        ✅ Completed
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mb-4">
                        {stats.completed}{" "}
                        {stats.completed === 1 ? "task" : "tasks"}
                    </p>
                    <div className="space-y-3">
                        {tasksByStatus.completed.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">
                                No completed tasks
                            </p>
                        ) : (
                            tasksByStatus.completed.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusChange={onStatusChange}
                                    onDelete={onDelete}
                                    onDragStart={() => handleDragStart(task)}
                                    isDragging={draggedTask?.id === task.id}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
