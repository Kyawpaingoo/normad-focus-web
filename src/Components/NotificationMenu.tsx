import { IconButton, Menu, MenuItem } from "@mui/material";
import type React from "react";
import { useState } from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationMenu: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }

    const handleClose = (event?: React.MouseEvent) => {
            if (event) event?.stopPropagation();
            setAnchorEl(null);
        }

    return (
        <>
            <IconButton             id="notification-menu-button"
            size="small"
            sx={{ padding: 0.5 }}
            aria-controls={open ? 'notification-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            >
                <NotificationsIcon />
            </IconButton>
            <Menu
                id="notification-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'notification-menu-button',
                    }
                }}
                sx={{}}
            >
                <MenuItem>
                    <p>Notification 1 for user 9</p>
                </MenuItem>
                <MenuItem>
                    <p>Notification 2</p>
                </MenuItem>
                <MenuItem>
                    <p>Notification 3</p>
                </MenuItem>
            </Menu>
        </>
    )
}

export default NotificationMenu