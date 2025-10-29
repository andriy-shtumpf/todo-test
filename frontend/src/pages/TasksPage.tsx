/**
 * Tasks page - Create and manage individual tasks
 */

import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { Task, TaskStatus } from "../types";

interface TasksPageProps {
    tasks: Task[];
    userId: string;
    onCreateTask: (
        data: Omit<Task, "id" | "createdAt" | "updatedAt">
    ) => Promise<void>;
    onStatusChange: (id: string, status: TaskStatus) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    loading: boolean;
}

export function TasksPage({
    tasks,
    userId,
    onCreateTask,
    onStatusChange,
    onDelete,
    loading,
}: TasksPageProps) {
    return (
        <div className="grid grid-cols-3 gap-6">
            {/* Form */}
            <div>
                <TaskForm
                    userId={userId}
                    onSubmit={onCreateTask}
                    loading={loading}
                />
            </div>

            {/* Tasks List */}
            <div className="col-span-2">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        All Tasks ({tasks.length})
                    </h2>

                    {loading && tasks.length === 0 ? (
                        <p className="text-gray-500">Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <p className="text-gray-500">
                            No tasks yet. Create one to get started!
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusChange={onStatusChange}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
