import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminCategoryHandle.css';
import config from '../../config';

const CategoriesComponent = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);

    const API_URL = `${config.API_BASE_URL}/adminside/categories/`;
    const token = localStorage.getItem('access_token');

    // Fetch categories from the backend
    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, [token, API_URL]);

    // Add a new category
    const handleAddCategory = async () => {
        if (!token) return;

        try {
            await axios.post(API_URL, { name: categoryName }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setCategoryName(''); // Clear input after adding
            fetchCategories(); // Refresh the category list
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    // Delete a category by ID
    const handleDeleteCategory = async () => {
        try {
            await axios.delete(`${API_URL}${deleteCategoryId}/`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setShowDeletePopup(false); // Close popup
            fetchCategories(); // Refresh the category list
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    // Show the delete confirmation popup
    const confirmDeleteCategory = (categoryId) => {
        setDeleteCategoryId(categoryId);
        setShowDeletePopup(true);
    };

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <div className="top-align">
            <h2>Manage Categories</h2>
            
            {/* Add Category Input */}
            <input
                type="text"
                placeholder="Enter category"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
            />
            <button onClick={handleAddCategory}>Add Category</button>

            {/* Categories Table */}
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Category Name</th>
                        <th>Handle</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr key={category.id}>
                            <td>{index + 1}</td>
                            <td>{category.name}</td>
                            <td>
                                <button onClick={() => confirmDeleteCategory(category.id)}>
                                    ❌
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete Confirmation Popup */}
            {showDeletePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Are you sure you want to delete this category?</h3>
                        <button onClick={handleDeleteCategory}>Yes, Delete</button>
                        <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesComponent;
