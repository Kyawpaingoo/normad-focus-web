import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useMemo, useState } from "react";
import { CssBaseline, type PaletteMode, ThemeProvider, createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { RouterProvider } from "react-router-dom";
import router from '../Routers';

interface ThemeContextProps {
    toggleTheme: ()=> void;
    mode: PaletteMode;
}

const ThemeContext = createContext<ThemeContextProps>({
    toggleTheme: () => {},
    mode: 'light'
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

    const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

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

    return (
        <ThemeProvider theme={theme}>
            <ThemeContext.Provider
                value={{
                    toggleTheme,
                    mode: mode
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