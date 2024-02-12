import React, { createContext, useContext, useState, ReactNode } from "react";
import { useMoonSDK } from "./usemoonsdk";

// Adjusting the AuthContextType to include login and logout functions
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Handle disconnect
const handleDisconnect = async () => {
	try {
		// Disconnect from Moon
		await useMoonSDK().disconnect(); // Disconnect from Moon
		console.log('Disconnected');
	} catch (error) {
		console.error('Error during disconnection:', error);
	}
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');

  const login = () => {
    setIsAuthenticated(true); // Properly update state
    // Assuming userData has properties isDoctor and isPatient to determine the role
  };

  const logout = () => {
    handleDisconnect(); // Disconnect from Moon
    setIsAuthenticated(false); // Properly update state
    setRole(""); // Clear the role
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
