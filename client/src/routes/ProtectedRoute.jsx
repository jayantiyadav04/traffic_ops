import { Navigate, Outlet } from 'react-router-dom';


// Let's inline usage or make a hook file. For simplicity, reading context here directly or creating a hook helper.
import { useContext } from 'react';
import AuthContext from '../auth/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <div className="unauthorized">Access Denied: You do not have permission to view this page.</div>;
    }

    return <Outlet />;
};

export default ProtectedRoute;
