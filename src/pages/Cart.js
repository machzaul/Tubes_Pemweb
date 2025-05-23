import { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="p-10 text-center">
      <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500 text-white p-10 rounded-lg shadow-lg">
        <div className="md:w-1/2 text-left">
          <h1 className="text-4xl font-bold mb-4">Keranjang Belanja</h1>
          <p className="text-lg">Lihat produk yang telah Anda tambahkan ke keranjang!</p>
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
        <p className="text-lg mt-4">Keranjang Anda kosong.</p>
      ) : (
        <ul className="mt-6">
          {cart.map((item, index) => (
            <li key={index} className="border p-4 mb-2 flex justify-between items-center bg-white shadow-md rounded-lg">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.title} className="h-16 w-16 object-contain" />
                <div className="ml-2 flex flex-col">
                  <span className="text-lg font-semibold">{item.title}</span>
                  <span className="text-md text-gray-600 text-left">${item.price}</span>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(index)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Cart;