import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path as necessary

const PrivateRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a more sophisticated loading spinner
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to an unauthorized page or dashboard if role is not allowed
        return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
