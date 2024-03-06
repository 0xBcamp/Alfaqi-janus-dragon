import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useMoonSDK } from "../Moon/usemoonsdk";
import { useUserData } from "./userDataContext";


// Adjusting the AuthContextType to include login and logout functions
interface AuthContextType {
  isAuthenticated: boolean;
  role: string;
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
  const { userData } = useUserData();

  useEffect(() => {
    const restoreSession = async () => {
      const storedMoonSession = sessionStorage.getItem(userData.alias);
      if (storedMoonSession) {
        // Restore login state, you might need to adjust based on what you store in session
        setIsAuthenticated(true);
        // If you store role or other user data, restore it here as well
      }
    };

    restoreSession();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    userData.isDoctor ? setRole("doctor") : setRole("patient");
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
