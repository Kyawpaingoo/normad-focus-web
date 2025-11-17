import type React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeHook } from "../Context/Theme";
import { useMutation } from "@tanstack/react-query";
import type { LoginRequestDto, User } from "../dtos/authDtos";
import {login} from '../ApiRequestHelpers/authApiRequest';
import { Eye, EyeOff } from "lucide-react";
import { queryClient } from "../Hooks/QueryClient";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login: React.FC = () => {
    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

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
        <Card className="p-8 rounded-lg min-w-[400px] max-w-[420px] shadow-lg">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Login</h1>

                <a href='/register' className="text-primary hover:underline text-sm">
                    Don't have an account?
                </a>
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
                    <Label htmlFor="email" className="font-medium">Email Address</Label>
                    <Input
                        id="email"
                        ref={emailInput}
                        placeholder="Enter email address"
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
                            placeholder="Enter password"
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

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="keep-signed-in"
                            checked={keepSignedIn}
                            onCheckedChange={(checked) => setKeepSignedIn(checked === true)}
                        />
                        <Label htmlFor="keep-signed-in" className="text-sm font-normal cursor-pointer">
                            Keep me sign in
                        </Label>
                    </div>
                    <a href="#" className="text-sm hover:underline">
                        Forgot Password?
                    </a>
                </div>

                <Button
                    type="submit"
                    className="w-full mt-6 text-lg py-6"
                >
                    Login
                </Button>
            </form>
        </Card>
    )
}

export default Login;