import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  isDoctor: boolean | null;
  isPatient: boolean | null;
  alias: string;
  address: string | null;
  email: string | null;
}

interface UserDataContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export const UserDataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({
    isDoctor: null,
    isPatient: null,
    alias: "User",
    address: null,
    email: null,
  });

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};
