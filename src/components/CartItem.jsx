import React from 'react';

export default function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>
        <h4 className="font-semibold">{item.name}</h4>
        <p>Rp {item.price} x {item.qty}</p>
        <p className="font-bold">Subtotal: Rp {item.price * item.qty}</p>
      </div>
      <div className="flex gap-2 items-center">
        <input type="number" value={item.qty} min={1} className="w-16 border px-2" onChange={(e) => onUpdateQty(item.id, Number(e.target.value))} />
        <button className="text-red-500" onClick={() => onRemove(item.id)}>Hapus</button>
      </div>
    </div>
  );
}