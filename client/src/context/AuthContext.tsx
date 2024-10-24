// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
    user: { email: string; id: string } | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ email: string; id: string } | null>(null);

    // Rehydrate user from localStorage when the app loads
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        const userData = { email, id: response.data.userId };
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData)); // Save email and userId in localStorage

        // Update user state
        setUser(userData);
    };

    const register = async (email: string, password: string) => {
        await axios.post('http://localhost:5000/api/auth/register', { email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Clear user info from localStorage
        setUser(null); // Reset user state
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
