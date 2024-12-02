import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyProduct.css';
import config from '../../config';

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${config.API_BASE_URL}/api/my-products/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle delete confirmation
  const confirmDelete = (productId) => {
    setDeleteProductId(productId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const productId = deleteProductId;

      await axios.delete(`${config.API_BASE_URL}/api/products/${productId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product.id !== productId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle edit product
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handleSubmit = async () => {
    const productId = editingProduct?.id;

    if (!productId) {
      console.error('Product ID is undefined');
      return;
    }

    const formData = {
      name: editingProduct.name,
      price: editingProduct.price,
      description: editingProduct.description,
      phone_number: editingProduct.phone_number,
    };

    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`${config.API_BASE_URL}/api/products/${productId}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const updatedProducts = products.map((product) =>
        product.id === productId ? { ...editingProduct, id: productId } : product
      );
      setProducts(updatedProducts);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
    }
  };

  const closeModal = () => {
    setIsEditing(false);
  };

  // Handle image modal
  const openImageModal = (product) => {
    setSelectedProductImages(product.product_images);
    setCurrentProductId(product.id);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedProductImages([]);
  };

  // Handle changing cover photo
  const handleChangeCoverImage = async (imageId) => {
    try {
      const token = localStorage.getItem('access_token');

      // Sending the request
      await axios.post(
        `${config.API_BASE_URL}/api/products/${currentProductId}/set-cover/`,
        { image_id: imageId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Cover image set successfully');
      // Refresh products after setting the cover image
      fetchProducts();
    } catch (error) {
      console.error('Error setting cover image:', error.response?.data || error.message);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${config.API_BASE_URL}/api/products/images/${imageId}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedProductImages(selectedProductImages.filter((image) => image.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Handle image upload
  const handleUploadImage = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages(files);
  };

  const handleImageConfirm = async () => {
    const formData = new FormData();
    uploadedImages.forEach((file) => formData.append('images', file));

    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`${config.API_BASE_URL}/api/products/${currentProductId}/upload-images/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowImageModal(false);
      fetchProducts(); // Refresh products after uploading images
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div className="my-products-container">
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.cover_image}
              alt={product.name}
              onClick={() => openImageModal(product)}
            />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <p>{product.description}</p>
            <p>No: {product.phone_number}</p>
            <div className="product-actions">
              <button onClick={() => handleEditClick(product)}>Edit</button>
              <button onClick={() => confirmDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="modal">
          <div className="modal-content edit-modal-content">
            <h3>Edit Product</h3>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={editingProduct.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Price:
              <input
                type="text"
                name="price"
                value={editingProduct.price}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={editingProduct.description}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phone_number"
                value={editingProduct.phone_number}
                onChange={handleInputChange}
              />
            </label>
            <div className="modal-actions">
              <button onClick={handleSubmit}>Submit</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete this product?</h3>
            <div className="modal-actions">
              <button onClick={handleDelete}>Yes</button>
              <button onClick={() => setShowDeleteModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

{showImageModal && (
  <div className="modal">
    <div className="modal-content">
      <div className="modal-header">
        <button className="modal-close-btn" onClick={closeImageModal}>
          &times;
        </button>
      </div>
      <div className="image-grid">
        {selectedProductImages.map((image) => (
          <div key={image.id} className="image-card">
            <img src={image.image} alt={image.image} />
            <button onClick={() => handleChangeCoverImage(image.id)}>Set as Cover</button>
            <button onClick={() => handleDeleteImage(image.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="upload-section">
        <input type="file" multiple onChange={handleUploadImage} />
        <button onClick={handleImageConfirm}>Upload</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default MyProducts;
