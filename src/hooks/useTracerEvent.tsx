"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import server from '@/constants/server';

const SERVER_URL = server.SERVER_API_URL;

interface TracerEvent {
    type: 'user_notification' | 'message_received' | 'status_update' | 'tracer_update';
    data: any;
    timestamp: Date;
}

interface TracerEventPayload {
    userId?: string;
}

export const useTracerEvent = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [events, setEvents] = useState<TracerEvent[]>([]);
    const socketRef = useRef<Socket | null>(null);

    // Simple connect function
    const connect = useCallback(({ userId }: TracerEventPayload) => {
        // Disconnect existing socket if any
        if (socketRef.current?.connected) {
            socketRef.current.disconnect();
        }

        try {
            // Create new socket connection
            const newSocket = io(SERVER_URL, {
                transports: ['websocket'],
                autoConnect: true,
            });

            // Handle connection events
            newSocket.on('connect', () => {
                console.log('Connected to tracer server:', newSocket.id);
                setIsConnected(true);
                
                // Subscribe to user events
                if (userId) {
                    newSocket.emit('subscribe', userId);
                }
            });

            newSocket.on('disconnect', () => {
                console.log('Disconnected from tracer server');
                setIsConnected(false);
            });

            newSocket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                setIsConnected(false);
            });

            // Listen for events and add to events array
            const eventTypes = ['user_notification', 'message_received', 'status_update', 'tracer_update'];
            
            eventTypes.forEach(eventType => {
                newSocket.on(eventType, (data) => {
                    console.log(`Received ${eventType}:`, data);
                    setEvents(prev => [...prev.slice(-99), { // Keep only last 100 events
                        type: eventType as TracerEvent['type'],
                        data,
                        timestamp: new Date()
                    }]);
                });
            });

            socketRef.current = newSocket;

        } catch (error) {
            console.error('Error connecting to tracer events:', error);
            setIsConnected(false);
        }
    }, []);

    // Simple disconnect function
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, []);

    // Clear events
    const clearEvents = useCallback(() => {
        setEvents([]);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    return {
        isConnected,
        events,
        connect,
        disconnect,
        clearEvents,
    };
};