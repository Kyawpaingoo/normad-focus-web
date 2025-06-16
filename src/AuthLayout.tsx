import React from 'react';
import {Container, Box} from '@mui/material';
const AuthLayout = ({children} : {children: React.ReactNode}) => {
    <Container maxWidth="sm">
        <Box sx={{mt: 8, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {children}
        </Box>
    </Container>
}

export default AuthLayout;