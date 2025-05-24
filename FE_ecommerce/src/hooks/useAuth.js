// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  // Check authentication status
  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const authStatus = localStorage.getItem('isAuthenticated');
    const storedAdminData = localStorage.getItem('adminData');
    
    setIsAuthenticated(token && authStatus === 'true');
    setAdminData(storedAdminData ? JSON.parse(storedAdminData) : null);
    setIsLoading(false);
  };

  // Login function
  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:6543/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth data
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        
        // Update state
        setIsAuthenticated(true);
        setAdminData(data.admin);
        
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        await fetch('http://localhost:6543/api/admin/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage and state
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('adminData');
      
      setIsAuthenticated(false);
      setAdminData(null);
    }
  };

  // API call with auth
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`http://localhost:6543/api${endpoint}`, finalOptions);
      
      // Check if token is expired
      if (response.status === 401) {
        await logout();
        window.location.href = '/admin';
        return null;
      }

      return response;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    isLoading,
    adminData,
    login,
    logout,
    apiCall,
    checkAuth
  };
};

export default useAuth;