import React from 'react';

const Cart = ({ cartItems, onPlaceOrder }) => {
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart">
      <span>{cartItems.length} món - {totalPrice.toLocaleString()}đ</span>
      <button onClick={onPlaceOrder}>Gọi món</button>
    </div>
  );
};

export default Cart;