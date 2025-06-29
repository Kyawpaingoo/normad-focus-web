import React from "react";
import { Drawer, Divider, Box, Typography, IconButton, Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface SidebarModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
}

const SidebarModal: React.FC<SidebarModalProps> = ({open, onClose, title, children}) => {
    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="right"
            sx={{width: '100%', maxWidth: 400, p:2}}
        >
            <Box sx={{
                width: 450,
                height: '100vh',
                borderRight: '1px solid #ddd',
                bgcolor: '#f8f9fa',
                p: 2,
                boxSizing: 'border-box',
                overflowY: 'auto',
            }}>
                <Stack height={'40px'} direction="row" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                    <Typography variant="h6">{title}</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>

                <Divider sx={{mb: 2}} />

                {children}
            </Box>
            
        </Drawer>
    )
}

export default SidebarModal;