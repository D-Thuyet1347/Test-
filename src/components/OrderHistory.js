import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import './OrderHistory.css';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.log('userId chưa sẵn sàng:', userId);
      setLoading(false);
      return;
    }
    console.log('Đang lấy dữ liệu cho userId:', userId);
    let unsubscribe;
    const fetchData = async () => {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Số tài liệu trả về:', snapshot.size, 'Dữ liệu:', ordersList);
        if (ordersList.length === 0) {
          console.log('Không tìm thấy đơn hàng cho userId:', userId);
        } else {
          console.log('Dữ liệu lấy được:', ordersList);
        }
        setOrders(ordersList);
        setLoading(false);
      }, (error) => {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        if (error.message.includes('index')) {
          alert('Yêu cầu tạo chỉ mục trong Firestore. Vui lòng kiểm tra console và tạo chỉ mục theo liên kết.');
        } else {
          alert('Có lỗi xảy ra khi lấy lịch sử đơn hàng: ' + error.message);
        }
        setLoading(false);
      });

      // Retry nếu không có dữ liệu sau 2 giây
      setTimeout(() => {
        if (orders.length === 0 && loading) {
          console.log('Thử lại lấy dữ liệu cho userId:', userId);
          unsubscribe(); // Hủy subscription cũ
          fetchData(); // Thử lại
        }
      }, 2000);
    };

    fetchData();

    return () => unsubscribe && unsubscribe();
  }, [userId, orders.length, loading]);

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
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-item">
            <h3>Đơn hàng - {new Date(order.timestamp.toDate()).toLocaleString()}</h3>
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