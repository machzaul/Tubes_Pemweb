import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="border rounded p-4 shadow">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2" />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-green-600 font-bold">Rp {product.price}</p>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onAddToCart(product)}>
        Tambah ke Keranjang
      </button>
    </div>
  );
}