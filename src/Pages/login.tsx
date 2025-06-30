import type React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeHook } from "../Context/Theme";
import { useMutation } from "@tanstack/react-query";
import type { LoginRequestDto, User } from "../dtos/authDtos";
import {login} from '../ApiRequestHelpers/authApiRequest';
import { Alert, Box, Button, Checkbox, FormControlLabel, Grid, InputAdornment, IconButton, Link, Paper, TextField, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { queryClient } from "../Hooks/QueryClient";

const Login: React.FC = () => {
    const emailInput : React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
    const passwordInput : React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string | null>(null);
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const {setAuth} = useThemeHook();

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email: string = emailInput.current?.value ?? '';
        const password: string = passwordInput.current?.value ?? '';

        if(!email || !password) {
            setError("email and password are required");
            return;
        }

        await loginRequest.mutateAsync({email: email, password: password});
    }

    const handleTogglePassword = () => setShowPassword((show) => !show);

    const loginRequest = useMutation<User, Error, LoginRequestDto>({
        mutationFn: async (data: LoginRequestDto) => await login(data),
        onError: async () => {
            setError("Incorrect email or password.");
        },

        onSuccess: async (data: User) => {
            //console.log(data)
            setAuth(data);
            await queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
            navigate('/');
        }
    });

    return (
        <Paper elevation={3} sx={{padding: 4, borderRadius: 2, minWidth: 400, maxWidth: 420}}>
            <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h4" fontWeight={700}>Login</Typography>
                
                <Link href='/register' underline='hover' color='primary'>
                    Don't have an account?
                </Link>
            </Box>
            {
                    error && (
                        <Alert severity='warning'>
                            {error}
                        </Alert>
                    )
            }

            <Box component={'form'} onSubmit={handleSubmit} mt={2}>
                <Typography mb={1} fontWeight={500}>Email Address</Typography>
                <TextField inputRef={emailInput} placeholder="Enter email address" fullWidth />

                <Typography mt={2} mb={1} fontWeight={500}>Password</Typography>
                <TextField inputRef={passwordInput} type={showPassword ? "text" : "password"} placeholder="Enter password" fullWidth InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        </InputAdornment>
                    )
                    }} />
                <Grid container alignItems="center" justifyContent="space-between" mt={1}>
                    <Grid>
                        <FormControlLabel
                            control={
                            <Checkbox
                                checked={keepSignedIn}
                                onChange={(e) => setKeepSignedIn(e.target.checked)}
                            />
                            }
                            label="Keep me sign in"
                        />
                    </Grid>
                    <Grid >
                        <Link href="#" underline="hover" color="inherit">
                            Forgot Password?
                        </Link>
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                    mt: 3,
                    backgroundColor: "#1976ff",
                    fontSize: "1.15rem",
                    textTransform: "none",
                    py: 1.2,
                    borderRadius: 1
                    }}
                >
                    Login
                </Button>
            </Box>
        </Paper>
    )
}

export default Login;