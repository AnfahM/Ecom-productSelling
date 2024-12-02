import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sell.css';
import config from '../../config';

function Sell() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // For image thumbnails
  const [coverImageIndex, setCoverImageIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/adminside/categories/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length <= 5) {
      setImages(selectedFiles);

      // Generate image previews
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    } else {
      alert('You can only upload up to 5 images.');
    }
  };

  const handleCoverImageSelect = (index) => {
    setCoverImageIndex(index);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('access_token');
    const customerId = localStorage.getItem('customer_id');

    if (!token || !customerId) {
      alert('User not authenticated. Please log in.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('price', price);
      formData.append('phone_number', phone);
      formData.append('description', description);
      formData.append('customer', parseInt(customerId, 10));

      // Ensure category is added as an integer
      formData.append('category', parseInt(selectedCategory, 10));

      images.forEach((image) => {
        formData.append('images', image);
      });

      if (coverImageIndex !== null) {
        formData.append('cover_image', images[coverImageIndex]);
      } else if (images.length > 0) {
        formData.append('cover_image', images[0]);
      }

      await axios.post(`${config.API_BASE_URL}/api/sell/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowPopup(true);
    } catch (error) {
      console.error('There was an error submitting the product:', error.response?.data || error.message);
      alert('Error submitting the product. Please check the inputs and try again.');
    }
  };

  const handlePopupOk = () => {
    setShowPopup(false);
    window.location.reload();
  };

  return (
    <div className="sell-container">
      <h2>Sell Your Product</h2>
      <form className="sell-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Upload Images (up to 5):</label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div className="preview-images">
            {imagePreviews.length > 0 &&
              imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview} alt={`Preview ${index}`} />
                  <label>
                    <input
                      type="radio"
                      name="coverImage"
                      checked={coverImageIndex === index}
                      onChange={() => handleCoverImageSelect(index)}
                    />
                    Set as Cover Image
                  </label>
                </div>
              ))}
          </div>
        </div>

        <button type="submit">Submit Product</button>
      </form>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Product Submitted Successfully!</h3>
            <button onClick={handlePopupOk}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sell;
