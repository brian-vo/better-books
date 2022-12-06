import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import "./nav.css";


const NavBar = () => {
  return (
    <nav>
      <div className="nav-right">
        <Link to="/">
        <img className="nav-logo" width="30" height="30" src="../img/logo.png" alt="logo" />
        </Link>
      </div>
      <div className="nav-left">
        <div className="link-container">
          <div className="page-links">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </div>
          <div className="user-links">
            <ul>
              <li>
                <Link to="/cart">View cart</Link>
              </li>
              <li>
                <Link to="/account">My account</Link>
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
