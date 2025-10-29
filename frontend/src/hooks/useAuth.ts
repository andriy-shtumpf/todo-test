/**
 * Custom hook for Firebase authentication
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
    user: User | null;
    firebaseUser: FirebaseUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (fbUser) => {
                if (fbUser) {
                    setFirebaseUser(fbUser);
                    setUser({
                        id: fbUser.uid,
                        email: fbUser.email || "",
                        name: fbUser.displayName || "User",
                        photoURL: fbUser.photoURL || undefined,
                    });
                    // Get the ID token for API authentication
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
                    setFirebaseUser(null);
                    setUser(null);
                    setToken(null);
                }
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false);
            }
        );

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
