import React, { useState, useEffect } from "react";
import Review from "../components/Review";
import { useLocation } from "react-router-dom";
import "./BookPurchase.css";

const BookPurchase = () => {
  const [book, setBook] = useState({});
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]); // Store the reviews in state
  const [error, setError] = useState(null); // Initialize the error state variable

  const queryString = useLocation().search;

  const params = new URLSearchParams(queryString);
  const isbn = params.get("isbn");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const fetchBook = async () => {
      try {
        const response = await fetch(`/book/${isbn}/data`);

        const data = await response.json();

        setBook(data.books[0]);

        const response1 = await fetch(`/book/${isbn}/review_all`, {
          headers: {
            "Content-Type": "application/json"
          },
        });
        const data1 = await response1.json();
        setReviews(data1.reviews);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBook();
  }, [isbn]);

  const handleAddToCart = async (isbn, token) => {
    if (!token) {
      alert("You must be logged in to add items to your cart.");
      return;
    }
    try {
      await fetch(`/shopping_cart/add/`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "isbn": isbn,
        }),
      });
      alert("Added to Cart!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToWishlist = async (isbn, token) => {
    if (!token) {
      alert("You must be logged in to add items to your wishlist.");
      return;
    }
    try {
      await fetch(`/wishlist/add/`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "isbn": isbn,
        }),
      });
      alert("Added to Wishlist!");
      // Parse the response as JSON
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  const handleAddReview = async (isbn, token, messageTitle, messageBody, rating) => {
    if (!token) {
      alert("You must be logged in to add a review.");
      return;
    }
    try {
      const response = await fetch(`/book/${isbn}/review/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: token,
          message_title: messageTitle,
          message_body: messageBody,
          rating: rating,
        }),
      });
      response.json().then((responseData) => {
        if (responseData.status === 400) {
          setError("You have already left a review on this product!.");
          return;
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    const messageTitle = event.target.messageTitle.value;
    const messageBody = event.target.messageBody.value;
    const rating = event.target.rating.value;

    handleAddReview(isbn, token, messageTitle, messageBody, rating);
    window.location.reload();

    event.target.messageTitle.value = "";
    event.target.messageBody.value = "";
    event.target.rating.value = "";
  };

  const handleShowReviewForm = () => {
    setShowReviewForm(true);
  };

  return (
    <div className="purchase-container">
      <div className="purchase-content">
        <div className="book-container">
          <img src={book.image_location} alt="book" />
        </div>
        <div className="purchase-info">
          <h1>{book.title}</h1>
          <span>By: {book.authors ? book.authors.map(author => <strong>{author.fname} {author.lname}</strong>) : null}</span>
          <p>
            <br/>
            <h2>${book.price}</h2>
            <div>
  {book.description ? <strong>About:</strong> : null} <br/> {book.description}
</div>
          </p>
          <div className="purchase-btns">
            <button className="pbutton" onClick={() => handleAddToWishlist(isbn, token)} >
              Add to Wishlist
            </button>
            <button className="pbutton" onClick={handleShowReviewForm}>
              Leave Review
            </button>
          </div>
          <button className="cart-button" onClick={() => handleAddToCart(isbn, token)}>
            Add to Cart
          </button>
        </div>
      </div>
      {showReviewForm && (
        <div className="review-form">
          <form onSubmit={handleReviewSubmit}>
            <label className="review-title">
              <p>Title:</p>
              <input type="text" name="messageTitle" />
            </label>
            <label className="review-body">
              <p>Review:</p>
              <textarea type="text" name="messageBody" />
            </label>
            <label className="review-rating">
              <p>Rating:</p>
              <input type="number" name="rating" min="1" max="5" />
            </label>
            <input type="submit" value="Submit" className="submit" />
          </form>
        </div>
      )}
      <div className="review-content">
        <h1>Reviews</h1>
        {reviews.map((review) => (
          <Review review={review} />
        ))}
      </div>
    </div>
  );
};

export default BookPurchase;