import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import OrderItem from "../components/OrderItem";
import { useNavigate } from 'react-router-dom';
import "./accountnav.css";

const SideNav = () => {
  return (
    <div className="sidenav">
      <Link to="/account">Order History</Link>
      <Link to="/wishlist">Wishlist</Link>
      <Link to="/recommendations">Recommendations</Link>
    </div>
  );
};

const Account = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    navigate("/");
  };

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
            <OrderItem order_id="000000000000"></OrderItem>
            <OrderItem order_id="000000000000"></OrderItem>
            <OrderItem order_id="000000000000"></OrderItem>
          </thead>
        </table>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Account;