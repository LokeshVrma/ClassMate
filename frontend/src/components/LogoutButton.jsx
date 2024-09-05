import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthProvider";

function LogoutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error: ', error);
        }
    }

    return (
        <button onClick={handleLogout}>Log Out</button>
    );
}

export default LogoutButton;
