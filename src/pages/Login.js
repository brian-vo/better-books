import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBInput, MDBCheckbox } from "mdb-react-ui-kit";
import { useNavigate, Link } from 'react-router-dom';

const LogIn = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
      navigate("/account");
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { "email": email, "pass_word": password };

    fetch('/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((responseData) => {
     if (responseData.status === 200) {
      const token = responseData.json().token
      document.cookie = `token=${encodeURIComponent(token)}`
      navigate("/account");
     }
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
