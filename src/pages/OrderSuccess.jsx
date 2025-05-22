
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/button';
import { CheckCircle, Package } from 'lucide-react';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const order = getOrderById(orderId);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  if (!order) {
    return (
      <div className="page-container">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
          <div className="text-red-500 text-6xl mb-6">!</div>
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find an order with the ID: {orderId}.
            Please check if you entered the correct order ID.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/track-order">Track Another Order</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex flex-wrap justify-between gap-4 mb-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">Order ID</p>
              <p className="font-semibold">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Date</p>
              <p className="font-semibold">
                {new Date(order.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Total</p>
              <p className="font-semibold">{formatCurrency(order.total)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Status</p>
              <p className="font-semibold text-amber-600">
                <span className="inline-flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {order.status}
                </span>
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="font-medium mb-2">Shipping Address:</p>
            <p className="text-gray-700">
              {order.customer.fullName}<br />
              {order.customer.address}<br />
              {order.customer.city}, {order.customer.state} {order.customer.zipCode}
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            {order.items.map((item, index) => (
              <div 
                key={`${item.productId}-${index}`} 
                className={`flex items-center justify-between p-4 ${
                  index < order.items.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/track-order?orderId=${order.id}`}>Track Your Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
