import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // Admin products for stock validation
  const [stockErrors, setStockErrors] = useState([]); // Track stock validation errors
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
    
    // Pastikan setiap item memiliki quantity, jika tidak ada set ke 1
    const cartWithQuantity = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1
    }));
    
    setCart(cartWithQuantity);
    setProducts(storedProducts);
    
    // Validate stock for cart items
    validateCartStock(cartWithQuantity, storedProducts);
  }, []);

  // Validate cart items against available stock
  const validateCartStock = (cartItems, adminProducts) => {
    const errors = [];
    
    cartItems.forEach(cartItem => {
      const adminProduct = adminProducts.find(p => p.id === cartItem.id);
      if (!adminProduct) {
        errors.push({
          id: cartItem.id,
          title: cartItem.title,
          message: "Product is no longer available",
          type: 'unavailable'
        });
      } else if (cartItem.quantity > adminProduct.stock) {
        errors.push({
          id: cartItem.id,
          title: cartItem.title,
          requestedQty: cartItem.quantity,
          availableStock: adminProduct.stock,
          message: `Only ${adminProduct.stock} items available (you have ${cartItem.quantity} in cart)`,
          type: 'exceeded'
        });
      }
    });
    
    setStockErrors(errors);
  };

  // Fungsi untuk update localStorage setiap kali cart berubah
  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Trigger custom event for navbar update
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Re-validate stock after cart update
    validateCartStock(updatedCart, products);
  };

  // Fix cart quantities to match available stock
  const fixCartQuantities = () => {
    const updatedCart = cart.map(cartItem => {
      const adminProduct = products.find(p => p.id === cartItem.id);
      if (adminProduct && cartItem.quantity > adminProduct.stock) {
        return {
          ...cartItem,
          quantity: Math.max(1, adminProduct.stock) // Ensure at least 1 if stock > 0
        };
      }
      return cartItem;
    }).filter(cartItem => {
      // Remove items that are no longer available or have 0 stock
      const adminProduct = products.find(p => p.id === cartItem.id);
      return adminProduct && adminProduct.stock > 0;
    });

    setCart(updatedCart);
    updateLocalStorage(updatedCart);
    
    // Clear stock errors if cart becomes empty
    if (updatedCart.length === 0) {
      setStockErrors([]);
    }
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
    
    // Clear stock errors if cart becomes empty
    if (updatedCart.length === 0) {
      setStockErrors([]);
    }
  };

  const incrementQuantity = (index) => {
    const item = cart[index];
    const adminProduct = products.find(p => p.id === item.id);
    
    if (!adminProduct) {
      alert("This product is no longer available.");
      return;
    }
    
    if (item.quantity >= adminProduct.stock) {
      alert(`Sorry, only ${adminProduct.stock} items are available in stock.`);
      return;
    }
    
    const updatedCart = cart.map((cartItem, i) => 
      i === index ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
    );
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const decrementQuantity = (index) => {
    const updatedCart = cart.map((item, i) => 
      i === index ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  // Direct quantity input handler
  const handleQuantityChange = (index, newQuantity) => {
    const item = cart[index];
    const adminProduct = products.find(p => p.id === item.id);
    
    if (!adminProduct) {
      alert("This product is no longer available.");
      return;
    }
    
    // Ensure quantity is at least 1 and not more than available stock
    const validQuantity = Math.max(1, Math.min(newQuantity, adminProduct.stock));
    
    if (newQuantity > adminProduct.stock) {
      alert(`Sorry, only ${adminProduct.stock} items are available in stock.`);
    }
    
    const updatedCart = cart.map((cartItem, i) => 
      i === index ? { ...cartItem, quantity: validQuantity } : cartItem
    );
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  // Clear entire cart function
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    setStockErrors([]);
    // Trigger custom event for navbar update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Hitung subtotal dan total
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const shippingCost = 0; // Gratis ongkir
  const totalCost = (parseFloat(calculateSubtotal()) + shippingCost).toFixed(2);

  // Check if checkout should be disabled
  const canProceedToCheckout = stockErrors.length === 0 && cart.length > 0;

  return (
    <div className="p-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-purple-500 to-blue-500 text-white p-10 rounded-lg shadow-lg mb-8">
        <div className="md:w-1/2 text-left">
          <h1 className="text-4xl font-bold mb-4">Your Shopping Cart</h1>
          <p className="text-lg">Review your selected items before checkout!</p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          {cart.length > 0 && (
            <div className="border p-4 rounded-lg shadow-md bg-white hover:shadow-xl transition-all duration-300">
              <img src={cart[0].image} alt={cart[0].title} className="h-32 mx-auto object-contain" />
            </div>
          )}
        </div>
      </div>

      {/* Stock Error Notifications */}
      {stockErrors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-red-800">Stock Issues Detected</h3>
            <button
              onClick={fixCartQuantities}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              Fix Cart
            </button>
          </div>
          <ul className="space-y-2">
            {stockErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                <strong>{error.title}:</strong> {error.message}
              </li>
            ))}
          </ul>
          <p className="text-sm text-red-600 mt-2">
            Click "Fix Cart" to automatically adjust quantities or remove unavailable items.
          </p>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-12">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 uppercase tracking-wider flex-1">
                  <div className="col-span-6">PRODUCT</div>
                  <div className="col-span-2 text-center">PRICE</div>
                  <div className="col-span-2 text-center">QUANTITY</div>
                  <div className="col-span-1 text-center">SUBTOTAL</div>
                  <div className="col-span-1 text-center">ACTIONS</div>
                </div>
                <button
                  onClick={clearCart}
                  className="ml-4 px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
                  title="Clear entire cart"
                >
                  Clear All
                </button>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cart.map((item, index) => {
                  const adminProduct = products.find(p => p.id === item.id);
                  const hasStockError = stockErrors.some(error => error.id === item.id);
                  
                  return (
                    <div key={index} className={`px-6 py-6 ${hasStockError ? 'bg-red-50' : ''}`}>
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Product Info */}
                        <div className="col-span-6 flex items-center space-x-4">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="h-16 w-16 object-contain rounded-lg border"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                              {item.title}
                            </h3>
                            {adminProduct && (
                              <p className="text-sm text-gray-500 mt-1">
                                Stock available: {adminProduct.stock}
                              </p>
                            )}
                            {hasStockError && (
                              <p className="text-sm text-red-600 mt-1">
                                ⚠️ Stock issue detected
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center">
                          <span className="text-lg font-semibold text-gray-800">
                            ${item.price}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="col-span-2 flex items-center justify-center">
                          <div className={`flex items-center border rounded-lg ${hasStockError ? 'border-red-300' : ''}`}>
                            <button
                              onClick={() => decrementQuantity(index)}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-2 border-l border-r bg-gray-50 font-semibold text-center focus:outline-none focus:bg-white"
                              min="1"
                              max={adminProduct ? adminProduct.stock : 999}
                            />
                            <button
                              onClick={() => incrementQuantity(index)}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-1 text-center">
                          <span className="text-lg font-semibold text-blue-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <div className="col-span-1 text-center">
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-md hover:bg-red-50"
                            title="Remove item"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold">${calculateSubtotal()}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-blue-600">${totalCost}</span>
                  </div>
                </div>
              </div>

              {/* Stock Warning */}
              {stockErrors.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Some items have stock issues. Please fix them before checkout.
                  </p>
                </div>
              )}

              <button 
                onClick={() => navigate('/checkout')}
                disabled={!canProceedToCheckout}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors mt-6 shadow-lg ${
                  canProceedToCheckout
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {stockErrors.length > 0 ? 'Fix Stock Issues First' : 'Proceed to Checkout'}
              </button>

              {/* Additional Actions */}
              <div className="mt-4 space-y-2">
                <button 
                  onClick={() => navigate('/products')}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </button>
                
                {stockErrors.length > 0 && (
                  <button 
                    onClick={fixCartQuantities}
                    className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    Auto-Fix All Stock Issues
                  </button>
                )}

                <button 
                  onClick={clearCart}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;