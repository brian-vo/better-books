import WishlistItem from "../components/WishlistItem";
import React from 'react';
import SideNav from "../components/SideNav";
import useFetch from "../hooks/useFetch";
import useLoginCheck from '../hooks/useLoginCheck';

const Wishlist = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
  const { data, isLoading, error } = useFetch("/wishlist/data", "GET", null, {
    Authorization: token,
  });
  useLoginCheck("/wishlist", "/login");

  return (
    <div className="wishlist">
      <SideNav />
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>You do not have a wishlist.</p>
        ) : data && data.wishlist_items.length === 0 ? (
          <p>You do not have a wishlist.</p>
        ) : (
          data &&
          data.wishlist_items.map((item) => (
            <WishlistItem key={item.isbn} book={item} />
          ))
        )}
      </div>
    </div>
  );
};
export default Wishlist;