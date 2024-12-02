import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Common.css'; // Add this for shared styles
import config from '../../config';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/register/`, {
        username: name, // Adjust according to your API requirements
        email,
        phone_number: phone,
        password,
      });

      const result = response.data; // Store result
      setSuccess("Registration successful!"); // Set success message
      // Optionally, you could redirect the user or clear the form here
      console.log(result);
    } catch (error) {
      console.error('Registration error:', error.response.data);
      setError("Registration failed. Please try again."); // Set error message
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create an Account</h2>
        <p>Join us for the best experience</p>
        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-button" type="submit">Register</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <p className="auth-footer">
          Go back to <Link to="/">Home</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
