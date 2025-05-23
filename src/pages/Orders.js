import { useState, useEffect } from "react";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [allOrders, setAllOrders] = useState([]);

  // Order status configuration
  const orderStatuses = {
    'pending': { 
      label: 'Order Placed', 
      color: 'bg-purple-100 text-purple-800',
      icon: '📦'
    },
    'confirmed': { 
      label: 'Processing', 
      color: 'bg-blue-100 text-blue-800',
      icon: '⚙️'
    },
    'preparing': { 
      label: 'Processing', 
      color: 'bg-orange-100 text-orange-800',
      icon: '⚙️'
    },
    'shipping': { 
      label: 'Shipped', 
      color: 'bg-purple-100 text-purple-800',
      icon: '🚚'
    },
    'delivered': { 
      label: 'Delivered', 
      color: 'bg-green-100 text-green-800',
      icon: '✅'
    },
    'completed': { 
      label: 'Delivered', 
      color: 'bg-green-100 text-green-800',
      icon: '✅'
    },
    'cancelled': { 
      label: 'Cancelled', 
      color: 'bg-red-100 text-red-800',
      icon: '❌'
    }
  };

  useEffect(() => {
    // Sample orders data
    const sampleOrders = [
      {
        orderId: '81d25430-3192-4106-a231-7a12cb0214a7',
        orderDate: '2025-05-23',
        status: 'pending',
        total: 449.98,
        customerInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          address: 'Jl. Sudirman No. 123, Jakarta',
          phoneNumber: '+62 812-3456-7890'
        },
        items: [
          {
            title: 'Smart Watch',
            price: 199.99,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60/E5E7EB/6B7280?text=⌚'
          },
          {
            title: 'Stylish Headphones',
            price: 249.99,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60/FCD34D/1F2937?text=🎧'
          }
        ]
      },
      {
        orderId: 'ORD-002',
        orderDate: '2025-05-22',
        status: 'shipping',
        total: 299.99,
        customerInfo: {
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          address: 'Jl. Thamrin No. 456, Jakarta',
          phoneNumber: '+62 813-7890-1234'
        },
        items: [
          {
            title: 'Wireless Earbuds',
            price: 299.99,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=🎵'
          }
        ]
      }
    ];

    // Get orders from localStorage or use sample data
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const ordersToUse = storedOrders.length > 0 ? storedOrders : sampleOrders;
    setAllOrders(ordersToUse);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const handleTrackOrder = () => {
    if (!orderId.trim()) {
      setError("Please enter an Order ID");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call delay
    setTimeout(() => {
      const foundOrder = allOrders.find(
        order => order.orderId.toLowerCase() === orderId.toLowerCase().trim()
      );

      if (foundOrder) {
        setSearchedOrder(foundOrder);
        setError("");
      } else {
        setSearchedOrder(null);
        setError("Order not found. Please check your Order ID and try again.");
      }
      setIsLoading(false);
    }, 500);
  };

  const getStatusProgress = (status) => {
    const statusFlow = ['pending', 'confirmed', 'shipping', 'delivered'];
    return statusFlow.indexOf(status);
  };

  const StatusProgress = ({ currentStatus }) => {
    const steps = [
      { key: 'pending', label: 'Order Placed' },
      { key: 'confirmed', label: 'Processing' },
      { key: 'shipping', label: 'Shipped' },
      { key: 'delivered', label: 'Delivered' }
    ];

    const currentIndex = getStatusProgress(currentStatus);

    return (
      <div className="my-6">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded">
            <div 
              className="h-full bg-purple-500 rounded transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          {steps.map((step, index) => {
            const isActive = index <= currentIndex;
            
            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {isActive ? '✓' : index + 1}
                </div>
                <span className={`text-xs mt-2 text-center max-w-20 ${
                  isActive ? 'text-purple-600 font-medium' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          
          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <input
                type="text"
                placeholder="Enter your Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
              />
              <button
                onClick={handleTrackOrder}
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Tracking...' : 'Track Order'}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Order Details */}
        {searchedOrder && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-gray-900">{searchedOrder.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(searchedOrder.orderDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold text-gray-900">${searchedOrder.total}</p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="px-6 py-6">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Status: {orderStatuses[searchedOrder.status]?.label || 'Unknown'}
                </h3>
              </div>
              
              <StatusProgress currentStatus={searchedOrder.status} />
            </div>

            {/* Ordered Items */}
            <div className="px-6 py-4 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Ordered Items</h4>
              <div className="space-y-4">
                {searchedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="h-16 w-16 object-contain rounded border bg-white"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.title}</h5>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sample Order ID for testing */}
        {!searchedOrder && !error && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">Sample Order ID for testing:</p>
            <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
              81d25430-3192-4106-a231-7a12cb0214a7
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;