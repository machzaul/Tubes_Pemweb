
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Minus, Plus, Trash, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const { cart, cartTotal, updateItem, removeItem } = useCart();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    updateItem(productId, newQuantity);
  };
  
  const handleRemoveItem = (productId) => {
    removeItem(productId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  if (cart.length === 0) {
    return (
      <div className="page-container">
        <h1 className="section-title">Your Shopping Cart</h1>
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild>
            <Link to="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <h1 className="section-title">Your Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cart.map((item) => (
                <tr key={item.productId}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center border rounded-md w-fit">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-0 h-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-3">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="px-2 py-0 h-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-700">Subtotal:</span>
          <span className="text-lg">{formatCurrency(cartTotal)}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-700">Shipping:</span>
          <span className="text-lg">Free</span>
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total:</span>
            <span className="text-xl font-bold text-blue-600">{formatCurrency(cartTotal)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
        
        <Button asChild>
          <Link to="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  );
};

export default Cart;
