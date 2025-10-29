/**
 * Geocoding utility - Convert addresses to coordinates
 * - Uses Nominatim (OpenStreetMap) free API
 * - Caches results to avoid repeated API calls
 * - Returns latitude/longitude for map display
 */

import { Coordinates } from "../types";

// In-memory cache to avoid repeated API calls for same address
const GEOCODING_CACHE = new Map<string, Coordinates>();

// Nominatim OpenStreetMap API endpoint
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Convert address string to geographic coordinates
 * - Returns cached results if available
 * - Falls back to Nominatim API on cache miss
 * - Returns null if address is empty or not found
 * @param address - Address string to geocode
 * @returns Coordinates (lat/lon) or null if not found
 */
export async function geocodeAddress(
    address: string
): Promise<Coordinates | null> {
    // Validate address
    if (!address || address.trim() === "") {
        return null;
    }

    // Check cache first to avoid unnecessary API calls
    const cached = GEOCODING_CACHE.get(address);
    if (cached) {
        return cached;
    }

    try {
        // Call Nominatim API with encoded address
        const response = await fetch(
            `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(
                address
            )}&format=json&limit=1` // Limit to 1 result
        );

        if (!response.ok) {
            console.error("Geocoding API error:", response.statusText);
            return null;
        }

        const results = await response.json();

        // No results found
        if (results.length === 0) {
            console.warn(`No results found for address: ${address}`);
            return null;
        }

        // Extract latitude and longitude from first result
        const result = results[0];
        const coordinates: Coordinates = {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
        };

        // Store in cache for future use
        GEOCODING_CACHE.set(address, coordinates);

        return coordinates;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}

/**
 * Geocode multiple addresses in parallel
 * - Deduplicates addresses to reduce API calls
 * - Returns map of address -> coordinates
 * - Handles failures gracefully (returns null for failed addresses)
 * @param addresses - Array of address strings to geocode
 * @returns Map with address as key and coordinates or null as value
 */
export async function geocodeAddresses(
    addresses: string[]
): Promise<Map<string, Coordinates | null>> {
    const results = new Map<string, Coordinates | null>();

    // Remove duplicate addresses to minimize API calls
    const uniqueAddresses = [...new Set(addresses)];

    // Create promises for all unique addresses
    const promises = uniqueAddresses.map(async (address) => {
        const coords = await geocodeAddress(address);
        results.set(address, coords);
    });

    // Wait for all geocoding requests to complete
    await Promise.all(promises);

    return results;
}
