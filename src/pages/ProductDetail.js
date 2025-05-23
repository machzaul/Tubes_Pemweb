import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then((response) => setProduct(response.data));
  }, [id]);

  const addToCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Cek apakah produk sudah ada di cart
    const existingProductIndex = storedCart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      // Jika produk sudah ada, tambahkan quantity
      storedCart[existingProductIndex].quantity = (storedCart[existingProductIndex].quantity || 1) + 1;
    } else {
      // Jika produk belum ada, tambahkan produk baru dengan quantity 1
      storedCart.push({
        ...product,
        quantity: 1
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(storedCart));
    alert("Produk ditambahkan ke keranjang!");
  };

  if (!product) return <p className="text-center text-xl font-semibold">Loading...</p>;

  return (
    <div className="container mx-auto p-20 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 max-w-4xl">
        <img src={product.image} alt={product.title} className="w-80 h-80 object-contain shadow-md rounded-lg" />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-xl font-semibold text-blue-600 mb-4">${product.price}</p>
          <button 
            onClick={addToCart} 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all">
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;