import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavAdmin from '../components/SideNavAdmin';
import OrderItem from '../components/OrderItem';

// AdminOrders page - displays all orders in the database for admin use

function AdminOrders() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    // Get roles from API
    fetch('/api/roles')
      .then((response) => response.json())
      .then((data) => {
        setRoles(data.roles);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    // Get all orders from API
    fetch(`/admin/orders/all`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(response => setOrders(response.orders));
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not an admin, redirect to login page
  if (!roles.includes('admin')) {
    navigate("/login");
  }

  return (
    <div className="wishlist">
      <SideNavAdmin />
      <div className="wishlist-container">
        <h1>All Orders - Admin</h1>
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

export default AdminOrders;
