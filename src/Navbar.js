import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = () => {
  return (
    <nav>
      <div className="nav-right">
        <img className="nav-logo" src="" alt="logo" />
      </div>
      <div className="nav-left">
        <div className="link-container">
          <div className="page-links">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/">Products</Link>
              </li>
              <li>
                <Link to="/">Recommendations</Link>
              </li>
              <li>
                <Link to="/">Wishlist</Link>
              </li>
            </ul>
          </div>
          <div className="user-links">
            <ul>
              <li>
                <Link to="/">Log in</Link>
              </li>
              <li>
                <Link to="/">Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
        <SearchBar placeholder="Search books by title or author..." />
      </div>
    </nav>
  );
};

export default Navbar;
