import React, { useState } from "react";
import axios from "axios";
import '../assets/styles/Auth.css';
import { useNavigate } from 'react-router-dom';

const OTPModal = ({ userId, setShowOTPModal, verifyUrl, successRedirect }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array to store OTP digits
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value) || value === '') { // Allow digits or empty input
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to next input if not the last one and value is entered
            if (index < otp.length - 1 && value) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '') {
            // Move focus to the previous input if current one is empty
            if (index > 0) {
                document.getElementById(`otp-${index - 1}`).focus();
            }
        } else if (e.key === 'Enter') {
            // Submit OTP when enter is pressed
            handleVerifyOtp();
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        try {
            const response = await axios.post(verifyUrl, { otp: otpString, userId: userId }, { withCredentials: true });

            if (response.status === 200) {
                setShowOTPModal(false);
                navigate(successRedirect);  // Redirect based on successRedirect prop
            } else {
                setError('OTP verification failed');
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            setError(error.response?.data?.message || 'OTP verification failed');
        }
    };

    return (
        <div className="otp-modal-overlay">
            <div className="otp-modal-content">
                <h2>Enter OTP</h2>
                <p>Please enter the OTP sent to your email to verify your account.</p>
                <div className="otp-input-container">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            value={digit}
                            onChange={(e) => handleOtpChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            maxLength="1"
                            className="otp-input"
                        />
                    ))}
                </div>
                <button className="verify-btn" onClick={handleVerifyOtp}>Verify OTP</button>
                {error && <p className="error-message">{error}</p>}
                <button className="cancel-btn" onClick={() => setShowOTPModal(false)}>Cancel</button>
            </div>
        </div>
    );
};

export default OTPModal;
