/**
 * Header component with navigation
 */

import { Link, useNavigate } from "react-router-dom";
import { User } from "../types";

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo / Title */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                ✓
                            </span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">
                            TodoApp
                        </h1>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex gap-6 items-center">
                        {user && (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-700 hover:text-blue-500 font-medium transition"
                                >
                                    📊 Dashboard
                                </Link>
                                <Link
                                    to="/tasks"
                                    className="text-gray-700 hover:text-blue-500 font-medium transition"
                                >
                                    📝 Tasks
                                </Link>
                                <Link
                                    to="/map"
                                    className="text-gray-700 hover:text-blue-500 font-medium transition"
                                >
                                    🗺️ Map
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {user.photoURL && (
                                    <img
                                        src={user.photoURL}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}
                                <span className="text-gray-700 font-medium">
                                    {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
