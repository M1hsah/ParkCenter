// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate , useLocation} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Make sure the path is correct
import IndexPage from './pages/IndexPage';
import CreateParkPage from './pages/CreateParkPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ParkDetailsPage from './pages/ParkDetailsPage';
import EditParkPage from './pages/EditParkPage';
import Header from './components/Header';

const App: React.FC = () => {
    return (
        <AuthProvider> {/* Ensure AuthProvider wraps the entire Router */}
            <Router>
                <div>
                    <Header />
                    <Routes>
                        <Route path="/parks" element={<IndexPage />} />
                        <Route 
                            path="/create" 
                            element={<PrivateRoute component={<CreateParkPage />} />} 
                        />
                        <Route path="/parks/:id" element={<ParkDetailsPage />} />
                        <Route 
                            path="/parks/:id/edit" 
                            element={<PrivateRoute component={<EditParkPage />} />} 
                        />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

// PrivateRoute component to handle the logic
const PrivateRoute = ({ component }: { component: JSX.Element }) => {
    const { user } = useAuth(); // Access user state from AuthContext
    const location = useLocation(); // Get the current location

    return user ? component : <Navigate to="/login" state={{ from: location }} />;
};

export default App;
