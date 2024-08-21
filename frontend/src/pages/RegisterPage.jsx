import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fa1, fa2, fa3 } from '@fortawesome/free-solid-svg-icons';
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPage() {
    document.title = "Register | ClassMate"

    // State for form data and error message
    const [name, setName] = useState('');
    const [studentID, setStudentID] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, {
                name,
                studentID,
                email,
                password
            });

            // If register is successfull
            toast.success(response.data.message, {theme: "colored"})
            setTimeout(() => navigate('/login'), 6000);
           }
        catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message)
            } else {
                setError('An unexpected error occured.')
                toast.error('An unexpected error occurred.');
            }
        }
    }

    return (
        <div className="auth-container">
            <div className="branding-container">
                <p className="branding">ClassMate</p>
                <div className="branding-content">
                    <h1>Get Started with Us</h1>
                    <p>Complete these steps to register your account</p>
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
                    <div className="signup-buttons">
                        <button>Google</button>
                        <button>Github</button>
                    </div>
                    <div className="or-container">
                        <div className="line"></div>
                        Or
                        <div className="line"></div>
                    </div>

                    <div className="row-1">
                        <InputField
                         label={"Name"}
                         type={"text"}
                         placeholder={"Name"}
                         value={name}
                         onChange={(e) => setName(e.target.value)} 
                        />
                        <InputField
                         label={"Student ID"}
                         type={"text"}
                         placeholder={"Unique ID"}
                         value={studentID}
                         onChange={(e) => setStudentID(e.target.value)}
                        />
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

                    <p className="password-desc">Must be at least 8 characters.</p>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="input-group-single">
                        <button className="submit-button" type="submit">Sign Up</button>
                    </div>
                    <p className="already-account">Already have an account? <a href="/login">Log In</a></p>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default RegisterPage;
