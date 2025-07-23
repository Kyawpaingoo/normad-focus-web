import { Badge, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import type React from "react";
import { useMemo, useState } from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotification } from "../Hooks/useNotification";
import { NotificationsOff } from "@mui/icons-material";

interface NotificationMenuProps {
    userId: number;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({userId}) => {
    const {notification, connectionStatus, isConnected, reconnect, clearNotifications} = useNotification(userId);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const results = notification ?? [];

    const unreadCount = useMemo(()=> 
        results.filter((result) => !result.sent).length, [results]
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }

    const handleClose = (event?: React.MouseEvent) => {
        if (event) event?.stopPropagation();
        setAnchorEl(null);
    }

    const handleReconnect = (event: React.MouseEvent) => {
        event.stopPropagation();
        reconnect();
    };

    const handleClearAll = (event: React.MouseEvent) => {
        event.stopPropagation();
        clearNotifications();
    };

    const getConnectionStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return 'success';
            case 'connecting': return 'warning';
            case 'error': return 'error';
            default: return 'default';
        }
    };

    return (
        <>
            <IconButton 
                id="notification-menu-button"
                size="small"
                sx={{ padding: 0.5 }}
                aria-controls={open ? 'notification-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Badge
                    badgeContent={unreadCount} 
                    color="error"
                    max={99}
                >
                    {isConnected ? (
                            <NotificationsIcon />
                        ) : (
                            <NotificationsOff color="disabled" />
                        )}
                </Badge>
                
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
                {results.length === 0 && (
                    <Typography padding={2}>
                        No Notification
                    </Typography>
                )}

                {results.map((result) => (
                    <MenuItem key={result.id}>
                        <p>{result.message}</p>
                    </MenuItem>
                ))}
                
            </Menu>
        </>
    )
}

export default NotificationMenu