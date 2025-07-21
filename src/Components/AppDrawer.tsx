import { Avatar, Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useThemeHook } from "../Context/Theme";
import { useNavigate } from "react-router-dom";

interface AppDrawerProps {
    open: boolean;
    onClose: () => void;
}

const AppDrawer: React.FC<AppDrawerProps> = ({open, onClose})=> {
    const {auth} = useThemeHook();
    const navigate = useNavigate();
    return (
        <Drawer
            open={open}
            onClose={onClose}
        >
            <Box
                    sx={{
                        mb: 6,
                        width: 300,
                        height: 40,
                        bgcolor: "background",
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            gap: 2,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            position: 'absolute',
                            left: 20,
                            bottom: -30
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 25,
                                height: 25,
                                color: 'white',
                                background: 'primary'
                            }}
                        />
                        <Typography sx={{fontWeight: 'blod'}}>
                            {auth ? auth.name : 'Guest'}
                        </Typography>
                    </Box>
                </Box>
                
                <Divider />
                <List>
                    <ListItem>
                        <ListItemButton
                            onClick={()=>navigate('/')}
                        >
                            <ListItemIcon>
                                <ListItemText>Home</ListItemText>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton
                            onClick={()=>navigate('/expense')}
                        >
                            <ListItemIcon>
                                <ListItemText>Expense</ListItemText>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton
                            onClick={()=>navigate('/task')}
                        >
                            <ListItemIcon>
                                <ListItemText>Task</ListItemText>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </List>
        </Drawer>
    )
}

export default AppDrawer;