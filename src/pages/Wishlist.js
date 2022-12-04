import WishlistItem from "../components/WishlistItem";
import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from "../components/SideNav";

const Wishlist = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="wishlist">
        <SideNav />
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        <WishlistItem isbn={"0"}></WishlistItem>
        <WishlistItem isbn={"0"}></WishlistItem>
      </div>
    </div>
  );
};

export default Wishlist;
