import WishlistItem from "../components/WishlistItem";
import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from "../components/SideNav";
import useFetch from "../hooks/useFetch";

const Wishlist = () => {
  const navigate = useNavigate();
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  const { data, isLoading, error } = useFetch("/wishlist/data", "GET", null, {
    Authorization: token,
  });
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="wishlist">
      <SideNav />
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        {error && <p>You do not have a wishlist.</p>}
        {data &&
  data.wishlist_items.map((item) => (
    <WishlistItem key={item.isbn} book={item} />
  ))}
      </div>
    </div>
  );
          };
export default Wishlist;
