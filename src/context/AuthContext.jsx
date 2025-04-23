"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api/v1";

// 🔥 ENV VAR to disable authentication during development
const DISABLE_AUTH = import.meta.env.REACT_APP_DISABLE_AUTH === "true";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoadingUser: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🌀 Running AuthProvider useEffect...");

    if (DISABLE_AUTH) {
      console.log("🚧 AUTH DISABLED: Setting fake user...");

      setUser({
        id: "dev-user",
        name: "Developer User",
        email: "developer@example.com",
        role: "developer",
      });

      setIsLoadingUser(false);
      return; // Exit early, don't execute the rest
    }

    const token = localStorage.getItem("authenticationToken");
    if (token) {
      console.log("🔐 Token found in localStorage:", token);

      axios
        .get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const user = res.data.data.user;
          setUser(user);
          console.log("✅ User loaded from /me:", user);
        })
        .catch((err) => {
          console.error("❌ Error loading /me:", err);
          localStorage.removeItem("authenticationToken");
          setUser(null);
        })
        .finally(() => setIsLoadingUser(false));
    } else {
      console.log("🚫 No token found in localStorage");
      setIsLoadingUser(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = res.data.data;

      if (token) {
        localStorage.setItem("authenticationToken", token);
        setUser(user);
        console.log("🔓 Login successful - token saved:", token);
        console.log("👤 User set:", user);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(
        err.response?.data?.message || "Failed to login. Please try again."
      );
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      await axios.post(`${API_BASE_URL}/auth/register`, userData);
      navigate("/verify-email", { state: { email: userData.email } });
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("authenticationToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoadingUser,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
