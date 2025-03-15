import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import Header from './components/Header';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root'); // Đặt root element cho modal

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userName, setUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true); // Mở modal khi khởi động
  const orderHistoryRef = useRef(null);

  useEffect(() => {
    // Kiểm tra xem đã có tên người dùng trong localStorage chưa
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
      setIsModalOpen(false);
    }
  }, []);

  const onAddToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(
        cartItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const onRemoveFromCart = (itemId) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === itemId);
    if (existingItem.quantity === 1) {
      setCartItems(cartItems.filter(cartItem => cartItem.id !== itemId));
    } else {
      setCartItems(
        cartItems.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  const onPlaceOrder = async () => {
    if (cartItems.length === 0) return;
    if (!userName) {
      alert('Vui lòng nhập tên trước khi đặt món!');
      return;
    }
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await addDoc(collection(db, 'orders'), {
      items: cartItems,
      total,
      status: 'Đã nhận',
      timestamp: new Date(),
      userName: userName, // Lưu tên người đặt
    });
    setCartItems([]);
    alert('Đặt món thành công!');
    orderHistoryRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitName = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('userName', userName); // Lưu tên vào localStorage
      setIsModalOpen(false);
    } else {
      alert('Vui lòng nhập tên!');
    }
  };

  return (
    <div className="App">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {}} // Không cho phép đóng modal bằng cách nhấp ra ngoài
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            padding: '20px',
          },
        }}
      >
        <h2>Nhập tên của bạn</h2>
        <form onSubmit={handleSubmitName}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Nhập tên..."
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button type="submit" style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Xác nhận
          </button>
        </form>
      </Modal>
      {!isModalOpen && (
        <>
          <Header />
          <MenuList
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
            cartItems={cartItems}
          />
          <Cart cartItems={cartItems} onPlaceOrder={onPlaceOrder} />
          <div ref={orderHistoryRef}>
            <OrderHistory />
          </div>
        </>
      )}
    </div>
  );
};

export default App;