import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

// SideNavAdmin component - used as a component to display a side navigation bar, curated for Admin users

const SideNav = () => {
  const navigate = useNavigate();
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");

  // Handle logout
  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  // Handle update points
  const handleUpdatePoints = async (user_id, points) => {
    try {
      // Call update points endpoint
      const response = await fetch(`/points/${user_id}/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // Send points to update as JSON
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

  // Handle update points form, pop up a prompt to enter user ID and points to update
  const handleFormLinkClick = (event) => {
    event.preventDefault();
    
    const userId = prompt("Enter user ID:");
    const updatedPoints = prompt("Enter how many points to add:");
    const pattern = /[0-9]+/i;
    // Check if user ID and points are valid (only numeric)
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