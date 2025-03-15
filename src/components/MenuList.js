import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import MenuItem from './MenuItem';

const MenuList = ({ onAddToCart, onRemoveFromCart, cartItems }) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const menuCollection = collection(db, 'menu');
      const menuSnapshot = await getDocs(menuCollection);
      const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenu(menuList);
    };
    fetchMenu();
  }, []);

  const groupedMenu = menu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="menu-list">
      {Object.keys(groupedMenu).map(category => (
        <div key={category}>
          <h2>{category} ({groupedMenu[category].length})</h2>
          {groupedMenu[category].map(item => (
            <MenuItem
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              quantity={cartItems.find(cartItem => cartItem.id === item.id)?.quantity || 0} // Lấy số lượng từ cartItems
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MenuList;