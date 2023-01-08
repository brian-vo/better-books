import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DropdownMenu from './DropdownMenu'; 

// SideNav component - used as a component to display a side navigation bar

const SideNav = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    // Replace token with null on logout
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    // call logout endpoint
    fetch('/logout', {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    // delete token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // reload page
    navigate("/");
    window.location.reload();

  };

  return (
    <div className="sidenav">
      <Link to="/account">Manage Account</Link>
      <Link to="/order_history">Order History</Link>
      <Link to="/wishlist">Wishlist</Link>
      <DropdownMenu /> 
      <Link to="/review_history">Reviews</Link>
      <button onClick={handleLogout} className="logout-button" style={{ position: "absolute", bottom: 0 }}>Logout</button>
    </div>
  );
};

export default SideNav;
