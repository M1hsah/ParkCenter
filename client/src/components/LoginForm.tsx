// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const { login,user } = useAuth();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    if (user) {
        const from = (location.state as any)?.from || '/';
        return <Navigate to={from} />;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required
            />
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Login
            </button>
        </form>
    );
};

export default LoginForm;
