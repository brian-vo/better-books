import React, { useState } from 'react';
import { MDBBtn, MDBInput, MDBCheckbox } from "mdb-react-ui-kit";
import { useNavigate } from 'react-router-dom';
import useLoginCheck from '../hooks/useLoginCheck';

// Sign up page - used to create a new user account

const SignUp = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in, if not, redirect to login page using useLoginCheck hook
  useLoginCheck("/account", "/signup");

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Create user object to send to API
    const data = { "fname": fname, "lname": lname, "email": email, "pass_word": password };

    // Send user object to API
    fetch('/register/new', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        // If user is created successfully, redirect to login page
        if (response.status === 201) {
          navigate("/login");
        } else if (response.status === 409) {
          // If user already exists, set error message
          setError("User with this email already exists");
        }
      })
      .catch((error) => {
      });
  }

  return (
    <div className="login">
      <div className="login-form">
        <div className="login-items">
          <h1>Create an Account</h1>
          <form onSubmit={handleSubmit}>
            <MDBInput
              wrapperClass="mb-4"
              label="First Name"
              id="form1"
              type="text"
              onChange={(event) => setFname(event.target.value)}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Last Name"
              id="form1"
              type="text"
              onChange={(event) => setLname(event.target.value)}
            />
            <MDBInput
              wrapperClass="mb-4"
              label={error ? error : "Email Address"}
              id="form1"
              type="email"
              onChange={(event) => setEmail(event.target.value)}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="form1"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className="d-flex justify-content-center mb-4">
              <MDBCheckbox
                name="flexCheck"
                id="flexCheckDefault"
                label="I have read and agree to the terms"
              />
            </div>
            <MDBBtn className="mb-4 w-100" type="submit">Sign up</MDBBtn>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;