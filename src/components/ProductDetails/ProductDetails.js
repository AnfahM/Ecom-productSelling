import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ProductDetails.css';
import config from '../../config';

function ProductDetails() {
  const { id } = useParams(); // Extract product ID from URL params
  const [product, setProduct] = useState(null); // State to hold product details
  const [loading, setLoading] = useState(true); // State to show loading spinner
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/All-products/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data); // Set the fetched data directly
        setLoading(false); // Disable loading state after data fetch
      } catch (error) {
        setError('Product not found or there was an error fetching the data.');
        setLoading(false); // Disable loading even on error
      }
    };

    fetchProductDetails(); // Fetch product details on component mount
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Display while loading data
  }

  if (error) {
    return <div>{error}</div>; // Display error message if there's an error
  }

  if (!product) {
    return <div>Product not found</div>; // Display if no product is found
  }

  return (
    <div className="product-details-container">
      <div className="carousel-container">
        <Carousel showThumbs={false} infiniteLoop autoPlay>
          {product.product_images && product.product_images.length > 0 ? (
            product.product_images.map((image, index) => (
              <div key={index}>
                <img src={image.image} alt={product.name} />
              </div>
            ))
          ) : (
            <p>No images available for this product</p>
          )}
        </Carousel>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p><strong>Price:</strong> ₹{product.price}</p>
        <div className="more-details-section">
          <h4>More Details</h4>
          <div className="more-details-box">
            <p>{product.description}</p>
          </div>
        </div>
        <p><strong>Contact:</strong> {product.phone_number}</p>
      </div>
    </div>
  );
}

export default ProductDetails;
