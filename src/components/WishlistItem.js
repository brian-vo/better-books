import BookIcon from "./BookIcon";
import { useState, useEffect } from "react";
import './WishlistItem.css';

const WishlistItem = ({ book }) => {  
  const [books, setBook] = useState({});
  
  const handleAddToCart = async (isbn, token) => {
    try {
      const response = await fetch(`/shopping_cart/add/`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "isbn": isbn,
        }),
      });
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error(`Error adding item to cart: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
    alert("Added to Cart!");
  };

  const deleteFromWishlist = async (isbn, token) => {
    try {
      const response = await fetch(`/wishlist/delete_item`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "isbn": isbn,
        }),
      });
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error(`Error deleting item from wishlist: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  async function fetchBookData() {
    const response = await fetch(`/book/${book.isbn}/data`);
    const data = await response.json();
    if (data.books[0]) {
      setBook(data.books[0]);
    }
  }
  useEffect(() => {
    if (book && book.isbn && Object.keys(books).length === 0) {
      fetchBookData();
    }
  }, );

  return (
    <BookIcon
      book={books} 
      content={
        <div className="button-stack">
          <button className="button" onClick={() => handleAddToCart(book.isbn)} style={{ backgroundColor: "#fce705" }}>
            Add to Cart
          </button>
          <button className="button" onClick={() => deleteFromWishlist(book.isbn)} style={{ backgroundColor: "#AA4A44" }}>
            Remove from List
          </button>
        </div>
      }
    ></BookIcon>
  );
};

export default WishlistItem;