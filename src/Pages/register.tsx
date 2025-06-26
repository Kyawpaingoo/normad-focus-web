import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegisterRequestDto, RegisterResponseDto } from "../dtos/authDtos";
import { register } from "../ApiRequestHelpers/authApiRequest";
import { Alert, Box,
  Button,
  Link,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton } from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Register: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const nameInput = useRef<HTMLInputElement | null>(null);
    const emailInput = useRef<HTMLInputElement | null>(null);
    const passwordInput = useRef<HTMLInputElement | null>(null);
    const confirmPasswordInput = useRef<HTMLInputElement | null>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const name: string = nameInput.current?.value ?? '';
        const email: string = emailInput.current?.value ?? '';
        const password: string = passwordInput.current?.value ?? '';
        const confirmPassword: string = confirmPasswordInput.current?.value ?? '';

        if(!name || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if(password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        registerRequest.mutate({username: name, email: email, password: password, confirmPassword: confirmPassword});
    }

    const handleTogglePassword = () => setShowPassword((show) => !show);

    const handleToggleConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const registerRequest = useMutation<RegisterResponseDto, Error, RegisterRequestDto, unknown>({
        mutationFn: async (data: RegisterRequestDto) : Promise<RegisterResponseDto> => await register(data),
        onError: async () => setError("Incorrect email or password."),
        onSuccess: async () => navigate('/login'),
    })   

    return (
        <Paper elevation={3} sx={{padding: 4, borderRadius: 2, minWidth: 400, maxWidth: 420}}>
            <Box mb={2} display={'flex'} justifyContent={'flex-start'}>
                <Typography variant="h4" fontWeight={700}>Create an account</Typography>
            </Box>
            
            {
                error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )
            }

            <Box component="form" onSubmit={handleSubmit} mt={2}>
                <Typography mt={2} mb={1} fontWeight={500}>User Name</Typography>
                <TextField inputRef={nameInput} placeholder="Enter your name" fullWidth />

                <Typography mt={2} mb={1} fontWeight={500}>Email Address</Typography>
                <TextField inputRef={emailInput} placeholder="Enter your email" fullWidth />

                <Typography mt={2} mb={1} fontWeight={500}>Password</Typography>
                <TextField type={showPassword ? "text" : "password"} inputRef={passwordInput} placeholder="Enter your password" fullWidth InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        </InputAdornment>
                    )
                    }} />

                <Typography mt={2} mb={1} fontWeight={500}>Confirm Password</Typography>
                <TextField type={showConfirmPassword ? "text" : "password"} inputRef={confirmPasswordInput} placeholder="Confirm your password" fullWidth InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton onClick={handleToggleConfirmPassword} edge="end">
                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        </InputAdornment>
                    )
                }} />

                 <Box mt={2} display={'flex'} justifyContent={'flex-start'}>
                    <Link href='/login' underline='hover' color='primary' fontSize={14} fontWeight={500}>
                       Already have an account? Sign In here.
                    </Link>
                </Box>

                <Button type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                    mt: 3,
                    backgroundColor: "#1976ff",
                    fontSize: "1.15rem",
                    textTransform: "none",
                    py: 1.2,
                    borderRadius: 1
                    }}>
                    Create Account
                </Button>
                
            </Box>
        </Paper>
    )
}

export default Register;