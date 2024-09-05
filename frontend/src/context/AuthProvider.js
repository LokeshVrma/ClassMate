import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return JSON.parse(localStorage.getItem('isAuthenticated')) || false;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const storedAuthStatus = JSON.parse(localStorage.getItem('isAuthenticated'));

            if (storedAuthStatus) {
                try {
                    // Here you may want to verify the token or rely on the saved state
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error checking authentication:', error);
                    setIsAuthenticated(false);
                    localStorage.removeItem('isAuthenticated');
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setIsAuthenticated(true);
                localStorage.setItem('isAuthenticated', JSON.stringify(true));
            }
        } catch (error) {
            console.error('Login failed:', error);
            setIsAuthenticated(false);
            localStorage.removeItem('isAuthenticated');
            throw new Error('Login failed');
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
            setIsAuthenticated(false);
            localStorage.removeItem('isAuthenticated');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
