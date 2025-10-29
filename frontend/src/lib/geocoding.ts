/**
 * Geocoding utility - Convert addresses to coordinates
 * Uses Nominatim (OpenStreetMap) API
 */

import { Coordinates } from "../types";

const GEOCODING_CACHE = new Map<string, Coordinates>();
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Convert address to coordinates using Nominatim API
 */
export async function geocodeAddress(
    address: string
): Promise<Coordinates | null> {
    if (!address || address.trim() === "") {
        return null;
    }

    // Check cache first
    const cached = GEOCODING_CACHE.get(address);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(
            `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(
                address
            )}&format=json&limit=1`
        );

        if (!response.ok) {
            console.error("Geocoding API error:", response.statusText);
            return null;
        }

        const results = await response.json();

        if (results.length === 0) {
            console.warn(`No results found for address: ${address}`);
            return null;
        }

        const result = results[0];
        const coordinates: Coordinates = {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
        };

        // Cache the result
        GEOCODING_CACHE.set(address, coordinates);

        return coordinates;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}

/**
 * Geocode multiple addresses in parallel
 */
export async function geocodeAddresses(
    addresses: string[]
): Promise<Map<string, Coordinates | null>> {
    const results = new Map<string, Coordinates | null>();

    const uniqueAddresses = [...new Set(addresses)];
    const promises = uniqueAddresses.map(async (address) => {
        const coords = await geocodeAddress(address);
        results.set(address, coords);
    });

    await Promise.all(promises);

    return results;
}
