import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    // Load products from localStorage or use sample data
    const storedProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
    
    // If no products in localStorage, use sample data
    if (storedProducts.length === 0) {
      const sampleProducts = [
        {
          id: 1,
          title: "Stylish Headphones",
          description: "Premium wireless headphones with noise cancellation",
          price: 249.99,
          stock: 15,
          image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
        },
        {
          id: 2,
          title: "Smart Watch",
          description: "Track your fitness and receive notifications on the go",
          price: 199.99,
          stock: 10,
          image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"
        },
        {
          id: 3,
          title: "Minimalist Desk Lamp",
          description: "Modern desk lamp with adjustable brightness",
          price: 59.99,
          stock: 25,
          image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
        },
        {
          id: 4,
          title: "Organic Coffee Beans",
          description: "Ethically sourced premium coffee beans",
          price: 19.99,
          stock: 30,
          image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"
        },
        {
          id: 5,
          title: "Leather Wallet",
          description: "Handcrafted genuine leather wallet with RFID protection",
          price: 45.99,
          stock: 18,
          image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg"
        },
        {
          id: 6,
          title: "Ceramic Plant Pot",
          description: "Minimalist design perfect for succulents and small plants",
          price: 24.99,
          stock: 22,
          image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg"
        }
      ];
      setProducts(sampleProducts);
      localStorage.setItem("adminProducts", JSON.stringify(sampleProducts));
    } else {
      setProducts(storedProducts);
    }
    setLoading(false);
  }, []);

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));
    }
  };

  const getStockColor = (stock) => {
    if (stock <= 10) return "text-red-500";
    if (stock <= 20) return "text-yellow-500";
    return "text-green-500";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-purple-500 border-solid border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/adminorder"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Manage Orders
              </Link>
              <Link
                to="/admin/add-product"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </Link>
              {/* Tombol Logout */}
              <button
                onClick={() => {
                  localStorage.removeItem("isAuthenticated");
                  window.location.href = "/admin"; // Redirect ke halaman login
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-5V7" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <div className="col-span-5">PRODUCT</div>
              <div className="col-span-2 text-center">PRICE</div>
              <div className="col-span-2 text-center">STOCK</div>
              <div className="col-span-3 text-center">ACTIONS</div>
            </div>
          </div>

          {/* Product List */}
          <div className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-2-2m0 0l-2 2m2-2v6m-4 6l2 2m0 0l2-2m-2 2V15" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
                <div className="mt-6">
                  <Link
                    to="/admin/add-product"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Product
                  </Link>
                </div>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="col-span-5 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="h-16 w-16 object-contain rounded-lg border bg-white p-2"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center">
                      <span className="text-lg font-semibold text-gray-900">
                        ${product.price}
                      </span>
                    </div>

                    {/* Stock */}
                    <div className="col-span-2 text-center">
                      <span className={`text-lg font-semibold ${getStockColor(product.stock)}`}>
                        {product.stock}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3 flex items-center justify-center space-x-3">
                      <Link
                        to={`/admin/edit-product/${product.id}`}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        title="Edit Product"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="inline-flex items-center p-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                        title="Delete Product"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;