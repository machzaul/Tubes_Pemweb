import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // Admin products for stock validation
  const [stockErrors, setStockErrors] = useState([]); // Track stock validation errors
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    phoneNumber: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
    
    setCart(storedCart);
    setProducts(storedProducts);

    // Redirect jika cart kosong
    if (storedCart.length === 0) {
      alert("Your cart is empty. Please add some products first.");
      navigate("/products");
      return;
    }

    // Validate stock availability for cart items
    validateCartStock(storedCart, storedProducts);
  }, [navigate]);

  // Validate cart items against available stock
  const validateCartStock = (cartItems, adminProducts) => {
    const errors = [];
    
    cartItems.forEach(cartItem => {
      const adminProduct = adminProducts.find(p => p.id === cartItem.id);
      if (!adminProduct) {
        errors.push({
          id: cartItem.id,
          title: cartItem.title,
          message: "Product is no longer available"
        });
      } else if (cartItem.quantity > adminProduct.stock) {
        errors.push({
          id: cartItem.id,
          title: cartItem.title,
          requestedQty: cartItem.quantity,
          availableStock: adminProduct.stock,
          message: `Only ${adminProduct.stock} items available (you have ${cartItem.quantity} in cart)`
        });
      }
    });
    
    setStockErrors(errors);
  };

  // Fix cart quantities to match available stock
  const fixCartQuantities = () => {
    const updatedCart = cart.map(cartItem => {
      const adminProduct = products.find(p => p.id === cartItem.id);
      if (adminProduct && cartItem.quantity > adminProduct.stock) {
        return {
          ...cartItem,
          quantity: adminProduct.stock
        };
      }
      return cartItem;
    }).filter(cartItem => {
      // Remove items that are no longer available
      const adminProduct = products.find(p => p.id === cartItem.id);
      return adminProduct && adminProduct.stock > 0;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Re-validate after fixing
    validateCartStock(updatedCart, products);
    
    if (updatedCart.length === 0) {
      alert("All items in your cart are out of stock. Redirecting to products page.");
      navigate("/products");
    }
  };

  // Update cart item quantity with stock validation
  const updateCartQuantity = (productId, newQuantity) => {
    const adminProduct = products.find(p => p.id === productId);
    
    if (!adminProduct) {
      alert("This product is no longer available.");
      return;
    }
    
    if (newQuantity > adminProduct.stock) {
      alert(`Sorry, only ${adminProduct.stock} items are available in stock.`);
      return;
    }
    
    if (newQuantity <= 0) {
      // Remove item from cart
      const updatedCart = cart.filter(item => item.id !== productId);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      validateCartStock(updatedCart, products);
      return;
    }

    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    validateCartStock(updatedCart, products);
  };

  // Hitung subtotal dan total
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const shippingCost = 0;
  const totalCost = (parseFloat(calculateSubtotal()) + shippingCost).toFixed(2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate unique order ID
  const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 9);
    return `${timestamp.substr(-8)}-${random}`;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // Check if there are any stock errors
    if (stockErrors.length > 0) {
      alert("Please resolve stock issues before placing your order. You can use the 'Fix Cart' button to automatically adjust quantities.");
      return;
    }
    
    // Validasi form
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.address || !customerInfo.phoneNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    // Final stock validation before placing order
    const finalValidation = [];
    cart.forEach(cartItem => {
      const adminProduct = products.find(p => p.id === cartItem.id);
      if (!adminProduct || cartItem.quantity > adminProduct.stock) {
        finalValidation.push(cartItem.title);
      }
    });

    if (finalValidation.length > 0) {
      alert(`Stock has changed for: ${finalValidation.join(', ')}. Please refresh and try again.`);
      window.location.reload();
      return;
    }

    // Generate unique order ID
    const orderId = generateOrderId();

    // Simulasi place order dengan status default 'pending'
    const orderData = {
      orderId,
      customerInfo,
      items: cart,
      subtotal: calculateSubtotal(),
      shipping: shippingCost,
      total: totalCost,
      orderDate: new Date().toISOString(),
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          updatedBy: 'system',
          note: 'Order placed by customer'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update product stock after successful order
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });

    // Save updated products back to localStorage
    localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));

    // Simpan order ke localStorage (simulasi)
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    // Clear cart
    localStorage.removeItem("cart");
    
    alert(`Order placed successfully! Order ID: ${orderData.orderId}\nYou can track your order using this ID.`);
    navigate("/orders");
  };

  if (cart.length === 0) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
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
              Click "Fix Cart" to automatically adjust quantities to available stock.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={customerInfo.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St, City, Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={customerInfo.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={stockErrors.length > 0}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors shadow-lg ${
                  stockErrors.length > 0
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {stockErrors.length > 0 ? 'Resolve Stock Issues First' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => {
                const adminProduct = products.find(p => p.id === item.id);
                const hasStockError = stockErrors.some(error => error.id === item.id);
                
                return (
                  <div key={index} className={`flex items-center justify-between py-3 border rounded-lg px-3 ${
                    hasStockError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="h-12 w-12 object-contain rounded border"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border rounded text-sm hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="text-sm text-gray-600 px-2">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border rounded text-sm hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        {adminProduct && (
                          <p className="text-xs text-gray-500 mt-1">
                            Stock available: {adminProduct.stock}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      {hasStockError && (
                        <p className="text-xs text-red-600 mt-1">Stock issue</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Totals */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">${calculateSubtotal()}</span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                <span>Total</span>
                <span className="text-purple-600">${totalCost}</span>
              </div>
            </div>

            {/* Order Status Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Order Status Information</h3>
              <p className="text-xs text-blue-700">
                After placing your order, you will receive an Order ID that you can use to track your order status. 
                Your order will initially be set to "Pending" and will be updated by our admin team as it progresses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;