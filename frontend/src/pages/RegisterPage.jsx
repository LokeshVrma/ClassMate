import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fa1, fa2, fa3 } from '@fortawesome/free-solid-svg-icons';
import InputField from "../components/InputField";
import axios from "axios";
import '../assets/styles/Auth.css';
import OTPModal from '../components/OTPModal';

// Conditional styling based on screen width
const customStyle = window.innerWidth < 768 ? {
    marginTop: 80 + "px", // Adjust margin for smaller screens
    display: "flex", // Enable Flexbox layout
    alignItems: "center", // Center items vertically
    justifyContent: "center", // Center items horizontally
} : {};

function RegisterPage() {
    // Set the document title
    document.title = "Register | ClassMate";

    // State hooks for form data and error message
    const [name, setName] = useState(''); // State for name input
    const [studentID, setStudentID] = useState(''); // State for student ID input
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(''); // State for error messages
    const [showOTPModal, setShowOTPModal] = useState(false); // State to control OTP modal visibility
    const [userId, setUserId] = useState(''); // State to store user ID from response

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Validate password length
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        try {
            // Send registration request to the server
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, {
                name,
                studentID,
                email,
                password
            });

            // On successful registration
            setUserId(response.data.userId); // Set user ID from response
            setShowOTPModal(true); // Show OTP modal
        }
        catch (error) {
            // Handle errors and set appropriate error message
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    }

    return (
        <div className="auth-container">
            <div className="intro-container" style={customStyle}>
                <p className="branding">ClassMate</p>
                <div className="intro-content">
                    <h1>Get Started with Us</h1>
                    <p>Complete these steps to register your account</p>
                    {/* Steps for registration process */}
                    <div className="card">
                        <div className="step-icon-wrapper">
                            <FontAwesomeIcon icon={fa1} className="step-icon" />
                        </div>
                        <span className="card-text">Sign up your account</span>
                    </div>
                    <div className="card">
                        <div className="step-icon-wrapper">
                            <FontAwesomeIcon icon={fa2} className="step-icon" />
                        </div>
                        <span className="card-text">Verify your email</span>
                    </div>
                    <div className="card">
                        <div className="step-icon-wrapper">
                            <FontAwesomeIcon icon={fa3} className="step-icon" />
                        </div>
                        <span className="card-text">Start using ClassMate</span>
                    </div>
                </div>
            </div>

            <div className="form-container">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h1>Sign Up Account</h1>
                    <p className="desc">Enter your personal data to create your account.</p>

                    <div className="row-1">
                        {/* Input fields for name and student ID */}
                        <InputField
                            label={"Name"} // Label for name input field
                            type={"text"} // Input type for text
                            placeholder={"Name"} // Placeholder text for name input
                            value={name} // Value of the name input field
                            onChange={(e) => setName(e.target.value)} // Update name state on change
                        />
                        <InputField
                            label={"Student ID"} // Label for student ID input field
                            type={"text"} // Input type for text
                            placeholder={"Unique ID"} // Placeholder text for student ID input
                            value={studentID} // Value of the student ID input field
                            onChange={(e) => setStudentID(e.target.value)} // Update student ID state on change
                        />
                    </div>

                    {/* Input fields for email and password */}
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

                    <p className="password-desc">Must be at least 8 characters.</p>
                    {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
                    <div className="input-group-single">
                        <button className="submit-button" type="submit">Sign Up</button> {/* Submit button for form */}
                    </div>
                    <p className="already-account">
                        Already have an account? 
                        {/* Link to login page */}
                        <a href="/login">Log In</a>
                    </p>
                </form>
            </div>
            {/* Render OTP Modal if showOTPModal state is true */}
            {showOTPModal && (
                <OTPModal 
                    userId={userId} // Pass user ID to OTPModal
                    setShowOTPModal={setShowOTPModal} // Function to close OTPModal
                    verifyUrl={`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify`} // URL for OTP verification
                    successRedirect="/"  // Redirect URL on successful OTP verification
                />
            )}
        </div>
    );
}

export default RegisterPage;
