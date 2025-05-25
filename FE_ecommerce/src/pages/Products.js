import { useState, useEffect } from "react";
import useAlert from "../hooks/useAlert"; // Sesuaikan path
import AlertContainer from "../components/ui/AlertContainer"; // Sesuaikan path
import ProductModal from "../components/ProductModal"; // Import modal baru
import Rupiah from "../components/Rupiah";
import PropTypes from "prop-types";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:6543';
  
  // Gunakan alert hook
  const { alerts, showSuccess, showError, removeAlert } = useAlert();

  const formatRupiah = (angka, prefix = "Rp") => {
    if (!angka) return prefix + "0";
    let number_string = angka.toString().replace(/[^,\d]/g, ""),
      split = number_string.split(","),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      rupiah += (sisa ? "." : "") + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return prefix + rupiah;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.products || []);
      localStorage.setItem("adminProducts", JSON.stringify(data.products || []));
    } catch (err) {
      console.error("Failed to fetch products from backend:", err);
      showError("Failed to load products from server. Using cached data.");
      
      // fallback to local storage or sample data
      const storedProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
      if (storedProducts.length > 0) {
        setProducts(storedProducts);
      } else {
        const sampleProducts = [/*...sample data...*/]; // salin dari kode awal
        setProducts(sampleProducts);
        localStorage.setItem("adminProducts", JSON.stringify(sampleProducts));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = storedCart.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
      storedCart[existingIndex].quantity = (storedCart[existingIndex].quantity || 1) + 1;
    } else {
      storedCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Ganti alert dengan komponen cantik
    showSuccess(
      `${product.title} has been added to your cart!`,
      "Added to Cart"
    );
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

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
                {/* Product Image - Clickable untuk membuka modal */}
                <div 
                  className="bg-gray-200 overflow-hidden flex justify-center items-center p-0 cursor-pointer"
                  onClick={() => openProductModal(product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <h3 
                    className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-purple-600 transition-colors"
                    onClick={() => openProductModal(product)}
                  >
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description.length > 40
                      ? product.description.slice(0, 40) + "..."
                      : product.description}
                  </p>
                  
                  {/* Harga dan Stok */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-purple-600">
                      <Rupiah value={product.price} />
                    </span>
                    <span className={`text-sm font-medium ${
                      product.stock > 10 ? 'text-green-600' : 
                      product.stock > 5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} tersedia` : 'Stok habis'}
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
                    <button
                      onClick={() => openProductModal(product)}
                      className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
      />

      {/* Alert Container */}
      <AlertContainer alerts={alerts} onRemoveAlert={removeAlert} />
    </div>
  );
};

export default Products;