import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  // Lắng nghe thay đổi từ Firestore và sắp xếp theo timestamp giảm dần
  useEffect(() => {
    const ordersQuery = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersList);
    });

    // Cleanup: Hủy lắng nghe khi component unmount
    return () => unsubscribe();
  }, []);

  // Hàm xóa đơn hàng
  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'orders', orderId));
      alert('Xóa đơn hàng thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
      alert('Có lỗi xảy ra khi xóa đơn hàng. Vui lòng thử lại!');
    }
  };

  return (
    <div className="order-history">
      <h2>Lịch sử đặt món</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-item">
            <h3> - {new Date(order.timestamp.toDate()).toLocaleString()}</h3>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-detail">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-info">
                    <p>{item.name}</p>
                    <p>Số lượng: {item.quantity}</p>
                    <p>Giá: {(item.price * item.quantity).toLocaleString()}đ</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="order-total">Tổng: {order.total.toLocaleString()}đ</p>
            <div className="order-footer">
              <p className="order-status">Trạng thái: {order.status}</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteOrder(order.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;