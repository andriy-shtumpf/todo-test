/**
 * Dashboard page - Overview of all tasks
 */

import { TaskCard } from "../components/TaskCard";
import { Task } from "../types";

interface DashboardProps {
    tasks: Task[];
    onStatusChange: (id: string, data: Partial<Task>) => Promise<Task>;
    onDelete: (id: string) => Promise<void>;
    loading: boolean;
}

export function Dashboard({
    tasks,
    onStatusChange,
    onDelete,
    loading,
}: DashboardProps) {
    // Group tasks by status
    const tasksByStatus = {
        created: tasks.filter((t) => t.status === "created"),
        in_progress: tasks.filter((t) => t.status === "in_progress"),
        completed: tasks.filter((t) => t.status === "completed"),
    };

    const stats = {
        total: tasks.length,
        created: tasksByStatus.created.length,
        in_progress: tasksByStatus.in_progress.length,
        completed: tasksByStatus.completed.length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">Total Tasks</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {stats.total}
                    </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">✓ Created</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {stats.created}
                    </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">⏳ In Progress</p>
                    <p className="text-3xl font-bold text-blue-600">
                        {stats.in_progress}
                    </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">✅ Completed</p>
                    <p className="text-3xl font-bold text-green-600">
                        {stats.completed}
                    </p>
                </div>
            </div>

            {/* Task Columns */}
            <div className="grid grid-cols-3 gap-6">
                {/* Created */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">
                        ✓ Created ({stats.created})
                    </h2>
                    <div className="space-y-3">
                        {tasksByStatus.created.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                No created tasks
                            </p>
                        ) : (
                            tasksByStatus.created.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusChange={onStatusChange}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* In Progress */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-blue-600">
                        ⏳ In Progress ({stats.in_progress})
                    </h2>
                    <div className="space-y-3">
                        {tasksByStatus.in_progress.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                No in-progress tasks
                            </p>
                        ) : (
                            tasksByStatus.in_progress.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusChange={onStatusChange}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Completed */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-green-600">
                        ✅ Completed ({stats.completed})
                    </h2>
                    <div className="space-y-3">
                        {tasksByStatus.completed.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                No completed tasks
                            </p>
                        ) : (
                            tasksByStatus.completed.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusChange={onStatusChange}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
