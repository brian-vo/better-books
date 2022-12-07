import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBInput, MDBCheckbox } from "mdb-react-ui-kit";
import { useNavigate } from 'react-router-dom';
import useLoginCheck from "../hooks/useLoginCheck";

const SignUp = () => {
  const navigate = useNavigate();
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
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
    const data = { "fname": fname, "lname": lname, "email": email, "pass_word": password };

    fetch('/register/new', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 201) {
          navigate("/login");
        } else if (response.status === 409) {
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