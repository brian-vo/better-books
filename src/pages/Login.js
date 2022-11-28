import { MDBBtn, MDBInput, MDBCheckbox } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";

const LogIn = () => {
  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-items">
          <div>
            <h1>Login</h1>
            <MDBInput
              wrapperClass="mb-4"
              label="Email address"
              id="form1"
              type="email"
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="form2"
              type="password"
            />
            <div className="d-flex justify-content-between mx-4 mb-4">
              <MDBCheckbox
                name="flexCheck"
                value=""
                id="flexCheckDefault"
                label="Remember me"
              />
              <a href="!#">Forgot password?</a>
            </div>
            <MDBBtn className="mb-4 w-100">Sign in</MDBBtn>
            <p className="text-center register-link">
              Not a member? <Link to="/signup">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
