
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '../../components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '../../lib/utils';
import { Package, ShoppingCart, Clock, Truck, CheckCircle } from 'lucide-react';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, refreshOrders, isAdmin } = useAdmin();
  
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    // If not logged in as admin, redirect to admin login page
    if (!isAdmin) {
      navigate('/admin');
    }
    
    refreshOrders();
  }, [isAdmin, navigate, refreshOrders]);
  
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [orders, statusFilter]);
  
  const viewOrderDetails = (order) => {
    setCurrentOrder(order);
    setIsDetailsDialogOpen(true);
  };
  
  const openUpdateStatusDialog = (order) => {
    setCurrentOrder(order);
    setNewStatus(order.status);
    setIsUpdateStatusDialogOpen(true);
  };
  
  const handleUpdateStatus = () => {
    updateOrderStatus(currentOrder.id, newStatus);
    
    toast({
      title: "Status Updated",
      description: `Order ${currentOrder.id} status updated to ${newStatus}.`,
    });
    
    setIsUpdateStatusDialogOpen(false);
    setCurrentOrder(null);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Preparing':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'In Transit':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Preparing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="page-container">
      <h1 className="section-title">Manage Orders</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Order List</h2>
            <p className="text-gray-500 text-sm">Manage and update customer orders</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filter by status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="Preparing">Preparing</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">
              {statusFilter === "all" 
                ? "There are no customer orders yet." 
                : `There are no orders with status "${statusFilter}".`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewOrderDetails(order)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => openUpdateStatusDialog(order)}
                        >
                          Update
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Order Details: {currentOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {currentOrder && (
            <div className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                  <p className="text-gray-600">{currentOrder.customer.fullName}</p>
                  <p className="text-gray-600">{currentOrder.customer.email}</p>
                  <p className="text-gray-600">{currentOrder.customer.phone}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                  <p className="text-gray-600">{currentOrder.customer.address}</p>
                  <p className="text-gray-600">
                    {currentOrder.customer.city}, {currentOrder.customer.state} {currentOrder.customer.zipCode}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Order Status</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(currentOrder.status)}`}>
                  {getStatusIcon(currentOrder.status)}
                  <span className="ml-2">{currentOrder.status}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                <div className="border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-10 w-10 rounded-md object-cover mr-3"
                              />
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end mb-2">
                <div className="text-right">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium mr-8">Subtotal:</span>
                    <span>{formatCurrency(currentOrder.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium mr-8">Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-2">
                    <span className="mr-8">Total:</span>
                    <span>{formatCurrency(currentOrder.total)}</span>
                  </div>
                </div>
              </div>
              
              {currentOrder.customer.notes && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-1">Customer Notes</h3>
                  <p className="text-gray-600">{currentOrder.customer.notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4 text-gray-600">
              Update the status for order <span className="font-semibold">{currentOrder?.id}</span>
            </p>
            
            <div className="mb-4">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Preparing">Preparing</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
