// src/components/OrderSummary.jsx
import React from 'react';

export default function OrderSummary({ items }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Ringkasan Pesanan</h3>
      {items.map((item, i) => (
        <p key={i}>{item.name} x {item.qty} - Rp {item.price * item.qty}</p>
      ))}
      <p className="mt-2 font-bold">Total: Rp {items.reduce((acc, cur) => acc + cur.price * cur.qty, 0)}</p>
    </div>
  );
}