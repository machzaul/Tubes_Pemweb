
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { createOrder, formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCartItems } = useCart();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cart.length === 0) {
      navigate('/cart');
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before checkout.",
        variant: "destructive"
      });
    }
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [cart, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is being edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP/Postal code is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const order = createOrder(formData);
      
      if (order) {
        clearCartItems();
        
        // Show success message
        toast({
          title: "Order Placed Successfully!",
          description: `Your order ID is ${order.id}. You can use this to track your order.`,
        });
        
        // Redirect to order success page
        navigate(`/order-success/${order.id}`);
      } else {
        toast({
          title: "Error",
          description: "Could not create your order. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="page-container">
      <h1 className="section-title">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={validationErrors.fullName ? 'border-red-500' : ''}
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={validationErrors.email ? 'border-red-500' : ''}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={validationErrors.phone ? 'border-red-500' : ''}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                  )}
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={validationErrors.address ? 'border-red-500' : ''}
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={validationErrors.city ? 'border-red-500' : ''}
                  />
                  {validationErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={validationErrors.state ? 'border-red-500' : ''}
                  />
                  {validationErrors.state && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.state}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={validationErrors.zipCode ? 'border-red-500' : ''}
                  />
                  {validationErrors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.zipCode}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special delivery instructions or other notes..."
                  className="resize-none"
                  rows={3}
                />
              </div>
            </form>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded mr-3" />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold mt-4">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(cartTotal)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleSubmit} 
              disabled={isSubmitting || cart.length === 0}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
