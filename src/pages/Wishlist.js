import WishlistItem from "../components/WishlistItem";
import React, { useState, useEffect } from 'react';
import SideNav from "../components/SideNav";
import useLoginCheck from '../hooks/useLoginCheck';

// Wishlist page - displays all books in a user's wishlist, with the option to remove books from the wishlist or to add them to the cart

const Wishlist = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");

  // Check if user is logged in, if not, redirect to login page using useLoginCheck hook
  useLoginCheck("/wishlist", "/login");

  useEffect(() => {
    // Fetch user wishlist from FLASK API
    const fetchData = async () => {
      try {
        const response = await fetch('/wishlist/data', {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });
        // Set wishlist state to wishlist returned from API
        if (response.ok) {
          const json = await response.json();
          setData(json);
          setIsLoading(false);
        } else {
          setError(response.statusText);
          setIsLoading(false);
        }
      } catch (e) {
        setError(e.message);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  return (
    <div className="wishlist">
      <SideNav />
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>An error occurred while loading the wishlist.</p>
        ) : (
          data && data.wishlist_items &&
          data.wishlist_items.length > 0 &&
          data.wishlist_items.map((item) => {
            if (item.isbn) {
              return <WishlistItem key={item.isbn} book={item} />;
            }
            return null;

          })
        )}
        {!isLoading && !error && data && data.wishlist_items.length === 0 && (
          <p>You do not have a wishlist.</p>
        )}
      </div>
    </div>
  );

};
export default Wishlist;