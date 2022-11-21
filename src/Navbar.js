import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = () => {
  return (
    <nav>
      <div className="nav-right">
        <img className="nav-logo" src="" alt="logo" />
      </div>
      <div className="nav-left">
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
        <SearchBar placeholder="Search books by title or author..." />
      </div>
    </nav>
  );
};

export default Navbar;

// const Navbar = () => {
//   return (
//     <nav>
//       <div className="nav-links">
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/">Products</Link>
//           </li>
//           <li>
//             <Link to="/">Recommendations</Link>
//           </li>
//           <li>
//             <Link to="/">Wishlist</Link>
//           </li>
//         </ul>
//       </div>
//       <div className="nav-bottom">
//         <div className="logo-container">
//           <img className="nav-logo" src="" alt="logo" />
//         </div>
//         <SearchBar placeholder="Search books by title or author..." />
//       </div>
//     </nav>
//   );
// };
