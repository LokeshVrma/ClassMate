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
  // Set the document title
  document.title = "Forgot Password | ClassMate"

  // State hooks for form data and UI
  const [email, setEmail] = useState(''); // State for email input
  const [error, setError] = useState(''); // State for error messages
  const [showOTPModal, setShowOTPModal] = useState(false); // State to control OTP modal visibility
  const [userId, setUserId] = useState(''); // State to store user ID from response

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      // Make API request to send password reset email
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/forgot-password`, {
        email
      });

      // On successful response, show OTP modal
      setUserId(response.data.userId);
      setShowOTPModal(true);
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
    <div className='auth-container'>
      <div className='branding-container' style={customStyle}>
        <p className="branding">ClassMate</p>
        <div className="branding-content">
          <h1>Forgot Password</h1>
          <p>Enter your email address to reset your password.</p>
        </div>
      </div>

      <div className='form-container'>
        <form className='auth-form' onSubmit={handleSubmit}>
          <h1>Reset Now</h1>
          <p className="desc">Enter your email to reset your password.</p>
          <InputField
            label={'Enter your email'} // Label for the input field
            type={'email'} // Input type for email
            value={email} // Value of the input field
            placeholder={'name@gmail.com'} // Placeholder text for the input field
            onChange={(e) => setEmail(e.target.value)} // Update email state on change
          />
          
          {error && <p style={{ color: 'red'}}>{error}</p> } {/* Display error message if any */}
          <div className='input-group-single'>
            <button className='submit-button' type="submit">Send OTP</button> {/* Submit button */}
          </div>
          <p className="already-account">Don't have an account? <a href="/register">Register Now!</a></p> {/* Link to registration page */}
        </form>
      </div>
      {/* Render OTP Modal if showOTPModal state is true */}
      {showOTPModal && (
        <OTPModal 
          userId={userId} // Pass userId to OTPModal
          setShowOTPModal={setShowOTPModal} // Function to close OTPModal
          verifyUrl={`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-otp`} // URL for OTP verification
          successRedirect={`/reset-password/${userId}`} // Redirect URL on successful OTP verification
        />
      )}
    </div>
  )
};

export default ForgotPassword;
