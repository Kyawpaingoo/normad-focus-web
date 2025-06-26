import React from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography, type PaletteMode } from '@mui/material';
import { Menu as MenuIcon, Add as AddIcon , LightMode as LightModeIcon, DarkMode as DarkModeIcon} from '@mui/icons-material';

interface HeaderProps {
    mode: PaletteMode
    handleToggleTheme: ()=> void;
    handleToggleDrawer: () => void;
}
const Header: React.FC<HeaderProps> = ({mode, handleToggleTheme, handleToggleDrawer}) => {
    
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
                        onClick={handleToggleDrawer}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>

                {
                    mode === 'dark' ? (
                        <IconButton
                            color='inherit'
                            edge='end'
                            onClick={handleToggleTheme}
                        >
                            <LightModeIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color='inherit'
                            edge='end'
                            onClick={handleToggleTheme}
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