import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const CountContext = createContext();

// Create a custom hook to access the context
export const useCount = () => useContext(CountContext);

// Create a provider component
export const CountProvider = ({ children }) => {
  // Initialize count from localStorage or default to 0
  const [count, setCount] = useState(() => {
    const storedCount = localStorage.getItem('count');
    return storedCount ? JSON.parse(storedCount) : 0;
  });

  // Update localStorage whenever count changes
  useEffect(() => {
    localStorage.setItem('count', JSON.stringify(count));
  }, [count]);

  // Update count
  const updateCount = (newCount) => {
    setCount(newCount);
  };

  return (
    <CountContext.Provider value={{ count, updateCount }}>
      {children}
    </CountContext.Provider>
  );
};
