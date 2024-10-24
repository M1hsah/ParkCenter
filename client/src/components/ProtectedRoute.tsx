// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    element: React.ReactNode; // Accept an element to render
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { user } = useAuth(); // Access user state from AuthContext

    // If user is not authenticated, redirect to the login page
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If user is authenticated, render the provided element
    return <>{element}</>;
};

export default ProtectedRoute;
