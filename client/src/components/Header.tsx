// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../content/Header.css';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-orange-500 p-5 shadow-lg">
            <nav className="container mx-auto flex justify-between items-center">
                <div className="text-white text-2xl font-bold">
                    <h1>Park Center</h1>
                </div>
                <ul className="flex space-x-6 text-white">
                    <li>
                        <Link to="/parks" className="hover:text-gray-200">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/create" className="hover:text-gray-200">
                            Create Park
                        </Link>
                    </li>
                    {user ? (
                        <>
                            <li className="hover:text-gray-200">Welcome, {user.email}</li>
                            <li>
                                <button onClick={handleLogout} className="hover:text-gray-200">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="hover:text-gray-200">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="hover:text-gray-200">
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
