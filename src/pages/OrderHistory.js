import React, { useEffect, useState } from 'react';
import OrderItem from "../components/OrderItem";
import "./accountnav.css";
import SideNav from "../components/SideNav";
import useLoginCheck from '../hooks/useLoginCheck';
import './orderhistory.css';

// OrderHistory page - displays all orders for a user in a table

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  // Check if user is logged in, if not, redirect to login page using useLoginCheck hook
  useLoginCheck("/order_history", "/login");

  useEffect(() => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
  // Fetch user orders from FLASK API
  fetch(`/orders/all`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(response => setOrders(response.orders));
}, []);


  return (
    <div className="wishlist">
      <SideNav />
      <div className="wishlist-container">
        <h1>Order History</h1>
        <table className="order-table">
        <thead>
        <tr>
          <th>Order ID</th>
          <th>Total</th>
          <th>Status</th>
          <th>Order Date</th>
          <th>Prepared Date</th>
          <th>Delivered Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <OrderItem key={order.order_id} order={order} />
        ))}
      </tbody>
</table>
      </div>
    </div>
  );
};

export default OrderHistory;