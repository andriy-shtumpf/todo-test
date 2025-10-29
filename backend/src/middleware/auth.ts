/**
 * Firebase authentication middleware
 * - Verifies JWT tokens from Firebase client SDK
 * - Extracts user info from token and attaches to request
 * - All protected routes use this middleware
 */

import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import { config } from "../config.js";

// Initialize Firebase Admin SDK (singleton pattern)
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: config.firebase.projectId,
    });
}

/**
 * Extended Express Request with authenticated user info
 */
export interface AuthRequest extends Request {
    user?: {
        uid: string; // Firebase user ID
        email: string; // User email from token
    };
}

/**
 * Express middleware to verify Firebase JWT token
 * Expects: Authorization header with "Bearer <token>"
 * Sets: req.user with uid and email
 */
export async function authenticateToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    // Extract token from Authorization header (Bearer scheme)
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    // Reject if no token provided
    if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
    }

    try {
        // Verify Firebase JWT token with Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Attach user info to request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email || "",
        };

        // Continue to next middleware/route handler
        next();
    } catch (error) {
        // Invalid or expired token
        console.error("Token verification failed:", error);
        res.status(403).json({ error: "Invalid token" });
    }
}
