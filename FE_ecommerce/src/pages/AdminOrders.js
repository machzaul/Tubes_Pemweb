// AdminOrderManagement.js
import { useState, useEffect } from "react";
import Rupiah from "../components/Rupiah";

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:6543/api"; // Sesuaikan dengan port API Anda

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

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Sort orders by created date (newest first)
      const sortedOrders = data.orders.sort((a, b) => 
        new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate)
      );
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status, note = '') => {
    if (!status) {
      alert('Please select a status');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: status,
          note: note || `Status updated to ${orderStatuses[status]?.label || status}`,
          updatedBy: 'admin'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedOrder = await response.json();
      
      // Update the orders state with the updated order
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      // Reset form
      setSelectedOrder(null);
      setNewStatus("");
      setStatusNote("");
      
      alert(`Order ${updatedOrder.orderId} status updated to ${orderStatuses[status]?.label || status}`);
      
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`Error updating order status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId, orderIdString) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderIdString}? This will also restore the stock for ordered items.`)) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Remove the order from state
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
      alert(`Order ${orderIdString} deleted successfully and stock restored`);
      
    } catch (error) {
      console.error('Error deleting order:', error);
      alert(`Error deleting order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRefresh = () => {
    loadOrders();
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin - Order Management</h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {orders.length === 0 && !loading ? (
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
                <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                          {order.updatedAt && order.updatedAt !== order.createdAt && (
                            <p className="text-xs text-gray-500">
                              Last updated: {formatDate(order.updatedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          <span className="mr-1">{statusInfo.icon}</span>
                          {statusInfo.label}
                        </span>
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === index ? null : index)}
                          disabled={loading}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {selectedOrder === index ? 'Cancel' : 'Update Status'}
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id, order.orderId)}
                          disabled={loading}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Delete
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
                            onClick={() => updateOrderStatus(order.id, newStatus, statusNote)}
                            disabled={!newStatus || loading}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                          >
                            {loading ? 'Updating...' : 'Update Status'}
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
                        <span className="font-medium">Name:</span> {order.customerInfo?.fullName || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {order.customerInfo?.email || 'N/A'}
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium">Address:</span> {order.customerInfo?.address || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {order.customerInfo?.phoneNumber || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-2">
                      {order.items && order.items.length > 0 ? order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={item.product?.image || item.image || '/placeholder-image.png'} 
                              alt={item.product?.title || item.title || 'Product'} 
                              className="h-10 w-10 object-contain rounded border bg-white"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.png';
                              }}
                            />
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">
                                {item.product?.title || item.title || 'Unknown Product'}
                              </h5>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity} × <Rupiah value={item.price}/>
                              </p>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            <Rupiah value={((item.price || 0) * (item.quantity || 1)).toFixed(0)}/>
                          </div>
                        </div>
                      )) : (
                        <p className="text-gray-500 text-sm">No items found</p>
                      )}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-gray-900">
                        Total: <span className="text-purple-600"><Rupiah value={order.total}/></span>
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