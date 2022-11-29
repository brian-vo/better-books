import CartItem from "../components/CartItem";

const Cart = () => {
  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <h1>My Cart</h1>
        <CartItem isbn={"0"}></CartItem>
        <CartItem isbn={"0"}></CartItem>
      </div>
    </div>
  );
};

export default Cart;
