/**
 * Login page - Firebase authentication
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

export function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                // Sign up
                const result = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                if (displayName) {
                    await updateProfile(result.user, { displayName });
                }
            } else {
                // Sign in
                await signInWithEmailAndPassword(auth, email, password);
            }

            navigate("/dashboard");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Authentication failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                                ✓
                            </span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                        TodoApp
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Multi-user task management with map integration
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) =>
                                        setDisplayName(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your name"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                        >
                            {loading
                                ? "Loading..."
                                : isSignUp
                                ? "Sign Up"
                                : "Sign In"}
                        </button>
                    </form>

                    {/* Toggle Sign Up */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            {isSignUp
                                ? "Already have an account?"
                                : "Don't have an account?"}{" "}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError(null);
                                }}
                                className="text-blue-500 hover:text-blue-600 font-medium"
                            >
                                {isSignUp ? "Sign In" : "Sign Up"}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Demo Info */}
                <div className="mt-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
                    <p className="font-semibold mb-2">
                        Demo Credentials (if using test data):
                    </p>
                    <p>Email: test@example.com</p>
                    <p>Password: password123</p>
                </div>
            </div>
        </div>
    );
}
