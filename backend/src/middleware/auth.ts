/**
 * Firebase authentication middleware
 */

import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import { config } from "../config.js";

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: config.firebase.projectId,
    });
}

export interface AuthRequest extends Request {
    user?: {
        uid: string;
        email: string;
    };
}

export async function authenticateToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email || "",
        };
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(403).json({ error: "Invalid token" });
    }
}
