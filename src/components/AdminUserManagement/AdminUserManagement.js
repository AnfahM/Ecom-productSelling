import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminUserManagement.css';
import config from '../../config';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();  // Initialize the hook for navigation

  // Fetch data from the API when component loads
  useEffect(() => {
    axios.get(`${config.API_BASE_URL}/adminside/customers/`)
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(e.target.value);
  
    const filtered = users.filter(user => {
      const name = user.username ? user.username.toLowerCase() : '';
      const email = user.email ? user.email.toLowerCase() : '';
      return name.includes(searchTerm) || email.includes(searchTerm);
    });
    setFilteredUsers(filtered);
  };

  // Handle navigation to customer details page
  const handleCustomerInfo = (userId) => {
    navigate(`/AdminCustomerDetails/${userId}`); // Redirect to customer detail page with user ID
  };

  return (
    <div className="admin-user-management">
      <h1>User Management</h1>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
      />

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Sl. No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone_number}</td>
                <td>
                  <button onClick={() => handleCustomerInfo(user.id)}>Info</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagement;
