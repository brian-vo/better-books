import CartItem from "../components/CartItem";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Cart.css"

const Cart = () => {
  const navigate = useNavigate(); 
  const [books, setBooks] = useState(null); 
  const [sum, setSum] = useState(0);

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
      navigate("/login");
    }

    fetch('/shopping_cart/data/', {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        setBooks(data.books);
        setSum(data.books[0].sum);
      })
      .catch(error => {
        console.error(error);
      });

  }, []);

return (
  <div className="wishlist">
    <div className="wishlist-container">
      <h1>Shopping Cart</h1>
      <div className="cart-items-container">
        {books &&
          books.map((book) =>
            book.items.map((item) => <CartItem key={item.isbn} book={item} />)
          )}
      </div>
      <div className="sum-box">
        <p>Subtotal: ${sum}.00</p>
      </div>
      <div className="button-stack">
        <button
          className="button"
          onClick={() => navigate('/checkout')}
          style={{ backgroundColor: '#AA4A44', margin: '30px 0' }}
        >
          Checkout
        </button>
      </div>
    </div>
  </div>
);

        };

export default Cart;
