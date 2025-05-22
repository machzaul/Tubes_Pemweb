
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from '@/hooks/use-toast';
import { User, Lock } from 'lucide-react';

const AdminLogin = () => {
  const { loginAsAdmin, isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // If already logged in, redirect to admin products page
  if (isAdmin) {
    navigate('/admin/products');
    return null;
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }
    
    setIsLoading(true);
    
    // Simple timeout to simulate authentication process
    setTimeout(() => {
      const success = loginAsAdmin(password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard!",
        });
        navigate('/admin/products');
      } else {
        setError('Invalid password');
        setPassword('');
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="page-container flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter your password to access the admin dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Label htmlFor="password" className="block text-gray-700">
                Password
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 ${error ? 'border-red-300' : ''}`}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              {/* For demo purposes, show the password */}
              <p className="mt-2 text-xs text-gray-500">Demo password: admin123</p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
