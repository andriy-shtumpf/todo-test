/**
 * Map page - View all task locations
 */

import { Suspense } from "react";
import { MapView } from "../components/MapView";
import { Task } from "../types";

interface MapPageProps {
    tasks: Task[];
    loading: boolean;
}

export function MapPage({ tasks, loading }: MapPageProps) {
    const tasksWithAddress = tasks.filter((t) => t.address);

    return (
        <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Tasks Map</h2>
                <p className="text-gray-600 text-sm">
                    Showing {tasksWithAddress.length} tasks with addresses
                </p>
            </div>

            <div
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                style={{ height: "600px" }}
            >
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Loading map...</p>
                    </div>
                ) : (
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center h-full">
                                <p>Loading map...</p>
                            </div>
                        }
                    >
                        <MapView tasks={tasks} />
                    </Suspense>
                )}
            </div>
        </div>
    );
}
