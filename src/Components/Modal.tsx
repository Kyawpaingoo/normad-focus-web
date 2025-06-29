import React from 'react';
import { Modal, Box, Button, Stack, Typography, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PopupModalProps {
    open: boolean;
    onClose: ()=> void;
    title?: string;
    children?: React.ReactNode;
    onConfirm?: () => void;
}

const PopupModal: React.FC<PopupModalProps> =({open, onClose, title, children, onConfirm}) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4}}>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                
                {children}

                <Stack direction={'row'} spacing={2} justifyContent={'flex-end'}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={onConfirm}>Confirm</Button>
                </Stack>
            </Box>
        </Modal>
    )
}

export default PopupModal;