import OrderItem from "../components/OrderItem";

const Account = () => {
  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <h1>My Orders</h1>
        <div className="order-list">
          <OrderItem></OrderItem>
          <OrderItem></OrderItem>
          <OrderItem></OrderItem>
          <OrderItem></OrderItem>
          <OrderItem></OrderItem>
        </div>
      </div>
    </div>
  );
};

export default Account;
