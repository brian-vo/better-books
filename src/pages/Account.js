import OrderItem from "../components/OrderItem";

const Account = () => {
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
      </div>
    </div>
  );
};

export default Account;
