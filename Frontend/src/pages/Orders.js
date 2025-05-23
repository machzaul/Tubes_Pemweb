
import { useState, useEffect } from "react";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [allOrders, setAllOrders] = useState([]);

  // Order status configuration - matching admin dashboard
  const orderStatuses = {
    'pending': { 
      label: 'Pending', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '⏳'
    },
    'confirmed': { 
      label: 'Confirmed', 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '✅'
    },
    'preparing': { 
      label: 'Preparing', 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: '👨‍🍳'
    },
    'shipping': { 
      label: 'Shipping', 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: '🚚'
    },
    'delivered': { 
      label: 'Delivered', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '📦'
    },
    'completed': { 
      label: 'Completed', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '✨'
    },
    'cancelled': { 
      label: 'Cancelled', 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '❌'
    }
  };

  useEffect(() => {
    // Sample orders data with various statuses
    const sampleOrders = [
      {
        orderId: '81d25430-3192-4106-a231-7a12cb0214a7',
        orderDate: '2025-05-23T08:30:00.000Z',
        status: 'confirmed',
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
        ],
        statusHistory: [
          {
            status: 'pending',
            timestamp: '2025-05-23T08:30:00.000Z',
            updatedBy: 'system',
            note: 'Order placed successfully'
          },
          {
            status: 'confirmed',
            timestamp: '2025-05-23T09:15:00.000Z',
            updatedBy: 'admin',
            note: 'Order confirmed and payment verified'
          }
        ]
      },
      {
        orderId: 'ORD-002',
        orderDate: '2025-05-22T14:20:00.000Z',
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
        ],
        statusHistory: [
          {
            status: 'pending',
            timestamp: '2025-05-22T14:20:00.000Z',
            updatedBy: 'system',
            note: 'Order placed successfully'
          },
          {
            status: 'confirmed',
            timestamp: '2025-05-22T15:00:00.000Z',
            updatedBy: 'admin',
            note: 'Order confirmed'
          },
          {
            status: 'preparing',
            timestamp: '2025-05-22T16:30:00.000Z',
            updatedBy: 'admin',
            note: 'Order is being prepared'
          },
          {
            status: 'shipping',
            timestamp: '2025-05-23T10:00:00.000Z',
            updatedBy: 'admin',
            note: 'Order shipped via express delivery'
          }
        ]
      },
      {
        orderId: 'ORD-003',
        orderDate: '2025-05-21T10:15:00.000Z',
        status: 'completed',
        total: 159.99,
        customerInfo: {
          fullName: 'Mike Johnson',
          email: 'mike@example.com',
          address: 'Jl. Gatot Subroto No. 789, Jakarta',
          phoneNumber: '+62 814-5678-9012'
        },
        items: [
          {
            title: 'Bluetooth Speaker',
            price: 159.99,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60/10B981/FFFFFF?text=🔊'
          }
        ],
        statusHistory: [
          {
            status: 'pending',
            timestamp: '2025-05-21T10:15:00.000Z',
            updatedBy: 'system',
            note: 'Order placed successfully'
          },
          {
            status: 'confirmed',
            timestamp: '2025-05-21T11:00:00.000Z',
            updatedBy: 'admin',
            note: 'Order confirmed'
          },
          {
            status: 'preparing',
            timestamp: '2025-05-21T14:00:00.000Z',
            updatedBy: 'admin',
            note: 'Order is being prepared'
          },
          {
            status: 'shipping',
            timestamp: '2025-05-22T09:00:00.000Z',
            updatedBy: 'admin',
            note: 'Order shipped'
          },
          {
            status: 'delivered',
            timestamp: '2025-05-22T18:30:00.000Z',
            updatedBy: 'system',
            note: 'Order delivered successfully'
          },
          {
            status: 'completed',
            timestamp: '2025-05-23T08:00:00.000Z',
            updatedBy: 'customer',
            note: 'Order completed by customer'
          }
        ]
      },
      {
        orderId: 'ORD-004',
        orderDate: '2025-05-20T16:45:00.000Z',
        status: 'cancelled',
        total: 89.99,
        customerInfo: {
          fullName: 'Sarah Wilson',
          email: 'sarah@example.com',
          address: 'Jl. Kuningan No. 321, Jakarta',
          phoneNumber: '+62 815-9012-3456'
        },
        items: [
          {
            title: 'Phone Case',
            price: 89.99,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60/EF4444/FFFFFF?text=📱'
          }
        ],
        statusHistory: [
          {
            status: 'pending',
            timestamp: '2025-05-20T16:45:00.000Z',
            updatedBy: 'system',
            note: 'Order placed successfully'
          },
          {
            status: 'cancelled',
            timestamp: '2025-05-20T18:00:00.000Z',
            updatedBy: 'customer',
            note: 'Order cancelled by customer request'
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    const statusFlow = ['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'completed'];
    const currentIndex = statusFlow.indexOf(status);
    return currentIndex >= 0 ? currentIndex : -1;
  };

  const StatusProgress = ({ currentStatus, statusHistory }) => {
    // If order is cancelled, show different flow
    if (currentStatus === 'cancelled') {
      return (
        <div className="my-6">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-lg">
                ❌
              </div>
              <span className="text-sm mt-2 text-red-600 font-medium">Order Cancelled</span>
              <p className="text-xs text-gray-500 mt-1 text-center max-w-xs">
                This order has been cancelled and will not be processed further.
              </p>
            </div>
          </div>
        </div>
      );
    }

    const steps = [
      { key: 'pending', label: 'Order Placed', icon: '⏳' },
      { key: 'confirmed', label: 'Confirmed', icon: '✅' },
      { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
      { key: 'shipping', label: 'Shipping', icon: '🚚' },
      { key: 'delivered', label: 'Delivered', icon: '📦' },
      { key: 'completed', label: 'Completed', icon: '✨' }
    ];

    const currentIndex = getStatusProgress(currentStatus);

    return (
      <div className="my-6">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          {steps.map((step, index) => {
            const isActive = index <= currentIndex;
            const isCompleted = index < currentIndex;
            
            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white' 
                    : isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {isCompleted ? '✓' : isActive ? step.icon : index + 1}
                </div>
                <span className={`text-xs mt-2 text-center max-w-16 leading-tight ${
                  isActive ? 'text-blue-600 font-medium' : 'text-gray-400'
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
                className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
              />
              <button
                onClick={handleTrackOrder}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
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
                <div className="mt-4 sm:mt-0 sm:ml-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${orderStatuses[searchedOrder.status]?.color || orderStatuses['pending'].color}`}>
                    <span className="mr-1">{orderStatuses[searchedOrder.status]?.icon || '⏳'}</span>
                    {orderStatuses[searchedOrder.status]?.label || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Status Progress */}
            <div className="px-6 py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h3>
              <StatusProgress currentStatus={searchedOrder.status} statusHistory={searchedOrder.statusHistory} />
            </div>

            {/* Status History */}
            {searchedOrder.statusHistory && searchedOrder.statusHistory.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Status History</h4>
                <div className="space-y-3">
                  {searchedOrder.statusHistory.slice().reverse().map((history, historyIndex) => (
                    <div key={historyIndex} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${orderStatuses[history.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {orderStatuses[history.status]?.icon || '📝'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              {orderStatuses[history.status]?.label || history.status}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {history.note}
                            </p>
                          </div>
                          <div className="text-right text-xs text-gray-500">
                            <div>{formatDate(history.timestamp)}</div>
                            <div className="mt-1">by {history.updatedBy}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-gray-900">
                  Total: <span className="text-blue-600">${searchedOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderTracking;