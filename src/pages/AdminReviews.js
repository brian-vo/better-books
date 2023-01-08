import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavAdmin from '../components/SideNavAdmin';
import Review from '../components/Review';

// AdminReviews page - used to display all reviews in the database for admin moderation, providing the ability to delete reviews

function AdminReviews() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [titles, setTitles] = useState({});
  const [fetchedIsbns, setFetchedIsbns] = useState(new Set());
  const navigate = useNavigate();
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");

  const fetchReviews = async () => {
    try {
      // fetch all reviews from database
      const response = await fetch('/admin/reviews/all', {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();
      // set reviews to the data returned from the database
      setReviews(data.reviews);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Get roles from API
    fetch('/api/roles')
      .then((response) => response.json())
      .then((data) => {
        setRoles(data.roles);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    fetchReviews();

  });
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not an admin, redirect to login page
  if (!roles.includes('admin')) {
    navigate("/login");
  }

  // Handle deleting review from database
  const deleteReview = async (isbn, user_id, token) => {
    try {
      // Delete review from database by API call
      await fetch(`/admin/review/${isbn}/${user_id}/delete`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch title data from Flask API
  async function fetchTitleData(review) {
    if (fetchedIsbns.has(review.isbn)) {
      return;
    }
    const response = await fetch(`/book/${review.isbn}/data`);
    const data = await response.json();
    // Set title data to state
    setTitles((prevTitles) => ({ ...prevTitles, [review.isbn]: data.books[0].title }));
    // Add isbn to set of fetched isbns
    setFetchedIsbns((prevIsbns) => prevIsbns.add(review.isbn));
  }

  return (
    <div className="wishlist">
      <SideNavAdmin />
      <div className="wishlist-container">
        {reviews.length > 0 ? (
          reviews.map((review) => {
            fetchTitleData(review);

            if (titles[review.isbn]) {
              return (
                <div key={review.review_id}>
                  <h2>{titles[review.isbn]}</h2>
                  <Review review={review} />
                  <div className="button-stack">
                    <button
                      className="button"
                      onClick={() => deleteReview(review.isbn, review.user_id)}
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

export default AdminReviews;
