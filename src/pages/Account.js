import OrderItem from "../components/OrderItem";
import { useNavigate } from 'react-router-dom';


const Account = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the user's session token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect the user to the home page
    navigate("/");
  };

  return (
    <div className="wishlist">
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
