import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';
import config from '../../config';

function ProductList() {
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const loadMoreRef = useRef(null);

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/categories/`);
      const data = await response.json();
      setCategories(data.results || data || []); // Update here if `results` key does not exist
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch products from the API with optional category filtering
  const fetchProducts = async (page, pageSize = 10, category = '') => {
    setLoading(true);
    try {
      const categoryFilter = category ? `&category=${category}` : '';
      const response = await fetch(`${config.API_BASE_URL}/api/All-products/?page=${page}&page_size=${pageSize}${categoryFilter}`);
      const data = await response.json();

      if (data.detail === 'Invalid page.') {
        setAllProductsLoaded(true);
        return [];
      }

      if (Array.isArray(data.results)) {
        return data.results;
      } else {
        console.error('Invalid data format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load categories on mount
    fetchCategories();
  }, []);

  useEffect(() => {
    const loadInitialProducts = async () => {
      const initialProducts = await fetchProducts(1, 12, selectedCategory);
      setDisplayedProducts(initialProducts);
      setPage(2);
    };
    loadInitialProducts();
  }, [selectedCategory]);

  const loadMoreProducts = useCallback(async () => {
    if (loading || allProductsLoaded) return;

    const newProducts = await fetchProducts(page, 10, selectedCategory);
    if (newProducts.length > 0) {
      setDisplayedProducts((prevProducts) => {
        const updatedProducts = [...prevProducts, ...newProducts].filter((product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
        );
        return updatedProducts;
      });
      setPage((prevPage) => prevPage + 1);
    } else {
      setAllProductsLoaded(true);
    }
  }, [loading, page, allProductsLoaded, selectedCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !allProductsLoaded) {
          loadMoreProducts();
        }
      },
      {
        root: null,
        rootMargin: '10px',
        threshold: 1.0,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loading, loadMoreProducts, allProductsLoaded]);

  return (
    <div className="product-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
            setAllProductsLoaded(false);
          }}
          className="category-dropdown"
        >
          <option value="">Categories</option>
          {categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>Loading categories...</option>
          )}
        </select>

        {/* Location Button */}
        <button className="location-button">
          <span className="location-icon">📍</span>
        </button>
      </div>

      <div className="product-list">
        {displayedProducts
          .filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((product) => (
            <div key={product.id} className="product">
              <Link to={`/product/${product.id}`}>
                <img src={product.cover_image} alt={product.name} />
                <h3>{product.name}</h3>
                <p style={{ color: 'green', textDecoration: 'none' }}>
                  <b>₹{product.price}</b>
                </p>
              </Link>
            </div>
          ))}
        {displayedProducts.length === 0 && (
          <p>Sorry, no products available in this category.</p>
        )}
      </div>

      <div ref={loadMoreRef} style={{ height: '20px', background: 'transparent' }}></div>
      {loading && <p>Loading more products...</p>}
      {allProductsLoaded && <p>No more products to load</p>}
    </div>
  );
}

export default ProductList;
