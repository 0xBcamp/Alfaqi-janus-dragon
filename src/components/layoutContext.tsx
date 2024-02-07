import React, { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }) => {
  const [layout, setLayout] = useState();

  useEffect(() => {
    const savedLayout = localStorage.getItem('react-resizable-panels:layout');
    // Ensure savedLayout is a valid JSON string
    if (savedLayout && savedLayout !== "undefined") {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setLayout(parsedLayout);
      } catch (e) {
        console.error("Error parsing layout from localStorage:", e);
        // Optionally, clear the invalid layout from localStorage or take other recovery actions
        localStorage.removeItem('react-resizable-panels:layout');
      }
    }
  }, []);

  useEffect(() => {
    // Optionally, save layout changes to Local Storage or handle them differently
    if (layout !== undefined) {
      localStorage.setItem('react-resizable-panels:layout', JSON.stringify(layout));
    }
  }, [layout]);

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};

