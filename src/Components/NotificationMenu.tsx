import type React from "react";
import { useMemo, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotification } from "../Hooks/useNotification";

interface NotificationMenuProps {
    userId: number;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({userId}) => {
    const {notification, connectionStatus: _connectionStatus, isConnected, reconnect: _reconnect, clearNotifications: _clearNotifications} = useNotification(userId);
    const [open, setOpen] = useState(false);

    const results = notification ?? [];

    const unreadCount = useMemo(()=>
        results.filter((result) => !result.sent).length, [results]
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setOpen(!open);
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={handleClick}
                    aria-label="Notifications"
                >
                    <div className="relative">
                        {isConnected ? (
                            <Bell className="h-5 w-5" />
                        ) : (
                            <BellOff className="h-5 w-5 opacity-50" />
                        )}
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-1 text-xs"
                            >
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                        )}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                {results.length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                        No Notification
                    </div>
                )}

                {results.map((result) => (
                    <DropdownMenuItem key={result.id} className="cursor-pointer">
                        <p className="text-sm">{result.message}</p>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NotificationMenu