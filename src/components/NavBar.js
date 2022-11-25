import { Link } from "react-router-dom";
import SearchBar from "../SearchBar";
import "./nav.css";

const NavBar = () => {
  return (
    <nav>
      <div className="nav-right">
        <Link to="/">
          <img className="nav-logo" src="" alt="logo" />
        </Link>
      </div>
      <div className="nav-left">
        <div className="link-container">
          <div className="page-links">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/recommendations">Recommendations</Link>
              </li>
              <li>
                <Link to="/wishlist">Wishlist</Link>
              </li>
            </ul>
          </div>
          <div className="user-links">
            <ul>
              <li>
                <Link to="/login">Log in</Link>
              </li>
              <li>
                <Link to="/signup">Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
        <SearchBar placeholder="Search books by title or author..." />
      </div>
    </nav>
  );
};

export default NavBar;
