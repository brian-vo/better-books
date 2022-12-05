import React, { useState, useEffect } from "react";
import Review from "../components/Review";
import { useLocation } from "react-router-dom";

const BookPurchase = () => {
  const [book, setBook] = useState({}); // Store the book in state
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  // Get the URL query string
  const queryString = useLocation().search;

  // Parse the query string to get the `isbn` value
  const params = new URLSearchParams(queryString);
  const isbn = params.get("isbn");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        // Make a request to the '/book/<book_isbn>/data' endpoint
        const response = await fetch(`/book/${isbn}/data`);

        // Parse the response as JSON
        const data = await response.json();

        // Update the book state with the returned data
        setBook(data.books[0]);
      } catch (error) {
        // Handle any errors
        console.error(error);
      }
    };

    // Fetch the book when the component mounts
    fetchBook();
  }, [isbn]);

  const handleAddToCart = async (isbn, token) => {
    try {
      // Make a request to the '/shopping_cart/add/<user_id>' endpoint
      const response = await fetch(`/shopping_cart/add/`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          "isbn": isbn,
        }),
      });
      // Parse the response as JSON
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

return (
  <div className="purchase-container">
    <div className="purchase-content">
      <div className="book-container">
        <img src={book.image_location} alt="book" />
      </div>
      <div className="purchase-info">
        <h1>{book.title}</h1>
        <p>
          <h2>${book.price}</h2>
          <strong>Description:</strong>
          <br />
          {book.description}
        </p>
        <div className="purchase-btns">
          <button className="button">Add to Wishlist</button>
          <button className="button">Leave Review</button>
        </div>
        <button className="button" onClick={() => handleAddToCart(isbn)}>
        Add to Cart
      </button>      </div>
    </div>
    <div className="review-content">
      <h1>Reviews</h1>
      <Review review_id="0"></Review>
      <Review review_id="0"></Review>
      <Review review_id="0"></Review>
      <Review review_id="0"></Review>
    </div>
  </div>
);
};

export default BookPurchase;