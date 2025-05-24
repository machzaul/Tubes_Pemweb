import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  // Check if user is authenticated (basic check)
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const isAuth = localStorage.getItem('isAuthenticated');
    return token && isAuth === 'true';
  };

  // Verify token with backend
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return false;

      const response = await fetch('http://localhost:6543/api/admin/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const adminData = await response.json();
        localStorage.setItem('adminData', JSON.stringify(adminData));
        return true;
      } else {
        // Token invalid, clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('adminData');
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      // Clear localStorage on error
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('adminData');
      return false;
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const tokenValid = await verifyToken();
      setIsValidToken(tokenValid);
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
            <span className="text-gray-600">Verifying authentication...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated or token is invalid
  if (!isAuthenticated() || !isValidToken) {
    return <Navigate to="/admin" replace />;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;