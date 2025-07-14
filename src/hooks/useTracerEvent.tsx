"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { UseHookProps } from "./useGetTracer";
import { toaster } from "@/components/ui/toaster";

import server from '@/constants/server';

const SERVER_URL = server.SERVER_API_URL;

interface TracerEvent {
    type: 'user_notification' | 'message_received' | 'status_update' | 'tracer_update';
    data: any;
    timestamp: Date;
}

interface TracerEventData {
    socket: Socket | null;
    isConnected: boolean;
    events: TracerEvent[];
}

interface TracerEventPayload {
    userId?: string;
}

export const useTracerEvent = (props?: UseHookProps<TracerEventPayload, any>) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [events, setEvents] = useState<TracerEvent[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const eventHandlersRef = useRef<Map<string, ((data: any) => void)[]>>(new Map());

    const connect = ({ userId }: TracerEventPayload) => {
        try {
            // Disconnect existing socket if any
            if (socketRef.current) {
                socketRef.current.close();
            }

            // Create new socket connection
            const newSocket = io(SERVER_URL, {
                transports: ['websocket'],
            });

            // Handle successful connection
            newSocket.on('connect', () => {
                console.log('Connected to tracer server:', newSocket.id);
                setIsConnected(true);
                
                // Subscribe to user events
                if (userId) {
                    newSocket.emit('event', userId);
                }

                toaster.success({
                    title: "Connected to tracer events",
                });
            });

            // Handle disconnection
            newSocket.on('disconnect', () => {
                console.log('Disconnected from tracer server');
                setIsConnected(false);
                
                toaster.info({
                    title: "Disconnected from tracer events",
                });
            });

            // Handle connection error
            newSocket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                toaster.error({
                    title: "Failed to connect to tracer events",
                    description: error.message,
                });
            });

            // Listen for tracer events from server
            newSocket.on('user_notification', (data) => {
                console.log('Received notification:', data);
                setEvents(prev => [...prev, { 
                    type: 'user_notification', 
                    data, 
                    timestamp: new Date() 
                }]);
                // Call custom handlers
                const handlers = eventHandlersRef.current.get('user_notification') || [];
                handlers.forEach(handler => handler(data));
            });

            newSocket.on('message_received', (data) => {
                console.log('Received message:', data);
                setEvents(prev => [...prev, { 
                    type: 'message_received', 
                    data, 
                    timestamp: new Date() 
                }]);
                // Call custom handlers
                const handlers = eventHandlersRef.current.get('message_received') || [];
                handlers.forEach(handler => handler(data));
            });

            newSocket.on('status_update', (data) => {
                console.log('Status updated:', data);
                setEvents(prev => [...prev, { 
                    type: 'status_update', 
                    data, 
                    timestamp: new Date() 
                }]);
                // Call custom handlers
                const handlers = eventHandlersRef.current.get('status_update') || [];
                handlers.forEach(handler => handler(data));
            });

            newSocket.on('tracer_update', (data) => {
                console.log('Tracer updated:', data);
                setEvents(prev => [...prev, { 
                    type: 'tracer_update', 
                    data, 
                    timestamp: new Date() 
                }]);
                // Call custom handlers
                const handlers = eventHandlersRef.current.get('tracer_update') || [];
                handlers.forEach(handler => handler(data));
            });

            setSocket(newSocket);
            socketRef.current = newSocket;

        } catch (error) {
            console.error('Error connecting to tracer events:', error);
            toaster.error({
                title: "Failed to connect to tracer events",
                description: error instanceof Error ? error.message : "Unknown error",
            });
        }
    };

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
            setSocket(null);
            setIsConnected(false);
        }
    };

    const sendEvent = (eventName: string, data: any) => {
        if (socket && isConnected) {
            socket.emit(eventName, data);
        } else {
            toaster.error({
                title: "Not connected",
                description: "Cannot send event - not connected to tracer server",
            });
        }
    };

    const clearEvents = () => {
        setEvents([]);
    };

    const addEventHandler = (eventType: TracerEvent['type'], handler: (data: any) => void) => {
        const handlers = eventHandlersRef.current.get(eventType) || [];
        handlers.push(handler);
        eventHandlersRef.current.set(eventType, handlers);
        
        return () => removeEventHandler(eventType, handler);
    };

    const removeEventHandler = (eventType: TracerEvent['type'], handler: (data: any) => void) => {
        const handlers = eventHandlersRef.current.get(eventType) || [];
        const filteredHandlers = handlers.filter(h => h !== handler);
        eventHandlersRef.current.set(eventType, filteredHandlers);
    };

    const on = (eventType: TracerEvent['type'], handler: (data: any) => void) => {
        return addEventHandler(eventType, handler);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    return {
        socket,
        isConnected,
        events,
        connect,
        disconnect,
        sendEvent,
        clearEvents,
        addEventHandler,
        removeEventHandler,
        on,
    };
};