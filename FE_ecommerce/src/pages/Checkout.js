import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAlert from "../hooks/useAlert"; // Sesuaikan path
import AlertContainer from "../components/ui/Alert"; // Sesuaikan path

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // Products from backend
  const [stockErrors, setStockErrors] = useState([]); // Track stock validation errors
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    phoneNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Gunakan alert hook
  const { alerts, showSuccess, showError, showWarning, showInfo, removeAlert } = useAlert();

  const API_BASE_URL = 'http://localhost:6543/api'; // Adjust to your backend URL

  // Fungsi untuk copy ke clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Order ID copied to clipboard!", "Copied!");
    } catch (err) {
      // Fallback untuk browser yang tidak support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showSuccess("Order ID copied to clipboard!", "Copied!");
    }
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // Redirect if cart is empty
    if (storedCart.length === 0) {
      showWarning("Please add some products to your cart first.", "Cart is Empty");
      setTimeout(() => {
        navigate("/products");
      }, 2000);
      return;
    }

    // Fetch products from backend
    fetchProducts();
  }, [navigate]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products);
      
      // Validate cart stock after fetching products
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      validateCartStock(storedCart, data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Error fetching product information. Please try again.', 'Network Error');
    }
  };

  // Validate cart items against available stock
  const validateCartStock = (cartItems, backendProducts) => {
    const errors = [];
    
    cartItems.forEach(cartItem => {
      const backendProduct = backendProducts.find(p => p.id === cartItem.id);
      if (!backendProduct) {
        errors.push({
          id: cartItem.id,
          title: cartItem.title,
          message: "Product is no longer available"
        });
      } else if (cartItem.quantity > backendProduct.stock) {
        errors.push({
          id: cartItem.id,
          title: cartItem.title,
          requestedQty: cartItem.quantity,
          availableStock: backendProduct.stock,
          message: `Only ${backendProduct.stock} items available (you have ${cartItem.quantity} in cart)`
        });
      }
    });
    
    setStockErrors(errors);
    
    if (errors.length > 0) {
      showWarning("Some items in your cart have stock issues. Please review them before checkout.", "Stock Issues Detected");
    }
  };

  // Fix cart quantities to match available stock
  const fixCartQuantities = () => {
    const updatedCart = cart.map(cartItem => {
      const backendProduct = products.find(p => p.id === cartItem.id);
      if (backendProduct && cartItem.quantity > backendProduct.stock) {
        return {
          ...cartItem,
          quantity: backendProduct.stock
        };
      }
      return cartItem;
    }).filter(cartItem => {
      // Remove items that are no longer available
      const backendProduct = products.find(p => p.id === cartItem.id);
      return backendProduct && backendProduct.stock > 0;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Re-validate after fixing
    validateCartStock(updatedCart, products);
    
    if (updatedCart.length === 0) {
      showError("All items in your cart are out of stock. Redirecting to products page.", "No Available Items");
      setTimeout(() => {
        navigate("/products");
      }, 3000);
    } else {
      showSuccess("Cart quantities have been adjusted to match available stock.", "Cart Updated");
    }
  };

  // Update cart item quantity with stock validation
  const updateCartQuantity = (productId, newQuantity) => {
    const backendProduct = products.find(p => p.id === productId);
    
    if (!backendProduct) {
      showError("This product is no longer available.", "Product Unavailable");
      return;
    }
    
    if (newQuantity > backendProduct.stock) {
      showWarning(`Sorry, only ${backendProduct.stock} items are available in stock.`, "Insufficient Stock");
      return;
    }
    
    if (newQuantity <= 0) {
      // Remove item from cart
      const updatedCart = cart.filter(item => item.id !== productId);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      validateCartStock(updatedCart, products);
      showInfo("Item removed from cart.", "Item Removed");
      return;
    }

    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    validateCartStock(updatedCart, products);
  };

  // Calculate subtotal and total
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
    return `ORD-${timestamp.substr(-8)}-${random.toUpperCase()}`;
  };

  // Update product stock in backend
  const updateProductStock = async (productId, newStock) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock: newStock
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update product stock');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  };

  // Create order in backend
  const createOrder = async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Check if there are any stock errors
    if (stockErrors.length > 0) {
      showError("Please resolve stock issues before placing your order. Use the 'Fix Cart' button to automatically adjust quantities.", "Stock Issues Detected");
      return;
    }
    
    // Validate form
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.address || !customerInfo.phoneNumber) {
      showWarning("Please fill in all required fields.", "Incomplete Information");
      return;
    }

    setLoading(true);
    showInfo("Processing your order...", "Please Wait");

    try {
      // Final stock validation before placing order
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch current stock');
      }
      const { products: currentProducts } = await response.json();
      
      const finalValidation = [];
      cart.forEach(cartItem => {
        const currentProduct = currentProducts.find(p => p.id === cartItem.id);
        if (!currentProduct || cartItem.quantity > currentProduct.stock) {
          finalValidation.push(cartItem.title);
        }
      });

      if (finalValidation.length > 0) {
        showError(`Stock has changed for: ${finalValidation.join(', ')}. Please refresh and try again.`, "Stock Changed");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return;
      }

      // Generate unique order ID
      const orderId = generateOrderId();

      // Prepare order data for backend
      const orderData = {
        orderId: orderId,
        customerInfo: {
          fullName: customerInfo.fullName,
          email: customerInfo.email,
          address: customerInfo.address,
          phoneNumber: customerInfo.phoneNumber
        },
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: parseFloat(calculateSubtotal()),
        shipping: shippingCost,
        total: parseFloat(totalCost),
        status: 'pending',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date().toISOString(),
            updatedBy: 'system',
            note: 'Order placed by customer'
          }
        ]
      };

      // Create order in backend
      const createdOrder = await createOrder(orderData);

      // Update product stock for each item in the cart
      const stockUpdatePromises = cart.map(async (cartItem) => {
        const currentProduct = currentProducts.find(p => p.id === cartItem.id);
        if (currentProduct) {
          const newStock = currentProduct.stock - cartItem.quantity;
          return updateProductStock(cartItem.id, newStock);
        }
      });

      // Wait for all stock updates to complete
      await Promise.all(stockUpdatePromises);

      // Clear cart from localStorage
      localStorage.removeItem("cart");
      
      // Show success alert with copy feature
      const finalOrderId = createdOrder.orderId || orderId;
      showOrderSuccessAlert(finalOrderId);
      
      setTimeout(() => {
        navigate("/orders");
      }, 5000);

    } catch (error) {
      console.error('Error placing order:', error);
      showError('Failed to place order. Please try again.', 'Order Failed');
    } finally {
      setLoading(false);
    }
  };

  // Custom success alert dengan copy functionality
  const showOrderSuccessAlert = (orderId) => {
    const customAlert = {
      id: Date.now().toString(),
      variant: 'success',
      title: 'Order Placed Successfully!',
      message: orderId,
      autoClose: false, // Jangan auto close
      duration: 0
    };
    
    // Custom alert dengan tombol copy
    const { alerts: currentAlerts, removeAlert: currentRemoveAlert } = useAlert();
    
    // Tambahkan alert ke state
    const alertElement = (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
        <div className="flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm bg-green-50 border-green-200 text-green-800">
          {/* Success Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">Order Placed Successfully!</h4>
            <div className="mt-2 p-2 bg-white rounded border">
              <p className="text-xs text-gray-600 mb-1">Order ID:</p>
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-800">{orderId}</code>
                <button
                  onClick={() => copyToClipboard(orderId)}
                  className="ml-2 p-1 text-green-600 hover:text-green-800 transition-colors"
                  title="Copy to clipboard"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-xs opacity-90 mt-2">You can track your order using this ID. Redirecting to orders page...</p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => {}}
            className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );

    // Render custom alert (ini akan ditangani oleh state management yang lebih kompleks)
    // Untuk sekarang, kita gunakan showSuccess biasa dengan informasi lengkap
    showSuccess(
      `Your order has been placed successfully! Order ID: ${orderId}. Click here to copy the Order ID. You can track your order using this ID.`,
      "Order Placed Successfully!"
    );
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="p-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    );
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
                disabled={stockErrors.length > 0 || loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors shadow-lg ${
                  stockErrors.length > 0 || loading
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {loading ? 'Processing Order...' : 
                 stockErrors.length > 0 ? 'Resolve Stock Issues First' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => {
                const backendProduct = products.find(p => p.id === item.id);
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
                        {backendProduct && (
                          <p className="text-xs text-gray-500 mt-1">
                            Stock available: {backendProduct.stock}
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

      {/* Alert Container */}
      <AlertContainer alerts={alerts} onRemoveAlert={removeAlert} />
    </div>
  );
};

export default Checkout;