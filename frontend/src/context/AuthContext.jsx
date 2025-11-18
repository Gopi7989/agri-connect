import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Initialize state safely
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    
    // SECURITY CHECK:
    // Only try to parse if savedUser exists AND it is not the string "undefined"
    if (savedUser && savedUser !== "undefined") {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        // If the data is corrupt, clear it and start fresh
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });

  // 2. Login Function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 3. Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;