import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from "../components/SideNav";
import Review from "../components/Review";
import "./ReviewHistory.css";

// ReviewHistory page - displays all reviews for a user, with ability to delete reviews

const ReviewHistory = () => {
  const [reviews, setReviews] = useState([]);
  const [titles, setTitles] = useState({});
  const [fetchedIsbns, setFetchedIsbns] = useState(new Set());
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
  const navigate = useNavigate();

  // Fetch reviews for user
  const fetchReviews = useCallback(async () => {
    try {
      // Call API to get reviews
      const response = await fetch('/reviews/all', {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();
      // Set reviews from response
      setReviews(data.reviews);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  // If user is not logged in, redirect to login page, otherwise fetch reviews
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchReviews();
    }
  }, [token, fetchReviews, navigate]);

  // Handle delete review button click
  const deleteReview = async (isbn, token) => {
    try {
      // Call API to delete review
      await fetch(`/book/${isbn}/review/delete`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      // Refresh page
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch title data for review
  async function fetchTitleData(review) {
    if (fetchedIsbns.has(review.isbn)) {
      return;
    }

    const response = await fetch(`/book/${review.isbn}/data`);
    const data = await response.json();
    // Set title for review
    setTitles((prevTitles) => ({ ...prevTitles, [review.isbn]: data.books[0].title }));
    // Add isbn to set of fetched isbns
    setFetchedIsbns((prevIsbns) => prevIsbns.add(review.isbn));
  }

  return (
    <div className="wishlist">
      <SideNav />
      <div className="wishlist-container">
        {reviews.length > 0 ? (
          reviews.map((review) => {
            fetchTitleData(review);

            if (titles[review.isbn]) {
              return (
                <div key={review.review_id}>
                  <h2>{titles[review.isbn]}</h2>
                  <Review review={review} displayUser={false} />
                  <div className="button-stack">
                    <button
                      className="button"
                      onClick={() => deleteReview(review.isbn)}
                      style={{ backgroundColor: "#fce705" }}
                    >
                      Delete Review
                    </button>
                  </div>
                </div>
              );
            }

            return <></>;
          })
        ) : (
          <p>You have not left any reviews.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewHistory;