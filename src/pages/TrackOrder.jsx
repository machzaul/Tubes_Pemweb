
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrderById, formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Package, CheckCircle, Clock, Truck } from 'lucide-react';

const TrackOrder = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialOrderId = queryParams.get('orderId') || '';
  
  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  
  useEffect(() => {
    if (initialOrderId) {
      handleTrackOrder();
    }
  }, [initialOrderId]);
  
  const handleTrackOrder = () => {
    if (!orderId.trim()) {
      setError('Please enter an Order ID');
      return;
    }
    
    const foundOrder = getOrderById(orderId.trim());
    
    if (foundOrder) {
      setOrder(foundOrder);
      setError('');
    } else {
      setOrder(null);
      setError(`Order with ID ${orderId} not found`);
    }
    
    setSearched(true);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Preparing':
        return <Clock className="h-8 w-8 text-amber-500" />;
      case 'In Transit':
        return <Truck className="h-8 w-8 text-blue-500" />;
      case 'Delivered':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      default:
        return <Package className="h-8 w-8 text-gray-500" />;
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
      <h1 className="section-title">Track Your Order</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              Enter your Order ID to track the status of your order.
              You can find your Order ID in the confirmation email we sent you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Enter your Order ID (e.g., ORD-123456789)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handleTrackOrder}>Track Order</Button>
            </div>
            
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          
          {searched && order && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                <p className="text-gray-600">
                  Placed on {new Date(order.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="font-medium mb-1">Shipping to:</p>
                    <p className="text-gray-600">{order.customer.fullName}</p>
                    <p className="text-gray-600">{order.customer.address}</p>
                    <p className="text-gray-600">
                      {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Contact:</p>
                    <p className="text-gray-600">{order.customer.email}</p>
                    <p className="text-gray-600">{order.customer.phone}</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-medium">{order.status}</span>
                  </div>
                </div>
                
                <h3 className="font-medium mb-3">Order Items:</h3>
                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-3">
                      <div className="flex items-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-12 w-12 object-cover rounded mr-3" 
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-right">
                  <p className="text-gray-600">Total: <span className="text-lg font-bold text-blue-600">{formatCurrency(order.total)}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
