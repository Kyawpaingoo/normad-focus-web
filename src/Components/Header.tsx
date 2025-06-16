import React from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography, type PaletteMode } from '@mui/material';
import { Menu as MenuIcon, Add as AddIcon , LightMode as LightModeIcon, DarkMode as DarkModeIcon} from '@mui/icons-material';

interface HeaderProps {
    mode: PaletteMode
    handleToggleDrawer: ()=> void;
    handleDrawerToggle: () => void;
}
const Header: React.FC<HeaderProps> = ({mode, handleToggleDrawer, handleDrawerToggle}) => {
    
    return (
        <AppBar position='static'>
            <Toolbar>
                <IconButton
                    color='inherit'
                    edge='start'
                    onClick={handleToggleDrawer}
                >
                    <MenuIcon />
                </IconButton>

                <Typography sx={{flexGrow: 1, ml: 2}}>
                    Nomad Focus
                </Typography>

                <Box>
                    <IconButton
                        color='inherit'
                        onClick={handleDrawerToggle}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>

                {
                    mode === 'dark' ? (
                        <IconButton
                            color='inherit'
                            edge='end'
                            onClick={handleToggleDrawer}
                        >
                            <LightModeIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color='inherit'
                            edge='end'
                            onClick={handleToggleDrawer}
                        >
                            <DarkModeIcon />
                        </IconButton>
                    )
                }
            </Toolbar>
        </AppBar>
    )
}

export default Header;