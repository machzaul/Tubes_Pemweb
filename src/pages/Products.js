import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load products from localStorage (admin products)
    const storedProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
    
    // If no products in localStorage, use sample data (same as admin dashboard)
    if (storedProducts.length === 0) {
      const sampleProducts = [
        {
          id: 1,
          title: "Stylish Headphones",
          description: "Premium wireless headphones with noise cancellation.",
          price: 249.99,
          stock: 15,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
        },
        {
          id: 2,
          title: "Smart Watch",
          description: "Track your fitness and receive notifications on the go.",
          price: 199.99,
          stock: 10,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
        },
        {
          id: 3,
          title: "Minimalist Desk Lamp",
          description: "Modern desk lamp with adjustable brightness.",
          price: 59.99,
          stock: 25,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
        },
        {
          id: 4,
          title: "Organic Coffee Beans",
          description: "Ethically sourced premium coffee beans.",
          price: 19.99,
          stock: 30,
          image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop"
        },
        {
          id: 5,
          title: "Leather Wallet",
          description: "Handcrafted genuine leather wallet with RFID protection.",
          price: 45.99,
          stock: 18,
          image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop"
        },
        {
          id: 6,
          title: "Ceramic Plant Pot",
          description: "Minimalist design perfect for succulents and small plants.",
          price: 24.99,
          stock: 22,
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop"
        }
      ];
      setProducts(sampleProducts);
      localStorage.setItem("adminProducts", JSON.stringify(sampleProducts));
    } else {
      setProducts(storedProducts);
    }
    setLoading(false);
  }, []);

  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = storedCart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      // If product exists, increase quantity
      storedCart[existingProductIndex].quantity = (storedCart[existingProductIndex].quantity || 1) + 1;
    } else {
      // If product doesn't exist, add new product with quantity 1
      storedCart.push({
        ...product,
        quantity: 1
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(storedCart));
    alert("Product added to cart!");
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-purple-500 border-solid border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">Discover our amazing collection of products</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-2-2m0 0l-2 2m2-2v6m-4 6l2 2m0 0l2-2m-2 2V15" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "No products available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Product Image */}
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  
                  {/* Price and Stock */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-purple-600">
                      ${product.price}
                    </span>
                    <span className={`text-sm font-medium ${
                      product.stock > 10 ? 'text-green-600' : 
                      product.stock > 5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        product.stock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-shrink-0 py-2 px-4 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;