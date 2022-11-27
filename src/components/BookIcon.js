import { Link } from "react-router-dom";

const BookIcon = ({ title, price, imageUrl }) => {
  return (
    <li className="book-icon">
      <Link to="/books">
        <div className="icon-container">
          <img src={imageUrl} alt="book" />
        </div>
        <div className="icon-info">
          <a href="/books" className="icon-title">
            {title}
          </a>
          <div className="icon-price">{price}</div>
        </div>
      </Link>
    </li>
  );
};

export default BookIcon;
