/**
 * Header component with responsive navigation
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types";

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
        navigate("/login");
        setMobileMenuOpen(false);
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">
                <div className="flex justify-between items-center">
                    {/* Logo / Title */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                ✓
                            </span>
                        </div>
                        <h1 className="text-lg md:text-xl font-bold text-gray-900 whitespace-nowrap">
                            TodoApp
                        </h1>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex gap-4 lg:gap-6 items-center">
                        {user && (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-700 hover:text-blue-500 font-medium transition text-sm lg:text-base"
                                >
                                    📊 Dashboard
                                </Link>
                                <Link
                                    to="/tasks"
                                    className="text-gray-700 hover:text-blue-500 font-medium transition text-sm lg:text-base"
                                >
                                    📝 Tasks
                                </Link>
                                <Link
                                    to="/map"
                                    className="text-gray-700 hover:text-blue-500 font-medium transition text-sm lg:text-base"
                                >
                                    🗺️ Map
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                        {user ? (
                            <>
                                {/* Desktop User Info */}
                                <div className="hidden md:flex items-center gap-2 lg:gap-3">
                                    {user.photoURL && (
                                        <img
                                            src={user.photoURL}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <span className="text-gray-700 font-medium text-sm lg:text-base line-clamp-1">
                                        {user.name}
                                    </span>
                                </div>
                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() =>
                                        setMobileMenuOpen(!mobileMenuOpen)
                                    }
                                    className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    ☰
                                </button>
                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="px-3 md:px-4 py-2 bg-red-500 text-white text-sm md:text-base rounded-lg hover:bg-red-600 transition font-medium whitespace-nowrap"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-3 md:px-4 py-2 bg-blue-500 text-white text-sm md:text-base rounded-lg hover:bg-blue-600 transition font-medium whitespace-nowrap"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && user && (
                    <nav className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
                        <Link
                            to="/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-gray-700 hover:text-blue-500 font-medium transition text-sm"
                        >
                            📊 Dashboard
                        </Link>
                        <Link
                            to="/tasks"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-gray-700 hover:text-blue-500 font-medium transition text-sm"
                        >
                            📝 Tasks
                        </Link>
                        <Link
                            to="/map"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-gray-700 hover:text-blue-500 font-medium transition text-sm"
                        >
                            🗺️ Map
                        </Link>
                        {user.photoURL && (
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                <img
                                    src={user.photoURL}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="text-gray-700 font-medium text-sm">
                                    {user.name}
                                </span>
                            </div>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
}
