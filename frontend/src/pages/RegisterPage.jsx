import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fa1, fa2, fa3 } from '@fortawesome/free-solid-svg-icons';
import InputField from "../components/InputField";

function RegisterPage() {
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
                <form className="auth-form">
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
                         placeholder={"Name"} 
                        />
                        <InputField
                         label={"Student ID"}
                         placeholder={"Unique ID"}
                        />
                    </div>

                    <InputField
                     label={"Email"}
                     type={"email"}
                     placeholder={"name@gmail.com"}
                    />

                    <InputField
                     label={"Password"}
                     type={"password"}
                     placeholder={"Enter your password"}
                    />

                    <p className="password-desc">Must be at least 8 characters.</p>

                    <div className="input-group-single">
                        <button className="submit-button" type="submit">Sign Up</button>
                    </div>
                    <p className="already-account">Already have an account? <a href="/login">Log In</a></p>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
