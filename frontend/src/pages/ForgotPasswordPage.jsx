import React, { useState } from 'react';
import axios from 'axios';
import '../assets/styles/Auth.css';
import InputField from '../components/InputField';
import OTPModal from '../components/OTPModal';

// Conditional style based on screen width
const customStyle = window.innerWidth < 768 ? {
  marginTop: 80 + "px", // Adjust margin for smaller screens
  display: "flex", // Enable Flexbox layout
  alignItems: "center", // Center items vertically
  justifyContent: "center", // Center items horizontally
} : {
  marginTop: 10 + "px", // Adjust margin for larger screens
  display: "flex", // Enable Flexbox layout
  alignItems: "center", // Center items vertically
  justifyContent: "center", // Center items horizontally
};

const ForgotPassword = () => {
  document.title = "Forgot Password | ClassMate";

  const [email, setEmail] = useState(''); // State for email input
  const [error, setError] = useState(''); // State for error messages
  const [showOTPModal, setShowOTPModal] = useState(false); // State to control OTP modal visibility
  const [userId, setUserId] = useState(''); // State to store user ID from response
  const [loading, setLoading] = useState(false); // State to control button text

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/forgot-password`, {
        email
      });

      setUserId(response.data.userId);
      setLoading(false); // Set loading state to false
      setShowOTPModal(true); // Show OTP modal
    } catch (error) {
      setLoading(false); // Set loading state to false
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className='auth-container'>
      <div className='intro-container' style={customStyle}>
        <p className="branding">ClassMate</p>
        <div className="intro-content">
          <h1>Forgot Password</h1>
          <p>Enter your email address to reset your password.</p>
        </div>
      </div>

      <div className='form-container'>
        <form className='auth-form' onSubmit={handleSubmit}>
          <h1>Reset Now</h1>
          <p className="desc">Enter your email to reset your password.</p>
          <InputField
            label={'Enter your email'}
            type={'email'}
            value={email}
            placeholder={'name@gmail.com'}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p style={{ color: 'red'}}>{error}</p>}
          <div className='input-group-single'>
            <button className='submit-button' type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
          <p className="already-account">Don't have an account? <a href="/register">Register Now!</a></p>
        </form>
      </div>

      {showOTPModal && (
        <OTPModal 
          userId={userId}
          setShowOTPModal={setShowOTPModal}
          verifyUrl={`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-otp`}
          successRedirect={`/reset-password/${userId}`}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
