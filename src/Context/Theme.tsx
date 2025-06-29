import { createContext, useContext, useMemo, useState } from "react";
import { CssBaseline, type PaletteMode, ThemeProvider, createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { RouterProvider } from "react-router-dom";
import router from '../Routers';
import type { User } from "../dtos/authDtos";
import axios from "axios";
import { useVerifyUser } from "../Hooks/useVerifyUser";

interface ThemeContextProps {
    toggleTheme: ()=> void;
    mode: PaletteMode;
    auth: User | null
    setAuth: (user: User | null) => void
}

const ThemeContext = createContext<ThemeContextProps>({
    toggleTheme: () => {},
    mode: 'light',
    auth: null,
    setAuth: () => {}
});


export const useThemeHook = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeHook must be used within a ThemeProvider");
    }
    return context;
}

const App: React.FC = () => {
    const [mode, setMode] = useState<PaletteMode>('light');
   // const [auth, setAuth] = useState<User | null>(null);
    const {data: user, isLoading} = useVerifyUser();
   // const [loading, setLoading] = useState(true);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    axios.defaults.withCredentials = true;

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

    if(isLoading) return <div>Loading...</div>;

    return (
            <ThemeProvider theme={theme}>
                <ThemeContext.Provider
                    value={{
                        toggleTheme,
                        mode: mode,
                        auth: user ? {name: user.name, id: user.id, email: user.email} : null,
                        setAuth: () => {}
                    }}
                > 
                    
                        <CssBaseline />
                        <RouterProvider router={router} />
                    
                    
                </ThemeContext.Provider>
            </ThemeProvider>
    )
}

export default App;