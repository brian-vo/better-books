import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavAdmin from '../components/SideNavAdmin';
import Review from '../components/Review';

function AdminReviews() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  const fetchReviews = async () => {
    try {
  
      const response = await fetch('/admin/reviews/all', {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();
      setReviews(data.reviews);
  
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
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

  }, []);
  console.log(roles);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roles.includes('admin')) {
    navigate("/login");
}


const deleteReview = async (isbn, user_id, token) => {
  try {
    const response = await fetch(`/admin/review/${isbn}/${user_id}/delete`, {
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
return (
  <div className="wishlist">
    <SideNavAdmin />
    <div className="wishlist-container">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.review_id}>
            <h2>{review.isbn}</h2>
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
        ))
      ) : (
        <p>You have not left any reviews.</p>
      )}
    </div>
  </div>
);
};

export default AdminReviews;
