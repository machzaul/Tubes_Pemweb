import { useState, useEffect } from "react";
import Rupiah from "../components/Rupiah";
import ProductModal from "../components/ProductModal"; // Import ProductModal

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  // State untuk mengontrol ProductModal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:6543';

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products from backend:", err);
      
      // Fallback to localStorage or sample data
      const storedProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
      if (storedProducts.length > 0) {
        setProducts(storedProducts);
      } else {
        // Sample products as fallback
        const sampleProducts = [
          {
            id: 1,
            title: "Luxury Travel Backpack",
            description: "Premium quality backpack for modern travelers",
            price: 60.57,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
            stock: 15
          },
          {
            id: 2,
            title: "Professional Messenger Bag",
            description: "Elegant messenger bag for business professionals",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
            stock: 8
          }
        ];
        setProducts(sampleProducts);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-rotate featured product every 5 seconds
  useEffect(() => {
    if (products.length > 1) {
      const interval = setInterval(() => {
        setCurrentProductIndex((prev) => (prev + 1) % products.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [products.length]);

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
  };

  // Function untuk membuka modal dengan produk tertentu
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Function untuk menutup modal
  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-purple-500 border-solid border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentProduct = products[currentProductIndex] || products[0];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <div className="flex min-h-screen">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-20 gap-1 h-full">
              {Array.from({ length: 400 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-gray-800 rounded-full opacity-30"></div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-8 text-gray-900">
              {currentProduct?.title || "Luxur Travel"}<br />
              <span className="text-5xl lg:text-6xl">Backpack</span>
            </h1>
            
            <p className="text-gray-600 text-lg mb-12 max-w-md leading-relaxed">
              {currentProduct?.description || "The site can definitelly not what level able to go along with my rod and phone. Surprising, I don't know lots of the oth compartments."}
            </p>

            {/* Product Navigation */}
            <div className="flex items-center space-x-8 mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-gray-900">01</span>
                <span className="text-gray-500">/05</span>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setCurrentProductIndex(Math.max(0, currentProductIndex - 1))}
                  className="text-purple-600 hover:text-purple-500 transition-colors"
                  disabled={currentProductIndex === 0}
                >
                  PREVIOUS
                </button>
                <span className="text-gray-500">|</span>
                <button 
                  onClick={() => setCurrentProductIndex(Math.min(products.length - 1, currentProductIndex + 1))}
                  className="text-purple-600 hover:text-purple-500 transition-colors"
                  disabled={currentProductIndex === products.length - 1}
                >
                  NEXT
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-purple-600 transition-colors">FACEBOOK</a>
              <a href="#" className="hover:text-purple-600 transition-colors">TWITTER</a>
              <a href="#" className="hover:text-purple-600 transition-colors">LINKEDIN</a>
              <a href="#" className="hover:text-purple-600 transition-colors">INSTAGRAM</a>
            </div>
          </div>
        </div>

        {/* Right Content - Product Image and Details */}
        <div className="flex-1 relative flex items-center justify-center">
          {/* Background Pattern */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-10">
            <div className="grid grid-cols-15 gap-2">
              {Array.from({ length: 225 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-gray-800 rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Product Image */}
          <div className="relative z-10">
            {currentProduct && (
              <div className="relative">
                <img 
                  src={currentProduct.image} 
                  alt={currentProduct.title}
                  className="w-80 h-96 object-cover rounded-lg shadow-2xl"
                />
                
                {/* Floating Product Details */}
                <div className="absolute -right-20 top-1/2 transform -translate-y-1/2">
                  <div className="bg-purple-500 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 text-gray-900">
                    <div className="text-3xl font-bold mb-2">
                      <Rupiah value={currentProduct.price} />
                    </div>
                    <button 
                      onClick={() => addToCart(currentProduct)}
                      className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-600 transition-colors"
                    >
                      <span>ADD TO BAG</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Product Intro Button - Updated dengan onClick handler */}
                <div className="absolute -left-16 bottom-10">
                  <button 
                    onClick={() => openProductModal(currentProduct)}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-500 transition-colors"
                  >
                    <div className="w-8 h-8 border border-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold">PRODUCT INTRO</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-20 px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Featured Products</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product, index) => (
              <div key={product.id} className="group cursor-pointer">
                <div 
                  className="relative overflow-hidden rounded-lg bg-white shadow-lg aspect-square"
                  onClick={() => openProductModal(product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-purple-500 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent modal from opening
                        addToCart(product);
                      }}
                      className="bg-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {product.description.length > 50 
                      ? product.description.slice(0, 50) + "..." 
                      : product.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-purple-600">
                      <Rupiah value={product.price} />
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="w-64 h-64 mx-auto lg:mx-0 rounded-full overflow-hidden border-4 border-purple-500">
              <img 
                src="https://media.licdn.com/dms/image/v2/D4D03AQE-OqL162sVgw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1696488893139?e=1748476800&v=beta&t=QdGcQe8P6tG93JbdXKiOGn6uHymU_igqGP26gT19Ybs" 
                alt="Store Owner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-16 text-center lg:text-left">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Store Owner</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              I am the owner of this store, with years of experience in the e-commerce world. 
              We are committed to providing the best quality products with affordable prices 
              for all our customers.
            </p>
            <div className="flex justify-center lg:justify-start space-x-6">
              <a href="#" className="text-purple-600 hover:text-purple-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-purple-600 hover:text-purple-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-purple-600 hover:text-purple-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ProductModal Component */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
      />
    </div>
  );
};

export default Home;