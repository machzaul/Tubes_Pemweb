import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    // Pastikan setiap item memiliki quantity, jika tidak ada set ke 1
    const cartWithQuantity = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1
    }));
    setCart(cartWithQuantity);
  }, []);

  // Fungsi untuk update localStorage setiap kali cart berubah
  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Trigger custom event for navbar update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const incrementQuantity = (index) => {
    const updatedCart = cart.map((item, i) => 
      i === index ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const decrementQuantity = (index) => {
    const updatedCart = cart.map((item, i) => 
      i === index ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  // Hitung subtotal dan total
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const shippingCost = 0; // Gratis ongkir
  const totalCost = (parseFloat(calculateSubtotal()) + shippingCost).toFixed(2);

  return (
    <div className="p-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-purple-500 to-blue-500 text-white p-10 rounded-lg shadow-lg mb-8">
        <div className="md:w-1/2 text-left">
          <h1 className="text-4xl font-bold mb-4">Your Shopping Cart</h1>
          <p className="text-lg">Review your selected items before checkout!</p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          {cart.length > 0 && (
            <div className="border p-4 rounded-lg shadow-md bg-white hover:shadow-xl transition-all duration-300">
              <img src={cart[0].image} alt={cart[0].title} className="h-32 mx-auto object-contain" />
            </div>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-lg mt-4">Your cart is empty.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="col-span-6">PRODUCT</div>
                  <div className="col-span-2 text-center">PRICE</div>
                  <div className="col-span-2 text-center">QUANTITY</div>
                  <div className="col-span-1 text-center">SUBTOTAL</div>
                  <div className="col-span-1 text-center">ACTIONS</div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cart.map((item, index) => (
                  <div key={index} className="px-6 py-6">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center space-x-4">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="h-16 w-16 object-contain rounded-lg border"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <span className="text-lg font-semibold text-gray-800">
                          ${item.price}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-2 flex items-center justify-center">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => decrementQuantity(index)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            −
                          </button>
                          <span className="px-4 py-2 border-l border-r bg-gray-50 font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQuantity(index)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-1 text-center">
                        <span className="text-lg font-semibold text-blue-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <div className="col-span-1 text-center">
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${calculateSubtotal()}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-blue-600">${totalCost}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 transition-colors mt-6 shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;