import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SideNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  return (
    <div className="sidenav">
      <Link to="/admin/orders">All Orders</Link>
      <Link to="/admin/reviews">All Reviews</Link>
      <button onClick={handleLogout} className="logout-button" style={{ position: "absolute", bottom: 0 }}>Logout</button>
    </div>
  );
};

export default SideNav;
