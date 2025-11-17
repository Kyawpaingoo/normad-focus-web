import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegisterRequestDto, RegisterResponseDto } from "../dtos/authDtos";
import { register } from "../ApiRequestHelpers/authApiRequest";
import { Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const nameInput = useRef<HTMLInputElement>(null);
    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const confirmPasswordInput = useRef<HTMLInputElement>(null);

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
        <Card className="p-8 rounded-lg min-w-[400px] max-w-[420px] shadow-lg">
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Create an account</h1>
            </div>

            {
                error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                )
            }

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="font-medium">User Name</Label>
                    <Input
                        id="name"
                        ref={nameInput}
                        placeholder="Enter your name"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">Email Address</Label>
                    <Input
                        id="email"
                        ref={emailInput}
                        placeholder="Enter your email"
                        type="email"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="font-medium">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            ref={passwordInput}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={handleTogglePassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="font-medium">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="confirm-password"
                            ref={confirmPasswordInput}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={handleToggleConfirmPassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="mt-2">
                    <a href='/login' className="text-primary hover:underline text-sm font-medium">
                       Already have an account? Sign In here.
                    </a>
                </div>

                <Button
                    type="submit"
                    className="w-full mt-6 text-lg py-6"
                >
                    Create Account
                </Button>

            </form>
        </Card>
    )
}

export default Register;