import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DropdownMenu from './DropdownMenu'; 

const SideNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  return (
    <div className="sidenav">
      <Link to="/account">Update Information</Link>
      <Link to="/order_history">Order History</Link>
      <Link to="/wishlist">Wishlist</Link>
      <DropdownMenu /> 
      <Link to="/review_history">Reviews</Link>
      <button onClick={handleLogout} className="logout-button" style={{ position: "absolute", bottom: 0 }}>Logout</button>
    </div>
  );
};

export default SideNav;
