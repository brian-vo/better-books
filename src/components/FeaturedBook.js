import { Link } from "react-router-dom";

const FeaturedBook = ({ title, price, imageUrl }) => {
  return (
    <li className="book-icon-small">
      <Link to="/book">
        <div className="icon-container-small">
          <img src={imageUrl} alt="book" />
        </div>
        <div className="icon-info">
          <a href="/book" className="icon-title">
            {title}
          </a>
          <div className="icon-price">{price}</div>
        </div>
      </Link>
    </li>
  );
};

export default FeaturedBook;
