import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`, {}, {
                withCredentials: true
            });
            navigate('/login')
        } catch (error) {
            console.error('Logout error: ', error)
        }
    }

    return (
        <button onClick={handleLogout}>Log Out</button>
    );
}

export default LogoutButton;