import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
            <Outlet />
        </div>
    )
}

export default AuthLayout;