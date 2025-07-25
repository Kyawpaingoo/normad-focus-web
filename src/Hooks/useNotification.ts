import { useCallback, useEffect, useRef, useState } from "react";
import type { NotificationDto } from "../dtos/notificationDto";

interface useNotificationReturn {
    notification: NotificationDto[];
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
    isConnected: boolean;
    reconnect: () => void;
    clearNotifications: () => void;
}

export const useNotification = (userId: number) : useNotificationReturn => {
    const [notification, setNotification] = useState<NotificationDto[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;

    const cleanUp = useCallback(()=> {
        if(reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        } 

        if (ws.current) {
            ws.current.onopen = null;
            ws.current.onmessage = null;
            ws.current.onerror = null;
            ws.current.onclose = null;
            
            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.close(1000, 'Cleanup');
            }
            ws.current = null;
        }
    },[])

    const connect = useCallback(()=> {
        cleanUp();

        const ws_url = import.meta.env.VITE_WS_API;
        setConnectionStatus('connecting');

        try {
            ws.current = new WebSocket(`${ws_url}?user_id=${userId}`);

            ws.current.onopen = () => {
                setConnectionStatus('connected');
                setReconnectAttempts(0);

                if (ws.current) {
                    ws.current.send(JSON.stringify({
                        action: 'subscribe',
                        userId: userId
                    }));
                }
            };

            ws.current.onmessage = (event) => {
                try {
                    const response: NotificationDto = JSON.parse(event.data);

                    setNotification((prev) => [...prev, response]);
                } catch(error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            }

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('error');
            };

            ws.current.onclose = (event) => {
                setConnectionStatus('disconnected');
                if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        setReconnectAttempts(prev => prev + 1);
                        connect();
                    }, reconnectDelay);
                }
            };
        } catch(error) {
            console.error("Failed to create WebSocket connection:", error);
            setConnectionStatus('error');
        }
    }, [userId, reconnectAttempts, cleanUp]);

    const reconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        setReconnectAttempts(0);
        connect();
    }, [connect]);

    const clearNotifications = useCallback(() => {
        setNotification([]);
    }, []);

    useEffect(() => {
        connect();

        return cleanUp;
    }, [connect, cleanUp]);

    return {notification, connectionStatus, isConnected: connectionStatus === 'connected', reconnect, clearNotifications};
}