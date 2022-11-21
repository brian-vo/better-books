import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = () => {
  return (
    <nav>
      <div className="nav-links">
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
      <div className="nav-bottom">
        {/* <img className="nav-logo" src="" alt="logo" />
        <SearchBar placeholder="Search for a book or author..." /> */}
      </div>
    </nav>
  );
};

export default Navbar;
