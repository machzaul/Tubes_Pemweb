import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Rupiah from "../components/Rupiah";
import OrderSuccessAlert from "../components/ui/OrderSuccessAlert";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/Alert"; // sesuaikan path jika berbeda


const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // Products from backend
  const [stockErrors, setStockErrors] = useState([]); // Track stock validation errors
  const [copied, setCopied] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    phoneNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [redirectTimer, setRedirectTimer] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:6543/api'; // Adjust to your backend URL

  

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // Redirect if cart is empty
    if (storedCart.length === 0) {
      alert("Your cart is empty. Please add some products first.");
      navigate("/products");
      return;
    }

    // Fetch products from backend
    fetchProducts();
  }, [navigate]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);

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
      alert('Error fetching product information. Please try again.');
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
      alert("All items in your cart are out of stock. Redirecting to products page.");
      navigate("/products");
    }
  };

  // Update cart item quantity with stock validation
  const updateCartQuantity = (productId, newQuantity) => {
    const backendProduct = products.find(p => p.id === productId);
    
    if (!backendProduct) {
      alert("This product is no longer available.");
      return;
    }
    
    if (newQuantity > backendProduct.stock) {
      alert(`Sorry, only ${backendProduct.stock} items are available in stock.`);
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

  // Calculate subtotal and total
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(0);
  };

  const shippingCost = 0;
  const totalCost = (parseFloat(calculateSubtotal()) + shippingCost).toFixed(0);

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

  // Handle successful order placement
  const handleOrderSuccess = (successOrderId) => {
    setOrderId(successOrderId);
    setShowSuccessAlert(true);
    
    // Set up redirect timer (5 seconds)
    //const timer = setTimeout(() => {
    //  navigate("/orders");
    //}, 5000);
    
    //setRedirectTimer(timer);
  };

  // Handle alert close (manual close or after copy)
  const handleAlertClose = () => {
    setShowSuccessAlert(false);

    // Hanya pindah ke halaman orders jika Order ID sudah disalin
    if (copied) {
      navigate("/orders");
    } else {
      setShowWarningAlert(true); // munculkan kembali alert
    }
  };

  // Handle copy action
  const handleCopySuccess = () => {
    console.log('Order ID copied successfully');
    setCopied(true); // aktifkan flag setelah copy
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Check if there are any stock errors
    if (stockErrors.length > 0) {
      alert("Please resolve stock issues before placing your order. You can use the 'Fix Cart' button to automatically adjust quantities.");
      return;
    }
    
    // Validate form
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.address || !customerInfo.phoneNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

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
        alert(`Stock has changed for: ${finalValidation.join(', ')}. Please refresh and try again.`);
        window.location.reload();
        return;
      }

      // Generate unique order ID
      const generatedOrderId = generateOrderId();

      // Prepare order data for backend
      const orderData = {
        orderId: generatedOrderId,
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
      window.dispatchEvent(new Event("cartUpdated"));
      
      // Show success alert with order ID
      handleOrderSuccess(createdOrder.orderId || generatedOrderId);

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
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
                        <Rupiah value={(item.price * item.quantity).toFixed(0)}/>
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
                <span className="font-semibold"><Rupiah value={calculateSubtotal()}/></span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                <span>Total</span>
                <span className="text-purple-600"><Rupiah value={totalCost}/></span>
              </div>
            </div>

            {/* Order Status Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Informasi status pengiriman</h3>
              <p className="text-xs text-blue-700">
                Setelah Anda melakukan pemesanan, Anda akan menerima ID Pesanan yang dapat digunakan untuk melacak status pesanan Anda.
                Pesanan Anda akan awalnya berstatus "Pending" dan akan diperbarui oleh tim admin kami seiring dengan proses berjalan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <OrderSuccessAlert
          orderId={orderId}
          onClose={handleAlertClose}
          onCopy={handleCopySuccess}
        />
      )}
      {showWarningAlert && (
        <Alert 
          variant="warning" 
          show={showWarningAlert}
          onClose={() => setShowWarningAlert(false)}
          autoClose={false} // agar tidak hilang otomatis
        >
          <div>
            <AlertTitle>Kamu Harus menyalin pengiriman ID </AlertTitle>
            <AlertDescription>
              Tolong salin ID pengiriman anda supaya bisa melacak status pengiriman.
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default Checkout;