import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./Recommendation.css"

const Recommendation = ({ sender_id, recommend_num, isSent }) => {
  const [wishlist_items, setWishlistItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch the wishlist_items data from the API
    const fetchWishlistItems = async () => {
      const response = await fetch(`/recommendation/view/${recommend_num}`);
      const data = await response.json();
      setWishlistItems(data.wishlist_items);
    };
    fetchWishlistItems();
  }, [recommend_num]);

  return (
    <div className="recommendation">
      <div className="count" onClick={() => setShowDropdown(!showDropdown)}>
        {recommend_num}
      </div>
      <div className="sender">
        {isSent ? 'To: User #' : 'From: User #'}
        {sender_id}
      </div>
      {showDropdown && (
        <div className="wishlist-items-container" style={{ position: 'relative' }}>
          <ul className="wishlist-items" style={{ display: 'block' }}>
            <p>Recommendations:</p>
            {wishlist_items.map((item) => {
              console.log(item);
              return (
                <p>
                  {item.isbn ? `ISBN: ${item.isbn}` : `Author ID: ${item.author_ids}`}
                </p>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Recommendation;
