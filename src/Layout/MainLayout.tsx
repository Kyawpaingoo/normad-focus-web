import { Box, Container } from "@mui/material";
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
        <Box>
            <Header userId={auth?.id} mode={mode} handleToggleTheme={toggleTheme} handleToggleDrawer={handleDrawerToggle} />
            <AppDrawer open={drawerOpen} onClose={handleDrawerToggle} />
            <Container maxWidth='xl' sx={{mt:2}}>
                <Outlet />
            </Container>
        </Box>
    )
}

export default MainLayout;