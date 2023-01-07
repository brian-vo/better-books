import React, { useState, useEffect } from 'react';
import "./Account.css";
import SideNav from "../components/SideNav";
import useLoginCheck from '../hooks/useLoginCheck';
import { useNavigate, Link } from 'react-router-dom';

function Account() {
  const [fname, setFname] = React.useState(null);
  const [lname, setLname] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [fnameD, setFnameD] = React.useState(null);
  const [lnameD, setLnameD] = React.useState(null);
  const [emailD, setEmailD] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [loyaltyPoints, setLoyaltyPoints] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [statusCode, setStatusCode] = React.useState(null);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useLoginCheck("/account", "/login");

  useEffect(() => { 
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    fetch('/api/roles')
      .then((response) => response.json())
      .then((data) => {
        setRoles(data.roles);
      })
      .catch((error) => {
        console.error(error);
      });
    async function fetchLoyaltyPoints() {
      const response = await fetch("/user/points/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await response.json();
      setLoyaltyPoints(json.user[0].points);
    }
    async function fetchRecommendationAuto() {
      const response = await fetch("/recommendation/auto", {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setStatusCode(response.status);
      const json1 = await response.json();
      setData(json1.wishlist_items);
    }
    async function fetchUserData() {
      const response = await fetch("/user/data/self", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await response.json();
      setFnameD(json.user[0].fname);
      setLnameD(json.user[0].lname);
      setEmailD(json.user[0].email);
    }
    
    fetchUserData();
    fetchLoyaltyPoints();
    fetchRecommendationAuto();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    const response = await fetch("/user/data/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fname: fname,
        lname: lname,
        email: email,
        pass_word: password
      })
    });
    if (response.ok) {
      alert("Updated information!");
      setFname("");
      setLname("");
      setEmail("");
      setPassword("");
      window.location.reload();
    } else {
      alert("Failed to update information!");
    }
  };

  const fiveRecommendations = data.slice(0, 5);
  if (roles.includes('admin')) {
    navigate("/admin/orders");
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }

  return (
    <div className="account-container">
      <SideNav />
      <div className="form-container">
        <h1>Manage Account</h1>
        <div className="form-and-loyalty-box">
          <div className="loyalty-box">
            <p className="loyalty-label">Loyalty Points:</p>
            <p className="loyalty-points">{loyaltyPoints}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="form-label">
              First Name:
              <input 
                type="text" 
                placeholder={fnameD}
                value={fname}
                onChange={(event) => setFname(event.target.value)}
                required 
              />
            </label>
            <br />
            <label className="form-label">
              Last Name:
              <input
                type="text"
                placeholder={lnameD}
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                className="form-input"
              />
            </label>
            <label className="form-label">
              Email:
              <input
                type="email"
                placeholder={emailD}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </label>
            <br />
            <label className="form-label">
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </label>
            <button type="submit" className="form-button">Update Profile</button>
          </form>
        </div>
        
      </div>
      <div className="suggestions-container">
        <h1 className="home-title">Our Suggestions</h1>
        {statusCode === 481 && <p className="no-suggestions">No suggestions</p>}
        <ul className="featured">
          {fiveRecommendations.map((book) => {
            return (
              <li className="book-icon">
                <Link to={"/book?isbn=" + book.isbn}>
                  <div className="icon-container">
                    <img src={book.image_location} alt="book" />
                  </div>
                  <div className="icon-info">
                  <div className="icon-title" title={book.title}>
                    {truncateText(book.title, 25)}
                  </div>
                   <div className="icon-price">${book.price}</div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div >
  );
};

export default Account;
