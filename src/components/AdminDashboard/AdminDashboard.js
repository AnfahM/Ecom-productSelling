import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import './AdminDashboard.css'; // Import the CSS
import config from '../../config';
import Chart from 'chart.js/auto';
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register scales and components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // To track if the data is loaded
  const chartRef = useRef(null); // To track the chart instance

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the access token from localStorage
        const token = localStorage.getItem('access_token');

        // Make the request with the Authorization header
        const response = await axios.get(`${config.API_BASE_URL}/adminside/dashboard-data/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });

        const { total_customers, total_products } = response.data;
        setUserCount(total_customers); // Set total_customers to userCount
        setProductCount(total_products); // Set total_products to productCount
        setIsDataLoaded(true); // Data is loaded, we can now render the chart
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Handle error, possibly token expired or invalid
      }
    };

    fetchData();

    // Store chartRef in a variable to ensure it's stable during cleanup
    const currentChartRef = chartRef.current;

    // Cleanup to prevent chart instance reuse
    return () => {
      if (currentChartRef) {
        currentChartRef.destroy(); // Destroy the chart instance on component unmount
      }
    };
  }, []);

  const data = {
    labels: ['Users', 'Products'],
    datasets: [
      {
        label: 'Count',
        data: [userCount, productCount],
        backgroundColor: ['#36A2EB', '#FF6384'], // Colors for the bars
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            // Customize the tooltip to show counts in a nice format
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="chart-container">
        {/* Render the chart only if the data is loaded */}
        {isDataLoaded ? (
          <Bar data={data} options={options} ref={chartRef} />
        ) : (
          <p>Loading data...</p> // Show loading message until data is fetched
        )}
      </div>
      
    </div>
  );
};

export default Dashboard;
