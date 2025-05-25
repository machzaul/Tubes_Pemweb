// AdminOrderManagement.js
import { useState, useEffect } from "react";
import Rupiah from "../components/Rupiah";
import { useNavigate } from "react-router-dom";


const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  const API_BASE_URL = "http://localhost:6543/api";

  const orderStatuses = {
    'pending': { 
      label: 'Pending', 
      color: 'bg-yellow-100 text-yellow-800',
      icon: '⏳',
      priority: 1
    },
    'confirmed': { 
      label: 'Confirmed', 
      color: 'bg-blue-100 text-blue-800',
      icon: '✅',
      priority: 2
    },
    'preparing': { 
      label: 'Preparing', 
      color: 'bg-orange-100 text-orange-800',
      icon: '👨‍🍳',
      priority: 3
    },
    'shipping': { 
      label: 'Shipping', 
      color: 'bg-purple-100 text-purple-800',
      icon: '🚚',
      priority: 4
    },
    'delivered': { 
      label: 'Delivered', 
      color: 'bg-green-100 text-green-800',
      icon: '📦',
      priority: 5
    },
    'completed': { 
      label: 'Completed', 
      color: 'bg-green-100 text-green-800',
      icon: '✨',
      priority: 6
    },
    'cancelled': { 
      label: 'Cancelled', 
      color: 'bg-red-100 text-red-800',
      icon: '❌',
      priority: 7
    }
  };

  // Custom sorting function
  const sortOrders = (ordersArray) => {
    return ordersArray.sort((a, b) => {
      const aStatus = orderStatuses[a.status] || { priority: 999 };
      const bStatus = orderStatuses[b.status] || { priority: 999 };
      
      // First sort by status priority
      if (aStatus.priority !== bStatus.priority) {
        return aStatus.priority - bStatus.priority;
      }
      
      // If same status, sort by date (newest first)
      const aDate = new Date(a.createdAt || a.orderDate || 0);
      const bDate = new Date(b.createdAt || b.orderDate || 0);
      return bDate - aDate;
    });
  };

  // Calculate pagination
  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  useEffect(() => {
    loadOrders();
  }, []);

  // Reset to first page when orders change
  useEffect(() => {
    setCurrentPage(1);
    setExpandedOrders(new Set());
    setSelectedOrder(null);
  }, [orders.length]);

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
      
      // Apply custom sorting
      const sortedOrders = sortOrders(data.orders);
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const restoreStock = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/restore-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to restore stock');
      }

      return true;
    } catch (error) {
      console.error('Error restoring stock:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status, note = '') => {
    if (!status) {
      alert('Please select a status');
      return;
    }

    const currentOrder = orders.find(order => order.id === orderId);
    const previousStatus = currentOrder?.status;

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
          updatedBy: 'admin',
          previousStatus: previousStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedOrder = await response.json();
      
      // If status changed to cancelled, restore stock
      if (status === 'cancelled' && previousStatus !== 'cancelled') {
        try {
          await restoreStock(orderId);
          console.log('Stock restored for cancelled order');
        } catch (stockError) {
          console.error('Failed to restore stock:', stockError);
          // Continue with status update even if stock restore fails
        }
      }
      
      // Update the orders state and re-sort
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        );
        return sortOrders(updatedOrders);
      });
      
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
    const orderToDelete = orders.find(order => order.id === orderId);
    const shouldRestoreStock = orderToDelete && orderToDelete.status !== 'completed';
    
    const confirmMessage = shouldRestoreStock 
      ? `Are you sure you want to delete order ${orderIdString}? This will also restore the stock for ordered items.`
      : `Are you sure you want to delete order ${orderIdString}? Stock will NOT be restored as this order is completed.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      
      // If order is not completed, restore stock first
      if (shouldRestoreStock) {
        try {
          await restoreStock(orderId);
          console.log('Stock restored before deletion');
        } catch (stockError) {
          console.error('Failed to restore stock before deletion:', stockError);
          if (!window.confirm('Failed to restore stock. Continue with deletion anyway?')) {
            return;
          }
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          restoreStock: shouldRestoreStock
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Remove the order from state
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
      const stockMessage = shouldRestoreStock 
        ? ' and stock restored' 
        : ' (stock not restored - order was completed)';
      
      alert(`Order ${orderIdString} deleted successfully${stockMessage}`);
      
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
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleRefresh = () => {
    loadOrders();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedOrders(new Set()); // Collapse all expanded orders when changing page
    setSelectedOrder(null); // Close any open update forms
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin - Order Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, totalOrders)} of {totalOrders} orders
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Sorted by status priority: Pending → Confirmed → Preparing → Shipping → Delivered → Completed → Cancelled
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => navigate("/adminDashboard")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {orders.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-lg font-medium text-gray-900">No Orders</h3>
              <p className="mt-2 text-gray-500">No orders have been placed yet.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-2">Order ID</div>
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {currentOrders.map((order) => {
                  const statusInfo = orderStatuses[order.status] || orderStatuses['pending'];
                  const isExpanded = expandedOrders.has(order.id);
                  const isCompleted = order.status === 'completed';
                  
                  return (
                    <div key={order.id}>
                      {/* Main Row */}
                      <div 
                        className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center text-sm">
                          <div className="col-span-2 font-medium text-gray-900">
                            {order.orderId.length > 8 ? `${order.orderId.substring(0, 8)}...` : order.orderId}
                          </div>
                          <div className="col-span-3">
                            <div className="font-medium text-gray-900">
                              {order.customerInfo?.fullName || 'N/A'}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {order.customerInfo?.email || 'N/A'}
                            </div>
                          </div>
                          <div className="col-span-2 text-gray-900">
                            {formatDate(order.orderDate)}
                          </div>
                          <div className="col-span-2 font-semibold text-gray-900">
                            <Rupiah value={order.total}/>
                          </div>
                          <div className="col-span-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="col-span-1 relative">
                            <select
                              value={order.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                if (e.target.value !== order.status) {
                                  updateOrderStatus(order.id, e.target.value);
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {Object.entries(orderStatuses).map(([key, status]) => (
                                <option key={key} value={key}>{status.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Customer Information */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h4>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div><span className="font-medium">Full Name:</span> {order.customerInfo?.fullName || 'N/A'}</div>
                                <div><span className="font-medium">Email:</span> {order.customerInfo?.email || 'N/A'}</div>
                                <div><span className="font-medium">Phone:</span> {order.customerInfo?.phoneNumber || 'N/A'}</div>
                                <div><span className="font-medium">Address:</span> {order.customerInfo?.address || 'N/A'}</div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {order.items && order.items.length > 0 ? order.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                    <div className="flex items-center space-x-3">
                                      <img 
                                        src={item.product?.image || item.image || '/placeholder-image.png'} 
                                        alt={item.product?.title || item.title || 'Product'} 
                                        className="h-8 w-8 object-cover rounded border"
                                        onError={(e) => {
                                          e.target.src = '/placeholder-image.png';
                                        }}
                                      />
                                      <div>
                                        <h5 className="text-xs font-medium text-gray-900">
                                          {item.product?.title || item.title || 'Unknown Product'}
                                        </h5>
                                        <p className="text-xs text-gray-600">
                                          Qty: {item.quantity} × <Rupiah value={item.price}/>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-900">
                                      <Rupiah value={((item.price || 0) * (item.quantity || 1)).toFixed(0)}/>
                                    </div>
                                  </div>
                                )) : (
                                  <p className="text-gray-500 text-xs">No items found</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Status History */}
                          {order.statusHistory && order.statusHistory.length > 0 && (
                            <div className="mt-6">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">Status History</h4>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {order.statusHistory.slice().reverse().map((history, historyIndex) => (
                                  <div key={historyIndex} className="flex justify-between items-start text-xs text-gray-600 bg-white p-2 rounded">
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

                          {/* Action Buttons */}
                          <div className="mt-4 flex space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(selectedOrder === order.id ? null : order.id);
                              }}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              {selectedOrder === order.id ? 'Cancel Update' : 'Update Status'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteOrder(order.id, order.orderId);
                              }}
                              className={`px-3 py-1 text-xs rounded ${
                                isCompleted 
                                  ? 'bg-orange-600 hover:bg-orange-700' 
                                  : 'bg-red-600 hover:bg-red-700'
                              } text-white`}
                              title={isCompleted ? 'Delete (Stock will NOT be restored)' : 'Delete (Stock will be restored)'}
                            >
                              {isCompleted ? 'Delete (No Stock Restore)' : 'Delete'}
                            </button>
                          </div>

                          {/* Update Status Form */}
                          {selectedOrder === order.id && (
                            <div className="mt-4 p-4 bg-white rounded border">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">Update Order Status</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    New Status
                                  </label>
                                  <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                                  >
                                    <option value="">Select Status</option>
                                    {Object.entries(orderStatuses).map(([key, status]) => (
                                      <option key={key} value={key}>{status.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Note (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={statusNote}
                                    onChange={(e) => setStatusNote(e.target.value)}
                                    placeholder="Add a note..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                                  />
                                </div>
                                <div className="flex items-end">
                                  <button
                                    onClick={() => updateOrderStatus(order.id, newStatus, statusNote)}
                                    disabled={!newStatus || loading}
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-xs"
                                  >
                                    {loading ? 'Updating...' : 'Update Status'}
                                  </button>
                                </div>
                              </div>
                              {newStatus === 'cancelled' && (
                                <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                                  ⚠️ Changing to cancelled will restore stock for all items in this order
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {generatePageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={index} className="px-3 py-2 text-sm text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm border rounded-md ${
                            currentPage === page
                              ? 'inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrderManagement;