import React, { useState } from "react";
import InputField from "../components/InputField";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../assets/styles/Auth.css';

// Style for the branding container
const customStyle = {
    marginTop: 10 + "px", // Adjust margin for desired top position
    display: "flex", // Enable Flexbox layout
    alignItems: "center", // Center items vertically
    justifyContent: "center", // Center items horizontally
};

function LoginPage() {
    // Set the document title
    document.title = "Login | ClassMate";

    // State hooks for form data and error message
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(''); // State for error messages

    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        try {
            // Send login request to the server
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
                email,
                password
            }, {
                withCredentials: true   // Send cookies with the request
            });

            // If login is successful, navigate to the home page
            navigate('/');
        }
        catch (error) {
            console.log("Error response:", error.response); // Log error response for debugging
            if (error.response && error.response.data) {
                // Set error message from server response
                setError(error.response.data.message);
            } else {
                // Set a generic error message
                setError('An unexpected error occurred.');
            }
        }
    };

    // Handle forgot password redirection
    const handleForgotPassword = () => {
        // Redirect to forgot password page
        navigate('/forgot-password');
    };

    return (
        <div className="auth-container">
            {/* Adding spacing for layout */}
            <br />
            <br />
            <br />
            <div className="branding-container" style={customStyle}>
                <p className="branding">ClassMate</p>
                <div className="branding-content">
                    <h1>Welcome Back</h1>
                    <p>Your gateway to ClassMate</p>
                </div>
            </div>
            <div className="form-container">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h1>Please Log In</h1>
                    <p className="desc">Enter your email and password to start using ClassMate.</p>

                    <InputField
                     label={"Email"} // Label for email input field
                     type={"email"} // Input type for email
                     placeholder={"name@gmail.com"} // Placeholder text for email input
                     value={email} // Value of the email input field
                     onChange={(e) => setEmail(e.target.value)} // Update email state on change
                    />

                    <InputField
                     label={"Password"} // Label for password input field
                     type={"password"} // Input type for password
                     placeholder={"Enter your password"} // Placeholder text for password input
                     value={password} // Value of the password input field
                     onChange={(e) => setPassword(e.target.value)} // Update password state on change
                    />

                    {/* Display error message if there is an error */}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <p className="forgot-password">
                        Forgot your password? 
                        {/* Button to navigate to forgot password page */}
                        <button onClick={handleForgotPassword}>Reset it</button>
                    </p>

                    <div className="input-group-single">
                        <button className="submit-button" type="submit">Log In</button> {/* Submit button for form */}
                    </div>
                    <p className="already-account">
                        Don't have an account? 
                        {/* Link to registration page */}
                        <a href="/register">Register Now!</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
