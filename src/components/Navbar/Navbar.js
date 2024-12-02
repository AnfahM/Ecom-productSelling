import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import config from '../../config';

function Navbar() {
  const [logoUrl, setLogoUrl] = useState(null); // State to store the logo URL

  // Fetch logo from API when the component mounts
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/logo/view/`);
        if (response.data && response.data.image) {
          setLogoUrl(response.data.image); // Set the logo URL from the response
        }
      } catch (error) {
        console.error('Error fetching the logo:', error);
      }
    };

    fetchLogo(); // Call the fetchLogo function
  }, []);

  return (
    <nav className="navbar main-navbar">
      <div className="logo main-navbar-logo-handling">
        <Link to="/">
          {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" className="navbar-logo" />
          ) : (
            <h2>Your Logo</h2>
          )}
        </Link>
      </div>
      <div className="login">
        <Link to="/login"><button className='main-page-navbar-btn'><b>Login</b></button></Link>
      </div>
    </nav>
  );
}

export default Navbar;
