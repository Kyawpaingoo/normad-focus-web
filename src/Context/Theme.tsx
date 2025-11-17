import { createContext, useContext, useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from '../Routers';
import type { User } from "../dtos/authDtos";
import axios from "axios";
import { useVerifyUser } from "../Hooks/useVerifyUser";

type Theme = 'light' | 'dark';

interface ThemeContextProps {
    toggleTheme: ()=> void;
    mode: Theme;
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
    const [mode, setMode] = useState<Theme>('light');
    const {data: user, isLoading} = useVerifyUser();

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    // Apply dark mode class to document root
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mode);
    }, [mode]);

    axios.defaults.withCredentials = true;

    if(isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <ThemeContext.Provider
            value={{
                toggleTheme,
                mode: mode,
                auth: user ? {name: user.name, id: user.id, email: user.email} : null,
                setAuth: () => {}
            }}
        >
            <RouterProvider router={router} />
        </ThemeContext.Provider>
    )
}

export default App;