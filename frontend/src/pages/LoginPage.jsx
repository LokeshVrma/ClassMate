import React, { useState } from "react";
import InputField from "../components/InputField";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const customStyle = {
    marginTop: 10 + "px", // Adjust margin for desired top position
    display: "flex", // Enable Flexbox
    alignItems: "center", // Center vertically
    justifyContent: "center", // Center horizontally
  };

function LoginPage() {
    document.title = "Login";

    // State for form data and error message
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
                email,
                password
            }, {
                withCredentials: true   // Send cookies to the server
            });

            // If login is successfull
            navigate('/');
        }
        catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message)
            } else {
                setError('An unexpected error occured.')
            }
        }
    };

    return (
        <div className="auth-container">
            <br />
            <br />
            <br />
            <div className="branding-container" style={customStyle}>
                <p className="branding">ClassMate</p>
                <div className="branding-content">
                    <h1>Get Started with Us</h1>
                    <p>Complete these steps to register your account</p>
                </div>
            </div>
            <div className="form-container">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h1>Please Log In</h1>
                    <p className="desc">Enter your email and password to start using ClassMate.</p>
                    <div className="signup-buttons">
                        <button>Google</button>
                        <button>Github</button>
                    </div>
                    <div className="or-container">
                        <div className="line"></div>
                        Or
                        <div className="line"></div>
                    </div>

                    <InputField
                     label={"Email"}
                     type={"email"}
                     placeholder={"name@gmail.com"}
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                    />

                    <InputField
                     label={"Password"}
                     type={"password"}
                     placeholder={"Enter your password"}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="input-group-single">
                        <button className="submit-button" type="submit">Log In</button>
                    </div>
                    <p className="already-account">Don't have an account? <a href="/register">Register Now!</a></p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;