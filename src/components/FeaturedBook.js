import { Link } from "react-router-dom";
import example_cover from "../img/example-cover.jpg";

const FeaturedBook = ({ isbn }) => {
  return (
    <li className="book-icon">
      <Link to={"/book?isbn=" + isbn}>
        <div className="icon-container">
          <img src={example_cover} alt="book" />
        </div>
        <div className="icon-info">
          <div className="icon-title">Book title</div>
          <div className="icon-price">$24.99</div>
        </div>
      </Link>
    </li>
  );
};

export default FeaturedBook;
