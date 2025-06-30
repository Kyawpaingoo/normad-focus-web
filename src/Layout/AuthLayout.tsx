import React from 'react';
import {Grid} from '@mui/material';
import { Outlet } from 'react-router-dom';
const AuthLayout: React.FC = () => {
    return (
        <Grid container justifyContent='center' alignItems='center' sx={{minHeight: '100vh', background:'#fafafa'}}>
            <Outlet />
        </Grid>
    )
}

export default AuthLayout;