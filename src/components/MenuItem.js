import React from 'react';

const MenuItem = ({ item, onAddToCart, onRemoveFromCart, quantity }) => {
  return (
    <div className="menu-item">
      <img src={item.image} alt={item.name} />
      <div>
        <h3>{item.name}</h3>
        <p>{item.price.toLocaleString()}đ</p>
      </div>
      <div className="quantity-controls">
        {quantity > 0 && (
          <>
            <button onClick={() => onRemoveFromCart(item.id)} className="quantity-button">−</button>
            <span className="quantity">{quantity}</span>
          </>
        )}
        <button onClick={() => onAddToCart(item)} className="quantity-button">+</button>
      </div>
    </div>
  );
};

export default MenuItem;