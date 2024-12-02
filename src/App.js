import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CustomerNavbar from './components/Navbar/CustomerNavbar';
import AdminNavbar from './components/Navbar/AdminNavbar'; // Import the admin navbar
import ProductList from './components/ProductList/ProductList';
import ProductDetails from './components/ProductDetails/ProductDetails';
import LoginPage from './components/LoginAndRegister/Login';
import RegisterPage from './components/LoginAndRegister/Register';
import Sell from './components/SellingProducts/Sell';
import MyProducts from './components/MyProductListing/MyProduct';
import Dashboard from './components/AdminDashboard/AdminDashboard'; // Import the Dashboard component
import AdminUserManagement from './components/AdminUserManagement/AdminUserManagement';
import CustomerDetail from './components/AdminCustomerDetails/AdminCustomerDetails';  // Import CustomerDetail component
import AdminCategoryHandle from './components/AdminCategoryHandle/AdminCategoryHandle';
import LocationSelector from './components/LocationHandler/LocationHandler';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
    setIsLoading(false); // Stop loading after user data is loaded
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }, [loggedInUser]);

  const renderNavbar = () => {
    if (!shouldShowNavbar || isLoading) return null;

    if (loggedInUser?.role === 'customer') {
      return <CustomerNavbar onLogout={() => setLoggedInUser(null)} />;
    }

    if (loggedInUser?.role === 'admin') {
      return <AdminNavbar onLogout={() => setLoggedInUser(null)} />;
    }

    return <Navbar />;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {renderNavbar()}
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route
          path="/login"
          element={<LoginPage setLoggedInUser={setLoggedInUser} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/myproducts" element={<MyProducts />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/AdminUserManagement" element={<AdminUserManagement />} />
        {/* Add route for Customer Details */}
        <Route path="/AdminCustomerDetails/:customerId" element={<CustomerDetail />} />  {/* New Route */}
        <Route path="/AdminCategoryHandle" element={<AdminCategoryHandle />} />
        <Route path="/LocationSelector" element={<LocationSelector />} />
      </Routes>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );  
}

export default AppWithRouter;
