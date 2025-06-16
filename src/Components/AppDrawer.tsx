import { Box, Drawer } from "@mui/material";

interface AppDrawerProps {
    open: boolean;
    onClose: () => void;
}

const AppDrawer: React.FC<AppDrawerProps> = ({open, onClose})=> {
    return (
        <Drawer
            open={open}
            onClose={onClose}
        >
            <Box>
                Sidebar
            </Box>
        </Drawer>
    )
}

export default AppDrawer;