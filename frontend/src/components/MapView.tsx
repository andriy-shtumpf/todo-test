/**
 * Map component showing task locations
 */

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { geocodeAddress } from "../lib/geocoding";
import { Coordinates, Task } from "../types";

// Fix default marker icons
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
    tasks: Task[];
}

const statusEmojis = {
    created: "✓",
    in_progress: "⏳",
    completed: "✅",
};

interface TaskWithCoordinates extends Task {
    coordinates: Coordinates;
}

export function MapView({ tasks }: MapViewProps) {
    const [tasksWithCoordinates, setTasksWithCoordinates] = useState<
        TaskWithCoordinates[]
    >([]);
    const [loading, setLoading] = useState(true);

    // Filter tasks with addresses and geocode them
    useEffect(() => {
        const geocodeTasks = async () => {
            setLoading(true);
            const tasksWithAddress = tasks.filter((t) => t.address);

            const geocoded: TaskWithCoordinates[] = [];

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

    // Calculate center point
    const center: [number, number] =
        tasksWithCoordinates.length > 0
            ? [
                  tasksWithCoordinates.reduce(
                      (sum, t) => sum + t.coordinates.latitude,
                      0
                  ) / tasksWithCoordinates.length,
                  tasksWithCoordinates.reduce(
                      (sum, t) => sum + t.coordinates.longitude,
                      0
                  ) / tasksWithCoordinates.length,
              ]
            : [40.7128, -74.006]; // Default to NYC

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
