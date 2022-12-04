import CartItem from "../components/CartItem";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
      navigate("/login");
    }
  }, []);

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
