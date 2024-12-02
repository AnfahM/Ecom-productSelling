import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import './AdminCustomerDetails.css'

const CustomerDetail = () => {
  const { customerId } = useParams();  // Get customer ID from URL
  const [customer, setCustomer] = useState(null);  // State to hold customer data
  const [products, setProducts] = useState([]);    // State to hold customer's products
  const [loading, setLoading] = useState(false);   // State for delete process loading
  const navigate = useNavigate();                  // Hook to programmatically navigate

  // Fetch customer details and their products
  useEffect(() => {
    axios.get(`${config.API_BASE_URL}/adminside/customers/${customerId}/`)
      .then(response => {
        setCustomer(response.data.customer);
        setProducts(response.data.products);
      })
      .catch(error => {
        console.error("Error fetching customer details: ", error);
      });
  }, [customerId]);

  // Function to delete customer and their products
  const handleDeleteCustomer = async () => {
    if (window.confirm(`Are you sure you want to delete ${customer.username} and all their products?`)) {
      try {
        setLoading(true);
        await axios.delete(`${config.API_BASE_URL}/adminside/customers/${customerId}/`);
        setLoading(false);
        alert('Customer and their products have been deleted.');
        navigate('/AdminUserManagement'); // Redirect to customer list or another page after deletion
      } catch (error) {
        setLoading(false);
        console.error('Error deleting customer: ', error);
        alert('An error occurred while deleting the customer.');
      }
    }
  };

  return (
    <div className='admin-customer-main'>
      {customer ? (
        <>
          <h2>{customer.username}'s Details</h2>
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone_number}</p>

          <h3>Products Posted by {customer.username}</h3>
          {products.length > 0 ? (
            <ul>
              {products.map(product => (
                <li key={product.id}>
                  {product.name} - ${product.price}
                </li>
              ))}
            </ul>
          ) : (
            <p>No products found</p>
          )}

          {/* Delete Button */}
          <button 
            onClick={handleDeleteCustomer} 
            disabled={loading}  // Disable button while deleting
            style={{ backgroundColor: 'red', color: 'white', padding: '10px', marginTop: '20px' }}>
            {loading ? 'Deleting...' : 'Delete Customer and Products'}
          </button>
        </>
      ) : (
        <p>Loading customer details...</p>
      )}
    </div>
  );
};

export default CustomerDetail;
