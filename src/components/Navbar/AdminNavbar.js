import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Use the same stylesheet for consistency
import axios from 'axios'; // Import axios for API requests
import config from '../../config';

function AdminNavbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout confirmation modal
  const [showLogoModal, setShowLogoModal] = useState(false); // State for logo upload modal
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  const [logo, setLogo] = useState(null); // State to store the logo URL
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Fetch the existing logo from the backend
  useEffect(() => {
    const token = localStorage.getItem('access_token'); // Retrieve token

    axios.get(`${config.API_BASE_URL}/adminside/logo/`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the request headers
      },
    })
    .then(response => {
      setLogo(response.data.image); // Assuming 'image' is the key for the logo URL
    })
    .catch(error => {
      console.error('Error fetching logo:', error);
    });
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to show the logout confirmation modal
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Function to confirm logout
  const confirmLogout = () => {
    localStorage.removeItem('access_token'); // Clear the token from storage
    onLogout(); // Reset login state if necessary
    navigate('/'); // Redirect to the homepage
  };

  // Function to handle navigation and close the menu
  const handleNavClick = () => {
    setMenuOpen(false); // Close the menu when an option is selected
  };

  // Function to open the logo modal
  const handleLogoClick = () => {
    setShowLogoModal(true);
  };

  // Function to handle file change
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Set the selected file
  };

  // Function to submit the new logo
  const handleSubmitLogo = () => {
    if (!selectedFile) {
      console.error("No file selected");
      return; // If no file is selected, don't proceed
    }

    const formData = new FormData();
    formData.append('image', selectedFile); // Use the correct key ('image') for the backend to recognize

    const token = localStorage.getItem('access_token');

    axios.post(`${config.API_BASE_URL}/adminside/logo/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}` // Add the token to the request headers
      },
    })
    .then(response => {
      console.log('Logo uploaded successfully', response);
      setLogo(response.data.image); // Update the logo state with the new URL
      setShowLogoModal(false); // Close the modal after successful upload
      window.location.reload(); // Refresh the page
    })
    .catch(error => {
      console.error('Error uploading logo:', error);
      if (error.response) {
        console.error('Backend response:', error.response.data); // Log the backend response
      }
    });
  };

  // Function to delete the logo
  const handleDeleteLogo = () => {
    const token = localStorage.getItem('access_token');

    axios.delete(`${config.API_BASE_URL}/adminside/logo/`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the request headers
      },
    })
    .then(response => {
      console.log('Logo deleted successfully', response);
      setLogo(null); // Clear the logo state
      setShowLogoModal(false); // Close the modal
    })
    .catch(error => {
      console.error('Error deleting logo:', error);
    });
  };

  return (
    <>
      <nav className="navbar admin-navbar">
        <div className="logo" onClick={handleLogoClick}>
          <Link to="#">
            {logo ? <img src={logo} alt="Admin Logo" className="logo-image" /> : 'Admin Logo'}
          </Link>
        </div>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/dashboard" onClick={handleNavClick}><b>Dashboard</b></Link>
          <Link to="/AdminUserManagement" onClick={handleNavClick}><b>Users</b></Link>
          <Link to="/AdminCategoryHandle" onClick={handleNavClick}><b>category</b></Link>
          <button onClick={handleLogoutClick} className="logout-button logout-button-adminonly"><b>Logout</b></button>
        </div>

        <button className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>

      {/* Logo Upload Modal */}
      {showLogoModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Upload a New Logo</h3>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div className="modal-actions">
              <button onClick={handleSubmitLogo}>Submit</button>
              <button onClick={handleDeleteLogo}>Delete</button>
              <button onClick={() => setShowLogoModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
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

export default AdminNavbar;
