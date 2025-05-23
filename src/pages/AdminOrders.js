// AdminOrderManagement.js
import { useState, useEffect } from "react";

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");

  const orderStatuses = {
    'pending': { 
      label: 'Pending', 
      color: 'bg-yellow-100 text-yellow-800',
      icon: '⏳'
    },
    'confirmed': { 
      label: 'Confirmed', 
      color: 'bg-blue-100 text-blue-800',
      icon: '✅'
    },
    'preparing': { 
      label: 'Preparing', 
      color: 'bg-orange-100 text-orange-800',
      icon: '👨‍🍳'
    },
    'shipping': { 
      label: 'Shipping', 
      color: 'bg-purple-100 text-purple-800',
      icon: '🚚'
    },
    'delivered': { 
      label: 'Delivered', 
      color: 'bg-green-100 text-green-800',
      icon: '📦'
    },
    'completed': { 
      label: 'Completed', 
      color: 'bg-green-100 text-green-800',
      icon: '✨'
    },
    'cancelled': { 
      label: 'Cancelled', 
      color: 'bg-red-100 text-red-800',
      icon: '❌'
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders.reverse()); // Show latest orders first
  };

  const updateOrderStatus = (orderIndex, status, note = '') => {
    const updatedOrders = [...orders];
    const order = updatedOrders[orderIndex];
    
    // Update status
    order.status = status;
    order.updatedAt = new Date().toISOString();
    
    // Add to status history
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      updatedBy: 'admin',
      note: note || `Status updated to ${orderStatuses[status]?.label || status}`
    });
    
    setOrders(updatedOrders);
    
    // Update localStorage
    localStorage.setItem("orders", JSON.stringify(updatedOrders.reverse()));
    
    // Reload orders to maintain correct order
    loadOrders();
    
    // Reset form
    setSelectedOrder(null);
    setNewStatus("");
    setStatusNote("");
    
    alert(`Order ${order.orderId} status updated to ${orderStatuses[status]?.label || status}`);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin - Order Management</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-lg font-medium text-gray-900">No Orders</h3>
              <p className="mt-2 text-gray-500">No orders have been placed yet.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const statusInfo = orderStatuses[order.status] || orderStatuses['pending'];
              
              return (
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
                      <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          <span className="mr-1">{statusInfo.icon}</span>
                          {statusInfo.label}
                        </span>
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === index ? null : index)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          {selectedOrder === index ? 'Cancel' : 'Update Status'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Update Status Form */}
                  {selectedOrder === index && (
                    <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Update Order Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Status
                          </label>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="">Select Status</option>
                            {Object.entries(orderStatuses).map(([key, status]) => (
                              <option key={key} value={key}>{status.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Note (Optional)
                          </label>
                          <input
                            type="text"
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                            placeholder="Add a note..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => updateOrderStatus(index, newStatus, statusNote)}
                            disabled={!newStatus}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                          >
                            Update Status
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

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
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="h-10 w-10 object-contain rounded border bg-white"
                            />
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">
                                {item.title}
                              </h5>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity} × ${item.price}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
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
                        Total: <span className="text-purple-600">${order.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status History */}
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Status History</h4>
                      <div className="space-y-2">
                        {order.statusHistory.slice().reverse().map((history, historyIndex) => (
                          <div key={historyIndex} className="flex justify-between items-start text-xs text-gray-600">
                            <div>
                              <span className="font-medium">{orderStatuses[history.status]?.label || history.status}</span>
                              {history.note && <span className="ml-2">- {history.note}</span>}
                            </div>
                            <div className="text-right">
                              <div>{formatDate(history.timestamp)}</div>
                              <div className="text-gray-400">by {history.updatedBy}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderManagement;