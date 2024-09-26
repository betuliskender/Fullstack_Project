import React, { createContext, useState } from "react";
import { User } from "../utility/types";

interface AuthContextState {
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  token: string | null; // Add token state
  setToken: (token: string | null) => void; // Add setToken function
  user: User | null; // Add user state
  setUser: (user: User | null) => void; // Add setUser function
  
}

interface AuthContextProps {
    children: React.ReactNode;
  }

  const initialAuthContextState: AuthContextState = {
    isLoggedIn: false,
    setLoggedIn: () => {},
    token: null, // Initialize token state
    setToken: () => {}, // Initialize setToken function
    user: null, // Initialize user state
    setUser: () => {}, // Initialize setUser function
  };

  export const AuthContext = createContext<AuthContextState>(initialAuthContextState);

  export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null); // Add user state
    const [token, setToken] = useState<string | null>(null); // Add token state
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, token, setToken, user, setUser }}>
        {children}
      </AuthContext.Provider>
    );
};