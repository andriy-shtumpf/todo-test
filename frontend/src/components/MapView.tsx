/**
 * Map component showing task locations
 * - Displays tasks with addresses on an OpenStreetMap map
 * - Uses React Leaflet for map rendering
 * - Geocodes addresses to get coordinates
 * - Shows task details in popup on marker click
 */

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { geocodeAddress } from "../lib/geocoding";
import { Coordinates, Task } from "../types";

/**
 * Fix default marker icons for React Leaflet
 * Required because of webpack module bundling issues
 */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

interface MapViewProps {
    tasks: Task[]; // All tasks (filtered to only those with addresses)
}

// Status indicators for map markers
const statusEmojis = {
    created: "✓",
    in_progress: "⏳",
    completed: "✅",
};

// Task with geocoded coordinates
interface TaskWithCoordinates extends Task {
    coordinates: Coordinates; // Latitude and longitude
}

export function MapView({ tasks }: MapViewProps) {
    // Store tasks that have been geocoded with coordinates
    const [tasksWithCoordinates, setTasksWithCoordinates] = useState<
        TaskWithCoordinates[]
    >([]);
    const [loading, setLoading] = useState(true); // Geocoding in progress

    // Geocode all tasks with addresses when tasks change
    useEffect(() => {
        const geocodeTasks = async () => {
            setLoading(true);
            // Filter to only tasks that have an address
            const tasksWithAddress = tasks.filter((t) => t.address);

            const geocoded: TaskWithCoordinates[] = [];

            // Geocode each task
            for (const task of tasksWithAddress) {
                if (task.address) {
                    const coords = await geocodeAddress(task.address);
                    if (coords) {
                        geocoded.push({
                            ...task,
                            coordinates: coords,
                        });
                    }
                }
            }

            setTasksWithCoordinates(geocoded);
            setLoading(false);
        };

        geocodeTasks();
    }, [tasks]);

    /**
     * Calculate center point for map viewport
     * Centers on average of all task coordinates
     * Falls back to NYC if no tasks with coordinates
     */
    const center: [number, number] =
        tasksWithCoordinates.length > 0
            ? [
                  // Average latitude
                  tasksWithCoordinates.reduce(
                      (sum, t) => sum + t.coordinates.latitude,
                      0
                  ) / tasksWithCoordinates.length,
                  // Average longitude
                  tasksWithCoordinates.reduce(
                      (sum, t) => sum + t.coordinates.longitude,
                      0
                  ) / tasksWithCoordinates.length,
              ]
            : [40.7128, -74.006]; // Default center: New York City

    if (loading && tasksWithCoordinates.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Geocoding addresses...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
            <MapContainer
                center={center}
                zoom={tasksWithCoordinates.length > 0 ? 12 : 4}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {tasksWithCoordinates.map((task) => (
                    <Marker
                        key={task.id}
                        position={[
                            task.coordinates.latitude,
                            task.coordinates.longitude,
                        ]}
                        title={task.title}
                    >
                        <Popup>
                            <div className="text-sm">
                                <h3 className="font-semibold">{task.title}</h3>
                                <p className="text-gray-600">
                                    {task.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {statusEmojis[task.status]}{" "}
                                    {task.status.replace("_", " ")}
                                </p>
                                {task.address && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        📍 {task.address}
                                    </p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
