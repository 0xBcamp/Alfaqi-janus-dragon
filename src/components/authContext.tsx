import React, { createContext, useContext, useState } from "react";
import { handleDisconnect } from "./usemoonsdk";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Now includes role and address

  const login = (userData) => {
    setUser(userData); // userData includes role, address, and any other relevant information
  };

  const logout = () => {
    handleDisconnect();
    setUser(null);
  };

  // Utility function to check if the user is authenticated
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
