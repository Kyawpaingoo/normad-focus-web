import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, type PaletteMode, ThemeProvider, createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { RouterProvider } from "react-router-dom";
import router from '../Routers';
import type { LoginResponseDto } from "../dtos/authDtos";
import axios from "axios";
import { verfiyUser } from '../ApiRequestHelpers/authApiRequest';

interface ThemeContextProps {
    toggleTheme: ()=> void;
    mode: PaletteMode;
    setAuth: (user: LoginResponseDto) => void;
    auth: LoginResponseDto | null
}

const ThemeContext = createContext<ThemeContextProps>({
    toggleTheme: () => {},
    mode: 'light',
    setAuth: () => {},
    auth: null,
});

export const queryClient = new QueryClient();

export const useThemeHook = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeHook must be used within a ThemeProvider");
    }
    return context;
}

const App: React.FC = () => {
    const [mode, setMode] = useState<PaletteMode>('light');
    const [auth, setAuth] = useState<LoginResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    axios.defaults.withCredentials = true;

    
    useEffect(()=> {
        const initializeAuth = async () => {
            const response = await verfiyUser();
            if(response)
            {
                setAuth({username: response.name, userId: response.id, email: response.email});
            }
            setLoading(false);
        }
        initializeAuth(); 
    },[])


    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: mode,
                primary: {
                    main: mode === 'light' ? '#1976d2' : '#90caf9',
                },
                // banner: mode === 'dark' ? grey[800] : grey[200],
                text: {
                    primary: mode === 'dark' ? grey[300] : grey[900],
                    secondary: mode === 'dark' ? grey[400] : grey[700],
                }
            }
        });
    }, [mode]);

    if(loading) return <div>Loading...</div>;

    return (
        <ThemeProvider theme={theme}>
            <ThemeContext.Provider
                value={{
                    toggleTheme,
                    mode: mode,
                    auth: auth,
                    setAuth: setAuth,
                }}
            > 
                <QueryClientProvider client={queryClient}>
                    <CssBaseline />
                    <RouterProvider router={router} />
                </QueryClientProvider> 
                
            </ThemeContext.Provider>
        </ThemeProvider>
    )
}

export default App;