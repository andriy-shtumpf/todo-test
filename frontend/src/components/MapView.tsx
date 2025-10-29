/**
 * Map component showing task locations
 */

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Task } from "../types";

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

export function MapView({ tasks }: MapViewProps) {
    // Filter tasks with locations
    const tasksWithLocation = tasks.filter((t) => t.location);

    // Calculate center point
    const center: [number, number] =
        tasksWithLocation.length > 0
            ? [
                  tasksWithLocation.reduce(
                      (sum, t) => sum + (t.location?.latitude || 0),
                      0
                  ) / tasksWithLocation.length,
                  tasksWithLocation.reduce(
                      (sum, t) => sum + (t.location?.longitude || 0),
                      0
                  ) / tasksWithLocation.length,
              ]
            : [40.7128, -74.006]; // Default to NYC

    return (
        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
            <MapContainer
                center={center}
                zoom={4}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {tasksWithLocation.map(
                    (task) =>
                        task.location && (
                            <Marker
                                key={task.id}
                                position={[
                                    task.location.latitude,
                                    task.location.longitude,
                                ]}
                                title={task.title}
                            >
                                <Popup>
                                    <div className="text-sm">
                                        <h3 className="font-semibold">
                                            {task.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {task.description}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {statusEmojis[task.status]}{" "}
                                            {task.status.replace("_", " ")}
                                        </p>
                                        {task.location.address && (
                                            <p className="text-xs text-gray-500">
                                                {task.location.address}
                                            </p>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        )
                )}
            </MapContainer>
        </div>
    );
}
