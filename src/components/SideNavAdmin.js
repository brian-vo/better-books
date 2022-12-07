import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SideNav = () => {
  const navigate = useNavigate();
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");


  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  const handleUpdatePoints = async (user_id, points) => {
    try {
      const response = await fetch(`/points/${user_id}/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          points: points,
        }),
      });
      response.json().then((responseData) => {
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormLinkClick = (event) => {
    event.preventDefault();

    const userId = prompt("Enter user ID:");
    const updatedPoints = prompt("Enter updated points:");
    const pattern = /[0-9]+/i;
    if (!pattern.test(userId)) {
        alert("User ID must be only numbers.");
        return;
    }
    if (!pattern.test(updatedPoints)) {
        alert("Requested value of points must be >=0");
        return;
    }

    handleUpdatePoints(userId, updatedPoints);
    alert("Updated points for user "  + userId);
  };

  return (
    <div className="sidenav">
      <Link to="/admin/orders">All Orders</Link>
      <Link to="/admin/reviews">All Reviews</Link>
      <Link to="#" onClick={handleFormLinkClick}>Update Points</Link>
      <button onClick={handleLogout} className="logout-button" style={{ position: "absolute", bottom: 0 }}>Logout</button>
    </div>
  );
};

export default SideNav;