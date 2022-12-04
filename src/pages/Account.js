import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OrderItem from "../components/OrderItem";
import "./accountnav.css";
import SideNav from "../components/SideNav";

const Account = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
      navigate("/login");
      return;
    }

      // Send the HTTP request to load the orders data.
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
    <tr className="order-header">
      <td>Order#</td>
      <td>Quantity</td>
      <td>Total</td>
      <td>Status</td>
      <td>Prepared date</td>
      <td>Shipped date</td>
      <td>Delivered date</td>
    </tr>
    {orders.map(order => (
      <OrderItem
        key={order.order_id}
        order_id={
          <Link to={`/order?order_id=${order.order_id}`}>{order.order_id}</Link>
        }
        quantity={order.quantity}
        total={order.sum}
        status={order.status}
        prepared_date={order.prepared_date}
        shipped_date={order.shipping_date}
        delivered_date={order.delivered_date}
      />
    ))}
  </thead>
</table>
      </div>
    </div>
  );
};

export default Account;