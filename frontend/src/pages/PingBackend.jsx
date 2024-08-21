import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PingBackend = () => {
  const [status, setStatus] = useState('Checking...');
  const [error, setError] = useState(null);

  const checkBackend = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/ping`);
      setStatus(`Backend is up and running.`);
      setError(null);
    } catch (err) {
      setStatus('Backend is down');
      setError(err.message);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
      color: '#333',
      fontFamily: 'Poppins, Arial, sans-serif',
      textAlign: 'center',
      animation: 'fadeIn 1s ease-out',
    },
    header: {
      fontSize: '2.5rem',
      marginBottom: '1.5rem',
      fontWeight: 600,
      animation: 'fadeIn 1.5s ease-out',
    },
    status: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      padding: '1rem',
      borderRadius: '8px',
      width: '80%',
      maxWidth: '500px',
      animation: 'fadeIn 2s ease-out',
    },
    success: {
      color: '#4caf50',
      backgroundColor: '#e8f5e9',
      border: '1px solid #4caf50',
    },
    error: {
      color: '#f44336',
      backgroundColor: '#ffebee',
      border: '1px solid #f44336',
    },
    errorMessage: {
      marginTop: '1rem',
      fontSize: '1rem',
      animation: 'fadeIn 2.5s ease-out',
    },
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Backend Connectivity Check</h1>
      <div
        style={{
          ...styles.status,
          ...(error ? styles.error : styles.success),
        }}
      >
        {status}
      </div>
      {error && <div style={styles.errorMessage}>Error: {error}</div>}
    </div>
  );
};

export default PingBackend;
