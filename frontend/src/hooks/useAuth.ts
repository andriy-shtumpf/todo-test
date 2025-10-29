/**
 * Custom hook for Firebase authentication
 * - Monitors Firebase authentication state changes
 * - Retrieves and manages JWT tokens for API requests
 * - Provides user data and logout functionality
 * - Automatically updates when user logs in/out
 */

import {
    User as FirebaseUser,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { User } from "../types";

interface UseAuthReturn {
    user: User | null; // Authenticated user data
    firebaseUser: FirebaseUser | null; // Raw Firebase user object
    token: string | null; // JWT token for API authentication
    loading: boolean; // Authentication state check in progress
    error: string | null; // Any authentication errors
    logout: () => Promise<void>; // Sign out function
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Monitor Firebase auth state on component mount
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (fbUser) => {
                if (fbUser) {
                    // User is logged in
                    setFirebaseUser(fbUser);
                    setUser({
                        id: fbUser.uid,
                        email: fbUser.email || "",
                        name: fbUser.displayName || "User",
                        photoURL: fbUser.photoURL || undefined,
                    });
                    // Fetch JWT token for API calls
                    try {
                        const idToken = await fbUser.getIdToken();
                        setToken(idToken);
                    } catch (err) {
                        setError(
                            err instanceof Error
                                ? err.message
                                : "Failed to get token"
                        );
                    }
                } else {
                    // User is logged out - clear all user data
                    setFirebaseUser(null);
                    setUser(null);
                    setToken(null);
                }
                setLoading(false);
            },
            (error) => {
                // Handle auth initialization error
                setError(error.message);
                setLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setFirebaseUser(null);
            setToken(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Logout failed");
        }
    };

    return { user, firebaseUser, token, loading, error, logout };
}
