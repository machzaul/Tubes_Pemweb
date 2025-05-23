import { useState, useEffect } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders.reverse()); // Show latest orders first
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="mt-2 text-gray-500">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.orderDate)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="px-6 pt-4 pb-2">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Customer Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Name:</span> {order.customerInfo.fullName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {order.customerInfo.email}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium">Address:</span> {order.customerInfo.address}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {order.customerInfo.phoneNumber}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Items Ordered</h4>
                  <div className="space-y-4">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="h-16 w-16 object-contain rounded border bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.title}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal:</span>
                        <span>${order.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping:</span>
                        <span className="text-green-600">Free</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        Total: <span className="text-purple-600">${order.total}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;