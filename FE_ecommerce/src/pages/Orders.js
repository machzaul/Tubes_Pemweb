
import { useState, useEffect } from "react";
import Rupiah from "../components/Rupiah";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [allOrders, setAllOrders] = useState([]);

  const API_BASE_URL = "http://localhost:6543/api"; // Sesuaikan dengan alamat backend kamu


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
    const fetchAllOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        const data = await response.json();
        setAllOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to load all orders:", err);
      }
    };

    fetchAllOrders();
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

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError("Please enter an Order ID");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/orders/order-id/${orderId.trim()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Order not found");
      }

      const order = await response.json();
      setSearchedOrder(order);
    } catch (err) {
      setSearchedOrder(null);
      setError(err.message || "Failed to fetch order. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
                    <p className="font-semibold text-gray-900"><Rupiah value={searchedOrder.total}/></p>
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
                      src={item.product.image} 
                      alt={item.product.title} 
                      className="h-16 w-16 object-contain rounded border bg-white"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.product.title}</h5>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × <Rupiah value={item.price}/>
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      <Rupiah value={((item.price || 0) * (item.quantity || 1)).toFixed(0)}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-gray-900">
                  Total: <span className="text-blue-600"><Rupiah value={searchedOrder.total}/></span>
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