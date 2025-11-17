import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationMenu from './NotificationMenu';

interface HeaderProps {
    userId: number,
    mode: 'light' | 'dark'
    handleToggleTheme: ()=> void;
    handleToggleDrawer: () => void;
}
const Header: React.FC<HeaderProps> = ({userId, mode, handleToggleTheme, handleToggleDrawer}) => {

    return (
        <header className="bg-primary text-primary-foreground">
            <div className="flex items-center px-4 py-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleDrawer}
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <span className="flex-1 ml-4 text-lg font-medium">
                    Nomad Focus
                </span>

                <div className="flex items-center gap-2">
                    <NotificationMenu userId={userId} />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleTheme}
                        className="text-primary-foreground hover:bg-primary-foreground/10"
                    >
                        {mode === 'dark' ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header;