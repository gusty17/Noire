import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      
      if (response.user) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.logout();
  };

  // Register function
  const register = async (fullName, email, password) => {
    try {
      const response = await api.register(fullName, email, password);
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const isAdmin = user?.role === "Admin";
  const isLoggedIn = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn,
        isAdmin,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
