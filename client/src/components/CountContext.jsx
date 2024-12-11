import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const CountContext = createContext();

export const useCount = () => useContext(CountContext);

export const CountProvider = ({ children }) => {
  const [count, setCount] = useState(0); // Initialize count to 0
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [userId, setUserId] = useState(null); // Track user ID

  // Function to fetch the cart count for a specific user
  const fetchCount = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure userId is valid before making the API call
      if (!userId) throw new Error('User ID is required');

      const response = await axios.get(`http://localhost:3000/addtocartcount/${userId}`);
      if (response.data && response.data.addToCartCount !== undefined) {
        setCount(response.data.addToCartCount);
      } else {
        setCount(0); // Fallback to 0 if no valid data is returned
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the count.');
      setCount(0); // Set count to 0 on error
    } finally {
      setLoading(false);
    }
  };

  // Function to update the count manually (e.g., when item is added to cart)
  const updateCount = (newCount) => {
    setCount(newCount);
  };

  // UseEffect to fetch the count when userId changes
  useEffect(() => {
    if (userId) {
      fetchCount(userId); // Only call fetchCount if userId is set and valid
    }
  }, [userId]); // Dependency on userId, only fetch when it changes

  // Function to set the userId dynamically (can be used to trigger count fetch)
  const setUser = (newUserId) => {
    setUserId(newUserId);
  };

  return (
    <CountContext.Provider value={{ count, loading, error, updateCount, setUser }}>
      {children}
    </CountContext.Provider>
  );
};
