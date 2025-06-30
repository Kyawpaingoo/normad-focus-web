import type React from "react";
import { useThemeHook } from "../Context/Theme";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
    const {auth} = useThemeHook();
    
    if(!auth || !auth.email) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
}

export default ProtectedRoute;