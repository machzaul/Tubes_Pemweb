import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if user is already authenticated when component mounts
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      const authToken = localStorage.getItem("authToken");
      
      // If user is already authenticated, redirect to dashboard
      if (isAuthenticated === "true" && authToken) {
        navigate("/adminDashboard", { replace: true });
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:6543/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies if needed
        body: JSON.stringify({
          username: username.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Login berhasil
        // Simpan token JWT ke localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        
        // Clear form
        setUsername("");
        setPassword("");
        
        // Redirect ke dashboard dengan replace untuk mencegah back button ke login
        navigate("/adminDashboard", { replace: true });
      } else {
        // Login gagal
        setError(data.error || data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout (optional - bisa dipanggil dari komponen lain)
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminData");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Admin Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            className={`w-full py-2 px-4 rounded-md shadow transition-colors ${
              isLoading || !username.trim() || !password.trim()
                ? 'bg-purple-600 text-white cursor-not-allowed' 
                : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;