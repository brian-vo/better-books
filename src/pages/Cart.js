import CartItem from "../components/CartItem";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useLoginCheck from '../hooks/useLoginCheck';
import "./Cart.css"

// Cart page - displays all items in the user's shopping cart

const Cart = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState(null);
  const [sum, setSum] = useState(0);
  const [roles, setRoles] = useState([]);

  // Check if user is logged in, if not, redirect to login page using useLoginCheck hook
  useLoginCheck("/cart", "/login");

  useEffect(() => {
    // Get token from cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    // Fetch user roles
    fetch('/shopping_cart/data/', {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        // set books from response
        setBooks(data.books);
        // set sum from response
        setSum(data.books[0].sum);
      })
      .catch(error => {
        console.error(error);
      });
    // Fetch user roles
    fetch('/api/roles')
      .then((response) => response.json())
      .then((data) => {
        setRoles(data.roles);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // If user is an admin, redirect to admin orders page
  if (roles.includes('admin')) {
    navigate("/admin/orders");
  }

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
        <div className="button-stack">
          <div className="sum-box">
            <p>Subtotal: ${sum}.00</p>
          </div>
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
