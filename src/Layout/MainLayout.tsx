import type React from "react";
import Header from "../Components/Header";
import { Outlet } from "react-router-dom";
import { useThemeHook } from "../Context/Theme";
import { useState } from "react";
import AppDrawer from "../Components/AppDrawer";


const MainLayout: React.FC = () => {
    const {auth, mode, toggleTheme} = useThemeHook();
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(prev => !prev);
    };


    return (
        <div>
            <Header userId={auth?.id ?? 0} mode={mode} handleToggleTheme={toggleTheme} handleToggleDrawer={handleDrawerToggle} />
            <AppDrawer open={drawerOpen} onClose={handleDrawerToggle} />
            <div className="container mx-auto px-4 mt-2 max-w-7xl">
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout;