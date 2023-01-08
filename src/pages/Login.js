import React, { useState } from 'react';
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import { useNavigate, Link } from 'react-router-dom';
import useLoginCheck from '../hooks/useLoginCheck';

const LogIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Check if user is logged in, if not, redirect to login page using useLoginCheck hook
  useLoginCheck("/account", "/login");

  // Handle login form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { "email": email, "pass_word": password };
    // Post login data to server
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((responseData) => {
        // If login is successful, set token cookie and redirect to account page
        if (responseData.status === 200) {
          const token = responseData.json().token
          document.cookie = `token=${encodeURIComponent(token)}`
          navigate("/account");
        }
        // If login is unsuccessful, set error message
        setError("Incorrect username or password");

      })
      .then((data) => {
      })
      .catch((error) => {
      });
  }

  return (
    <div className="login">
      <div className="login-form">
        <div className="login-items">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <MDBInput
              wrapperClass="mb-4"
              label={error ? error : "Email Address"}
              id="form1"
              type="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
            />
            <MDBInput
              wrapperClass="mb-4"
              label={error ? error : "Password"}
              id="form2"
              type="password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <MDBBtn
              className="mb-4 w-100"
              type="submit"
            >
              Sign in
            </MDBBtn>
          </form>
          <p className="text-center register-link">
            Not a member? <Link to="/signup">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
