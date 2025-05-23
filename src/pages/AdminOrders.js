import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    
    // If no orders exist, create sample orders
    if (storedOrders.length === 0) {
      const sampleOrders = [
        {
          orderId: "466a653a...",
          customerInfo: {
            fullName: "rghth",
            email: "gpt07@pixelbanget.com",
            address: "123 Main St, Jakarta",
            phoneNumber: "+62 123 456 789"
          },
          items: [
            {
              id: 1,
              title: "Stylish Headphones",
              price: 249.99,
              quantity: 1,
              image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
            },
            {
              id: 2,
              title: "Smart Watch",
              price: 199.99,
              quantity: 1,
              image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"
            }
          ],
          subtotal: "449.98",
          total: "449.98",
          orderDate: "2025-05-22T10:30:00Z",
          status: "pending"
        },
        {
          orderId: "b67ad1c6...",
          customerInfo: {
            fullName: "rghth",
            email: "gpt07@pixelbanget.com",
            address: "456 Oak Ave, Bandung",
            phoneNumber: "+62 987 654 321"
          },
          items: [
            {
              id: 3,
              title: "Minimalist Desk Lamp",
              price: 59.99,
              quantity: 2,
              image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
            },
            {
              id: 4,
              title: "Organic Coffee Beans",
              price: 19.99,
              quantity: 5,
              image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"
            }
          ],
          subtotal: "219.93",
          total: "219.93",
          orderDate: "2025-05-23T14:15:00Z",
          status: "pending"
        }
      ];
      
      setOrders(sampleOrders);
      localStorage.setItem("orders", JSON.stringify(sampleOrders));
    } else {
      // Add status field to existing orders if not present
      const ordersWithStatus = storedOrders.map(order => ({
        ...order,
        status: order.status || 'pending'
      }));
      setOrders(ordersWithStatus);
    }
    setLoading(false);
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.orderId === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-purple-500 border-solid border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/admin"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <span className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <div className="col-span-2">Order ID</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">No orders match your current filter.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.orderId} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Order ID */}
                    <div className="col-span-2">
                      <div className="text-sm font-mono text-gray-900">
                        {order.orderId}
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="col-span-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerInfo.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerInfo.email}
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.orderDate)}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="col-span-2">
                      <div className="text-sm font-semibold text-gray-900">
                        ${order.total}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <Link
                        to={`/admin/order-detail/${order.orderId}`}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;