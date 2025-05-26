import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useAlert from "../hooks/useAlert";
import AlertContainer from "./ui/AlertContainer";

const ProductModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { alerts, removeAlert, showSuccess, showError } = useAlert();
  const [shouldClose, setShouldClose] = useState(false);
  
  // Helper function untuk mendapatkan quantity dari cart
  const getCartQuantity = () => {
    if (!product) return 0;
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProduct = storedCart.find(item => item.id === product.id);
      return existingProduct ? existingProduct.quantity : 0;
    } catch (error) {
      console.error("Error reading cart:", error);
      return 0;
    }
  };

  // Helper function untuk mendapatkan available quantity
  const getAvailableQuantity = () => {
    if (!product) return 0;
    const cartQuantity = getCartQuantity();
    return Math.max(0, product.stock - cartQuantity);
  };

  // Hitung informasi stock yang tersedia
  const cartQuantity = getCartQuantity();
  const availableQuantity = getAvailableQuantity();
  const isOutOfStock = product ? (product.stock === 0 || availableQuantity === 0) : true;

  useEffect(() => {
    if (shouldClose) {
      onClose();
      setQuantity(1);
      setShouldClose(false);
    }
  }, [shouldClose, onClose]);

  // Reset quantity jika melebihi available quantity
  useEffect(() => {
    if (product && quantity > availableQuantity && availableQuantity > 0) {
      setQuantity(Math.min(quantity, availableQuantity));
    }
  }, [availableQuantity, quantity, product]);

  // Early return setelah semua hooks
  if (!isOpen || !product) return null;

  const handleAlertClose = (id) => {
    removeAlert(id);
    setShouldClose(true);
  };

  const addToCart = () => {
    try {
      if (typeof Storage === "undefined") {
        showError("Browser Anda tidak mendukung localStorage");
        return;
      }

      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProductIndex = storedCart.findIndex(item => item.id === product.id);
      
      // Hitung quantity yang sudah ada di cart
      const currentCartQuantity = existingProductIndex !== -1 ? storedCart[existingProductIndex].quantity : 0;
      const totalQuantityAfterAdd = currentCartQuantity + quantity;

      // Validasi: total quantity tidak boleh melebihi stock
      if (totalQuantityAfterAdd > product.stock) {
        const availableToAdd = product.stock - currentCartQuantity;
        if (availableToAdd <= 0) {
          showError(
            `Produk ${product.title} sudah mencapai batas maksimal di keranjang (${currentCartQuantity}/${product.stock})`,
            "Stok Tidak Mencukupi"
          );
        } else {
          showError(
            `Hanya tersisa ${availableToAdd} item yang bisa ditambahkan ke keranjang. Total di keranjang akan menjadi ${product.stock}/${product.stock}`,
            "Stok Terbatas"
          );
        }
        return;
      }

      // Proses penambahan ke cart
      if (existingProductIndex !== -1) {
        storedCart[existingProductIndex].quantity = totalQuantityAfterAdd;
      } else {
        storedCart.push({
          ...product,
          quantity: quantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(storedCart));
      window.dispatchEvent(new Event("cartUpdated"));

      // Tampilkan alert success
      showSuccess(
        `${quantity} ${product.title} berhasil ditambahkan ke keranjang! Total di keranjang: ${totalQuantityAfterAdd}`,
        "Produk Ditambahkan"
      );

      // Delay penutupan modal 3 detik
      setTimeout(() => {
        setShouldClose(true);
      }, 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError("Terjadi kesalahan saat menambahkan produk ke keranjang", "Error!");
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    
    // Validasi quantity tidak boleh kurang dari 1 dan tidak boleh melebihi available quantity
    if (newQuantity >= 1 && newQuantity <= availableQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setQuantity(1);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Detail Produk</h2>
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
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 10 ? 'bg-green-100 text-green-800' :
                    product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                    product.stock > 0 ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} total stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Cart Status - Show if item is already in cart */}
                {cartQuantity > 0 && (
                  <div className="mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Di keranjang:</span> {cartQuantity} item
                      </p>
                      <p className="text-sm text-blue-600">
                        <span className="font-medium">Tersisa:</span> {availableQuantity} item bisa ditambahkan
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah
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
                        disabled={quantity >= availableQuantity}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Maksimal {availableQuantity} item dapat ditambahkan
                    </p>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={addToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                      isOutOfStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 
                     availableQuantity === 0 ? 'Sudah penuh' : 
                     'Masukkan ke Keranjang'}
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
      
      {/* Alert Container */}
      <AlertContainer 
        alerts={alerts} 
        onRemoveAlert={handleAlertClose} 
      />
    </>
  );
};

ProductModal.propTypes = {
  product: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProductModal;