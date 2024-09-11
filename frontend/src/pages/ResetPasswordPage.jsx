import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/styles/Auth.css';
import InputField from '../components/InputField';

const ResetPasswordPage = () => {
  // Set the document title
  document.title = "Set New Password | ClassMate";

  // State hooks for form data and error message
  const { userId } = useParams();  // Extract userId from URL parameters
  const [password, setPassword] = useState(''); // State for new password input
  const [confirmPassword, setConfirmPassword] = useState(''); // State for password confirmation input
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Send reset password request to the server
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password`, {
        userId, // Include userId in request body
        password // Include new password in request body
      });

      // Redirect to login page on successful password reset
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      // Handle errors and display a generic error message
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="intro-container">
        <p className="branding">ClassMate</p> {/* Branding text */}
      </div>

      <div className="form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Set New Password</h1> {/* Form heading */}
          <p className="desc">Enter a new password for your account</p> {/* Form description */}
          
          {/* Input field for new password */}
          <InputField
            label={'Password'}
            type={'password'}
            value={password}
            placeholder={'Enter your password'}
            onChange={(e) => setPassword(e.target.value)} // Update password state on change
          />
          
          {/* Input field for password confirmation */}
          <InputField
            label={'Confirm Password'}
            type={'password'}
            value={confirmPassword}
            placeholder={'Confirm your password'}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state on change
          />
          
          {/* Display error message if any */}
          {error && <p style={{ color: 'red'}}>{error}</p>}
          
          <div className='input-group-single'>
            <button className='submit-button' type="submit">Reset Password</button> {/* Submit button for form */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
