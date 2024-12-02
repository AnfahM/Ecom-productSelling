import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Common.css'; // Assuming this contains shared styles
import config from '../../config';

function LoginPage({ setLoggedInUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/login/`, {
        email,
        password,
      });

      const { user, access, refresh } = response.data;

      // Store access and refresh tokens in local storage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Store the logged-in user data for future use
      localStorage.setItem('user', JSON.stringify(user));

      // Store the customer ID properly
      localStorage.setItem('customer_id', user.id); 

      // Check if the user is a customer or admin based on the 'customer' field
      if (user.customer) {
        setLoggedInUser({ username: user.username, role: 'customer' });
        navigate('/'); // Navigate to customer home page
      } else {
        setLoggedInUser({ username: user.username, role: 'admin' });
        navigate('/dashboard'); // Navigate to admin dashboard
      }
    } catch (error) {
      console.error('Login error:', error.response.data);
      setErrorMessage('Username or password is incorrect. Please try again.'); // Set the error message
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}

          <button className="auth-button" type="submit">
            Login
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register Now</Link>
          </p>
          <p>
            Go back to <Link to="/">Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
