import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import './Navbar.css';

function CustomerNavbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null); // State to store the fetched logo URL
  const navigate = useNavigate();

  // Fetch logo from API when the component mounts
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Get the stored token

        // Use the API_BASE_URL from config
        const response = await axios.get(`${config.API_BASE_URL}/api/logo/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header with the token
          },
        });

        if (response.data && response.data.image) {
          setLogoUrl(response.data.image); // Set the logo URL from the response
        }
      } catch (error) {
        console.error('Error fetching the logo:', error);
      }
    };

    fetchLogo(); // Call the fetchLogo function
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('access_token');
    onLogout();
    navigate('/');
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar customer-navbar">
        <div className="logo">
          <Link to="/">
            {logoUrl ? (
              <img src={logoUrl} alt="Company Logo" className="navbar-logo" />
            ) : (
              "Your Logo"
            )}
          </Link>
        </div>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`} style={{ marginRight: '40px' }}>
          <Link to="/" onClick={handleNavClick}><b>Products</b></Link>
          <Link to="/sell" onClick={handleNavClick}><b>Sell</b></Link>
          <Link to="/myproducts" onClick={handleNavClick}><b>My Products</b></Link>
          <button onClick={handleLogoutClick} className="logout-button"><b>Logout</b></button>
        </div>

        <button className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>

      {showLogoutModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to log out?</h3>
            <div className="modal-actions">
              <button onClick={confirmLogout}>Confirm</button>
              <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerNavbar;
