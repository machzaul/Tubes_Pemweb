import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Update cart count
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = storedCart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    // Initial count
    updateCartCount();

    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Custom event listener for cart updates
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white flex justify-between items-center shadow-lg">
      <Link to="/" className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-purple-500 font-bold">
          M
        </div>
        <h1 className="text-xl font-bold">MachzaulMart</h1>
      </Link>
      
      <div className="flex items-center space-x-6">
        <Link to="/products" className="hover:text-purple-200 transition-colors">
          Products
        </Link>
        <Link to="/about" className="hover:text-purple-200 transition-colors">
          About
        </Link>
        <Link to="/contact" className="hover:text-purple-200 transition-colors">
          Contact
        </Link>
        <Link to="/orders" className="hover:text-purple-200 transition-colors">
          Track Order
        </Link>
        <Link to="/admin" className="hover:text-purple-200 transition-colors">
          Admin
        </Link>
        <Link to="/cart" className="relative hover:text-purple-200 transition-colors">
          <div className="flex items-center space-x-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.9 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005 16h12M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6.5" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;