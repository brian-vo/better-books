import React, { useEffect } from 'react';
import "./Account.css";
import SideNav from "../components/SideNav";
import useLoginCheck from "../hooks/useLoginCheck"

function Account() {
  const [fname, setFname] = React.useState(null);
  const [lname, setLname] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [loyaltyPoints, setLoyaltyPoints] = React.useState(0);

  useLoginCheck("/login");

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    async function fetchLoyaltyPoints() {
      const response = await fetch("/user/points/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await response.json();
      setLoyaltyPoints(json.user[0].points);
    }

    fetchLoyaltyPoints();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

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
  };

  return (
    <div className="account-container">
      <SideNav />
      <div className="form-container">
        <h1>Update Information</h1>
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
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                className="form-input"
              />
            </label>
            <br />
            <label className="form-label">
              Last Name:
              <input
                type="text"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                className="form-input"
              />
            </label>
            <br />
            <label className="form-label">
              Email:
              <input
                type="email"
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
            <br />
          </form>
        </div>
        <button type="submit" className="form-button">Update Profile</button>
      </div>
    </div >
  );
};

export default Account;
