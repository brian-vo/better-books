import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DropdownMenu from './DropdownMenu'; 

const SideNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    fetch('/logout', {
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
    window.location.reload();

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
