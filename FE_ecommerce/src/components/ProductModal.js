import { useState } from "react";
import PropTypes from "prop-types";

const ProductModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const addToCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = storedCart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      // If product exists, increase quantity
      storedCart[existingProductIndex].quantity = (storedCart[existingProductIndex].quantity || 1) + quantity;
    } else {
      // If product doesn't exist, add new product with specified quantity
      storedCart.push({
        ...product,
        quantity: quantity
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(storedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message and close modal
    alert(`${quantity} item(s) added to cart!`);
    onClose();
    setQuantity(1); // Reset quantity
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setQuantity(1); // Reset quantity when closing
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={() => {
              onClose();
              setQuantity(1);
            }}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="flex justify-center">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full max-w-md h-96 object-cover rounded-lg shadow-md"
              />
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-purple-600">
                  Rp. {product.price}
                </span>
              </div>
              
              {/* Stock Status */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 10 ? 'bg-green-100 text-green-800' :
                  product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                  product.stock > 0 ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              
              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-4 py-2 border border-gray-300 rounded-md min-w-16 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => {
                    onClose();
                    setQuantity(1);
                  }}
                  className="px-6 py-3 border border-gray-600 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductModal.propTypes = {
  product: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProductModal;