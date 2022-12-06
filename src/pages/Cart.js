import CartItem from "../components/CartItem";
import useLoginCheck from "../hooks/useLoginCheck"

const Cart = () => {
  useLoginCheck("/login");

  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <h1>Shopping Cart</h1>
        <CartItem isbn={"0"}></CartItem>
        <CartItem isbn={"0"}></CartItem>
      </div>
    </div>
  );
};

export default Cart;
