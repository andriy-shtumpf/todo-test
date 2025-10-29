/**
 * Main App component with routing and authentication
 * - Sets up React Router with public and protected routes
 * - Initializes authentication and task management hooks
 * - Redirects unauthenticated users to login page
 * - Provides layout wrapper with Header and Footer
 */

import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import { Header } from "./components/Header";
import { useAuth } from "./hooks/useAuth";
import { useTasks } from "./hooks/useTasks";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/LoginPage";
import { MapPage } from "./pages/MapPage";
import { TasksPage } from "./pages/TasksPage";

function App() {
    const { user, token, loading: authLoading, logout } = useAuth();
    const {
        tasks,
        loading: tasksLoading,
        error: tasksError,
        createTask,
        updateTask,
        deleteTask,
    } = useTasks(token);

    // Show loading screen while checking authentication state
    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="bg-white rounded-lg p-6 md:p-8 shadow-xl mx-4">
                    <p className="text-gray-700 font-medium text-sm md:text-base">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header user={user} onLogout={logout} />

                <main className="flex-1 max-w-7xl mx-auto w-full px-3 md:px-4 py-4 md:py-8 overflow-hidden">
                    <Routes>
                        {/* Login Page */}
                        <Route
                            path="/login"
                            element={
                                !user ? (
                                    <LoginPage />
                                ) : (
                                    <Navigate to="/dashboard" />
                                )
                            }
                        />

                        {/* Protected Routes */}
                        {user ? (
                            <>
                                {/* Dashboard */}
                                <Route
                                    path="/dashboard"
                                    element={
                                        <Dashboard
                                            tasks={tasks}
                                            onStatusChange={updateTask}
                                            onDelete={deleteTask}
                                            loading={tasksLoading}
                                        />
                                    }
                                />

                                {/* Tasks */}
                                <Route
                                    path="/tasks"
                                    element={
                                        <TasksPage
                                            tasks={tasks}
                                            userId={user.id}
                                            onCreateTask={createTask}
                                            onStatusChange={updateTask}
                                            onDelete={deleteTask}
                                            loading={tasksLoading}
                                        />
                                    }
                                />

                                {/* Map */}
                                <Route
                                    path="/map"
                                    element={
                                        <MapPage
                                            tasks={tasks}
                                            loading={tasksLoading}
                                        />
                                    }
                                />

                                {/* Redirect home to dashboard */}
                                <Route
                                    path="/"
                                    element={<Navigate to="/dashboard" />}
                                />
                            </>
                        ) : (
                            // Redirect all protected routes to login
                            <Route
                                path="*"
                                element={<Navigate to="/login" />}
                            />
                        )}
                    </Routes>

                    {/* Error Display */}
                    {tasksError && (
                        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base">
                            {tasksError}
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-3 md:py-4 mt-auto">
                    <div className="max-w-7xl mx-auto px-3 md:px-4 text-center text-gray-500 text-xs md:text-sm">
                        <p>
                            Todo Multi-User App © 2024 - Built with React,
                            Firebase & PostgreSQL
                        </p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
