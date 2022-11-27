import { MDBBtn, MDBInput, MDBCheckbox } from "mdb-react-ui-kit";
import Banner from "../components/Banner";

const SignUp = () => {
  return (
    <div className="signup">
      <Banner title="Sign up"></Banner>
      <div className="signup-container">
        <MDBInput wrapperClass="mb-4" label="Name" id="form1" type="text" />
        <MDBInput wrapperClass="mb-4" label="Username" id="form1" type="text" />
        <MDBInput wrapperClass="mb-4" label="Email" id="form1" type="email" />
        <MDBInput
          wrapperClass="mb-4"
          label="Password"
          id="form1"
          type="password"
        />

        <div className="d-flex justify-content-center mb-4">
          <MDBCheckbox
            name="flexCheck"
            id="flexCheckDefault"
            label="I have read and agree to the terms"
          />
        </div>

        <MDBBtn className="mb-4 w-100">Sign up</MDBBtn>
      </div>
    </div>
  );
};

export default SignUp;
